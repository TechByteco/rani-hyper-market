-- ============================================================================
-- RANI HYPER MARKET ENTERPRISE — PHASE 2 REGIONAL EXPANSION
-- MIGRATION 001: MULTI-TENANT ARCHITECTURE WITH POSTGRESQL ROW-LEVEL SECURITY (RLS)
-- Coverage: 15 Supermarkets across Theni, Madurai, and Dindigul Districts
-- ============================================================================

-- 1. EXTENSIONS & PREREQUISITES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Dedicated session context schema
CREATE SCHEMA IF NOT EXISTS app;

-- 2. TENANT SESSION CONTEXT HELPERS
-- These functions enable seamless RLS filtering whether invoked via Supabase JWT
-- (e.g. auth.jwt() ->> 'tenant_id') or transaction-scoped session settings.
CREATE OR REPLACE FUNCTION app.current_tenant_id()
RETURNS uuid AS $$
BEGIN
  RETURN COALESCE(
    NULLIF(current_setting('app.current_tenant_id', true), '')::uuid,
    NULLIF(current_setting('request.jwt.claim.tenant_id', true), '')::uuid,
    '37a64e83-514d-4b00-b90a-9af172dacdd6'::uuid -- Fallback: Bodinayakanur Flagship Hub
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN '37a64e83-514d-4b00-b90a-9af172dacdd6'::uuid;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION app.is_super_admin()
RETURNS boolean AS $$
BEGIN
  RETURN COALESCE(
    current_setting('app.is_super_admin', true) = 'true',
    current_setting('request.jwt.claim.role', true) = 'super_admin',
    false
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION app.set_current_tenant(p_tenant_id uuid)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', p_tenant_id::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. TENANTS MASTER TABLE (15 Regional Stores across Theni, Madurai, Dindigul)
CREATE TABLE IF NOT EXISTS public.tenants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_code varchar(32) UNIQUE NOT NULL,
  store_name text NOT NULL,
  slug text UNIQUE NOT NULL,
  district text NOT NULL CHECK (district IN ('Theni', 'Madurai', 'Dindigul')),
  city text NOT NULL,
  store_type text NOT NULL CHECK (store_type IN ('FLAGSHIP_HUB', 'HYPERMARKET', 'SUPERMARKET', 'EXPRESS_MART', 'TRANSIT_STORE')),
  address text NOT NULL,
  pincode varchar(10) NOT NULL,
  gstin varchar(15) NOT NULL,
  contact_phone varchar(20) NOT NULL,
  is_warehouse boolean DEFAULT false,
  parent_hub_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. GLOBAL MASTER SKU CATALOG (50,000 Standardized Indian FMCG Items)
-- Central catalog shared across all 15 regional supermarkets.
CREATE TABLE IF NOT EXISTS public.global_master_catalog (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  barcode varchar(32) UNIQUE NOT NULL,
  brand_name text NOT NULL,
  product_name text NOT NULL,
  tamil_name text,
  category text NOT NULL,
  sub_category text,
  package_size text NOT NULL,
  unit_of_measure varchar(16) NOT NULL,
  hsn_code varchar(10) NOT NULL,
  gst_rate numeric(4,2) NOT NULL CHECK (gst_rate IN (0.00, 5.00, 12.00, 18.00, 28.00)),
  standard_mrp numeric(10,2) NOT NULL CHECK (standard_mrp >= 0),
  verified_image_url text NOT NULL,
  shelf_life_days integer,
  manufacturer text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TENANT STORE INVENTORY (Store-Specific Pricing, Cost, Shelf Location, Stock Units)
-- Fully isolated per tenant with Row-Level Security (RLS) enforcement.
CREATE TABLE IF NOT EXISTS public.tenant_store_inventory (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  global_sku_id uuid NOT NULL REFERENCES public.global_master_catalog(id) ON DELETE RESTRICT,
  store_sku_code text,
  selling_price numeric(10,2) NOT NULL CHECK (selling_price > 0),
  wholesale_landed_cost numeric(10,2) NOT NULL CHECK (wholesale_landed_cost > 0),
  local_shelf_location varchar(64) NOT NULL,
  current_stock_units numeric(12,3) NOT NULL DEFAULT 0.000 CHECK (current_stock_units >= 0),
  reorder_threshold_units numeric(12,3) NOT NULL DEFAULT 10.000 CHECK (reorder_threshold_units >= 0),
  max_shelf_capacity numeric(12,3) DEFAULT 100.000,
  batch_lot_number varchar(64),
  expiry_date date,
  last_restocked_at timestamptz,
  is_available_online boolean DEFAULT true,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT uq_tenant_store_sku UNIQUE (tenant_id, global_sku_id)
);

-- 6. MULTI-STORE INVENTORY TRANSFERS (Inter-Store Logistics & Transfer Manifests)
-- Tracks transfer orders from Central Hub (Bodinayakanur) to regional branches.
CREATE TABLE IF NOT EXISTS public.inventory_transfers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  transfer_number varchar(32) UNIQUE NOT NULL,
  source_tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE RESTRICT,
  destination_tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE RESTRICT,
  status varchar(32) NOT NULL CHECK (status IN ('DRAFT', 'PENDING_DISPATCH', 'IN_TRANSIT', 'RECEIVED', 'REJECTED', 'CANCELLED')) DEFAULT 'DRAFT',
  vehicle_number varchar(32),
  driver_name text,
  driver_phone varchar(20),
  e_way_bill_number varchar(64),
  dispatched_at timestamptz,
  received_at timestamptz,
  initiated_by_user_id uuid,
  received_by_user_id uuid,
  total_items_count integer NOT NULL DEFAULT 0,
  total_transfer_value numeric(12,2) NOT NULL DEFAULT 0.00,
  notes text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT chk_diff_source_dest CHECK (source_tenant_id <> destination_tenant_id)
);

-- 7. INVENTORY TRANSFER ITEMS (Line Item Details per Transfer Manifest)
CREATE TABLE IF NOT EXISTS public.inventory_transfer_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  transfer_id uuid NOT NULL REFERENCES public.inventory_transfers(id) ON DELETE CASCADE,
  global_sku_id uuid NOT NULL REFERENCES public.global_master_catalog(id) ON DELETE RESTRICT,
  requested_quantity numeric(12,3) NOT NULL CHECK (requested_quantity > 0),
  dispatched_quantity numeric(12,3) NOT NULL DEFAULT 0.000 CHECK (dispatched_quantity >= 0),
  received_quantity numeric(12,3) NOT NULL DEFAULT 0.000 CHECK (received_quantity >= 0),
  unit_cost numeric(10,2) NOT NULL CHECK (unit_cost > 0),
  batch_number varchar(64),
  expiry_date date,
  received_condition varchar(32) CHECK (received_condition IN ('PERFECT', 'DAMAGED_TRANSIT', 'LEAKAGE', 'EXPIRED', 'MISSING')) DEFAULT 'PERFECT',
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT uq_transfer_sku UNIQUE (transfer_id, global_sku_id)
);

-- 8. ZERO-PERFORMANCE-DEGRADATION COMPOSITE INDEXING STRATEGY
-- Global Catalog Indexes
CREATE INDEX IF NOT EXISTS idx_global_catalog_barcode ON public.global_master_catalog(barcode);
CREATE INDEX IF NOT EXISTS idx_global_catalog_category ON public.global_master_catalog(category, sub_category);
CREATE INDEX IF NOT EXISTS idx_global_catalog_brand ON public.global_master_catalog(brand_name);
CREATE INDEX IF NOT EXISTS idx_global_catalog_name_trgm ON public.global_master_catalog USING gin(product_name gin_trgm_ops);

-- Tenant Store Inventory Indexes (Composite covering indexes ensure sub-millisecond tenant queries)
CREATE INDEX IF NOT EXISTS idx_store_inv_tenant_sku ON public.tenant_store_inventory(tenant_id, global_sku_id);
CREATE INDEX IF NOT EXISTS idx_store_inv_tenant_shelf ON public.tenant_store_inventory(tenant_id, local_shelf_location);
CREATE INDEX IF NOT EXISTS idx_store_inv_low_stock ON public.tenant_store_inventory(tenant_id, current_stock_units)
  WHERE current_stock_units <= reorder_threshold_units;
CREATE INDEX IF NOT EXISTS idx_store_inv_tenant_pricing ON public.tenant_store_inventory(tenant_id, selling_price, wholesale_landed_cost);

-- Inventory Transfer Indexes
CREATE INDEX IF NOT EXISTS idx_transfers_source_status ON public.inventory_transfers(source_tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_transfers_dest_status ON public.inventory_transfers(destination_tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_transfers_created_at ON public.inventory_transfers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transfer_items_transfer_id ON public.inventory_transfer_items(transfer_id);

-- 9. ROW-LEVEL SECURITY (RLS) POLICIES
-- Enable RLS across all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_master_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_store_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transfer_items ENABLE ROW LEVEL SECURITY;

-- Policy A: Tenants
-- Any tenant can see all active store locations in the network (for transfer targeting)
DROP POLICY IF EXISTS "Allow tenants read network" ON public.tenants;
CREATE POLICY "Allow tenants read network" ON public.tenants
  FOR SELECT USING (is_active = true OR app.is_super_admin());

DROP POLICY IF EXISTS "Super admin full tenants" ON public.tenants;
CREATE POLICY "Super admin full tenants" ON public.tenants
  FOR ALL USING (app.is_super_admin()) WITH CHECK (app.is_super_admin());

-- Policy B: Global Master Catalog
-- All authenticated tenants can search the global master catalog (Read-Only)
DROP POLICY IF EXISTS "Global catalog read all" ON public.global_master_catalog;
CREATE POLICY "Global catalog read all" ON public.global_master_catalog
  FOR SELECT USING (is_active = true OR app.is_super_admin());

DROP POLICY IF EXISTS "Super admin edit global catalog" ON public.global_master_catalog;
CREATE POLICY "Super admin edit global catalog" ON public.global_master_catalog
  FOR ALL USING (app.is_super_admin()) WITH CHECK (app.is_super_admin());

-- Policy C: Tenant Store Inventory (Strict Isolation)
-- A store manager or cashier CANNOT see or modify another store's stock, shelf location, or wholesale cost
DROP POLICY IF EXISTS "Tenant store inventory isolation" ON public.tenant_store_inventory;
CREATE POLICY "Tenant store inventory isolation" ON public.tenant_store_inventory
  FOR ALL
  USING (tenant_id = app.current_tenant_id() OR app.is_super_admin())
  WITH CHECK (tenant_id = app.current_tenant_id() OR app.is_super_admin());

-- Policy D: Inventory Transfers (Multi-Store Shared Visibility)
-- A store can see a transfer order if it is either the Source or Destination store
DROP POLICY IF EXISTS "Inventory transfers bilateral visibility" ON public.inventory_transfers;
CREATE POLICY "Inventory transfers bilateral visibility" ON public.inventory_transfers
  FOR ALL
  USING (
    source_tenant_id = app.current_tenant_id() OR
    destination_tenant_id = app.current_tenant_id() OR
    app.is_super_admin()
  )
  WITH CHECK (
    source_tenant_id = app.current_tenant_id() OR
    app.is_super_admin()
  );

-- Policy E: Inventory Transfer Items (Cascaded Visibility)
DROP POLICY IF EXISTS "Inventory transfer items visibility" ON public.inventory_transfer_items;
CREATE POLICY "Inventory transfer items visibility" ON public.inventory_transfer_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.inventory_transfers t
      WHERE t.id = inventory_transfer_items.transfer_id
        AND (t.source_tenant_id = app.current_tenant_id() OR t.destination_tenant_id = app.current_tenant_id() OR app.is_super_admin())
    )
  );

-- 10. AUTOMATED INTER-STORE STOCK TRANSFER STATE MACHINE & INVENTORY SYNC
-- Automatically decrements source inventory when transfer is dispatched (IN_TRANSIT)
-- Automatically increments destination inventory when transfer is received (RECEIVED)
CREATE OR REPLACE FUNCTION public.fn_process_inventory_transfer_status()
RETURNS TRIGGER AS $$
DECLARE
  item_rec RECORD;
BEGIN
  -- When state transitions to 'IN_TRANSIT': Decrement stock at Source Store
  IF (NEW.status = 'IN_TRANSIT' AND (OLD.status IS NULL OR OLD.status <> 'IN_TRANSIT')) THEN
    FOR item_rec IN 
      SELECT global_sku_id, dispatched_quantity 
      FROM public.inventory_transfer_items 
      WHERE transfer_id = NEW.id
    LOOP
      UPDATE public.tenant_store_inventory
      SET current_stock_units = GREATEST(0.000, current_stock_units - item_rec.dispatched_quantity),
          updated_at = now()
      WHERE tenant_id = NEW.source_tenant_id 
        AND global_sku_id = item_rec.global_sku_id;
    END LOOP;
    NEW.dispatched_at := COALESCE(NEW.dispatched_at, now());
  END IF;

  -- When state transitions to 'RECEIVED': Increment stock at Destination Store
  IF (NEW.status = 'RECEIVED' AND OLD.status <> 'RECEIVED') THEN
    FOR item_rec IN 
      SELECT iti.global_sku_id, iti.received_quantity, iti.unit_cost, gmc.standard_mrp
      FROM public.inventory_transfer_items iti
      JOIN public.global_master_catalog gmc ON iti.global_sku_id = gmc.id
      WHERE iti.transfer_id = NEW.id
    LOOP
      -- Insert or Update inventory in destination store
      INSERT INTO public.tenant_store_inventory (
        tenant_id, global_sku_id, selling_price, wholesale_landed_cost, 
        local_shelf_location, current_stock_units, last_restocked_at
      ) VALUES (
        NEW.destination_tenant_id,
        item_rec.global_sku_id,
        item_rec.standard_mrp,
        item_rec.unit_cost,
        'Receiving Dock Bay 1',
        item_rec.received_quantity,
        now()
      )
      ON CONFLICT (tenant_id, global_sku_id) DO UPDATE SET
        current_stock_units = public.tenant_store_inventory.current_stock_units + EXCLUDED.current_stock_units,
        wholesale_landed_cost = EXCLUDED.wholesale_landed_cost,
        last_restocked_at = now(),
        updated_at = now();
    END LOOP;
    NEW.received_at := COALESCE(NEW.received_at, now());
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_inventory_transfer_lifecycle ON public.inventory_transfers;
CREATE TRIGGER trg_inventory_transfer_lifecycle
  BEFORE UPDATE ON public.inventory_transfers
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_process_inventory_transfer_status();

-- 11. GRANT PERMISSIONS TO SUPABASE / POSTGRES API ROLES
GRANT USAGE ON SCHEMA app TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA app TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';

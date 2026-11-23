-- ============================================================================
-- RANI HYPER MARKET ENTERPRISE — PHASE 2 REGIONAL EXPANSION
-- MIGRATION 002: SEED DATA FOR 15 REGIONAL SUPERMARKETS & GLOBAL MASTER CATALOG
-- Districts: Theni, Madurai, Dindigul
-- ============================================================================

-- 1. SEED 15 REGIONAL SUPERMARKET TENANTS
INSERT INTO public.tenants (
  id, store_code, store_name, slug, district, city, store_type, 
  address, pincode, gstin, contact_phone, is_warehouse, parent_hub_id
) VALUES
  -- THENI DISTRICT (7 STORES)
  ('37a64e83-514d-4b00-b90a-9af172dacdd6', 'RANI-THN-01', 'Rani Hyper Market (Bodinayakanur Flagship Hub)', 'rani-bodi-flagship', 'Theni', 'Bodinayakanur', 'FLAGSHIP_HUB', 'Main Road, Bodinayakanur', '625513', '33BAGPN1341C1ZC', '+91 77088 34547', true, NULL),
  ('37a64e83-0002-4b00-b90a-9af172dacdd6', 'RANI-THN-02', 'Rani Hyper Market - Theni Main Bazaar', 'rani-theni-bazaar', 'Theni', 'Theni', 'HYPERMARKET', 'NRT Road, Opp. Head Post Office, Theni', '625531', '33BAGPN1341C2ZD', '+91 94431 22331', false, '37a64e83-514d-4b00-b90a-9af172dacdd6'),
  ('37a64e83-0003-4b00-b90a-9af172dacdd6', 'RANI-THN-03', 'Rani Supermarket - Periyakulam Branch', 'rani-periyakulam', 'Theni', 'Periyakulam', 'SUPERMARKET', 'Theni Main Road, Near Old Bus Stand, Periyakulam', '625601', '33BAGPN1341C3ZE', '+91 98421 77665', false, '37a64e83-514d-4b00-b90a-9af172dacdd6'),
  ('37a64e83-0004-4b00-b90a-9af172dacdd6', 'RANI-THN-04', 'Rani Express Mart - Chinnamanur', 'rani-chinnamanur', 'Theni', 'Chinnamanur', 'EXPRESS_MART', 'Bazaar Street, Chinnamanur', '625515', '33BAGPN1341C4ZF', '+91 94420 88990', false, '37a64e83-514d-4b00-b90a-9af172dacdd6'),
  ('37a64e83-0005-4b00-b90a-9af172dacdd6', 'RANI-THN-05', 'Rani Valley Hypermarket - Cumbum', 'rani-cumbum-valley', 'Theni', 'Cumbum', 'HYPERMARKET', 'LF Road, Near Clock Tower, Cumbum', '625516', '33BAGPN1341C5ZG', '+91 98942 33445', false, '37a64e83-514d-4b00-b90a-9af172dacdd6'),
  ('37a64e83-0006-4b00-b90a-9af172dacdd6', 'RANI-THN-06', 'Rani Supermarket - Uthamapalayam', 'rani-uthamapalayam', 'Theni', 'Uthamapalayam', 'SUPERMARKET', 'Main Road, Near Bus Stand, Uthamapalayam', '625533', '33BAGPN1341C6ZH', '+91 97871 44556', false, '37a64e83-514d-4b00-b90a-9af172dacdd6'),
  ('37a64e83-0007-4b00-b90a-9af172dacdd6', 'RANI-THN-07', 'Rani Mart - Andipatti', 'rani-andipatti', 'Theni', 'Andipatti', 'SUPERMARKET', 'Madurai Road, Andipatti', '625512', '33BAGPN1341C7ZI', '+91 98651 99001', false, '37a64e83-514d-4b00-b90a-9af172dacdd6'),

  -- MADURAI DISTRICT (4 STORES)
  ('37a64e83-0008-4b00-b90a-9af172dacdd6', 'RANI-MDU-01', 'Rani Hypermarket - Madurai Simmakkal Central', 'rani-madurai-simmakkal', 'Madurai', 'Madurai', 'HYPERMARKET', 'North Veli Street, Simmakkal, Madurai', '625001', '33BAGPN1341C8ZJ', '+91 98421 11223', false, '37a64e83-514d-4b00-b90a-9af172dacdd6'),
  ('37a64e83-0009-4b00-b90a-9af172dacdd6', 'RANI-MDU-02', 'Rani Wholesale & Retail Hub - Madurai Mattuthavani', 'rani-madurai-mattuthavani', 'Madurai', 'Madurai', 'FLAGSHIP_HUB', 'Near Integrated Bus Stand, Mattuthavani, Madurai', '625007', '33BAGPN1341C9ZK', '+91 94435 66778', true, '37a64e83-514d-4b00-b90a-9af172dacdd6'),
  ('37a64e83-0010-4b00-b90a-9af172dacdd6', 'RANI-MDU-03', 'Rani Gourmet Mart - Madurai Anna Nagar', 'rani-madurai-anna-nagar', 'Madurai', 'Madurai', 'SUPERMARKET', '80 Feet Road, Anna Nagar, Madurai', '625020', '33BAGPN1341CAZL', '+91 97865 77889', false, '37a64e83-0009-4b00-b90a-9af172dacdd6'),
  ('37a64e83-0011-4b00-b90a-9af172dacdd6', 'RANI-MDU-04', 'Rani Supermarket - Madurai Thirunagar', 'rani-madurai-thirunagar', 'Madurai', 'Madurai', 'SUPERMARKET', 'GST Road, Thirunagar, Madurai', '625006', '33BAGPN1341CBZM', '+91 99445 88990', false, '37a64e83-0009-4b00-b90a-9af172dacdd6'),

  -- DINDIGUL DISTRICT (4 STORES)
  ('37a64e83-0012-4b00-b90a-9af172dacdd6', 'RANI-DGL-01', 'Rani Hypermarket - Dindigul Main Road', 'rani-dindigul-main', 'Dindigul', 'Dindigul', 'HYPERMARKET', 'Salai Road, Near Clock Tower, Dindigul', '624001', '33BAGPN1341CCZN', '+91 98421 44556', false, '37a64e83-514d-4b00-b90a-9af172dacdd6'),
  ('37a64e83-0013-4b00-b90a-9af172dacdd6', 'RANI-DGL-02', 'Rani Supermarket - Palani Temple Town', 'rani-palani-temple', 'Dindigul', 'Palani', 'SUPERMARKET', 'Adivaram Road, Palani', '624601', '33BAGPN1341CDZO', '+91 94431 55667', false, '37a64e83-0012-4b00-b90a-9af172dacdd6'),
  ('37a64e83-0014-4b00-b90a-9af172dacdd6', 'RANI-DGL-03', 'Rani Agro Mart - Oddanchatram', 'rani-oddanchatram', 'Dindigul', 'Oddanchatram', 'SUPERMARKET', 'Dharapuram Road, Market Area, Oddanchatram', '624619', '33BAGPN1341CEZP', '+91 98940 12345', false, '37a64e83-0012-4b00-b90a-9af172dacdd6'),
  ('37a64e83-0015-4b00-b90a-9af172dacdd6', 'RANI-DGL-04', 'Rani Transit Mart - Batlagundu', 'rani-batlagundu-transit', 'Dindigul', 'Batlagundu', 'TRANSIT_STORE', 'Kodaikanal Ghat Road, Batlagundu', '624202', '33BAGPN1341CFZQ', '+91 97871 67890', false, '37a64e83-0012-4b00-b90a-9af172dacdd6')
ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  store_code = EXCLUDED.store_code,
  address = EXCLUDED.address,
  contact_phone = EXCLUDED.contact_phone;

-- 2. SEED GLOBAL MASTER CATALOG ITEMS (High-Demand FMCG Staples)
INSERT INTO public.global_master_catalog (
  id, barcode, brand_name, product_name, tamil_name, category, sub_category, 
  package_size, unit_of_measure, hsn_code, gst_rate, standard_mrp, verified_image_url
) VALUES
  ('a0000001-0001-4000-8000-000000000001', '8901234500012', 'Bodi Royal', 'Bodi Royal Ponni Boiled Rice (25kg Sack)', 'போடி ராயல் பொன்னி புழுங்கல் அரிசி (25kg)', 'Staples & Grains', 'Rice', '25kg', 'kg', '10063010', 0.00, 1450.00, 'https://5.imimg.com/data5/SELLER/Default/2021/6/YQ/ZB/VC/52481281/ponni-boiled-rice-500x500.jpg'),
  ('a0000001-0001-4000-8000-000000000002', '8901234500029', 'Gold Winner', 'Gold Winner Refined Sunflower Oil (5L Can)', 'கோல்ட் வின்னர் சூரியகாந்தி எண்ணெய் (5L கேன்)', 'Edible Oils & Ghee', 'Cooking Oil', '5L', 'L', '15121910', 5.00, 875.00, 'https://m.media-amazon.com/images/I/71c6q3E2nUL._SX679_.jpg'),
  ('a0000001-0001-4000-8000-000000000003', '8901234500036', 'Surf Excel', 'Surf Excel Easy Wash Detergent Powder (1kg Pack)', 'சர்ப் எக்செல் ஈசி வாஷ் வாஷிங் பவுடர் (1kg)', 'Household Care', 'Laundry Detergents', '1kg', 'kg', '34029011', 18.00, 165.00, 'https://m.media-amazon.com/images/I/71n0uO+vLTL._SX679_.jpg'),
  ('a0000001-0001-4000-8000-000000000004', '8901234500043', 'Aashirvaad', 'Aashirvaad Shudh Chakki Whole Wheat Atta (5kg Bag)', 'ஆசிர்வாத் சுத் சக்கி கோதுமை மாவு (5kg)', 'Staples & Grains', 'Atta & Flour', '5kg', 'kg', '11010000', 5.00, 285.00, 'https://m.media-amazon.com/images/I/81x2hZ6d2TL._SX679_.jpg'),
  ('a0000001-0001-4000-8000-000000000005', '8901234500050', 'Ooty Supreme', 'Ooty Supreme Toor Dal Grade-A (1kg Pouch)', 'ஊட்டி சுப்ரீம் துவரம் பருப்பு (1kg)', 'Staples & Grains', 'Pulses & Dals', '1kg', 'kg', '07136000', 0.00, 178.00, 'https://m.media-amazon.com/images/I/71r4zK7V+bL._SX679_.jpg'),
  ('a0000001-0001-4000-8000-000000000006', '8901234500067', 'Idhayam', 'Idhayam Pure Sesame Gingelly Oil (1L Bottle)', 'இதயம் நல்லெண்ணெய் (1L பாட்டில்)', 'Edible Oils & Ghee', 'Cooking Oil', '1L', 'L', '15155091', 5.00, 448.00, 'https://m.media-amazon.com/images/I/61Nf+o2a0bL._SX679_.jpg'),
  ('a0000001-0001-4000-8000-000000000007', '8901234500074', 'GRB', 'GRB Pure Cow Ghee (500ml Jar)', 'ஜிஆர்பி தூய பசு நெய் (500ml ஜாடி)', 'Dairy Products', 'Ghee', '500ml', 'ml', '04059020', 12.00, 390.00, 'https://m.media-amazon.com/images/I/61S6h1o0ZgL._SX679_.jpg'),
  ('a0000001-0001-4000-8000-000000000008', '8901234500081', 'M-Grade', 'M-Grade Fine Crystal White Sugar (1kg Bag)', 'எம்-கிரேடு வெள்ளை சர்க்கரை (1kg)', 'Staples & Grains', 'Sugar', '1kg', 'kg', '17019990', 5.00, 52.00, 'https://m.media-amazon.com/images/I/61S2X2f+lBL._SX679_.jpg'),
  ('a0000001-0001-4000-8000-000000000009', '8901234500098', 'Aachi', 'Aachi Kulambu Chilli Masala Powder (500g Pouch)', 'ஆச்சி குழம்பு மிளகாய்த்தூள் (500g)', 'Spices & Condiments', 'Masalas', '500g', 'g', '09109100', 5.00, 205.00, 'https://m.media-amazon.com/images/I/71WpX4q+kLL._SX679_.jpg'),
  ('a0000001-0001-4000-8000-000000000010', '8901234500104', 'Brooke Bond', 'Brooke Bond 3 Roses Strong Leaf Tea (500g Pack)', 'புரூக் பாண்ட் 3 ரோசஸ் டீத்தூள் (500g)', 'Beverages', 'Tea', '500g', 'g', '09024020', 5.00, 350.00, 'https://m.media-amazon.com/images/I/61R6Z8Q9L0L._SX679_.jpg')
ON CONFLICT (barcode) DO UPDATE SET
  product_name = EXCLUDED.product_name,
  standard_mrp = EXCLUDED.standard_mrp,
  hsn_code = EXCLUDED.hsn_code,
  gst_rate = EXCLUDED.gst_rate;

-- 3. SEED TENANT STORE INVENTORIES (Isolated Pricing, Cost, Shelf Location per Store)
-- Sample seed for Bodinayakanur Flagship, Theni Main, Madurai Simmakkal, Dindigul Main
INSERT INTO public.tenant_store_inventory (
  tenant_id, global_sku_id, selling_price, wholesale_landed_cost, 
  local_shelf_location, current_stock_units, reorder_threshold_units
) VALUES
  -- Bodinayakanur Flagship Hub (Wholesale Mother Warehouse & Flagship Store)
  ('37a64e83-514d-4b00-b90a-9af172dacdd6', 'a0000001-0001-4000-8000-000000000001', 1299.00, 1180.00, 'Warehouse Bay 4-A', 450.000, 50.000),
  ('37a64e83-514d-4b00-b90a-9af172dacdd6', 'a0000001-0001-4000-8000-000000000002', 785.00, 715.00, 'Oil Section Rack 1', 320.000, 40.000),
  ('37a64e83-514d-4b00-b90a-9af172dacdd6', 'a0000001-0001-4000-8000-000000000003', 145.00, 128.00, 'Aisle 6, Shelf 3', 280.000, 30.000),
  ('37a64e83-514d-4b00-b90a-9af172dacdd6', 'a0000001-0001-4000-8000-000000000004', 245.00, 220.00, 'Aisle 2, Pallet B', 210.000, 25.000),
  ('37a64e83-514d-4b00-b90a-9af172dacdd6', 'a0000001-0001-4000-8000-000000000005', 148.00, 132.00, 'Aisle 3, Bin 12', 360.000, 40.000),

  -- Theni Main Bazaar Supermarket (Branch Store)
  ('37a64e83-0002-4b00-b90a-9af172dacdd6', 'a0000001-0001-4000-8000-000000000001', 1310.00, 1195.00, 'Rear Storage Pallet 2', 45.000, 20.000),
  ('37a64e83-0002-4b00-b90a-9af172dacdd6', 'a0000001-0001-4000-8000-000000000002', 790.00, 725.00, 'Aisle 1, Rack 2', 35.000, 15.000),
  ('37a64e83-0002-4b00-b90a-9af172dacdd6', 'a0000001-0001-4000-8000-000000000003', 148.00, 130.00, 'Aisle 5, Tier 2', 60.000, 15.000),

  -- Madurai Simmakkal Central (Urban Hypermarket)
  ('37a64e83-0008-4b00-b90a-9af172dacdd6', 'a0000001-0001-4000-8000-000000000001', 1320.00, 1205.00, 'Basement Bulk Bay B', 80.000, 30.000),
  ('37a64e83-0008-4b00-b90a-9af172dacdd6', 'a0000001-0001-4000-8000-000000000002', 795.00, 730.00, 'Ground Floor FMCG-04', 55.000, 20.000),
  ('37a64e83-0008-4b00-b90a-9af172dacdd6', 'a0000001-0001-4000-8000-000000000003', 150.00, 131.00, 'Detergents Bay 1', 95.000, 25.000),

  -- Dindigul Main Road Hypermarket (Regional Store)
  ('37a64e83-0012-4b00-b90a-9af172dacdd6', 'a0000001-0001-4000-8000-000000000001', 1315.00, 1200.00, 'Bulk Granary Aisle 1', 65.000, 25.000),
  ('37a64e83-0012-4b00-b90a-9af172dacdd6', 'a0000001-0001-4000-8000-000000000002', 790.00, 725.00, 'Central Island Rack 3', 42.000, 15.000),
  ('37a64e83-0012-4b00-b90a-9af172dacdd6', 'a0000001-0001-4000-8000-000000000003', 148.00, 130.00, 'Cleaning Aisle 4', 70.000, 20.000)
ON CONFLICT (tenant_id, global_sku_id) DO UPDATE SET
  selling_price = EXCLUDED.selling_price,
  wholesale_landed_cost = EXCLUDED.wholesale_landed_cost,
  current_stock_units = EXCLUDED.current_stock_units,
  local_shelf_location = EXCLUDED.local_shelf_location;

-- 4. SEED SAMPLE MULTI-STORE INVENTORY TRANSFERS
INSERT INTO public.inventory_transfers (
  id, transfer_number, source_tenant_id, destination_tenant_id, status,
  vehicle_number, driver_name, driver_phone, e_way_bill_number,
  total_items_count, total_transfer_value, notes, dispatched_at, received_at
) VALUES
  -- Transfer 1: Bodinayakanur Flagship -> Theni Main Bazaar (IN_TRANSIT)
  ('b0000001-0001-4000-8000-000000000001', 'TRF-2026-BODI-THN-001', 
   '37a64e83-514d-4b00-b90a-9af172dacdd6', '37a64e83-0002-4b00-b90a-9af172dacdd6', 
   'IN_TRANSIT', 'TN-60-AZ-4512', 'Murugesan K', '+91 94421 55667', 'EWB-3312-8849-0021',
   2, 70800.00, 'Weekly staple replenishment from Central Warehouse', 
   now() - interval '2 hours', NULL),

  -- Transfer 2: Bodinayakanur Flagship -> Madurai Simmakkal (RECEIVED)
  ('b0000001-0001-4000-8000-000000000002', 'TRF-2026-BODI-MDU-001', 
   '37a64e83-514d-4b00-b90a-9af172dacdd6', '37a64e83-0008-4b00-b90a-9af172dacdd6', 
   'RECEIVED', 'TN-59-BL-9021', 'Raju Pandian', '+91 98421 99887', 'EWB-3312-7721-0045',
   2, 95200.00, 'Bulk delivery for weekend Karthigai surge', 
   now() - interval '1 day', now() - interval '4 hours')
ON CONFLICT (transfer_number) DO UPDATE SET
  status = EXCLUDED.status,
  total_transfer_value = EXCLUDED.total_transfer_value;

-- Line Items for Transfer 1 (Bodi -> Theni)
INSERT INTO public.inventory_transfer_items (
  transfer_id, global_sku_id, requested_quantity, dispatched_quantity, 
  received_quantity, unit_cost, batch_number, received_condition
) VALUES
  ('b0000001-0001-4000-8000-000000000001', 'a0000001-0001-4000-8000-000000000001', 40.000, 40.000, 0.000, 1180.00, 'BATCH-2026-RICE-11', 'PERFECT'),
  ('b0000001-0001-4000-8000-000000000001', 'a0000001-0001-4000-8000-000000000002', 30.000, 30.000, 0.000, 715.00, 'BATCH-2026-OIL-09', 'PERFECT')
ON CONFLICT (transfer_id, global_sku_id) DO UPDATE SET
  dispatched_quantity = EXCLUDED.dispatched_quantity;

-- Line Items for Transfer 2 (Bodi -> Madurai)
INSERT INTO public.inventory_transfer_items (
  transfer_id, global_sku_id, requested_quantity, dispatched_quantity, 
  received_quantity, unit_cost, batch_number, received_condition
) VALUES
  ('b0000001-0001-4000-8000-000000000002', 'a0000001-0001-4000-8000-000000000001', 50.000, 50.000, 50.000, 1180.00, 'BATCH-2026-RICE-11', 'PERFECT'),
  ('b0000001-0001-4000-8000-000000000002', 'a0000001-0001-4000-8000-000000000002', 50.000, 50.000, 50.000, 715.00, 'BATCH-2026-OIL-09', 'PERFECT')
ON CONFLICT (transfer_id, global_sku_id) DO UPDATE SET
  received_quantity = EXCLUDED.received_quantity;

NOTIFY pgrst, 'reload schema';

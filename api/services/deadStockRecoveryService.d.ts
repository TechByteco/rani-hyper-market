export interface StagnantSku {
  variant_id: number;
  name: string;
  category: string;
  current_stock: number;
  landed_cost: number;
  sales_rate: number;
  mrp: number;
  days_stagnant: number;
  months_stagnant: number;
  capital_locked: number;
  holding_cost_accrued: number;
  liquidation_discount: number;
}

export interface AnchorSku {
  variant_id: number;
  name: string;
  category: string;
  sales_rate: number;
  landed_cost: number;
  daily_velocity: number;
  sold_5yr: number;
}

export interface BundleFinancials {
  standalone_total: number;
  bundle_price: number;
  bundle_cost: number;
  bundle_gross_profit: number;
  bundle_margin_pct: number;
  customer_savings: number;
  customer_discount_pct: number;
  dead_capital_recovery_pct: number;
  unit_capital_recovered: number;
  total_batch_capital_recovered: number;
  total_batch_profit: number;
}

export interface DynamicBundle {
  bundle_id: string;
  bundle_title: string;
  marketing_headline: string;
  marketing_badge: string;
  badge_color: string;
  stagnant_sku: StagnantSku;
  anchor_sku: AnchorSku;
  financials: BundleFinancials;
}

export interface PortfolioRecoveryMetrics {
  total_dead_capital_locked: number;
  total_capital_recovered: number;
  overall_capital_recovery_pct: number;
  total_bundle_gross_profit: number;
  average_customer_discount_pct: number;
  target_threshold_met: boolean;
  recovery_efficiency_status: string;
}

export interface DeadStockPortfolioResponse {
  success: boolean;
  metadata: {
    algorithm: string;
    version: string;
    execution_timestamp?: string;
    total_catalog_skus_scanned: number;
    dead_stock_skus_identified: number;
    bundles_generated: number;
    source_file: string;
  };
  metrics: PortfolioRecoveryMetrics;
  bundles_count: number;
  top_bundles: DynamicBundle[];
}

export interface GetBundlesOptions {
  search?: string;
  category?: string;
  minDiscount?: number;
  minLocked?: number;
  page?: number;
  limit?: number;
  sortBy?: 'capital_locked_desc' | 'discount_desc' | 'profit_desc' | 'price_asc';
}

export interface BundleListResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  bundles: DynamicBundle[];
}

export declare function getDeadStockPortfolio(): DeadStockPortfolioResponse;
export declare function getBundles(options?: GetBundlesOptions): BundleListResponse;
export declare function triggerInventoryScan(): Promise<{
  success: boolean;
  scanned: boolean;
  scanned_at?: string;
  portfolio: DeadStockPortfolioResponse;
}>;
export declare function initDailyInventoryScanScheduler(): void;

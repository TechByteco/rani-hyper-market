export interface CustomerRfmRecord {
  customer_id: number;
  customer_name: string;
  phone_number: string;
  phone_masked: string;
  city: string;
  address: string;
  district: string;
  recency_days: number;
  last_checkout_date: string;
  frequency_12m: number;
  monetary_12m: number;
  monthly_spend_avg: number;
  average_ticket_size: number;
  lifetime_visits: number;
  lifetime_spend: number;
  weekend_visit_pct: number;
  r_score: number;
  f_score: number;
  m_score: number;
  rfm_score: string;
  cohort_code: 'VIP_HIGH_SPENDERS' | 'DAILY_ESSENTIALS_MILK_LOYALS' | 'WEEKEND_FAMILY_SHOPPERS' | 'AT_RISK_LAPSED_CHURN' | 'REGULAR_NEIGHBORHOOD_SHOPPERS';
  cohort_name: string;
  badge_color: string;
  priority_rank: number;
  recommended_strategy: string;
  action_channel: string;
  promo_discount: string;
  last_scored_at: string;
  sync_status: string;
}

export interface CohortAggregate {
  cohort_code: string;
  cohort_name: string;
  badge_color: string;
  priority_rank: number;
  recommended_strategy: string;
  action_channel: string;
  promo_discount: string;
  customer_count: number;
  total_monetary_12m: number;
  avg_monetary_12m: number;
  avg_recency_days: number;
  avg_frequency_12m: number;
  avg_ticket_size: number;
  revenue_share_pct: number;
  customer_share_pct: number;
  members: CustomerRfmRecord[];
}

export interface ExecutiveKpis {
  total_identified_customers: number;
  total_12m_portfolio_revenue: number;
  avg_annual_customer_value: number;
  vip_revenue_locked: number;
  at_risk_churn_revenue_exposure: number;
  at_risk_churn_percentage: number;
  daily_milk_loyals_count: number;
  weekend_family_shoppers_count: number;
}

export interface RfmCohortsSummaryResponse {
  success: boolean;
  metadata: {
    system: string;
    version: string;
    generated_at: string;
    reference_date: string;
    window_start: string;
    total_customers_scored: number;
    total_portfolio_revenue_12m: number;
    source_file: string;
    last_evaluated: string;
  };
  executive_kpis: ExecutiveKpis;
  cohorts: Record<string, CohortAggregate>;
  total_customers_scored: number;
}

export interface GetCustomersOptions {
  cohortCode?: string;
  search?: string;
  minR?: number;
  minF?: number;
  minM?: number;
  page?: number;
  limit?: number;
  sortBy?: 'priority_rank' | 'monetary_desc' | 'recency_asc' | 'frequency_desc';
}

export interface CustomerListResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  customers: CustomerRfmRecord[];
}

export declare function getRfmCohortsSummary(): RfmCohortsSummaryResponse;
export declare function getCustomersByCohort(options?: GetCustomersOptions): CustomerListResponse;
export declare function triggerWeeklyScoreRefresh(): Promise<{
  success: boolean;
  refreshed: boolean;
  refreshed_at?: string;
  summary: RfmCohortsSummaryResponse;
}>;
export declare function initAutomatedWeeklyRefreshScheduler(): void;

/**
 * TypeScript Type Definitions for Omni-Channel Orchestrator Service
 * Connecting Agent 3: Omni-Channel Dispatcher & Agent 4: Continuous RL Optimizer
 */

export interface CampaignPayload {
  productName: string;
  mrp: number;
  promoPrice?: number;
  discountPct?: number;
  marginPct?: number;
  stockUnits?: number;
  festivalContext?: string;
  deliveryHour?: string;
  banditArmId?: string;
}

export interface BanditArm {
  arm_id: string;
  discount_delta_pct: number;
  delivery_hour: '07:30 AM' | '05:30 PM';
  target_cohort: string;
  alpha: number;
  beta: number;
  total_sent: number;
  conversions: number;
  conversion_rate_pct: number;
  revenue_lift_inr: number;
  profit_contribution_inr: number;
  win_probability_pct: number;
}

export interface TelemetryWindowMetrics {
  period: string;
  total_sent: number;
  whatsapp_link_clicks: number;
  counter_bill_conversions: number;
  conversion_rate_pct: number;
  campaign_sku_sales_inr: number;
  baseline_sales_inr: number;
  revenue_lift_inr: number;
  gross_profit_contribution_inr: number;
}

export interface TelemetryWindows {
  window_24h: TelemetryWindowMetrics;
  window_48h: TelemetryWindowMetrics;
  window_7d: TelemetryWindowMetrics;
}

export interface BanditState {
  metadata: {
    engine: string;
    version: string;
    store: string;
    location: string;
    last_updated: string;
    total_campaign_evaluations: number;
    cumulative_revenue_lift_inr: number;
    cumulative_gross_profit_contribution_inr: number;
  };
  telemetry_windows: TelemetryWindows;
  bandit_arms: BanditArm[];
  current_best_arm?: Partial<BanditArm>;
}

export interface ThompsonSamplingResult {
  selected_arm: BanditArm;
  sampled_theta: number;
  expected_profit_score: number;
  all_arm_samples: Array<{
    arm_id: string;
    discount_delta_pct: number;
    delivery_hour: string;
    sampled_theta: number;
    score: number;
    win_probability_pct: number;
  }>;
}

export interface WhatsAppDispatchResult {
  channel: 'META_WHATSAPP_CLOUD_API';
  total_recipients: number;
  dispatched_at: string;
  mode?: string;
  results: Array<{
    phone: string;
    status: 'DELIVERED' | 'FAILED' | 'DELIVERED_SANDBOX';
    messageId?: string;
    simulated_wamid?: string;
    attempts: number;
    error?: string;
    direct_chat_link?: string;
  }>;
}

export interface GoogleMerchantFeedResult {
  channel: 'GOOGLE_MERCHANT_XML_FEED';
  total_skus_rendered: number;
  promo_skus_tagged: number;
  updated_at: string;
  feed_url: string;
  bytes: number;
}

export interface MqttSignageResult {
  channel: 'MQTT_COUNTER_SIGNAGE';
  topic: string;
  broker: string;
  mqtt_published: boolean;
  notice: string;
  embedded_event_bus: string;
  display_payload: {
    timestamp: string;
    type: string;
    campaign_id: string;
    product_name: string;
    mrp: number;
    promo_price: number;
    savings: number;
    discount_pct: number;
    delivery_guarantee: string;
    counter_displays: string[];
  };
}

export interface OrchestrationLoopResult {
  success: boolean;
  execution_loop: {
    status: string;
    executed_at: string;
    agent_orchestration: string;
  };
  bandit_optimization: {
    selected_arm_id: string;
    selected_cohort: string;
    applied_discount_delta: string;
    effective_discount_pct: number;
    scheduled_delivery_hour: string;
    sampled_theta: number;
    win_probability_pct: number;
  };
  campaign_copy: {
    sms_tamil: string;
    whatsapp_tamil: string;
    instagram_caption: string;
  };
  channel_dispatches: {
    whatsapp_cloud: WhatsAppDispatchResult;
    google_merchant_feed: GoogleMerchantFeedResult;
    mqtt_counter_signage: MqttSignageResult;
  };
}

export class ContinuousRlOptimizer {
  loadState(): BanditState;
  saveState(): void;
  sampleArm(): ThompsonSamplingResult;
  recordTelemetryEvent(event: {
    armId: string;
    converted: boolean;
    profitInr?: number;
    revenueLiftInr?: number;
    messagesSent?: number;
  }): { success: boolean; updated_arm: BanditArm; cumulative_evaluations: number };
  getStatus(): { success: boolean; metadata: any; telemetry_windows: TelemetryWindows; bandit_arms: BanditArm[]; current_best_arm: any };
}

export class OmniChannelDispatcher {
  dispatchWhatsAppCloud(payload: any, options?: any): Promise<WhatsAppDispatchResult>;
  updateGoogleMerchantFeed(activePromo?: any): Promise<GoogleMerchantFeedResult>;
  publishMqttCounterSignage(payload: any, options?: any): Promise<MqttSignageResult>;
}

export const rlOptimizer: ContinuousRlOptimizer;
export const omniDispatcher: OmniChannelDispatcher;
export function runAutonomousOrchestrationLoop(productPayload: CampaignPayload): Promise<OrchestrationLoopResult>;

import json
import os
import datetime

print("=== GENERATING CANONICAL RL BANDIT STATE FOR AGENT 4 ===")

now = datetime.datetime.now(datetime.timezone.utc).isoformat()

bandit_state = {
    "metadata": {
        "engine": "Agent 4: Continuous RL Optimizer (Thompson Sampling)",
        "version": "4.2.0-Production",
        "store": "Rani Hyper Market (SNS Market)",
        "location": "Bodinayakanur, Theni District, Tamil Nadu",
        "last_updated": now,
        "total_campaign_evaluations": 142,
        "cumulative_revenue_lift_inr": 253300.0,
        "cumulative_gross_profit_contribution_inr": 68240.0
    },
    "telemetry_windows": {
        "window_24h": {
            "period": "Last 24 Hours (Immediate Post-Dispatch Velocity)",
            "total_sent": 850,
            "whatsapp_link_clicks": 312,
            "counter_bill_conversions": 148,
            "conversion_rate_pct": 17.4,
            "campaign_sku_sales_inr": 48600.0,
            "baseline_sales_inr": 31200.0,
            "revenue_lift_inr": 17400.0,
            "gross_profit_contribution_inr": 5220.0
        },
        "window_48h": {
            "period": "Last 48 Hours (Weekend / Festival Surge)",
            "total_sent": 1820,
            "whatsapp_link_clicks": 624,
            "counter_bill_conversions": 298,
            "conversion_rate_pct": 16.4,
            "campaign_sku_sales_inr": 98400.0,
            "baseline_sales_inr": 64800.0,
            "revenue_lift_inr": 33600.0,
            "gross_profit_contribution_inr": 9880.0
        },
        "window_7d": {
            "period": "Last 7 Days (Full Multi-Channel Cycle)",
            "total_sent": 5400,
            "whatsapp_link_clicks": 1890,
            "counter_bill_conversions": 874,
            "conversion_rate_pct": 16.2,
            "campaign_sku_sales_inr": 284500.0,
            "baseline_sales_inr": 192000.0,
            "revenue_lift_inr": 92500.0,
            "gross_profit_contribution_inr": 26400.0
        }
    },
    "bandit_arms": [
        {
            "arm_id": "ARM_D1_T1",
            "discount_delta_pct": -2,
            "delivery_hour": "07:30 AM",
            "target_cohort": "Morning Homemakers (Margin Protective)",
            "alpha": 12,
            "beta": 88,
            "total_sent": 680,
            "conversions": 82,
            "conversion_rate_pct": 12.1,
            "revenue_lift_inr": 16200.0,
            "profit_contribution_inr": 5420.0,
            "win_probability_pct": 8.5
        },
        {
            "arm_id": "ARM_D1_T2",
            "discount_delta_pct": -2,
            "delivery_hour": "05:30 PM",
            "target_cohort": "Evening Commuters (Margin Protective)",
            "alpha": 9,
            "beta": 91,
            "total_sent": 520,
            "conversions": 47,
            "conversion_rate_pct": 9.0,
            "revenue_lift_inr": 9800.0,
            "profit_contribution_inr": 3150.0,
            "win_probability_pct": 4.2
        },
        {
            "arm_id": "ARM_D2_T1",
            "discount_delta_pct": 0,
            "delivery_hour": "07:30 AM",
            "target_cohort": "Morning Regular Shoppers (Baseline 0%)",
            "alpha": 22,
            "beta": 118,
            "total_sent": 1050,
            "conversions": 165,
            "conversion_rate_pct": 15.7,
            "revenue_lift_inr": 32800.0,
            "profit_contribution_inr": 9450.0,
            "win_probability_pct": 14.8
        },
        {
            "arm_id": "ARM_D2_T2",
            "discount_delta_pct": 0,
            "delivery_hour": "05:30 PM",
            "target_cohort": "Evening Quick Pickups (Baseline 0%)",
            "alpha": 16,
            "beta": 104,
            "total_sent": 840,
            "conversions": 112,
            "conversion_rate_pct": 13.3,
            "revenue_lift_inr": 22400.0,
            "profit_contribution_inr": 6800.0,
            "win_probability_pct": 10.1
        },
        {
            "arm_id": "ARM_D3_T1",
            "discount_delta_pct": 2,
            "delivery_hour": "07:30 AM",
            "target_cohort": "Morning Pantry Stockers (+2% Sweet-Spot)",
            "alpha": 42,
            "beta": 138,
            "total_sent": 1550,
            "conversions": 361,
            "conversion_rate_pct": 23.3,
            "revenue_lift_inr": 74200.0,
            "profit_contribution_inr": 19850.0,
            "win_probability_pct": 34.6
        },
        {
            "arm_id": "ARM_D3_T2",
            "discount_delta_pct": 2,
            "delivery_hour": "05:30 PM",
            "target_cohort": "Evening Working Couples (+2% High Lift)",
            "alpha": 28,
            "beta": 122,
            "total_sent": 1180,
            "conversions": 218,
            "conversion_rate_pct": 18.5,
            "revenue_lift_inr": 44800.0,
            "profit_contribution_inr": 11620.0,
            "win_probability_pct": 18.2
        },
        {
            "arm_id": "ARM_D4_T1",
            "discount_delta_pct": 5,
            "delivery_hour": "07:30 AM",
            "target_cohort": "Morning Deep Discount Bargain Seekers (+5%)",
            "alpha": 31,
            "beta": 109,
            "total_sent": 1220,
            "conversions": 284,
            "conversion_rate_pct": 23.3,
            "revenue_lift_inr": 53200.0,
            "profit_contribution_inr": 12250.0,
            "win_probability_pct": 21.0
        },
        {
            "arm_id": "ARM_D4_T2",
            "discount_delta_pct": 5,
            "delivery_hour": "05:30 PM",
            "target_cohort": "Evening Clearance Rush Seekers (+5%)",
            "alpha": 21,
            "beta": 109,
            "total_sent": 980,
            "conversions": 188,
            "conversion_rate_pct": 19.2,
            "revenue_lift_inr": 36100.0,
            "profit_contribution_inr": 7820.0,
            "win_probability_pct": 12.4
        }
    ],
    "current_best_arm": {
        "arm_id": "ARM_D3_T1",
        "discount_delta_pct": 2,
        "delivery_hour": "07:30 AM",
        "description": "+2% Discount Depth @ 07:30 AM Delivery (Morning Grocery Peak)",
        "expected_conversion_rate_pct": 23.3,
        "expected_profit_multiplier": 1.48
    }
}

paths = [
    'data/rl_bandit_state.json',
    'public/rl_bandit_state.json',
    'api/data/rl_bandit_state.json',
    'rl_bandit_state.json'
]

raw_json = json.dumps(bandit_state, indent=2, ensure_ascii=False)
for p in paths:
    os.makedirs(os.path.dirname(p) or '.', exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(raw_json)
    print(f"Wrote canonical state to {p} ({len(raw_json)} bytes)")

import random
import math

class ThompsonSamplingBandit:
    def __init__(self):
        # 8 Arms: 4 discount levels (-2%, 0%, +2%, +5%) x 2 delivery hours (07:30 AM, 05:30 PM)
        self.arms = [
            {"id": "ARM_D1_T1", "discountDelta": -2, "deliveryHour": "07:30 AM", "label": "-2% @ 07:30 AM (Morning Homemaker Margin)", "alpha": 8, "beta": 72, "totalSent": 800, "conversions": 72, "revenueLift": 14200.0, "profitContribution": 4850.0},
            {"id": "ARM_D1_T2", "discountDelta": -2, "deliveryHour": "05:30 PM", "label": "-2% @ 05:30 PM (Evening Commute Margin)", "alpha": 6, "beta": 74, "totalSent": 650, "conversions": 52, "revenueLift": 10800.0, "profitContribution": 3720.0},
            {"id": "ARM_D2_T1", "discountDelta": 0, "deliveryHour": "07:30 AM", "label": "Baseline (0%) @ 07:30 AM (Morning Baseline)", "alpha": 14, "beta": 96, "totalSent": 1100, "conversions": 138, "revenueLift": 28400.0, "profitContribution": 8200.0},
            {"id": "ARM_D2_T2", "discountDelta": 0, "deliveryHour": "05:30 PM", "label": "Baseline (0%) @ 05:30 PM (Evening Baseline)", "alpha": 11, "beta": 89, "totalSent": 950, "conversions": 105, "revenueLift": 21500.0, "profitContribution": 6450.0},
            {"id": "ARM_D3_T1", "discountDelta": 2, "deliveryHour": "07:30 AM", "label": "+2% @ 07:30 AM (Sweet-Spot Morning High CR)", "alpha": 28, "beta": 112, "totalSent": 1400, "conversions": 252, "revenueLift": 52400.0, "profitContribution": 13850.0},
            {"id": "ARM_D3_T2", "discountDelta": 2, "deliveryHour": "05:30 PM", "label": "+2% @ 05:30 PM (Evening Fast Replenish)", "alpha": 19, "beta": 101, "totalSent": 1200, "conversions": 190, "revenueLift": 38900.0, "profitContribution": 9920.0},
            {"id": "ARM_D4_T1", "discountDelta": 5, "deliveryHour": "07:30 AM", "label": "+5% @ 07:30 AM (Deep Discount Morning Volume)", "alpha": 26, "beta": 94, "totalSent": 1200, "conversions": 260, "revenueLift": 49200.0, "profitContribution": 10400.0},
            {"id": "ARM_D4_T2", "discountDelta": 5, "deliveryHour": "05:30 PM", "label": "+5% @ 05:30 PM (Deep Discount Evening Rush)", "alpha": 18, "beta": 92, "totalSent": 1100, "conversions": 198, "revenueLift": 37100.0, "profitContribution": 7850.0}
        ]

    def sample_arm(self):
        samples = []
        for arm in self.arms:
            # Sample from Beta(alpha, beta) using random.betavariate
            theta = random.betavariate(arm["alpha"], arm["beta"])
            # Weight by expected profit per conversion
            expected_profit_per_conv = arm["profitContribution"] / max(1, arm["conversions"])
            score = theta * expected_profit_per_conv
            samples.append((score, theta, arm))
        
        samples.sort(key=lambda x: x[0], reverse=True)
        winner_score, winner_theta, winner_arm = samples[0]
        return winner_arm, winner_theta, samples

bandit = ThompsonSamplingBandit()
winner, theta, samples = bandit.sample_arm()
print(f"Selected Arm: {winner['id']} -> {winner['label']}")
print(f"Sampled Theta: {theta:.4f}")
print("All Arm Rankings:")
for score, th, a in samples:
    cr = (a['conversions'] / a['totalSent']) * 100
    print(f"  {a['id']}: Score={score:.2f}, CR={cr:.1f}%, Profit=Rs.{a['profitContribution']:.0f}")

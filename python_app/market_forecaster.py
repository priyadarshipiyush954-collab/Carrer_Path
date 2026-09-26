import math
from typing import Dict, List, Any

class MarketForecaster:
    """
    Forecasting and statistical modeling for technical job markets,
    analyzing skill leverage, compensation quartiles, and growth momentum.
    """

    def __init__(self, career_paths: Dict[str, Dict[str, Any]], required_skills: List[str]):
        self.career_paths = career_paths
        self.required_skills = required_skills

    def get_skill_leverage_rankings(self) -> List[Dict[str, Any]]:
        """
        Ranks skills by market leverage (frequency across distinct tracks
        weighted by the growth rate of roles requiring them).
        """
        growth_weights = {
            "Very High": 1.5,
            "High": 1.25,
            "Medium": 1.0,
            "Low": 0.8
        }

        rankings = []
        for skill in self.required_skills:
            associated_roles = []
            weighted_score = 0.0

            for role_name, details in self.career_paths.items():
                if skill in details.get("required_skills", []):
                    associated_roles.append(role_name)
                    growth = details.get("growth_rate", "Medium")
                    weighted_score += growth_weights.get(growth, 1.0)

            rankings.append({
                "skill": skill,
                "role_count": len(associated_roles),
                "roles": associated_roles,
                "leverage_score": round(weighted_score, 2),
                "is_cross_role": len(associated_roles) > 1
            })

        rankings.sort(key=lambda x: (x["leverage_score"], x["role_count"]), reverse=True)
        return rankings

    def get_growth_momentum_summary(self) -> Dict[str, Any]:
        """Summarizes market growth distribution and role demand velocity."""
        growth_counts = {}
        for role_name, details in self.career_paths.items():
            g = details.get("growth_rate", "Unknown")
            growth_counts[g] = growth_counts.get(g, 0) + 1

        total = len(self.career_paths)
        return {
            "breakdown": growth_counts,
            "high_growth_ratio": round((growth_counts.get("High", 0) + growth_counts.get("Very High", 0)) / total * 100, 1) if total > 0 else 0,
            "fastest_growing_role": next((r for r, d in self.career_paths.items() if d.get("growth_rate") == "Very High"), "AI Engineer")
        }

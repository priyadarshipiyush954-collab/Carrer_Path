import json
import os
import re
from typing import Dict, List, Any, Optional, Tuple

from .models import SalaryMetrics, CareerPathModel, CandidateReadinessReport
from .recommender import CareerRecommender
from .market_forecaster import MarketForecaster
from .roadmap_generator import RoadmapGenerator
from .exporter import ReportExporter

class JobMarketAnalyzer:
    """
    Core Python engine for analyzing technology career paths,
    skill alignments, compensation benchmarks, and readiness metrics.
    """

    def __init__(self, data_path: Optional[str] = None):
        if data_path is None:
            # Default to job_market_data.json in repo root
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            data_path = os.path.join(base_dir, "job_market_data.json")
            if not os.path.exists(data_path):
                # Fallback to local directory
                data_path = "job_market_data.json"
        
        self.data_path = data_path
        self.data: Dict[str, Any] = self._load_data()

    def _load_data(self) -> Dict[str, Any]:
        """Loads and parses the JSON dataset."""
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Dataset file not found at: {self.data_path}")
        
        with open(self.data_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        if "required_skills" not in data or "career_paths" not in data:
            raise ValueError("Invalid dataset structure: missing 'required_skills' or 'career_paths'")

        return data

    @property
    def required_skills(self) -> List[str]:
        """Returns the master list of required in-demand tech skills."""
        return self.data.get("required_skills", [])

    @property
    def career_paths(self) -> Dict[str, Dict[str, Any]]:
        """Returns dictionary of all career paths."""
        return self.data.get("career_paths", {})

    def get_role(self, role_name: str) -> Optional[Dict[str, Any]]:
        """Retrieves details for a specific career path."""
        return self.career_paths.get(role_name)

    def parse_salary(self, salary_str: str) -> Dict[str, int]:
        """
        Parses salary range string like '$80,000 - $150,000' into numeric values.
        """
        numbers = [int(num) for num in re.findall(r'\d+', salary_str.replace(',', ''))]
        if len(numbers) >= 2:
            min_val = numbers[0]
            max_val = numbers[1]
        elif len(numbers) == 1:
            min_val = numbers[0]
            max_val = numbers[0]
        else:
            min_val, max_val = 0, 0
            
        avg_val = round((min_val + max_val) / 2)
        return {
            "min": min_val,
            "max": max_val,
            "average": avg_val,
            "spread": max_val - min_val
        }

    def calculate_skill_match(self, user_skills: List[str]) -> List[Dict[str, Any]]:
        """
        Calculates skill match percentage, matching skills, and missing skills
        for each career path given user-provided skills.
        """
        normalized_user_skills = {s.strip().lower() for s in user_skills if s.strip()}
        results = []

        for role_name, details in self.career_paths.items():
            req_skills = details.get("required_skills", [])
            matching = [s for s in req_skills if s.lower() in normalized_user_skills]
            missing = [s for s in req_skills if s.lower() not in normalized_user_skills]
            
            total_req = len(req_skills)
            match_pct = round((len(matching) / total_req * 100)) if total_req > 0 else 0

            # Determine readiness status
            if match_pct == 100:
                status = "Fully Qualified"
            elif match_pct >= 75:
                status = "Near Ready (1 skill gap)"
            elif match_pct >= 50:
                status = "Intermediate Match"
            elif match_pct > 0:
                status = "Foundational Stage"
            else:
                status = "No Overlap"

            results.append({
                "role": role_name,
                "match_percentage": match_pct,
                "status": status,
                "matching_skills": matching,
                "missing_skills": missing,
                "total_required": total_req,
                "salary_range": details.get("salary_range"),
                "growth_rate": details.get("growth_rate"),
                "education": details.get("education")
            })

        # Sort descending by match percentage
        results.sort(key=lambda x: x["match_percentage"], reverse=True)
        return results

    def compare_roles(self, role_names: List[str]) -> Dict[str, Any]:
        """
        Generates a comparative side-by-side analysis for the specified roles.
        """
        roles_to_compare = [r for r in role_names if r in self.career_paths]
        if not roles_to_compare:
            return {"error": "None of the specified roles exist in the dataset"}

        all_skills_in_selection = set()
        role_summaries = {}

        for role in roles_to_compare:
            details = self.career_paths[role]
            salary_data = self.parse_salary(details.get("salary_range", ""))
            skills = details.get("required_skills", [])
            all_skills_in_selection.update(skills)

            role_summaries[role] = {
                "salary_range": details.get("salary_range"),
                "salary_metrics": salary_data,
                "growth_rate": details.get("growth_rate"),
                "education": details.get("education"),
                "skills": skills
            }

        # Build skill matrix
        skill_matrix = {}
        for skill in sorted(all_skills_in_selection):
            skill_matrix[skill] = {
                role: (skill in role_summaries[role]["skills"])
                for role in roles_to_compare
            }

        return {
            "roles": roles_to_compare,
            "summaries": role_summaries,
            "skill_matrix": skill_matrix,
            "total_compared_skills": len(all_skills_in_selection)
        }

    def get_market_statistics(self) -> Dict[str, Any]:
        """
        Calculates aggregate market statistics across all career paths and skills.
        """
        salaries = [self.parse_salary(d.get("salary_range", "")) for d in self.career_paths.values()]
        
        # Skill frequency across roles
        skill_frequency: Dict[str, int] = {}
        for skill in self.required_skills:
            count = sum(1 for d in self.career_paths.values() if skill in d.get("required_skills", []))
            skill_frequency[skill] = count

        most_demanded_skills = sorted(
            skill_frequency.items(),
            key=lambda item: item[1],
            reverse=True
        )

        min_overall = min(s["min"] for s in salaries) if salaries else 0
        max_overall = max(s["max"] for s in salaries) if salaries else 0
        avg_overall = round(sum(s["average"] for s in salaries) / len(salaries)) if salaries else 0

        return {
            "total_career_paths": len(self.career_paths),
            "total_cataloged_skills": len(self.required_skills),
            "min_salary": min_overall,
            "max_salary": max_overall,
            "average_salary": avg_overall,
            "skill_demand_ranking": most_demanded_skills
        }

    def validate_dataset_consistency(self) -> Tuple[bool, List[str]]:
        """
        Validates the Hackathon 3.0 data consistency requirement:
        Ensures all skills referenced inside career_paths are present in required_skills.
        """
        errors = []
        master_set = set(self.required_skills)

        for role_name, details in self.career_paths.items():
            req_skills = details.get("required_skills", [])
            for skill in req_skills:
                if skill not in master_set:
                    errors.append(f"Role '{role_name}' uses skill '{skill}', which is missing from required_skills.")

        is_valid = len(errors) == 0
        return is_valid, errors

    def get_recommender(self) -> CareerRecommender:
        """Returns initialized CareerRecommender instance."""
        return CareerRecommender(self.career_paths, self.required_skills)

    def get_forecaster(self) -> MarketForecaster:
        """Returns initialized MarketForecaster instance."""
        return MarketForecaster(self.career_paths, self.required_skills)

    def evaluate_candidate(self, user_skills: List[str]) -> List[CandidateReadinessReport]:
        """Runs full candidate readiness evaluation including roadmaps."""
        recommender = self.get_recommender()
        return recommender.generate_comprehensive_evaluation(user_skills)


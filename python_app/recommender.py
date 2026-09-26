from typing import List, Dict, Any, Tuple
from .models import CandidateReadinessReport
from .roadmap_generator import RoadmapGenerator

class CareerRecommender:
    """
    Intelligent recommendation engine for career alignment,
    cross-role skill transferability, and pathway prioritization.
    """

    def __init__(self, career_paths: Dict[str, Dict[str, Any]], all_skills: List[str]):
        self.career_paths = career_paths
        self.all_skills = all_skills

    def compute_jaccard_similarity(self, set_a: set, set_b: set) -> float:
        """Calculates Jaccard similarity coefficient between two sets."""
        if not set_a and not set_b:
            return 1.0
        intersection = len(set_a.intersection(set_b))
        union = len(set_a.union(set_b))
        return round(intersection / union, 3) if union > 0 else 0.0

    def calculate_transferability(self, source_role: str, target_role: str) -> Dict[str, Any]:
        """
        Calculates how easily a professional in source_role can transition to target_role.
        """
        source_skills = set(self.career_paths.get(source_role, {}).get("required_skills", []))
        target_skills = set(self.career_paths.get(target_role, {}).get("required_skills", []))

        if not source_skills or not target_skills:
            return {"error": "Invalid role names provided"}

        shared_skills = list(source_skills.intersection(target_skills))
        skills_to_acquire = list(target_skills - source_skills)
        similarity = self.compute_jaccard_similarity(source_skills, target_skills)
        
        # Transferability percentage based on target role coverage
        coverage_pct = round((len(shared_skills) / len(target_skills)) * 100) if target_skills else 0

        if coverage_pct >= 50:
            transition_ease = "High (Strong technical overlap)"
        elif coverage_pct >= 25:
            transition_ease = "Moderate (Requires foundational bridge)"
        else:
            transition_ease = "Steep (Minimal direct skill overlap)"

        return {
            "source_role": source_role,
            "target_role": target_role,
            "shared_skills": shared_skills,
            "skills_to_acquire": skills_to_acquire,
            "overlap_percentage": coverage_pct,
            "jaccard_index": similarity,
            "transition_ease": transition_ease
        }

    def generate_comprehensive_evaluation(self, user_skills: List[str]) -> List[CandidateReadinessReport]:
        """
        Evaluates candidate readiness across all career paths and attaches
        learning roadmaps and transferability ratings.
        """
        normalized_user = {s.strip().lower() for s in user_skills if s.strip()}
        evaluations = []

        for role_name, details in self.career_paths.items():
            req_skills = details.get("required_skills", [])
            req_set_lower = {s.lower(): s for s in req_skills}

            matching = [req_set_lower[s] for s in req_set_lower if s in normalized_user]
            missing = [req_set_lower[s] for s in req_set_lower if s not in normalized_user]

            total = len(req_skills)
            pct = round((len(matching) / total) * 100) if total > 0 else 0

            if pct == 100:
                status = "Fully Qualified"
            elif pct >= 75:
                status = "Near Ready (1 skill gap)"
            elif pct >= 50:
                status = "Intermediate Match"
            elif pct > 0:
                status = "Foundational Stage"
            else:
                status = "No Overlap Yet"

            # Calculate user-to-role transferability score
            user_set = set(matching)
            role_set = set(req_skills)
            transferability = self.compute_jaccard_similarity(user_set, role_set)

            # Generate roadmap
            milestones = RoadmapGenerator.generate_roadmap(role_name, missing)

            evaluations.append(
                CandidateReadinessReport(
                    role=role_name,
                    match_percentage=pct,
                    status=status,
                    matching_skills=matching,
                    missing_skills=missing,
                    total_required=total,
                    salary_range=details.get("salary_range", ""),
                    growth_rate=details.get("growth_rate", ""),
                    education=details.get("education", ""),
                    transferability_score=transferability,
                    milestones=milestones
                )
            )

        # Sort by match percentage descending
        evaluations.sort(key=lambda x: x.match_percentage, reverse=True)
        return evaluations

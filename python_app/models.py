from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class SalaryMetrics:
    min: int
    max: int
    average: int
    spread: int

@dataclass
class CareerPathModel:
    title: str
    required_skills: List[str]
    salary_range: str
    growth_rate: str
    education: str
    salary_metrics: SalaryMetrics

@dataclass
class CandidateProfile:
    known_skills: List[str]
    target_role: Optional[str] = None
    weekly_hours_available: int = 10

@dataclass
class RoadmapMilestone:
    phase_number: int
    phase_title: str
    skills_to_learn: List[str]
    estimated_weeks: int
    recommended_projects: List[str]
    key_deliverable: str

@dataclass
class CandidateReadinessReport:
    role: str
    match_percentage: int
    status: str
    matching_skills: List[str]
    missing_skills: List[str]
    total_required: int
    salary_range: str
    growth_rate: str
    education: str
    transferability_score: float
    milestones: List[RoadmapMilestone] = field(default_factory=list)

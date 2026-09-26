from typing import List, Dict, Any
from .models import RoadmapMilestone

# Curated syllabus and projects for in-demand tech skills
SKILL_LEARNING_GUIDES: Dict[str, Dict[str, Any]] = {
    "Python": {
        "difficulty": "Beginner to Intermediate",
        "weeks": 4,
        "topics": ["Syntax & Data Structures", "OOP & Functional Idioms", "Virtual Environments & Packaging", "API Requests"],
        "project": "Build an Automated Data Extraction & Web Scraper CLI"
    },
    "SQL": {
        "difficulty": "Beginner",
        "weeks": 3,
        "topics": ["Complex JOINs & Aggregations", "Window Functions & CTEs", "Indexing & Query Optimization", "Schema Normalization"],
        "project": "Design and Query a Scalable E-Commerce Analytics Database"
    },
    "Data Analysis": {
        "difficulty": "Intermediate",
        "weeks": 4,
        "topics": ["Pandas & NumPy Manipulation", "Exploratory Data Analysis (EDA)", "Statistical Testing", "Matplotlib/Seaborn Visualization"],
        "project": "Interactive Financial Markets or Health Data Insight Notebook"
    },
    "Machine Learning": {
        "difficulty": "Intermediate to Advanced",
        "weeks": 6,
        "topics": ["Supervised & Unsupervised Learning", "Feature Engineering & Cross-Validation", "Scikit-Learn Pipelines", "Model Evaluation Metrics"],
        "project": "End-to-End Customer Churn or Real Estate Price Prediction System"
    },
    "Deep Learning": {
        "difficulty": "Advanced",
        "weeks": 6,
        "topics": ["Backpropagation & Gradient Optimization", "Convolutional & Recurrent Networks", "PyTorch/TensorFlow Frameworks", "Transfer Learning"],
        "project": "Image Classification or Sentiment Analysis Neural Network"
    },
    "Artificial Intelligence": {
        "difficulty": "Advanced",
        "weeks": 5,
        "topics": ["Heuristic Search & Reinforcement", "Large Language Model Prompt Engineering & RAG", "Transformer Architectures", "Ethics & Alignment"],
        "project": "Autonomous Agent with Retrieval-Augmented Generation"
    },
    "JavaScript": {
        "difficulty": "Beginner to Intermediate",
        "weeks": 4,
        "topics": ["ES6+ Modern Syntax", "Async/Await & Promises", "DOM Manipulation & Event Loop", "Modular Architecture"],
        "project": "Interactive Real-Time Dashboard with Local Persistence"
    },
    "HTML/CSS": {
        "difficulty": "Beginner",
        "weeks": 2,
        "topics": ["Semantic HTML5 & Accessibility (a11y)", "Flexbox & Grid Layouts", "Responsive Design & Media Queries", "Modern CSS Variables"],
        "project": "Pixel-Perfect, Accessible SaaS Landing Page"
    },
    "React": {
        "difficulty": "Intermediate",
        "weeks": 4,
        "topics": ["Component Lifecycle & Custom Hooks", "State Management & Context", "React Router & Lazy Loading", "Performance Optimization"],
        "project": "Full-Featured Collaborative Kanban or Task Management Web Application"
    },
    "Node.js": {
        "difficulty": "Intermediate",
        "weeks": 4,
        "topics": ["Express/Fastify Frameworks", "RESTful API Architecture", "Authentication with JWT & Bcrypt", "Database Integration with ORM"],
        "project": "Production-Grade Secure REST API with Role-Based Access Control"
    },
    "Cloud Computing": {
        "difficulty": "Intermediate",
        "weeks": 4,
        "topics": ["Cloud Architecture (AWS/GCP)", "IAM & Security Rules", "Serverless Compute & Object Storage", "CDN & DNS Configuration"],
        "project": "Deploy High-Availability Microservice to Cloud Infrastructure"
    },
    "DevOps": {
        "difficulty": "Intermediate to Advanced",
        "weeks": 4,
        "topics": ["Docker Containerization", "GitHub Actions CI/CD Pipelines", "Infrastructure as Code", "Logging & Observability"],
        "project": "Automated Multi-Stage CI/CD Pipeline with Docker Deployment"
    }
}

class RoadmapGenerator:
    """
    Generates tailored, milestone-based learning plans to bridge
    the gap between candidate's current skills and target role requirements.
    """

    @staticmethod
    def generate_roadmap(target_role: str, missing_skills: List[str]) -> List[RoadmapMilestone]:
        if not missing_skills:
            return [
                RoadmapMilestone(
                    phase_number=1,
                    phase_title="Readiness & Interview Preparation",
                    skills_to_learn=[],
                    estimated_weeks=2,
                    recommended_projects=["Build an advanced capstone portfolio", "Mock technical interviews & system design"],
                    key_deliverable="Deploy verified capstone project and publish case study"
                )
            ]

        milestones = []
        # Chunk missing skills into logical phases (e.g. 1-2 skills per milestone)
        phase_num = 1
        for i in range(0, len(missing_skills), 2):
            phase_skills = missing_skills[i:i+2]
            phase_weeks = 0
            projects = []
            
            for s in phase_skills:
                guide = SKILL_LEARNING_GUIDES.get(s, {
                    "weeks": 3,
                    "topics": [f"Fundamental principles of {s}", f"Practical applications of {s}"],
                    "project": f"Hands-on demonstration repository for {s}"
                })
                phase_weeks += guide["weeks"]
                projects.append(guide["project"])

            milestones.append(
                RoadmapMilestone(
                    phase_number=phase_num,
                    phase_title=f"Phase {phase_num}: Master {' & '.join(phase_skills)}",
                    skills_to_learn=phase_skills,
                    estimated_weeks=max(2, phase_weeks),
                    recommended_projects=projects,
                    key_deliverable=f"Complete working demo applying {' and '.join(phase_skills)}"
                )
            )
            phase_num += 1

        # Final capstone phase
        milestones.append(
            RoadmapMilestone(
                phase_number=phase_num,
                phase_title=f"Phase {phase_num}: {target_role} Capstone & Industry Portfolio",
                skills_to_learn=[],
                estimated_weeks=3,
                recommended_projects=[f"End-to-End {target_role} production application integrating all acquired competencies"],
                key_deliverable=f"Production-deployed portfolio demonstrating all {target_role} requirements"
            )
        )

        return milestones

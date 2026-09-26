import unittest
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from python_app.analyzer import JobMarketAnalyzer
from python_app.recommender import CareerRecommender
from python_app.roadmap_generator import RoadmapGenerator
from python_app.market_forecaster import MarketForecaster
from python_app.exporter import ReportExporter

class TestRecommenderAndRoadmap(unittest.TestCase):
    def setUp(self):
        self.analyzer = JobMarketAnalyzer()
        self.recommender = self.analyzer.get_recommender()
        self.forecaster = self.analyzer.get_forecaster()

    def test_jaccard_similarity(self):
        score = self.recommender.compute_jaccard_similarity({"Python", "SQL"}, {"Python", "SQL", "ML"})
        self.assertAlmostEqual(score, 0.667, places=2)

    def test_transferability(self):
        # Data Scientist to AI Engineer
        res = self.recommender.calculate_transferability("Data Scientist", "AI Engineer")
        self.assertIn("Python", res["shared_skills"])
        self.assertIn("Machine Learning", res["shared_skills"])
        self.assertEqual(res["overlap_percentage"], 50)
        self.assertIn("Artificial Intelligence", res["skills_to_acquire"])
        self.assertIn("Deep Learning", res["skills_to_acquire"])

    def test_roadmap_generation(self):
        milestones = RoadmapGenerator.generate_roadmap("Data Scientist", ["Machine Learning", "Data Analysis"])
        self.assertGreaterEqual(len(milestones), 2)
        self.assertTrue(any("Machine Learning" in m.skills_to_learn or "Data Analysis" in m.skills_to_learn for m in milestones))

    def test_forecaster_leverage(self):
        rankings = self.forecaster.get_skill_leverage_rankings()
        self.assertGreater(len(rankings), 0)
        # Python should be highest or tied for highest leverage (used in 2 roles)
        python_item = next(item for item in rankings if item["skill"] == "Python")
        self.assertEqual(python_item["role_count"], 2)
        self.assertTrue(python_item["is_cross_role"])

    def test_exporter_markdown_and_csv(self):
        evals = self.analyzer.evaluate_candidate(["Python", "SQL"])
        md = ReportExporter.to_markdown(evals)
        self.assertIn("Candidate Tech Career Readiness", md)
        self.assertIn("Data Scientist", md)

        csv_out = ReportExporter.to_csv(evals)
        self.assertIn("Role,MatchPercentage", csv_out)
        self.assertIn("Data Scientist", csv_out)

if __name__ == "__main__":
    unittest.main()

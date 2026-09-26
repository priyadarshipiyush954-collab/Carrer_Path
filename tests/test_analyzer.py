import unittest
import os
import sys

# Ensure project root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from python_app.analyzer import JobMarketAnalyzer

class TestJobMarketAnalyzer(unittest.TestCase):
    def setUp(self):
        self.analyzer = JobMarketAnalyzer()

    def test_dataset_loaded_successfully(self):
        """Verifies that the dataset loads and contains core keys."""
        self.assertGreater(len(self.analyzer.required_skills), 0)
        self.assertGreater(len(self.analyzer.career_paths), 0)
        self.assertIn("Data Scientist", self.analyzer.career_paths)
        self.assertIn("Web Developer", self.analyzer.career_paths)
        self.assertIn("AI Engineer", self.analyzer.career_paths)

    def test_hackathon_consistency_fix(self):
        """
        Validates the Hackathon 3.0 consistency fix:
        All skills in career_paths must exist in required_skills, including:
        - HTML/CSS
        - React
        - Node.js
        - Deep Learning
        """
        is_valid, errors = self.analyzer.validate_dataset_consistency()
        self.assertTrue(is_valid, f"Dataset consistency validation failed: {errors}")
        self.assertEqual(len(errors), 0)

        # Check explicitly that the added items are in required_skills
        for added_skill in ["HTML/CSS", "React", "Node.js", "Deep Learning"]:
            self.assertIn(
                added_skill,
                self.analyzer.required_skills,
                f"Missing {added_skill} from required_skills"
            )

    def test_parse_salary(self):
        """Tests parsing of salary string formats."""
        res = self.analyzer.parse_salary("$80,000 - $150,000")
        self.assertEqual(res["min"], 80000)
        self.assertEqual(res["max"], 150000)
        self.assertEqual(res["average"], 115000)
        self.assertEqual(res["spread"], 70000)

    def test_skill_match_perfect(self):
        """Tests 100% skill match calculation."""
        web_skills = ["JavaScript", "HTML/CSS", "React", "Node.js"]
        matches = self.analyzer.calculate_skill_match(web_skills)
        web_match = next((m for m in matches if m["role"] == "Web Developer"), None)
        self.assertIsNotNone(web_match)
        self.assertEqual(web_match["match_percentage"], 100)
        self.assertEqual(len(web_match["missing_skills"]), 0)
        self.assertEqual(web_match["status"], "Fully Qualified")

    def test_skill_match_partial(self):
        """Tests partial match and missing skills deduction."""
        # 2 out of 4 skills for Data Scientist (Python, SQL)
        partial_skills = ["Python", "SQL"]
        matches = self.analyzer.calculate_skill_match(partial_skills)
        ds_match = next((m for m in matches if m["role"] == "Data Scientist"), None)
        self.assertIsNotNone(ds_match)
        self.assertEqual(ds_match["match_percentage"], 50)
        self.assertIn("Python", ds_match["matching_skills"])
        self.assertIn("SQL", ds_match["matching_skills"])
        self.assertIn("Machine Learning", ds_match["missing_skills"])
        self.assertIn("Data Analysis", ds_match["missing_skills"])

    def test_compare_roles(self):
        """Tests side-by-side comparison logic."""
        comparison = self.analyzer.compare_roles(["Data Scientist", "AI Engineer"])
        self.assertIn("Data Scientist", comparison["roles"])
        self.assertIn("AI Engineer", comparison["roles"])
        self.assertIn("Python", comparison["skill_matrix"])
        # Both require Python
        self.assertTrue(comparison["skill_matrix"]["Python"]["Data Scientist"])
        self.assertTrue(comparison["skill_matrix"]["Python"]["AI Engineer"])

    def test_market_statistics(self):
        """Tests calculation of aggregate stats."""
        stats = self.analyzer.get_market_statistics()
        self.assertEqual(stats["total_career_paths"], 3)
        self.assertEqual(stats["total_cataloged_skills"], 18)
        self.assertGreaterEqual(stats["min_salary"], 70000)
        self.assertGreaterEqual(stats["max_salary"], 160000)

if __name__ == "__main__":
    unittest.main()

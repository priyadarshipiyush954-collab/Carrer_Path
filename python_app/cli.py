#!/usr/bin/env python3
"""
Command Line Interface for Job Market Explorer.
Run:
    python python_app/cli.py list
    python python_app/cli.py match --skills "Python,SQL,Data Analysis"
    python python_app/cli.py compare "Data Scientist" "AI Engineer"
    python python_app/cli.py validate
    python python_app/cli.py stats
"""

import sys
import os
import argparse
from typing import List

# Ensure python_app package is in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from python_app.analyzer import JobMarketAnalyzer

def format_currency(amount: int) -> str:
    return f"${amount:,.0f}"

def handle_list(analyzer: JobMarketAnalyzer, args):
    print("=" * 70)
    print("TECH CAREER PATHS OVERVIEW")
    print("=" * 70)
    for role_name, details in analyzer.career_paths.items():
        print(f"\n🔹 Role: {role_name}")
        print(f"   Salary Range: {details.get('salary_range')} ({details.get('growth_rate')} Growth)")
        print(f"   Education:    {details.get('education')}")
        print(f"   Skills:       {', '.join(details.get('required_skills', []))}")
    print("\n" + "=" * 70)

def handle_match(analyzer: JobMarketAnalyzer, args):
    if not args.skills:
        print("Please provide skills using --skills 'Skill1,Skill2'")
        return

    skills = [s.strip() for s in args.skills.split(",") if s.strip()]
    results = analyzer.calculate_skill_match(skills)

    print("=" * 70)
    print(f"SKILL GAP & CAREER READINESS REPORT")
    print(f"User Skills Provided: {', '.join(skills)}")
    print("=" * 70)

    for res in results:
        print(f"\n🏆 Role: {res['role']} — {res['match_percentage']}% Match [{res['status']}]")
        print(f"   Compensation: {res['salary_range']} • Growth: {res['growth_rate']}")
        if res['matching_skills']:
            print(f"   ✅ You Have ({len(res['matching_skills'])}): {', '.join(res['matching_skills'])}")
        else:
            print(f"   ✅ You Have: None yet")
        if res['missing_skills']:
            print(f"   ⏳ To Learn ({len(res['missing_skills'])}): {', '.join(res['missing_skills'])}")
        else:
            print(f"   🎉 Ready! All {res['total_required']} prerequisite skills mastered.")
    print("\n" + "=" * 70)

def handle_compare(analyzer: JobMarketAnalyzer, args):
    roles = args.roles
    if not roles or len(roles) < 2:
        print("Please specify at least 2 roles to compare. Example: compare 'Data Scientist' 'AI Engineer'")
        return

    comparison = analyzer.compare_roles(roles)
    if "error" in comparison:
        print(f"Error: {comparison['error']}")
        return

    print("=" * 75)
    print(f"CAREER PATH COMPARISON: {' vs '.join(comparison['roles'])}")
    print("=" * 75)

    # Summaries
    for role, summary in comparison["summaries"].items():
        print(f"\n📌 {role}")
        print(f"   Salary:    {summary['salary_range']} (Midpoint: {format_currency(summary['salary_metrics']['average'])})")
        print(f"   Growth:    {summary['growth_rate']}")
        print(f"   Education: {summary['education']}")
        print(f"   Skills:    {', '.join(summary['skills'])}")

    # Matrix
    print("\n" + "-" * 75)
    print(f"{'SKILL':<25} " + " ".join(f"{r[:15]:<18}" for r in comparison['roles']))
    print("-" * 75)
    for skill, role_map in comparison["skill_matrix"].items():
        indicators = ["Yes" if role_map[r] else "-" for r in comparison['roles']]
        print(f"{skill:<25} " + " ".join(f"{ind:<18}" for ind in indicators))
    print("=" * 75)

def handle_skills(analyzer: JobMarketAnalyzer, args):
    print("=" * 70)
    print(f"MASTER IN-DEMAND SKILLS TAXONOMY ({len(analyzer.required_skills)} Total)")
    print("=" * 70)
    for idx, skill in enumerate(analyzer.required_skills, 1):
        # Find which roles require this
        roles = [r for r, d in analyzer.career_paths.items() if skill in d.get("required_skills", [])]
        usage = f"Required by: {', '.join(roles)}" if roles else "Domain / Cross-functional competency"
        print(f"{idx:2d}. {skill:<25} -> {usage}")
    print("=" * 70)

def handle_validate(analyzer: JobMarketAnalyzer, args):
    is_valid, errors = analyzer.validate_dataset_consistency()
    print("=" * 70)
    print("DATASET INTEGRITY & CONSISTENCY CHECK")
    print("=" * 70)
    if is_valid:
        print("✅ SUCCESS: Dataset is 100% consistent!")
        print("   All career path required_skills match the master required_skills taxonomy.")
        print(f"   - {len(analyzer.career_paths)} career paths verified.")
        print(f"   - {len(analyzer.required_skills)} master skills validated.")
    else:
        print("❌ CONSISTENCY ISSUES FOUND:")
        for err in errors:
            print(f"   - {err}")
    print("=" * 70)

def handle_stats(analyzer: JobMarketAnalyzer, args):
    stats = analyzer.get_market_statistics()
    print("=" * 70)
    print("JOB MARKET AGGREGATE STATISTICS")
    print("=" * 70)
    print(f"Total Career Paths:        {stats['total_career_paths']}")
    print(f"Total Cataloged Skills:     {stats['total_cataloged_skills']}")
    print(f"Salary Range:              {format_currency(stats['min_salary'])} - {format_currency(stats['max_salary'])}")
    print(f"Average Market Midpoint:   {format_currency(stats['average_salary'])}")
    print("\nMost Demanded Skills Across Tracked Roles:")
    for skill, count in stats['skill_demand_ranking']:
        if count > 0:
            print(f"   • {skill:<22} appears in {count} career paths")
    print("=" * 70)

def main():
    parser = argparse.ArgumentParser(description="Tech Career & Job Market Explorer CLI")
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # list
    sub_list = subparsers.add_parser("list", help="List all tech career paths")
    sub_list.set_defaults(func=handle_list)

    # match
    sub_match = subparsers.add_parser("match", help="Calculate skill match score and gap analysis")
    sub_match.add_argument("--skills", required=True, help="Comma-separated skills you currently possess")
    sub_match.set_defaults(func=handle_match)

    # compare
    sub_compare = subparsers.add_parser("compare", help="Compare two or more career paths")
    sub_compare.add_argument("roles", nargs="+", help="Names of roles to compare")
    sub_compare.set_defaults(func=handle_compare)

    # skills
    sub_skills = subparsers.add_parser("skills", help="Display master list of in-demand skills")
    sub_skills.set_defaults(func=handle_skills)

    # validate
    sub_val = subparsers.add_parser("validate", help="Validate dataset consistency and schema")
    sub_val.set_defaults(func=handle_validate)

    # stats
    sub_stats = subparsers.add_parser("stats", help="Show market summary statistics")
    sub_stats.set_defaults(func=handle_stats)

    args = parser.parse_args()

    try:
        analyzer = JobMarketAnalyzer()
    except Exception as e:
        print(f"Error loading dataset: {e}", file=sys.stderr)
        sys.exit(1)

    if hasattr(args, "func"):
        args.func(analyzer, args)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()

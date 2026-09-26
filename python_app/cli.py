#!/usr/bin/env python3
"""
Comprehensive CLI for Tech Career & Job Market Explorer.
Commands:
    python python_app/cli.py list
    python python_app/cli.py match --skills "Python,SQL,Data Analysis"
    python python_app/cli.py roadmap --role "Data Scientist" --skills "Python,SQL"
    python python_app/cli.py transfer "Data Scientist" "AI Engineer"
    python python_app/cli.py leverage
    python python_app/cli.py compare "Data Scientist" "AI Engineer"
    python python_app/cli.py validate
    python python_app/cli.py stats
    python python_app/cli.py export --skills "Python,SQL" --format md
"""

import sys
import os
import argparse
from typing import List

# Ensure python_app package is in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from python_app.analyzer import JobMarketAnalyzer
from python_app.exporter import ReportExporter

def format_currency(amount: int) -> str:
    return f"${amount:,.0f}"

def handle_list(analyzer: JobMarketAnalyzer, args):
    print("=" * 75)
    print("TECH CAREER PATHS DIRECTORY")
    print("=" * 75)
    for role_name, details in analyzer.career_paths.items():
        print(f"\n💼 Role: {role_name}")
        print(f"   Salary Range: {details.get('salary_range')} ({details.get('growth_rate')} Growth)")
        print(f"   Education:    {details.get('education')}")
        print(f"   Skills:       {', '.join(details.get('required_skills', []))}")
    print("\n" + "=" * 75)

def handle_match(analyzer: JobMarketAnalyzer, args):
    if not args.skills:
        print("Please provide skills using --skills 'Skill1,Skill2'")
        return

    skills = [s.strip() for s in args.skills.split(",") if s.strip()]
    results = analyzer.calculate_skill_match(skills)

    print("=" * 75)
    print(f"CANDIDATE SKILL GAP & READINESS REPORT")
    print(f"User Skills Provided: {', '.join(skills)}")
    print("=" * 75)

    for res in results:
        print(f"\n🏆 {res['role']} — {res['match_percentage']}% Match [{res['status']}]")
        print(f"   Compensation: {res['salary_range']} • Growth: {res['growth_rate']}")
        if res['matching_skills']:
            print(f"   ✅ You Have ({len(res['matching_skills'])}): {', '.join(res['matching_skills'])}")
        else:
            print(f"   ✅ You Have: None yet")
        if res['missing_skills']:
            print(f"   ⏳ To Learn ({len(res['missing_skills'])}): {', '.join(res['missing_skills'])}")
        else:
            print(f"   🎉 Ready! All {res['total_required']} prerequisite skills mastered.")
    print("\n" + "=" * 75)

def handle_roadmap(analyzer: JobMarketAnalyzer, args):
    role = args.role
    if role not in analyzer.career_paths:
        print(f"Error: Role '{role}' not found. Available roles: {', '.join(analyzer.career_paths.keys())}")
        return

    user_skills = [s.strip() for s in args.skills.split(",") if s.strip()] if args.skills else []
    reports = analyzer.evaluate_candidate(user_skills)
    target_report = next((r for r in reports if r.role == role), None)

    if not target_report:
        print("Failed to compute roadmap.")
        return

    print("=" * 75)
    print(f"PERSONALIZED LEARNING ROADMAP: {role}")
    print(f"Current Match: {target_report.match_percentage}% ({len(target_report.matching_skills)}/{target_report.total_required} skills)")
    print("=" * 75)

    for m in target_report.milestones:
        print(f"\n📍 {m.phase_title} (~{m.estimated_weeks} weeks)")
        if m.skills_to_learn:
            print(f"   Focus Skills: {', '.join(m.skills_to_learn)}")
        print(f"   Recommended Projects:")
        for p in m.recommended_projects:
            print(f"     - {p}")
        print(f"   Key Deliverable: {m.key_deliverable}")
    print("\n" + "=" * 75)

def handle_transfer(analyzer: JobMarketAnalyzer, args):
    recommender = analyzer.get_recommender()
    res = recommender.calculate_transferability(args.source, args.target)
    if "error" in res:
        print(f"Error: {res['error']}")
        return

    print("=" * 75)
    print(f"ROLE TRANSITION ANALYSIS: {args.source} ➔ {args.target}")
    print("=" * 75)
    print(f"Transition Feasibility: {res['transition_ease']}")
    print(f"Skill Overlap:           {res['overlap_percentage']}% (Jaccard Index: {res['jaccard_index']})")
    print(f"\nReusable Skills ({len(res['shared_skills'])}):")
    print(f"  {', '.join(res['shared_skills']) if res['shared_skills'] else 'None'}")
    print(f"\nSkills to Acquire ({len(res['skills_to_acquire'])}):")
    print(f"  {', '.join(res['skills_to_acquire']) if res['skills_to_acquire'] else 'Fully compatible!'}")
    print("=" * 75)

def handle_leverage(analyzer: JobMarketAnalyzer, args):
    forecaster = analyzer.get_forecaster()
    rankings = forecaster.get_skill_leverage_rankings()

    print("=" * 75)
    print("SKILL MARKET LEVERAGE RANKING (Weighted by Role Growth)")
    print("=" * 75)
    print(f"{'RANK':<5} {'SKILL':<25} {'LEVERAGE':<10} {'ROLES COUNT':<12} {'ROLES'}")
    print("-" * 75)
    for idx, item in enumerate(rankings, 1):
        roles_str = ", ".join(item["roles"]) if item["roles"] else "Universal domain skill"
        print(f"{idx:<5} {item['skill']:<25} {item['leverage_score']:<10} {item['role_count']:<12} {roles_str}")
    print("=" * 75)

def handle_compare(analyzer: JobMarketAnalyzer, args):
    roles = args.roles
    if not roles or len(roles) < 2:
        print("Please specify at least 2 roles to compare.")
        return

    comparison = analyzer.compare_roles(roles)
    if "error" in comparison:
        print(f"Error: {comparison['error']}")
        return

    print("=" * 75)
    print(f"CAREER PATH COMPARISON: {' vs '.join(comparison['roles'])}")
    print("=" * 75)

    for role, summary in comparison["summaries"].items():
        print(f"\n📌 {role}")
        print(f"   Salary:    {summary['salary_range']} (Midpoint: {format_currency(summary['salary_metrics']['average'])})")
        print(f"   Growth:    {summary['growth_rate']}")
        print(f"   Education: {summary['education']}")
        print(f"   Skills:    {', '.join(summary['skills'])}")

    print("\n" + "-" * 75)
    print(f"{'SKILL':<25} " + " ".join(f"{r[:15]:<18}" for r in comparison['roles']))
    print("-" * 75)
    for skill, role_map in comparison["skill_matrix"].items():
        indicators = ["Yes" if role_map[r] else "-" for r in comparison['roles']]
        print(f"{skill:<25} " + " ".join(f"{ind:<18}" for ind in indicators))
    print("=" * 75)

def handle_validate(analyzer: JobMarketAnalyzer, args):
    is_valid, errors = analyzer.validate_dataset_consistency()
    print("=" * 75)
    print("DATASET INTEGRITY & CONSISTENCY CHECK")
    print("=" * 75)
    if is_valid:
        print("✅ SUCCESS: Dataset is 100% consistent!")
        print("   All career path required_skills match the master required_skills taxonomy.")
        print(f"   - {len(analyzer.career_paths)} career paths verified.")
        print(f"   - {len(analyzer.required_skills)} master skills validated.")
    else:
        print("❌ CONSISTENCY ISSUES FOUND:")
        for err in errors:
            print(f"   - {err}")
    print("=" * 75)

def handle_stats(analyzer: JobMarketAnalyzer, args):
    stats = analyzer.get_market_statistics()
    forecaster = analyzer.get_forecaster()
    growth_data = forecaster.get_growth_momentum_summary()

    print("=" * 75)
    print("JOB MARKET AGGREGATE STATISTICS & FORECAST")
    print("=" * 75)
    print(f"Total Career Paths:        {stats['total_career_paths']}")
    print(f"Total Cataloged Skills:     {stats['total_cataloged_skills']}")
    print(f"Salary Range:              {format_currency(stats['min_salary'])} - {format_currency(stats['max_salary'])}")
    print(f"Average Market Midpoint:   {format_currency(stats['average_salary'])}")
    print(f"High-Growth Role Ratio:    {growth_data['high_growth_ratio']}%")
    print(f"Fastest Growing Track:     {growth_data['fastest_growing_role']}")
    print("\nMost Demanded Skills Across Tracked Roles:")
    for skill, count in stats['skill_demand_ranking']:
        if count > 0:
            print(f"   • {skill:<22} appears in {count} career paths")
    print("=" * 75)

def handle_export(analyzer: JobMarketAnalyzer, args):
    user_skills = [s.strip() for s in args.skills.split(",") if s.strip()] if args.skills else []
    reports = analyzer.evaluate_candidate(user_skills)
    fmt = args.format.lower()

    if fmt == "csv":
        out = ReportExporter.to_csv(reports)
    else:
        out = ReportExporter.to_markdown(reports)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(out)
        print(f"Report successfully saved to {args.output}")
    else:
        print(out)

def main():
    parser = argparse.ArgumentParser(description="Tech Career & Job Market Explorer Python CLI")
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    sub_list = subparsers.add_parser("list", help="List all tech career paths")
    sub_list.set_defaults(func=handle_list)

    sub_match = subparsers.add_parser("match", help="Calculate skill match score and gap analysis")
    sub_match.add_argument("--skills", required=True, help="Comma-separated skills you currently possess")
    sub_match.set_defaults(func=handle_match)

    sub_road = subparsers.add_parser("roadmap", help="Generate milestone learning roadmap for a target career")
    sub_road.add_argument("--role", required=True, help="Target role name (e.g. 'Data Scientist')")
    sub_road.add_argument("--skills", default="", help="Comma-separated skills you already possess")
    sub_road.set_defaults(func=handle_roadmap)

    sub_trans = subparsers.add_parser("transfer", help="Analyze cross-role transferability")
    sub_trans.add_argument("source", help="Source role name")
    sub_trans.add_argument("target", help="Target role name")
    sub_trans.set_defaults(func=handle_transfer)

    sub_lev = subparsers.add_parser("leverage", help="Show skill leverage rankings")
    sub_lev.set_defaults(func=handle_leverage)

    sub_compare = subparsers.add_parser("compare", help="Compare two or more career paths")
    sub_compare.add_argument("roles", nargs="+", help="Names of roles to compare")
    sub_compare.set_defaults(func=handle_compare)

    sub_val = subparsers.add_parser("validate", help="Validate dataset consistency and schema")
    sub_val.set_defaults(func=handle_validate)

    sub_stats = subparsers.add_parser("stats", help="Show market summary statistics")
    sub_stats.set_defaults(func=handle_stats)

    sub_export = subparsers.add_parser("export", help="Export candidate gap report")
    sub_export.add_argument("--skills", default="", help="Your current skills")
    sub_export.add_argument("--format", choices=["md", "csv"], default="md", help="Export format")
    sub_export.add_argument("--output", help="Optional output filepath")
    sub_export.set_defaults(func=handle_export)

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

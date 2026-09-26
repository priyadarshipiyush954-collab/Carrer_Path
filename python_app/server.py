#!/usr/bin/env python3
"""
Python Job Market REST API and Microservice.
Built entirely with the Python Standard Library (zero third-party requirements).
"""

import sys
import os
import json
import argparse
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from python_app.analyzer import JobMarketAnalyzer
from python_app.exporter import ReportExporter

analyzer = JobMarketAnalyzer()

class JobMarketHandler(BaseHTTPRequestHandler):
    def _send_json(self, data: dict, status_code: int = 200):
        response_bytes = json.dumps(data, indent=2).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(response_bytes)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip('/')
        query = parse_qs(parsed.query)

        if path == "" or path == "/":
            html = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Python Job Market Engine & API</title>
  <style>
    body {{ font-family: system-ui, sans-serif; background: #faf5ff; color: #1e1b4b; padding: 2rem; max-width: 850px; margin: auto; }}
    h1 {{ color: #4338ca; }}
    .badge {{ display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; font-weight: bold; font-size: 0.8rem; }}
    .card {{ background: #ffffff; border: 1px solid #e0e7ff; border-radius: 1rem; padding: 1.5rem; margin-top: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }}
    a {{ color: #6366f1; text-decoration: none; font-weight: 500; }}
    a:hover {{ text-decoration: underline; }}
    ul {{ line-height: 2; }}
    code {{ background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; }}
  </style>
</head>
<body>
  <h1>Job Market Python Microservice <span class="badge">Active</span></h1>
  <p>Production Python service powering career analysis, candidate readiness matching, and skill gap forecasting.</p>
  <div class="card">
    <h3>Available REST Endpoints</h3>
    <ul>
      <li><a href="/api/health">/api/health</a> - Microservice health status</li>
      <li><a href="/api/careers">/api/careers</a> - Complete career path data</li>
      <li><a href="/api/skills">/api/skills</a> - Master required skills directory</li>
      <li><a href="/api/stats">/api/stats</a> - Market statistics & growth momentum</li>
      <li><a href="/api/leverage">/api/leverage</a> - Skill market leverage & cross-role utility</li>
      <li><a href="/api/validate">/api/validate</a> - Dataset integrity & consistency verification</li>
    </ul>
    <h3>POST Endpoints</h3>
    <ul>
      <li><code>POST /api/match</code> with <code>{{"skills": ["Python", "SQL"]}}</code></li>
      <li><code>POST /api/roadmap</code> with <code>{{"role": "Data Scientist", "skills": ["Python"]}}</code></li>
      <li><code>POST /api/transfer</code> with <code>{{"source": "Web Developer", "target": "Data Scientist"}}</code></li>
    </ul>
  </div>
</body>
</html>"""
            response_bytes = html.encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(response_bytes)))
            self.end_headers()
            self.wfile.write(response_bytes)
            return

        if path == "/api/health":
            self._send_json({"status": "healthy", "service": "Python Job Market Microservice", "version": "1.0.0"})
            return

        if path == "/api/careers":
            self._send_json({"career_paths": analyzer.career_paths})
            return

        if path == "/api/skills":
            self._send_json({"required_skills": analyzer.required_skills})
            return

        if path == "/api/stats":
            stats = analyzer.get_market_statistics()
            growth = analyzer.get_forecaster().get_growth_momentum_summary()
            self._send_json({**stats, "growth_momentum": growth})
            return

        if path == "/api/leverage":
            rankings = analyzer.get_forecaster().get_skill_leverage_rankings()
            self._send_json({"rankings": rankings})
            return

        if path == "/api/validate":
            is_valid, errors = analyzer.validate_dataset_consistency()
            self._send_json({"valid": is_valid, "errors": errors, "career_paths_count": len(analyzer.career_paths)})
            return

        self._send_json({"error": "Endpoint not found"}, 404)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip('/')

        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        try:
            payload = json.loads(body.decode('utf-8')) if content_length > 0 else {}
        except Exception as e:
            self._send_json({"error": f"Invalid JSON payload: {str(e)}"}, 400)
            return

        if path == "/api/match":
            skills = payload.get("skills", [])
            results = analyzer.calculate_skill_match(skills)
            self._send_json({"user_skills": skills, "results": results})
            return

        if path == "/api/roadmap":
            role = payload.get("role", "")
            skills = payload.get("skills", [])
            if role not in analyzer.career_paths:
                self._send_json({"error": f"Role '{role}' not found"}, 404)
                return
            reports = analyzer.evaluate_candidate(skills)
            target = next((r for r in reports if r.role == role), None)
            if target:
                self._send_json({
                    "role": target.role,
                    "match_percentage": target.match_percentage,
                    "milestones": [m.__dict__ for m in target.milestones]
                })
            else:
                self._send_json({"error": "Evaluation failed"}, 500)
            return

        if path == "/api/transfer":
            source = payload.get("source", "")
            target = payload.get("target", "")
            res = analyzer.get_recommender().calculate_transferability(source, target)
            self._send_json(res)
            return

        self._send_json({"error": "Endpoint not found"}, 404)

def run_server(port: int = 8000, host: str = "0.0.0.0"):
    server_address = (host, port)
    httpd = HTTPServer(server_address, JobMarketHandler)
    print(f"🚀 Python Job Market Engine running on http://{host}:{port}/")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Python Job Market API Server")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind (default: 8000)")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host to bind (default: 0.0.0.0)")
    args = parser.parse_args()
    run_server(port=args.port, host=args.host)

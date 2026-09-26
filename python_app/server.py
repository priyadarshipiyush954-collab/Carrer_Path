#!/usr/bin/env python3
"""
Lightweight REST API and Dashboard server using Python standard library.
Zero third-party dependencies required.
Run:
    python python_app/server.py --port 8000
"""

import sys
import os
import json
import argparse
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from python_app.analyzer import JobMarketAnalyzer

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

        if path == "" or path == "/":
            # Serve a clean HTML status page
            html = f"""<!DOCTYPE html>
<html>
<head>
  <title>Python Job Market API</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; max-width: 800px; margin: auto; }}
    h1 {{ color: #818cf8; }}
    .badge {{ display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; background: #065f46; color: #34d399; font-weight: bold; font-size: 0.8rem; }}
    pre {{ background: #1e293b; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; color: #38bdf8; }}
    a {{ color: #38bdf8; text-decoration: none; }}
    a:hover {{ text-decoration: underline; }}
    ul {{ line-height: 1.8; }}
  </style>
</head>
<body>
  <h1>Job Market Explorer API <span class="badge">Active</span></h1>
  <p>Python Standard Library REST API powering career path analysis and skill gap calculations.</p>
  <h3>Available Endpoints</h3>
  <ul>
    <li><a href="/api/health">/api/health</a> - Service health check</li>
    <li><a href="/api/careers">/api/careers</a> - All technology career paths</li>
    <li><a href="/api/skills">/api/skills</a> - Master required skills list</li>
    <li><a href="/api/stats">/api/stats</a> - Market statistics & rankings</li>
    <li><a href="/api/validate">/api/validate</a> - Dataset consistency validation</li>
  </ul>
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
            self._send_json({"status": "healthy", "service": "JobMarketAnalyzer Python Engine"})
            return

        if path == "/api/careers":
            self._send_json({"career_paths": analyzer.career_paths})
            return

        if path == "/api/skills":
            self._send_json({"required_skills": analyzer.required_skills})
            return

        if path == "/api/stats":
            self._send_json(analyzer.get_market_statistics())
            return

        if path == "/api/validate":
            is_valid, errors = analyzer.validate_dataset_consistency()
            self._send_json({"valid": is_valid, "errors": errors, "career_paths_count": len(analyzer.career_paths)})
            return

        self._send_json({"error": "Endpoint not found"}, 404)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip('/')

        if path == "/api/match":
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            try:
                payload = json.loads(body.decode('utf-8'))
                skills = payload.get("skills", [])
                if not isinstance(skills, list):
                    self._send_json({"error": "'skills' must be an array of skill strings"}, 400)
                    return
                results = analyzer.calculate_skill_match(skills)
                self._send_json({"user_skills": skills, "results": results})
            except Exception as e:
                self._send_json({"error": f"Failed to parse JSON body: {str(e)}"}, 400)
            return

        self._send_json({"error": "Endpoint not found"}, 404)

def run_server(port: int = 8000, host: str = "0.0.0.0"):
    server_address = (host, port)
    httpd = HTTPServer(server_address, JobMarketHandler)
    print(f"🚀 Python Job Market API Server running at http://{host}:{port}/")
    print(f"   Health check: http://{host}:{port}/api/health")
    print(f"   Careers API:  http://{host}:{port}/api/careers")
    print("Press Ctrl+C to stop.")
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

#!/usr/bin/env python3
"""
Quick entry point to run the Job Market Analyzer CLI or launch the Python API server.
Usage:
    python run_analyzer.py list
    python run_analyzer.py match --skills "Python,SQL"
    python run_analyzer.py server [--port 8000]
"""

import sys
import os

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "server":
        from python_app.server import run_server
        port = 8000
        if "--port" in sys.argv:
            try:
                idx = sys.argv.index("--port")
                port = int(sys.argv[idx + 1])
            except (IndexError, ValueError):
                pass
        run_server(port=port)
    else:
        from python_app.cli import main
        main()

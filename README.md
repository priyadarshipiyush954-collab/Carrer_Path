# Tech Career & Job Market Explorer (Hackathon 3.0)

[![CI Workflow](https://img.shields.io/badge/CI-GitHub%20Actions-blue?logo=github-actions)](.github/workflows/ci.yml)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python)](python_app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](src/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](src/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker)](Dockerfile)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An end-to-end technology career intelligence platform and skill gap analyzer built with **Python** and **React + TypeScript**. The project analyzes verified technology career paths, benchmarks salary distributions, maps cross-disciplinary in-demand skills, and calculates real-time candidate readiness scores.

---

## 📌 Background & Hackathon 3.0 Data Consistency Fix

This repository originally introduced `job_market_data.json`, a dataset detailing in-demand technical skills, compensation ranges, growth outlooks, and educational requirements across top tech roles.

In Hackathon 3.0, the `required_skills` master taxonomy was audited and strictly aligned with all prerequisite skills specified across `career_paths`. The missing skills were incorporated into the master taxonomy:

- `HTML/CSS` (Web Developer)
- `React` (Web Developer)
- `Node.js` (Web Developer)
- `Deep Learning` (AI Engineer)

---

## 🚀 Key Features

- **Python Core Engine (`python_app/analyzer.py`)**: High-performance module for parsing, salary statistics calculation, role comparison, and readiness score computation. Zero third-party runtime dependencies required.
- **Interactive Python CLI (`python_app/cli.py`)**: Terminal tool to list paths, run candidate skill gap calculations, compare multiple roles, and audit dataset integrity.
- **Python REST API Server (`python_app/server.py`)**: Lightweight HTTP service serving career endpoints and live readiness evaluations.
- **Modern Web Application (React 19 + Tailwind CSS)**: Rich visual dashboard with side-by-side career comparison, interactive skill-selection checklist, and dataset inspector.
- **Automated Test Suite (`tests/`)**: Complete unit tests verifying dataset consistency, edge cases, and mathematical models.
- **Dockerized Deployment**: Production multi-stage `Dockerfile` and `docker-compose.yml` for unified execution.
- **CI/CD Pipeline (`.github/workflows/ci.yml`)**: Multi-version Python testing (3.10, 3.11, 3.12), frontend build checks, and container build validation.

---

## 📂 Project Architecture

```
├── job_market_data.json         # Master career & skills dataset
├── run_analyzer.py              # Top-level Python entry point
│
├── python_app/                  # Python implementation package
│   ├── __init__.py              # Package initializer
│   ├── analyzer.py              # Core JobMarketAnalyzer engine
│   ├── cli.py                   # Command-line interface
│   └── server.py                # Python standard library REST API server
│
├── tests/                       # Python test suite
│   └── test_analyzer.py         # Unit tests (consistency, matching, salary parsing)
│
├── src/                         # React 19 + TypeScript Web App
│   ├── components/              # Modular UI views (Explorer, Matcher, Matrix, Benchmarks)
│   ├── data/                    # Dataset loaders & utilities
│   ├── types/                   # TypeScript interfaces
│   ├── App.tsx                  # Root application
│   └── main.tsx                 # Entry point
│
├── .github/workflows/ci.yml     # Automated CI/CD pipeline
├── Dockerfile                   # Multi-stage production container
├── docker-compose.yml           # Multi-service container orchestration
├── requirements.txt             # Python dependencies
└── package.json                 # Node.js dependencies & scripts
```

---

## 🐍 Python Quickstart & CLI

The Python implementation operates on Python 3.8+ using the Python standard library.

### 1. Validate Dataset Integrity
```bash
python3 python_app/cli.py validate
# or quick JSON syntax check:
python3 -m json.tool job_market_data.json > /dev/null
```

### 2. View Market Overview & Statistics
```bash
python3 python_app/cli.py stats
python3 python_app/cli.py list
```

### 3. Compute Skill Match & Gap Analysis
Provide the skills you currently possess to get an instant readiness report:
```bash
python3 python_app/cli.py match --skills "Python,SQL,Data Analysis"
```
*Output:*
```text
🏆 Role: Data Scientist — 75% Match [Near Ready (1 skill gap)]
   Compensation: $80,000 - $150,000 • Growth: High
   ✅ You Have (3): Python, SQL, Data Analysis
   ⏳ To Learn (1): Machine Learning

🏆 Role: AI Engineer — 25% Match [Foundational Stage]
   Compensation: $90,000 - $160,000 • Growth: Very High
   ✅ You Have (1): Python
   ⏳ To Learn (3): Machine Learning, Artificial Intelligence, Deep Learning
```

### 4. Side-by-Side Role Comparison
```bash
python3 python_app/cli.py compare "Data Scientist" "AI Engineer"
```

### 5. Launch the Python REST API
```bash
python3 python_app/server.py --port 8000
```
Available API endpoints:
- `GET  /api/health` — Service healthcheck
- `GET  /api/careers` — All career paths
- `GET  /api/skills` — Master skills catalog
- `GET  /api/stats` — Aggregate market statistics
- `POST /api/match` — JSON body `{"skills": ["Python", "SQL"]}` for score computation

---

## 🧪 Running Python Tests

Execute the automated test suite with Python's built-in test runner:
```bash
python3 -m unittest discover tests
```
Or with pytest:
```bash
pytest -v
```

---

## 🌐 Running the Web Application

The interactive web dashboard is powered by React 19, TypeScript, and Vite.

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run type-checks & lint
npm run lint

# Build production bundle
npm run build
```

---

## 🐳 Docker & Docker Compose

### Option A: Docker Compose (Recommended)
Spins up both the Web Explorer (port 3000) and the Python REST API (port 8000):
```bash
docker compose up --build
```
- **Web App**: [http://localhost:3000](http://localhost:3000)
- **Python API**: [http://localhost:8000](http://localhost:8000)

### Option B: Build and Run Single Docker Image
```bash
docker build -t tech-career-market-explorer .
docker run -p 3000:3000 tech-career-market-explorer
```

---

## ⚙️ CI/CD Workflow

The repository includes a GitHub Actions pipeline (`.github/workflows/ci.yml`) running on push and pull requests:

1. **Python Validation Matrix (`python-tests`)**: Runs on Python `3.10`, `3.11`, and `3.12`.
   - Validates JSON format with `python -m json.tool`
   - Executes all unit tests in `tests/test_analyzer.py`
   - Verifies CLI commands (`validate`, `stats`, `match`, `list`)
2. **Frontend Quality (`web-tests`)**:
   - Node 22 setup
   - Strict TypeScript type-checking (`tsc --noEmit`)
   - Production bundle compilation (`npm run build`)
3. **Container Delivery (`docker-build`)**:
   - Builds Docker image using Docker Buildx to guarantee image reproducibility

---

## 📊 Dataset Schema (`job_market_data.json`)

```json
{
  "required_skills": [
    "Python", "JavaScript", "Machine Learning", "Data Analysis", "SQL",
    "Cloud Computing", "Agile Methodologies", "DevOps", "Artificial Intelligence",
    "Blockchain", "Communication", "Critical Thinking", "Problem Solving",
    "Teamwork", "HTML/CSS", "React", "Node.js", "Deep Learning"
  ],
  "career_paths": {
    "Data Scientist": {
      "required_skills": ["Python", "Machine Learning", "Data Analysis", "SQL"],
      "salary_range": "$80,000 - $150,000",
      "growth_rate": "High",
      "education": "Bachelor's or Master's in Computer Science, Statistics, or related field"
    },
    "Web Developer": {
      "required_skills": ["JavaScript", "HTML/CSS", "React", "Node.js"],
      "salary_range": "$70,000 - $120,000",
      "growth_rate": "Medium",
      "education": "Bachelor's in Computer Science or self-taught with portfolio"
    },
    "AI Engineer": {
      "required_skills": ["Python", "Machine Learning", "Artificial Intelligence", "Deep Learning"],
      "salary_range": "$90,000 - $160,000",
      "growth_rate": "Very High",
      "education": "Master's or PhD in Computer Science or related field"
    }
  }
}
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

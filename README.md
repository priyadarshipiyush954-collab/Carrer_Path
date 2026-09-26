# Tech Career & Job Market Explorer

[![CI Workflow](https://img.shields.io/badge/CI-GitHub%20Actions-blue?logo=github-actions)](.github/workflows/ci.yml)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python)](python_app/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-yellow?logo=javascript)](src/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](src/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker)](Dockerfile)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An end-to-end technology career intelligence platform and skill gap analyzer built with **Python as the central computing engine (~80% of project logic)** paired with a **colorful, light-themed modern JavaScript (React JSX) web UI**. The project analyzes verified technology career paths, benchmarks salary distributions, maps cross-disciplinary in-demand skills, and calculates real-time candidate readiness scores.

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

### 🐍 Python Core Architecture (~80% of Business Logic)
- **`python_app/models.py`**: Strongly-typed dataclasses for career paths, compensation metrics, candidate profiles, and multi-phase milestones.
- **`python_app/analyzer.py`**: High-performance module for parsing, salary statistics calculation, role comparison, and readiness score computation. Zero third-party runtime dependencies required.
- **`python_app/recommender.py`**: Intelligent career match and recommendation engine calculating Jaccard similarity coefficients and role-to-role transferability scores.
- **`python_app/roadmap_generator.py`**: Generates step-by-step phased learning roadmaps to bridge candidate skill gaps with project deliverables and timelines.
- **`python_app/market_forecaster.py`**: Advanced market metrics, cross-disciplinary skill leverage rankings, and growth momentum forecasting.
- **`python_app/exporter.py`**: Exports evaluations to Markdown, CSV, and formatted reports.
- **`python_app/cli.py`**: Terminal tool to list paths, run candidate skill gap calculations, generate roadmaps, analyze cross-role portability, and audit dataset integrity.
- **`python_app/server.py`**: Lightweight HTTP microservice serving REST endpoints with Python's built-in `http.server`.

### 🎨 Vibrant, Light-Themed Web Application
- **Light & Colorful Aesthetic**: Soft pastel tints (sky blue, lavender, mint green, warm amber, and peach) with crisp typography and vibrant gradient accents.
- **Interactive Career Explorer**: Side-by-side comparison, filterable directories, and compensation meters.
- **Personal Skill Matcher**: Interactive checklist with instant compatibility scoring and customized gap analysis.

---

## 📂 Project Architecture

```
├── job_market_data.json         # Master career & skills dataset
├── run_analyzer.py              # Top-level Python entry point
│
├── python_app/                  # Core Python Package (~80% of project logic)
│   ├── __init__.py              # Package initializer
│   ├── models.py                # Dataclasses & type schemas
│   ├── analyzer.py              # JobMarketAnalyzer core engine
│   ├── recommender.py           # Jaccard similarity & transition engine
│   ├── roadmap_generator.py     # Milestone learning roadmap builder
│   ├── market_forecaster.py     # Growth momentum & skill leverage models
│   ├── exporter.py              # Markdown & CSV reporting
│   ├── cli.py                   # Extended command-line interface
│   └── server.py                # Python REST API server
│
├── tests/                       # Automated Test Suite (12 unit tests)
│   ├── test_analyzer.py         # Consistency, math, and salary tests
│   └── test_recommender.py      # Recommender, roadmap, & leverage tests
│
├── src/                         # React 19 + TypeScript Light Themed Web UI
│   ├── components/              # Modular light colorful views
│   ├── data/                    # Dataset loaders & utilities
│   ├── types/                   # TypeScript interfaces
│   ├── App.tsx                  # Root layout with ambient glow
│   └── main.tsx                 # Entry point
│
├── .github/workflows/ci.yml     # Automated CI/CD pipeline
├── Dockerfile                   # Multi-stage production container
├── docker-compose.yml           # Multi-service container orchestration
├── package.json & lock          # Node.js dependencies & locked tree
└── requirements.txt             # Python dependencies
```

---

## 🐍 Python Quickstart & CLI

The Python implementation operates on Python 3.8+ using the Python standard library with **zero external dependencies required**.

### 1. Validate Dataset Integrity
```bash
python3 python_app/cli.py validate
```

### 2. View Market Statistics & Growth Forecast
```bash
python3 python_app/cli.py stats
```

### 3. Compute Skill Match & Gap Analysis
```bash
python3 python_app/cli.py match --skills "Python,SQL,Data Analysis"
```

### 4. Generate Personalized Learning Roadmap
```bash
python3 python_app/cli.py roadmap --role "Data Scientist" --skills "Python,SQL"
```

### 5. Role Transition Feasibility
```bash
python3 python_app/cli.py transfer "Data Scientist" "AI Engineer"
```

### 6. Skill Market Leverage Ranking
```bash
python3 python_app/cli.py leverage
```

### 7. Export Gap Analysis to Markdown or CSV
```bash
python3 python_app/cli.py export --skills "Python,SQL" --format md
```

### 8. Launch Python REST Microservice
```bash
python3 python_app/server.py --port 8000
```

---

## 🧪 Automated Testing

Execute the automated test suite with Python's built-in test runner:
```bash
python3 -m unittest discover tests
```
*Output: 12 tests passing in <0.01s.*

---

## 🐳 Docker Deployment

Run both the Web Application and the Python API service:
```bash
docker compose up --build
```
- **Web App**: [http://localhost:3000](http://localhost:3000)
- **Python API**: [http://localhost:8000](http://localhost:8000)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

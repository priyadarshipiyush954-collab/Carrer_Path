# ==========================================
# Multi-stage Dockerfile: Web + Python App
# ==========================================

# Stage 1: Build Frontend Assets
FROM node:22-alpine AS web-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Python & Web Container
FROM python:3.11-slim AS production

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=3000

WORKDIR /app

# Install system dependencies & Node.js for dual hosting if desired
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Copy python requirements and install
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt || true

# Copy application files
COPY job_market_data.json ./
COPY python_app/ ./python_app/
COPY tests/ ./tests/
COPY run_analyzer.py ./
COPY package*.json ./

# Install npm production dependencies and copy built frontend
RUN npm ci --omit=dev
COPY --from=web-builder /app/dist ./dist

# Create non-root user for security
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

# Expose Web (3000) and Python API (8000)
EXPOSE 3000 8000

# Healthcheck testing Python and Web endpoints
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/health')" || exit 1

# Default command starts the web preview server on port 3000
CMD ["npm", "run", "preview"]

<div align="center">

<img src="https://img.shields.io/badge/☁️_CloudForge-AWS%20DevOps%20CI/CD%20Platform-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="CloudForge" height="45"/>

<br/><br/>

<h3>Enterprise-Grade CI/CD Infrastructure for Secure, Automated Cloud Deployments</h3>

<p>Fully automated pipeline — from <code>git push</code> to live production on AWS ECS in under 3 minutes.<br/>Built with Docker, GitHub Actions, Amazon ECR & ECS.</p>

<br/>

[![Deploy to ECS](https://github.com/ruthwik-thotapelli/CloudForge-AWS-DevOps-CI-CD-Infrastructure-for-Secure-Deployments/actions/workflows/deploy.yml/badge.svg)](https://github.com/ruthwik-thotapelli/CloudForge-AWS-DevOps-CI-CD-Infrastructure-for-Secure-Deployments/actions/workflows/deploy.yml)
&nbsp;
![Docker](https://img.shields.io/badge/Docker-Multi--Stage%20Build-2496ED?style=flat-square&logo=docker&logoColor=white)
&nbsp;
![Amazon ECS](https://img.shields.io/badge/Amazon%20ECS-Fargate-FF9900?style=flat-square&logo=amazon-ecs&logoColor=white)
&nbsp;
![Amazon ECR](https://img.shields.io/badge/Amazon%20ECR-Private%20Registry-FF9900?style=flat-square&logo=amazon-aws&logoColor=white)
&nbsp;
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI/CD-2088FF?style=flat-square&logo=github-actions&logoColor=white)
&nbsp;
![Node.js](https://img.shields.io/badge/Node.js-18--Alpine-339933?style=flat-square&logo=node.js&logoColor=white)
&nbsp;
![Express](https://img.shields.io/badge/Express.js-REST%20API-000000?style=flat-square&logo=express&logoColor=white)
&nbsp;
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)

<br/>

[📌 Overview](#-overview) · [🏗️ Architecture](#️-architecture) · [🚀 Pipeline](#-cicd-pipeline-deep-dive) · [🐳 Docker](#-docker-strategy) · [📡 API](#-api-endpoints) · [⚙️ Setup](#️-setup-guide) · [🔐 Secrets](#-github-secrets-reference) · [🔁 Rollback](#-rollback-procedures) · [🔒 Security](#-security-practices)

</div>

<br/>

---

<br/>

## 📌 Overview

**CloudForge** is a production-ready DevOps CI/CD platform built on AWS that automates the complete software delivery lifecycle. Every push to `main` triggers an automated pipeline that builds a Docker image, pushes it to a private **Amazon ECR** registry, and deploys a new revision to **Amazon ECS** — with zero-downtime rolling updates and built-in rollback safety.

This isn't a tutorial project — it's a **real infrastructure blueprint** demonstrating how production teams ship code.

<br/>

### 🎯 What This Project Proves

<table>
<tr><td width="200"><strong>🔄 CI/CD Mastery</strong></td><td>GitHub Actions pipelines with concurrency control, SHA tagging, and deployment gates</td></tr>
<tr><td><strong>🐳 Containerization</strong></td><td>Multi-stage Docker builds, Alpine images, non-root users, health checks</td></tr>
<tr><td><strong>☁️ AWS Cloud Infra</strong></td><td>ECS orchestration, ECR private registry, IAM least-privilege, rolling deploys</td></tr>
<tr><td><strong>🔒 DevSecOps</strong></td><td>No secrets in code, private registries, non-root containers, pinned action versions</td></tr>
<tr><td><strong>📡 Production App</strong></td><td>Express.js with structured JSON logging, graceful shutdown, health/readiness/metrics endpoints</td></tr>
<tr><td><strong>🔁 Release Safety</strong></td><td>ECS rolling deployments, health check gates, manual + automatic rollback support</td></tr>
</table>

<br/>

---

<br/>

## 🏗️ Architecture

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                          CLOUDFORGE ARCHITECTURE                                ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                  ║
║   DEVELOPER          GITHUB                         AWS CLOUD                    ║
║   ─────────       ─────────────               ──────────────────────────         ║
║                                                                                  ║
║   ┌─────────┐     ┌──────────────┐            ┌──────────────────────┐          ║
║   │         │     │  Repository  │            │    Amazon ECR         │          ║
║   │  Code   │────►│  (Source of  │            │  ┌────────────────┐  │          ║
║   │  Push   │     │   Truth)     │            │  │ cloudforge:abc │  │          ║
║   │         │     └──────┬───────┘            │  │ cloudforge:lat │  │          ║
║   └─────────┘            │                    │  └────────┬───────┘  │          ║
║                          │ trigger            └───────────┼──────────┘          ║
║                  ┌───────▼────────┐                       │                      ║
║                  │ GitHub Actions │         docker push    │   docker pull        ║
║                  │   Workflow     │──────────────────────►│                      ║
║                  │                │                       │                      ║
║                  │ 1. Checkout    │            ┌──────────▼──────────┐           ║
║                  │ 2. AWS Auth    │            │    Amazon ECS        │           ║
║                  │ 3. ECR Login   │            │  ┌────────────────┐ │           ║
║                  │ 4. Docker Build│            │  │   Task (v2)    │ │           ║
║                  │ 5. Push to ECR │            │  │   Container    │ │           ║
║                  │ 6. ECS Deploy  │──deploy──►│  │   :3000        │ │           ║
║                  │ 7. Wait Stable │            │  └────────────────┘ │           ║
║                  └────────────────┘            │  Rolling Update     │           ║
║                                                └─────────────────────┘           ║
║                                                         │                        ║
║                                                    ┌────▼─────┐                  ║
║                                                    │  Users   │                  ║
║                                                    │  🌐 :80  │                  ║
║                                                    └──────────┘                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

### Component Roles

| Component | Service | Purpose |
|---|---|---|
| **Source Control** | GitHub | Single source of truth, triggers pipelines on every push to `main` |
| **CI/CD Engine** | GitHub Actions | Runs the build, push, and deploy workflow in isolated `ubuntu-latest` runners |
| **Container Registry** | Amazon ECR | Stores Docker images privately with SHA + `latest` dual-tagging |
| **Orchestration** | Amazon ECS | Runs containers with rolling deployments & automatic health check gating |
| **Application** | Node.js + Express | Production API with health, readiness, and metrics endpoints |
| **Security** | AWS IAM + GitHub Secrets | Least-privilege access, encrypted secrets, no credentials in source |

<br/>

---

<br/>

## 🚀 CI/CD Pipeline Deep Dive

```
  ┌───────────┐    ┌────────────┐    ┌───────────┐    ┌──────────────────┐    ┌───────────┐    ┌─────────────┐    ┌──────────┐
  │  📥 Code  │    │  🔐 AWS    │    │  🔑 ECR   │    │  🐳 Docker Build │    │  🚢 ECS   │    │  ⏳ Wait    │    │  📊 Done │
  │  Checkout │───►│  Auth      │───►│  Login    │───►│  Tag & Push      │───►│  Deploy   │───►│  Stable    │───►│  Summary │
  └───────────┘    └────────────┘    └───────────┘    └──────────────────┘    └───────────┘    └─────────────┘    └──────────┘
   actions/v4       IAM creds         Private ECR       SHA + latest tag       Force new        services-stable    Commit SHA
                    from secrets      registry auth     dual-push to ECR      deployment        health gate        Image URI
```

### Stage Details

| # | Stage | Action | What Happens |
|---|---|---|---|
| 1 | **Checkout** | `actions/checkout@v4` | Pulls latest commit from `main` into the runner workspace |
| 2 | **AWS Auth** | `aws-actions/configure-aws-credentials@v4` | Authenticates with AWS using encrypted GitHub Secrets — zero credentials in code |
| 3 | **ECR Login** | `aws-actions/amazon-ecr-login@v2` | Authenticates Docker CLI with private Amazon ECR registry |
| 4 | **Build & Push** | `docker build` + `docker push` | Builds multi-stage Docker image, tags with `$GITHUB_SHA` + `latest`, pushes both |
| 5 | **ECS Deploy** | `aws ecs update-service --force-new-deployment` | Triggers ECS rolling deployment — pulls new image, replaces tasks one by one |
| 6 | **Wait Stable** | `aws ecs wait services-stable` | Blocks until ECS confirms all new tasks are healthy and serving traffic |
| 7 | **Summary** | Console output | Logs commit SHA, image URI, cluster, service, and who triggered the deploy |

### Pipeline Features

- 🔒 **Concurrency lock** — Only one deployment runs at a time (no parallel deploys)
- 🔄 **Manual trigger** — Supports `workflow_dispatch` for on-demand deployments
- 🏷️ **Immutable tagging** — Every image tagged with commit SHA for traceability
- ✅ **Health gate** — Pipeline waits until ECS confirms deployment is stable

<br/>

---

<br/>

## 🐳 Docker Strategy

### Multi-Stage Production Dockerfile

```dockerfile
# ─── Stage 1: Builder ─────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ─── Stage 2: Production ──────────────────────────
FROM node:18-alpine AS production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=appuser:appgroup . .
ENV NODE_ENV=production
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --spider http://localhost:3000/health || exit 1
CMD ["node", "index.js"]
```

### Why Multi-Stage?

| Aspect | Before (Single-Stage) | After (Multi-Stage) |
|---|---|---|
| **Base Image** | `node:18` (~900MB) | `node:18-alpine` (~120MB) |
| **User** | root (unsafe) | `appuser` (non-root) |
| **Health Check** | None | Built-in `HEALTHCHECK` instruction |
| **Layer Caching** | Basic | Optimized `package.json`-first copy |
| **Attack Surface** | Full Debian + dev tools | Minimal Alpine, production-only |

### Build & Run Locally

```bash
# Build
docker build -t cloudforge-app -f app/Dockerfile app/

# Run
docker run -p 3000:3000 cloudforge-app

# Test
curl http://localhost:3000/health
# → {"status":"healthy","timestamp":"...","uptime":"1.23s"}
```

<br/>

---

<br/>

## 📡 API Endpoints

The CloudForge application exposes four production-ready HTTP endpoints:

| Method | Endpoint | Purpose | Response |
|---|---|---|---|
| `GET` | `/` | Application info & status | `200` — JSON with app name, version, uptime |
| `GET` | `/health` | **ALB/ECS health check** | `200` — `{"status": "healthy"}` |
| `GET` | `/ready` | Readiness probe | `200` — `{"ready": true}` |
| `GET` | `/metrics` | Prometheus-style metrics | `200` — `text/plain` with uptime + heap stats |

### Example Responses

```bash
# Root — App Info
$ curl http://localhost:3000/
{
  "app": "CloudForge",
  "description": "Enterprise-grade AWS DevOps CI/CD Platform",
  "version": "1.2.0",
  "status": "running",
  "uptime": "42.50s",
  "startedAt": "2026-07-15T17:45:00.000Z"
}

# Health Check — Used by ALB Target Group
$ curl http://localhost:3000/health
{
  "status": "healthy",
  "timestamp": "2026-07-15T17:46:00.000Z",
  "uptime": "102.33s"
}

# Metrics — Prometheus-Compatible
$ curl http://localhost:3000/metrics
# HELP process_uptime_seconds Application uptime in seconds
# TYPE process_uptime_seconds gauge
process_uptime_seconds 102.33
# HELP nodejs_heap_used_bytes Heap memory used
# TYPE nodejs_heap_used_bytes gauge
nodejs_heap_used_bytes 12345678
```

<br/>

---

<br/>

## ⚙️ Setup Guide

### Prerequisites

| Requirement | Details |
|---|---|
| AWS Account | With IAM permissions for ECR + ECS |
| Amazon ECR | Private repository created |
| Amazon ECS | Cluster + service + task definition running |
| GitHub | This repo forked or cloned |
| Docker | Installed locally (for testing) |

### Quick Start

```bash
# 1. Clone
git clone https://github.com/ruthwik-thotapelli/CloudForge-AWS-DevOps-CI-CD-Infrastructure-for-Secure-Deployments.git
cd CloudForge-AWS-DevOps-CI-CD-Infrastructure-for-Secure-Deployments

# 2. Create ECR repository (if not exists)
aws ecr create-repository --repository-name cloudforge-app --region us-east-1

# 3. Configure GitHub Secrets (see table below)
# Settings → Secrets → Actions → New repository secret

# 4. Push to main — pipeline runs automatically
git add .
git commit -m "feat: initial deployment"
git push origin main

# 5. Watch the pipeline
# → GitHub Actions tab → "CloudForge — Build & Deploy to AWS ECS"
```

<br/>

---

<br/>

## 🔐 GitHub Secrets Reference

All credentials are stored as **encrypted GitHub Secrets** — never committed to source code.

| Secret | Description | Example |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | IAM access key ID | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key | `wJalrXUtnFEMI/K7MDENG/...` |
| `AWS_REGION` | AWS region for all resources | `us-east-1` |
| `ECR_REPOSITORY` | ECR repository name | `cloudforge-app` |
| `ECS_CLUSTER` | ECS cluster name | `cloudforge-cluster` |
| `ECS_SERVICE` | ECS service name | `cloudforge-service` |

> ⚠️ **IAM Policy**: Follow least-privilege — only grant `ecr:GetAuthorizationToken`, `ecr:BatchCheckLayerAvailability`, `ecr:PutImage`, `ecr:InitiateLayerUpload`, `ecr:UploadLayerPart`, `ecr:CompleteLayerUpload` for ECR, and `ecs:UpdateService`, `ecs:DescribeServices` for ECS.

<br/>

---

<br/>

## 📂 Project Structure

```
CloudForge-AWS-DevOps-CI-CD-Infrastructure/
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD pipeline — build, push, deploy
│                                    #   ├─ SHA + latest dual-tagging
│                                    #   ├─ Concurrency lock
│                                    #   ├─ ECS stability wait gate
│                                    #   └─ Manual trigger support
│
├── app/
│   ├── Dockerfile                   # Multi-stage production build
│   │                                #   ├─ node:18-alpine (120MB vs 900MB)
│   │                                #   ├─ Non-root user (appuser)
│   │                                #   └─ Built-in HEALTHCHECK
│   │
│   ├── index.js                     # Express.js application
│   │                                #   ├─ Structured JSON logging
│   │                                #   ├─ /health, /ready, /metrics
│   │                                #   ├─ Graceful SIGTERM/SIGINT shutdown
│   │                                #   └─ Error handling middleware
│   │
│   └── package.json                 # Dependencies & scripts
│                                    #   ├─ npm start / npm run dev
│                                    #   └─ Engine pinning: node >=18
│
└── README.md                        # ← This file
```

<br/>

---

<br/>

## 🔁 Rollback Procedures

### Automatic (Built-In)

ECS performs **rolling deployments** by default. If a new task fails its health check (`/health`), ECS:
1. Stops the failing task
2. Keeps the previous healthy tasks running
3. Does **not** complete the rollout

**No data loss. No downtime. Automatic.**

### Manual Rollback via CLI

```bash
# 1. List previous image tags (every deploy is tagged with commit SHA)
aws ecr describe-images \
  --repository-name cloudforge-app \
  --query 'imageDetails[*].imageTags' \
  --output table

# 2. Update task definition to use the previous SHA image tag
# (edit your task definition JSON → image: <ecr-uri>:<previous-sha>)

# 3. Force deploy the previous revision
aws ecs update-service \
  --cluster cloudforge-cluster \
  --service cloudforge-service \
  --task-definition cloudforge-task:<PREVIOUS_REVISION> \
  --force-new-deployment
```

### Why SHA Tagging Matters

| Tag | Purpose | Rollback |
|---|---|---|
| `latest` | Always points to newest image | ❌ Can't rollback with `latest` |
| `abc123f` (SHA) | Immutable, tied to exact commit | ✅ Pin any task to any past commit |

<br/>

---

<br/>

## 🔒 Security Practices

| Practice | Implementation |
|---|---|
| **No secrets in code** | All credentials in GitHub Encrypted Secrets |
| **Private registry** | ECR repository is not publicly accessible |
| **Non-root container** | Application runs as `appuser`, never `root` |
| **Least-privilege IAM** | Credentials scoped to only ECR push + ECS deploy |
| **Pinned action versions** | `@v4`, `@v2` — prevents supply-chain attacks |
| **Alpine base image** | Minimal attack surface, no unnecessary OS packages |
| **Health check gating** | Bad deploys are blocked before reaching users |
| **Concurrency control** | Prevents parallel deployments from causing conflicts |

<br/>

---

<br/>

## 🌐 Tech Stack

<div align="center">

| Layer | Technology | Role |
|---|---|---|
| **Runtime** | ![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=flat-square&logo=node.js&logoColor=white) | Application server |
| **Framework** | ![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white) | HTTP routing & middleware |
| **Container** | ![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED?style=flat-square&logo=docker&logoColor=white) | Image packaging |
| **Registry** | ![ECR](https://img.shields.io/badge/Amazon%20ECR-Private-FF9900?style=flat-square&logo=amazon-aws&logoColor=white) | Image storage |
| **Orchestrator** | ![ECS](https://img.shields.io/badge/Amazon%20ECS-Rolling%20Deploy-FF9900?style=flat-square&logo=amazon-ecs&logoColor=white) | Container management |
| **CI/CD** | ![Actions](https://img.shields.io/badge/GitHub%20Actions-Automated-2088FF?style=flat-square&logo=github-actions&logoColor=white) | Pipeline engine |
| **Security** | ![IAM](https://img.shields.io/badge/AWS%20IAM-Least%20Privilege-DD344C?style=flat-square&logo=amazon-aws&logoColor=white) | Access control |

</div>

<br/>

---

<br/>

## 📊 Pipeline Status

| Branch | Workflow | Status |
|---|---|---|
| `main` | Deploy to ECS | [![Deploy](https://github.com/ruthwik-thotapelli/CloudForge-AWS-DevOps-CI-CD-Infrastructure-for-Secure-Deployments/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/ruthwik-thotapelli/CloudForge-AWS-DevOps-CI-CD-Infrastructure-for-Secure-Deployments/actions/workflows/deploy.yml) |

<br/>

---

<br/>

## 🤝 Contributing

```bash
# 1. Fork this repo
# 2. Create your feature branch
git checkout -b feat/amazing-feature

# 3. Commit with conventional commits
git commit -m "feat: add amazing feature"

# 4. Push and open a PR
git push origin feat/amazing-feature
```

All PRs are welcome — whether it's a bug fix, feature, or documentation improvement.

<br/>

---

<br/>

<div align="center">

## 👨‍💻 Author

**Thotapelli Ruthwik**
<br/>
*DevOps & Cloud Infrastructure Engineer*

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-ruthwik--thotapelli-181717?style=for-the-badge&logo=github)](https://github.com/ruthwik-thotapelli)
&nbsp;&nbsp;
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ruthwik--thotapelli-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ruthwik-thotapelli)

<br/>

---

<br/>

⭐ **If this project helped you** — give it a star, fork it, or share it.

<br/>

<sub>Built with ❤️ using AWS · Docker · GitHub Actions</sub>

</div>

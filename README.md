<div align="center">
  <img src="./banner.jpg" alt="CloudForge Cover" style="width:100%; border-radius: 12px; margin-bottom: 20px;">
  <img src="https://img.shields.io/badge/☁️_CloudForge-AWS%20DevOps%20CI/CD%20Platform-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="CloudForge" height="45"/>
  
  <br/><br/>

  <h2 align="center" style="font-weight: 800; font-size: 2em; letter-spacing: -0.5px;">Enterprise-Grade CI/CD Infrastructure for Secure, Automated Cloud Deployments</h2>

  <p align="center" style="font-size: 1.1em; color: #555;">
    Fully automated pipeline — from <code>git push</code> to live production on AWS ECS in under 3 minutes.<br/>
    <strong>Built with Docker, GitHub Actions, Amazon ECR & ECS.</strong>
  </p>

  <p align="center">
    <a href="#-overview"><strong>Explore the architecture »</strong></a>
  </p>

  <p align="center">
    [![Deploy to ECS](https://github.com/ruthwik-thotapelli/CloudForge-AWS-DevOps-CI-CD-Infrastructure-for-Secure-Deployments/actions/workflows/deploy.yml/badge.svg)](https://github.com/ruthwik-thotapelli/CloudForge-AWS-DevOps-CI-CD-Infrastructure-for-Secure-Deployments/actions/workflows/deploy.yml)
    <img src="https://img.shields.io/badge/Status-Production_Ready-success?style=flat-square&color=10B981" alt="Status" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square&color=6366F1" alt="License" />
  </p>
</div>

<hr />

## 🚀 Built With Premium Cloud Native Tech

<div align="center">
  <table>
    <tr>
      <td align="center" width="96">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" width="48" height="48" alt="AWS" />
        <br>AWS
      </td>
      <td align="center" width="96">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg" width="48" height="48" alt="Docker" />
        <br>Docker
      </td>
      <td align="center" width="96">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/githubactions/githubactions-original.svg" width="48" height="48" alt="GitHub Actions" />
        <br>GitHub Actions
      </td>
      <td align="center" width="96">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" width="48" height="48" alt="Node.js" />
        <br>Node.js
      </td>
      <td align="center" width="96">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" width="48" height="48" alt="Express" />
        <br>Express
      </td>
      <td align="center" width="96">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg" width="48" height="48" alt="Alpine Linux" />
        <br>Alpine
      </td>
    </tr>
  </table>
</div>

---

## 📖 Table of Contents
<details>
  <summary><kbd>Click to expand</kbd></summary>
  
  1. [📌 Overview](#-overview)
  2. [🎯 What This Project Proves](#-what-this-project-proves)
  3. [🏗️ Architecture](#️-architecture)
  4. [🚀 CI/CD Pipeline Deep Dive](#-cicd-pipeline-deep-dive)
  5. [🐳 Docker Strategy](#-docker-strategy)
  6. [📡 API Endpoints](#-api-endpoints)
  7. [⚙️ Setup Guide](#️-setup-guide)
  8. [🔐 Security Practices](#-security-practices)
</details>

---

## 📌 Overview

**CloudForge** is a production-ready DevOps CI/CD platform built on AWS that automates the complete software delivery lifecycle. Every push to `main` triggers an automated pipeline that builds a Docker image, pushes it to a private **Amazon ECR** registry, and deploys a new revision to **Amazon ECS** — with zero-downtime rolling updates and built-in rollback safety.

This isn't a tutorial project — it's a **real infrastructure blueprint** demonstrating how production teams ship code securely and at scale.

---

## 🎯 What This Project Proves

| Competency | Demonstration |
| :--- | :--- |
| **🔄 CI/CD Mastery** | GitHub Actions pipelines with concurrency control, SHA tagging, and strict deployment gates. |
| **🐳 Containerization** | Multi-stage Docker builds, Alpine minimal images, non-root user execution, and robust health checks. |
| **☁️ AWS Cloud Infra** | ECS orchestration (Fargate), ECR private registry management, IAM least-privilege policies, and zero-downtime rolling deploys. |
| **🔒 DevSecOps** | Absolute zero credentials in code. Utilizes encrypted GitHub Secrets, private registries, and pinned GitHub Actions versions to prevent supply-chain attacks. |
| **📡 Production App Design** | Express.js REST API equipped with structured JSON logging, graceful shutdown protocols, and critical `/health`, `/ready`, `/metrics` probes. |
| **🔁 Release Safety & Rollback** | ECS automatic rolling deployments, health check gates, and immutable SHA tags allowing instant rollback to previous commits without breaking state. |

---

## 🏗️ System Architecture

```mermaid
graph TD
    Developer[Developer / Git Push] -->|Source Code| GitHub[GitHub Repository]
    
    subgraph CI/CD Engine
        GitHub -->|Triggers| Actions[GitHub Actions Pipeline]
        Actions -.->|Auth| Secrets[GitHub Secrets]
        Actions -->|1. Checkout| Code
        Actions -->|2. Build| Docker[Docker Multi-Stage Build]
        Actions -->|3. Tag| SHA[Commit SHA + Latest Tag]
    end
    
    subgraph AWS Cloud Infrastructure
        Docker -->|4. Push Image| ECR[(Amazon ECR Private Registry)]
        Actions -->|5. Deploy Revision| ECS[Amazon ECS / Fargate]
        ECS -->|Pulls Image| ECR
        ECS -->|Rolling Update| TargetGroup[ALB Target Group]
        TargetGroup -->|Health Checks| Container[App Container :3000]
    end
    
    Users[End Users] -->|HTTP Request| TargetGroup
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

---

## 🚀 CI/CD Pipeline Deep Dive

### The 7-Stage Automated Pipeline

| # | Stage | Action | What Happens |
|:---:|:---|:---|:---|
| 1 | **Checkout** | `actions/checkout@v4` | Pulls latest commit from `main` into the runner workspace |
| 2 | **AWS Auth** | `aws-actions/configure-aws-credentials@v4` | Authenticates with AWS using encrypted GitHub Secrets — zero credentials in code |
| 3 | **ECR Login** | `aws-actions/amazon-ecr-login@v2` | Authenticates Docker CLI with private Amazon ECR registry |
| 4 | **Build & Push** | `docker build` + `docker push` | Builds multi-stage Docker image, tags with `$GITHUB_SHA` + `latest`, pushes both |
| 5 | **ECS Deploy** | `aws ecs update-service` | Triggers ECS rolling deployment — pulls new image, replaces tasks one by one safely |
| 6 | **Wait Stable** | `aws ecs wait services-stable` | **Health Gate**: Blocks until ECS confirms all new tasks are healthy and serving traffic |
| 7 | **Summary** | Console output | Logs commit SHA, image URI, cluster, service, and trigger details |

> 🔒 **Concurrency Lock**: The pipeline enforces a concurrency lock. Only one deployment runs at a time to prevent race conditions during rapid commits.

---

## 🐳 Docker Strategy

### The Multi-Stage Production Advantage

This project utilizes an aggressively optimized **Multi-Stage Dockerfile**.

| Aspect | Traditional Single-Stage | CloudForge Multi-Stage | Impact |
|:---|:---|:---|:---|
| **Base Image** | `node:18` | `node:18-alpine` | Size reduced from ~900MB to ~120MB, massively accelerating pulls. |
| **Execution Context** | `root` user | `appuser` (non-root) | Eliminates critical security vulnerabilities. |
| **Health Probes** | None | Native `HEALTHCHECK` | Tells ECS exactly when the container is ready for traffic. |
| **Attack Surface** | Full OS + Dev tools | Production binaries only | Hackers have no shell tools or compilers to pivot with. |

---

## 📡 API Endpoints

The CloudForge Node.js application exposes production-ready endpoints designed specifically to interface with AWS Application Load Balancers (ALB) and ECS Health Monitors.

| Method | Endpoint | Purpose | Response |
|:---:|:---|:---|:---|
| `GET` | `/` | Application info | `200` — JSON with app name, version, uptime |
| `GET` | `/health` | **ALB/ECS Health Check** | `200` — `{"status": "healthy"}` |
| `GET` | `/ready` | Readiness probe | `200` — `{"ready": true}` |
| `GET` | `/metrics` | Prometheus-style metrics | `200` — `text/plain` with uptime + heap stats |

---

## ⚙️ Setup Guide

### 1. Prerequisites
- **AWS Account** with IAM permissions for ECR and ECS.
- **Amazon ECR** private repository created.
- **Amazon ECS** cluster, service, and task definition running.
- **GitHub** repository cloned.

### 2. Configure GitHub Secrets
Navigate to **Settings → Secrets and variables → Actions** and add:

| Secret | Description | Example |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | IAM access key ID | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key | `wJalrXUtnFEMI/K7MDENG/...` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `ECR_REPOSITORY` | ECR repository name | `cloudforge-app` |
| `ECS_CLUSTER` | ECS cluster name | `cloudforge-cluster` |
| `ECS_SERVICE` | ECS service name | `cloudforge-service` |

### 3. Deploy
Simply commit your code and push to `main`. The GitHub Actions pipeline takes over automatically.
```bash
git add .
git commit -m "feat: trigger cloudforge deployment"
git push origin main
```

---

## 🔐 Security Practices

- **Zero Hardcoded Secrets**: All credentials are in GitHub Encrypted Secrets.
- **Least-Privilege IAM**: AWS credentials are scoped *strictly* to `ecr:Push` and `ecs:UpdateService`.
- **Pinned Action Versions**: Using `@v4` and `@v2` syntax for Actions prevents devastating supply-chain attacks.
- **Health Check Gating**: Bad deployments are automatically rolled back by ECS before reaching end users.

---

<div align="center">
  <p><strong>CloudForge</strong> is engineered to demonstrate top-tier Cloud Infrastructure & DevOps principles.</p>
</div>

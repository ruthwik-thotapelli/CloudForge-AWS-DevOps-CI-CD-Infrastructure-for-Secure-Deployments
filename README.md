<div align="center">

<img src="https://img.shields.io/badge/CloudForge-AWS%20DevOps%20Platform-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="CloudForge" height="40"/>

<h1>☁️ CloudForge — AWS DevOps CI/CD Infrastructure</h1>

<p><strong>Enterprise-grade CI/CD pipeline that automates containerized deployments on AWS ECS using GitHub Actions, Docker, and Amazon ECR — from code commit to live production in minutes.</strong></p>

<br/>

[![CI/CD Pipeline](https://github.com/ruthwik-thotapelli/CloudForge-AWS-DevOps-CI-CD-Infrastructure-for-Secure-Deployments/actions/workflows/deploy.yml/badge.svg)](https://github.com/ruthwik-thotapelli/CloudForge-AWS-DevOps-CI-CD-Infrastructure-for-Secure-Deployments/actions/workflows/deploy.yml)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat-square&logo=docker&logoColor=white)
![Amazon ECR](https://img.shields.io/badge/Amazon%20ECR-Container%20Registry-FF9900?style=flat-square&logo=amazon-aws&logoColor=white)
![Amazon ECS](https://img.shields.io/badge/Amazon%20ECS-Orchestration-FF9900?style=flat-square&logo=amazon-ecs&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Automation-2088FF?style=flat-square&logo=github-actions&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=flat-square&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

<br/>

[📖 Architecture](#-architecture) • [🚀 Pipeline](#-cicd-pipeline) • [⚙️ Setup](#️-setup--configuration) • [🔐 Secrets](#-github-secrets-reference) • [📂 Structure](#-project-structure) • [📡 API](#-api-endpoints) • [🔁 Rollback](#-rollback-strategy)

</div>

---

## 📌 Overview

**CloudForge** is a production-ready **DevOps CI/CD platform** built on AWS that demonstrates real-world cloud automation. Every code push to the `main` branch automatically triggers a full pipeline — building a Docker image, pushing it to **Amazon ECR**, and deploying a new revision to **Amazon ECS** — all without manual intervention.

### 🎯 What This Project Demonstrates

| Skill Area | Technologies Used |
|---|---|
| **CI/CD Automation** | GitHub Actions, YAML pipelines |
| **Containerization** | Docker, multi-stage builds |
| **Cloud Infrastructure** | AWS ECS (Fargate/EC2), Amazon ECR |
| **IAM & Security** | Least-privilege IAM, GitHub Secrets |
| **Release Engineering** | Automated rollout, forced ECS deployment |
| **Application Layer** | Node.js, Express.js, health endpoints |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLOUDFORGE ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────────┘

  Developer                GitHub                   AWS Cloud
  ─────────           ──────────────         ──────────────────────────
  │ Code  │  push     │  Repository │         │                        │
  │ Push  │ ────────► │  + Actions  │         │   ┌──────────────────┐ │
  └───────┘           └──────┬──────┘         │   │   Amazon ECR     │ │
                             │                │   │  (Container      │ │
                     ┌───────▼────────┐       │   │   Registry)      │ │
                     │  GitHub Actions │       │   └────────┬─────────┘ │
                     │  CI/CD Runner  │       │            │            │
                     │                │       │   ┌────────▼─────────┐ │
                     │  1. Checkout   │       │   │   Amazon ECS     │ │
                     │  2. AWS Auth   │──────►│   │  (Container      │ │
                     │  3. ECR Login  │       │   │  Orchestration)  │ │
                     │  4. Docker     │       │   │                  │ │
                     │     Build+Push │       │   │  ┌─────────────┐ │ │
                     │  5. ECS Deploy │       │   │  │  Task (v2)  │ │ │
                     └────────────────┘       │   │  │  Container  │ │ │
                                              │   │  │  :3000      │ │ │
                                              │   │  └─────────────┘ │ │
                                              │   └──────────────────┘ │
                                              └────────────────────────┘
```

### Component Breakdown

| Component | Role |
|---|---|
| **GitHub Repository** | Source of truth; every commit to `main` triggers the pipeline |
| **GitHub Actions Runner** | Executes the CI/CD workflow in an isolated `ubuntu-latest` environment |
| **Amazon ECR** | Private Docker registry — stores versioned container images securely |
| **Amazon ECS** | Orchestrates the containerized application with zero-downtime rolling deployments |
| **Docker** | Packages the Node.js app and all dependencies into a portable image |
| **AWS IAM** | Scoped credentials via GitHub Secrets — no hardcoded keys |

---

## 🚀 CI/CD Pipeline

```
 ┌──────────┐    ┌────────────┐    ┌──────────────┐    ┌───────────────┐    ┌─────────────┐
 │   Code   │    │ Configure  │    │  ECR Login   │    │  Docker Build │    │  ECS Force  │
 │ Checkout │───►│    AWS     │───►│              │───►│  Tag & Push   │───►│  New Deploy │
 │          │    │ Credentials│    │  (OIDC Auth) │    │  to ECR       │    │             │
 └──────────┘    └────────────┘    └──────────────┘    └───────────────┘    └─────────────┘
     ✅ git           ✅ IAM             ✅ ECR              ✅ Image              ✅ Live
  actions/          secrets           registry           versioned             production
 checkout@v4       @v4 action         login @v2          & pushed             deployment
```

### Pipeline Stages Explained

#### **Stage 1 — Checkout** `actions/checkout@v4`
Pulls the latest commit from the `main` branch into the runner's workspace.

#### **Stage 2 — AWS Authentication** `aws-actions/configure-aws-credentials@v4`
Authenticates securely with AWS using GitHub Secrets (no IAM keys in code). Credentials are scoped to the minimum required permissions.

#### **Stage 3 — ECR Login** `aws-actions/amazon-ecr-login@v2`
Authenticates Docker with the private Amazon ECR registry. The registry URL is output as a step variable for downstream use.

#### **Stage 4 — Build, Tag & Push**
```bash
docker build -t $ECR_REPOSITORY:latest -f app/Dockerfile app
docker tag  $ECR_REPOSITORY:latest  $ECR_REGISTRY/$ECR_REPOSITORY:latest
docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
```
Builds the production Docker image from `app/Dockerfile`, tags it, and pushes it to the private ECR repository.

#### **Stage 5 — ECS Force Deployment**
```bash
aws ecs update-service \
  --cluster $ECS_CLUSTER \
  --service $ECS_SERVICE \
  --force-new-deployment \
  --region $AWS_REGION
```
Forces ECS to pull the latest image tag and perform a **rolling replacement** of running tasks — achieving zero-downtime deployment.

---

## ⚙️ Setup & Configuration

### Prerequisites

Before running this pipeline, ensure you have the following provisioned on AWS:

- [ ] **AWS Account** with appropriate IAM permissions
- [ ] **Amazon ECR Repository** — private registry for Docker images
- [ ] **Amazon ECS Cluster** — with a running service and task definition
- [ ] **IAM User or Role** — with permissions for ECR push and ECS update-service
- [ ] **GitHub Repository** — forked or cloned from this project

### Step 1 — Fork This Repository

```bash
git clone https://github.com/ruthwik-thotapelli/CloudForge-AWS-DevOps-CI-CD-Infrastructure-for-Secure-Deployments.git
cd CloudForge-AWS-DevOps-CI-CD-Infrastructure-for-Secure-Deployments
```

### Step 2 — Create AWS Resources

```bash
# Create an ECR repository
aws ecr create-repository \
  --repository-name cloudforge-app \
  --region us-east-1

# (Assumes ECS cluster and service are already provisioned)
```

### Step 3 — Configure GitHub Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add all secrets listed in the [Secrets Reference](#-github-secrets-reference) section below.

### Step 4 — Trigger the Pipeline

Push any change to `main`:

```bash
git add .
git commit -m "feat: trigger first deployment"
git push origin main
```

Navigate to **Actions** tab → **Deploy to ECS** → watch the pipeline run live. ✅

---

## 🔐 GitHub Secrets Reference

All sensitive values are stored as **encrypted GitHub Secrets** — never hardcoded in source.

| Secret Name | Description | Example Value |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user access key ID | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret access key | `wJalrXUtnFEMI/K7MDENG/...` |
| `AWS_REGION` | AWS region for all resources | `us-east-1` |
| `ECR_REPOSITORY` | Name of your ECR repository | `cloudforge-app` |
| `ECS_CLUSTER` | Name of your ECS cluster | `cloudforge-cluster` |
| `ECS_SERVICE` | Name of your ECS service | `cloudforge-service` |

> **Security Note:** The IAM user/role should follow **least-privilege principle** — only grant permissions for `ecr:*` on the specific repository and `ecs:UpdateService` on the specific cluster/service.

---

## 📂 Project Structure

```
CloudForge-AWS-DevOps-CI-CD-Infrastructure-for-Secure-Deployments/
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # ← CI/CD pipeline (GitHub Actions)
│
├── app/
│   ├── Dockerfile              # ← Docker image definition
│   ├── index.js                # ← Express.js application
│   └── package.json            # ← Node.js dependencies & metadata
│
└── README.md                   # ← You are here
```

---

## 📡 API Endpoints

The deployed Node.js application exposes the following HTTP routes:

| Method | Route | Description | Response |
|---|---|---|---|
| `GET` | `/` | Root endpoint — triggers a load test response | `200 OK` — success message |
| `GET` | `/health` | Health check for ALB Target Group | `200 OK` — `"OK"` |

### Health Check

Used by the **ALB (Application Load Balancer)** target group to verify container health before routing traffic.

```bash
curl http://<your-ec2-or-alb-dns>/health
# → "OK"
```

---

## 🐳 Docker Image

### Dockerfile Breakdown

```dockerfile
FROM node:18                # Official Node.js 18 base image

WORKDIR /app                # Set working directory inside container

COPY package.json ./        # Copy dependency manifest first (cache optimization)
RUN npm install             # Install production dependencies

COPY . .                    # Copy application source code

EXPOSE 3000                 # Declare the listening port

CMD ["node", "index.js"]    # Start the Express server
```

### Build & Run Locally

```bash
# Build the image
docker build -t cloudforge-app -f app/Dockerfile app

# Run the container
docker run -p 3000:3000 cloudforge-app

# Test locally
curl http://localhost:3000/health
```

---

## 🔁 Rollback Strategy

CloudForge supports rapid rollback if a bad deployment is detected.

### Automatic (via ECS)
ECS keeps the previous task revision running during a rolling deployment. If the new task fails health checks, ECS automatically stops the rollout and maintains the previous version.

### Manual Rollback via AWS CLI

```bash
# Step 1 — List available image tags in ECR
aws ecr describe-images \
  --repository-name cloudforge-app \
  --region us-east-1

# Step 2 — Update the ECS task definition to point to the previous image tag
# (Update your task definition JSON with the old image URI)

# Step 3 — Force a new deployment using the previous task definition revision
aws ecs update-service \
  --cluster cloudforge-cluster \
  --service cloudforge-service \
  --task-definition cloudforge-task:PREVIOUS_REVISION \
  --force-new-deployment \
  --region us-east-1
```

---

## 🔒 Security Practices

This project follows DevSecOps principles throughout:

- ✅ **No secrets in source code** — All credentials stored in GitHub Encrypted Secrets
- ✅ **Private ECR repository** — Docker images are not publicly accessible
- ✅ **IAM least-privilege** — Pipeline credentials scoped to only required actions
- ✅ **Official base images** — Using `node:18` from Docker Hub's verified publisher
- ✅ **Pinned action versions** — Using `@v4` and `@v2` tags to prevent supply-chain attacks

---

## 🌐 Tech Stack

<div align="center">

| Category | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js 18 | Application server |
| **Framework** | Express.js | HTTP routing |
| **Containerization** | Docker | Image packaging |
| **Registry** | Amazon ECR | Private image store |
| **Orchestration** | Amazon ECS | Container deployment |
| **CI/CD** | GitHub Actions | Pipeline automation |
| **Cloud** | AWS | Infrastructure provider |
| **IaC (Secrets)** | GitHub Secrets | Secure credential management |

</div>

---

## 📊 Pipeline Status

| Branch | Status |
|---|---|
| `main` | [![Deploy to ECS](https://github.com/ruthwik-thotapelli/CloudForge-AWS-DevOps-CI-CD-Infrastructure-for-Secure-Deployments/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/ruthwik-thotapelli/CloudForge-AWS-DevOps-CI-CD-Infrastructure-for-Secure-Deployments/actions/workflows/deploy.yml) |

---

## 🤝 Contributing

Contributions, improvements, and issue reports are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

<div align="center">

**Thotapelli Ruthwik**
*DevOps & Cloud Engineer*

[![GitHub](https://img.shields.io/badge/GitHub-ruthwik--thotapelli-181717?style=for-the-badge&logo=github)](https://github.com/ruthwik-thotapelli)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ruthwik--thotapelli-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/ruthwik-thotapelli)

</div>

---

## ⭐ Support

If this project helped you learn or you found it useful:

- Give it a **⭐ Star** on GitHub
- **Fork** it and build your own variation
- Share it with your network

---

<div align="center">

<sub>Built with ❤️ using AWS, Docker, and GitHub Actions</sub>

</div>

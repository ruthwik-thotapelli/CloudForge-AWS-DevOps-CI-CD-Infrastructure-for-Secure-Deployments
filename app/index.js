"use strict";

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const START_TIME = new Date().toISOString();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());

// Request logger middleware
app.use((req, _res, next) => {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      ip: req.ip,
    })
  );
  next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────

// Root route — application info
app.get("/", (_req, res) => {
  res.json({
    app: "CloudForge",
    description: "Enterprise-grade AWS DevOps CI/CD Platform",
    version: process.env.npm_package_version || "1.0.0",
    status: "running",
    uptime: process.uptime().toFixed(2) + "s",
    startedAt: START_TIME,
  });
});

// Health check — used by ALB Target Group & ECS health checks
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime().toFixed(2) + "s",
  });
});

// Readiness probe — signals app is ready to serve traffic
app.get("/ready", (_req, res) => {
  res.status(200).json({ ready: true });
});

// Metrics stub — simulates a metrics endpoint (Prometheus-style)
app.get("/metrics", (_req, res) => {
  res.set("Content-Type", "text/plain");
  res.send(
    [
      `# HELP process_uptime_seconds Application uptime in seconds`,
      `# TYPE process_uptime_seconds gauge`,
      `process_uptime_seconds ${process.uptime().toFixed(2)}`,
      `# HELP nodejs_heap_used_bytes Heap memory used`,
      `# TYPE nodejs_heap_used_bytes gauge`,
      `nodejs_heap_used_bytes ${process.memoryUsage().heapUsed}`,
    ].join("\n")
  );
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ─── Error Handler ───────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(JSON.stringify({ level: "error", message: err.message }));
  res.status(500).json({ error: "Internal Server Error" });
});

// ─── Start Server ────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(
    JSON.stringify({
      level: "info",
      message: `CloudForge server started`,
      port: PORT,
      env: process.env.NODE_ENV || "development",
      startedAt: START_TIME,
    })
  );
});

// ─── Graceful Shutdown ───────────────────────────────────────────────────────
const shutdown = (signal) => {
  console.log(
    JSON.stringify({ level: "info", message: `Received ${signal}, shutting down gracefully...` })
  );
  server.close(() => {
    console.log(JSON.stringify({ level: "info", message: "Server closed. Goodbye." }));
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

module.exports = app;
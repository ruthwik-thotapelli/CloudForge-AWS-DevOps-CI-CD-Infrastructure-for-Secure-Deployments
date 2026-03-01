const express = require("express");
const app = express();

// Root route (adds CPU load to trigger auto scaling)
app.get("/", (req, res) => {
  const start = Date.now();

  // Burn CPU for ~300ms
  while (Date.now() - start < 300) {}

  res.send("CloudForge Auto Scaling Test Successful 🚀");
});

// Health check route (used by ALB target group)
app.get("/health", (req, res) => {
  res.send("OK");
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
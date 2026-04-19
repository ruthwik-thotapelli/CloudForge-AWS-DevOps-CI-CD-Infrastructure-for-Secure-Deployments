const express = require("express");
const app = express();


// Root route (burn CPU to trigger auto scaling & alarm)
app.get("/", (req, res) => {
  const start = Date.now();

  // Burn CPU for ~500ms
  while (Date.now() - start < 500) {
    
    // intentional CPU loop
  }

  res.send("CloudForge Auto Scaling & Alarm Test Successful 🚀");
});


// Health check route (used by ALB target group)
app.get("/health", (req, res) => {
  res.send("OK");
});


// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
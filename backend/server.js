const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const portfinder = require("portfinder");
const path = require("path");
require("dotenv").config();

// Validate environment variables
require("./utils/validateEnv");

/* ================= ROUTES ================= */

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const hodRoutes = require("./routes/hodRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const reportRoutes = require("./routes/reportRoutes");
const creditConfigRoutes = require("./routes/creditConfigRoutes");

/* ================= MIDDLEWARE ================= */

const securityMiddleware = require("./middleware/securityMiddleware");

/* ================= APP ================= */

const app = express();

/* =====================================================
   MIDDLEWARE STACK
===================================================== */

// Security headers
app.use(securityMiddleware);

// Enable CORS
app.use(cors());

// JSON & Form Data Support
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded files
app.use("/uploads", express.static("uploads"));

// Serve frontend dist folder
app.use(express.static(path.join(__dirname, "dist")));

/* =====================================================
   API ROUTES
===================================================== */

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/hod", hodRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/credit-config", creditConfigRoutes);

/* =====================================================
   HEALTH CHECK
===================================================== */

app.get("/api/health", (req, res) => {
  res.json({ status: "Faculty Research Management API Running" });
});

/* =====================================================
   FRONTEND ROUTING (SPA fallback)
===================================================== */

// Serve index.html for any route that's not an API or static file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

/* =====================================================
   DATABASE CONNECTION & SERVER STARTUP
===================================================== */

const DEFAULT_PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("MongoDB Connected");

  // Find an available port starting from DEFAULT_PORT
  portfinder.getPort({ port: DEFAULT_PORT }, (err, port) => {
    if (err) {
      console.error("Error finding available port:", err);
      return;
    }

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      if (port !== DEFAULT_PORT) {
        console.log(`Note: Using port ${port} instead of ${DEFAULT_PORT} (which was in use)`);
      }
    });
  });

})
.catch((err) => {

  console.error("MongoDB Connection Error:", err);

});
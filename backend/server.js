import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import chatRoutes from "./routes/chat.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Add COOP header to allow Google OAuth popups
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});


// API routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Serve frontend
const primaryDist = path.join(__dirname, "dist");
const secondaryDist = path.join(__dirname, "../frontend/dist");

app.use(express.static(primaryDist));
app.use(express.static(secondaryDist));

// React fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(primaryDist, "index.html"), (err) => {
    if (err) {
      res.sendFile(path.join(secondaryDist, "index.html"));
    }
  });
});

// DB
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";  // Import body-parser

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001; // Default to 5001 if not provided
const __dirname = path.resolve();

// Body parser middleware to increase payload limit
app.use(bodyParser.json({ limit: "50mb" }));  // Increase payload size limit to 50mb
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Use middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: "https://chatappriza.netlify.app/", // Frontend URL (adjust if necessary)
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Static files for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start the server
server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);

  // Ensure that MongoDB URI is set properly and connect
  if (!process.env.MONGODB_URI) {
    console.error("MONGO_URI environment variable is not set.");
    process.exit(1);  // Exit if MongoDB URI is not set
  }

  connectDB(); // Connect to MongoDB
});

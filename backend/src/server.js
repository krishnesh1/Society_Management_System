import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import { seedDefaultAdmin } from "./utils/seedAdmin.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import residentRoutes from "./routes/residentRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
if (process.env.NODE_ENV === "production") {
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: Number(process.env.RATE_LIMIT_MAX || 5000),
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        message: "Too many requests. Please wait a moment and try again.",
      },
    }),
  );
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Society Management API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/residents", residentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res
    .status(error.statusCode || 500)
    .json({ message: error.message || "Server error" });
});

connectDB()
  .then(seedDefaultAdmin)
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });

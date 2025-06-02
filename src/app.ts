import express from "express";
import userRoute from "./routes/user.route";
import scheduleRoute from "./routes/schedule.route";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI as string);

const app = express();

app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/schedule", scheduleRoute);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Có lỗi xảy ra",
  });
});

export const viteNodeApp = app;

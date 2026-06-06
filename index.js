import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import AuthRouter from "./routes/authRoutes.js";
import PostRouter from "./routes/postRoutes.js";
import UserRouter from "./routes/userRoutes.js";
import uploadRouter from "./routes/uploadRoute.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  "/images",
  express.static("public/images")
);

app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/posts", PostRouter);
app.use("/api/v1/users", UserRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});


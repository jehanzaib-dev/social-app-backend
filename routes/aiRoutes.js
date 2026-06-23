import express from "express";
import { generatePost } from "../controllers/aiController.js";

const AIRouter = express.Router();

AIRouter.route("/generate-text").post(generatePost);

export default AIRouter;
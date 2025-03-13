import express from "express";
import { health } from "../controllers/health.controller.js";

const healthRouters = express.Router();

healthRouters.get("/health", health);

export default healthRouters;

import express from "express";
import { getSimilarProducts } from "../Controllers/recomm.js";

const router = express.Router();

router.get("/:slug", getSimilarProducts);

export default router;

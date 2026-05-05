import express from "express";
import {
  getRecommendedPackages,
  getAllPackages,
  getPackageBySlug,
} from "../controllers/packages.controller.js";
import { cachePublicList } from "../middlewares/cache.js";

const router = express.Router();

router.get("/recommended", cachePublicList("recommended_packages"), getRecommendedPackages);
router.get("/all", getAllPackages);
router.get("/:slug", getPackageBySlug);

export default router;

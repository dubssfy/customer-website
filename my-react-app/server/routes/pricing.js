import express from "express";
import {
  getPricing,
  updatePricing
} from "../controllers/pricingController.js";

const router = express.Router();

router.get("/", getPricing);

router.put("/:id", updatePricing);

export default router;
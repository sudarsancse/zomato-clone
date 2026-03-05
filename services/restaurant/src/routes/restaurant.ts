import express from "express";
import { isAuth, isSeller } from "../middlewares/isAuth.js";
import {
  addRestaurant,
  fetchMyRestaurant,
  fetchSingleRestaurent,
  getNearbyRestaurent,
  updateStatusRestaurant,
  updatRestaurant,
} from "../controllers/restaurant.js";
import uploadeFile from "../middlewares/Multer.js";

const router = express.Router();

router.post("/new", isAuth, isSeller, uploadeFile, addRestaurant);
router.get("/myrestaurant", isAuth, isSeller, fetchMyRestaurant);
router.put("/status", isAuth, isSeller, updateStatusRestaurant);
router.put("/edit", isAuth, isSeller, updatRestaurant);
router.get("/all", isAuth, getNearbyRestaurent);
router.get("/:id", isAuth, fetchSingleRestaurent);

export default router;

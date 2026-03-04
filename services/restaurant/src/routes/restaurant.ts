import express from "express";
import { isAuth, isSeller } from "../middlewares/isAuth.js";
import { addRestaurant, fetchMyRestaurant } from "../controllers/restaurant.js";
import uploadeFile from "../middlewares/Multer.js";

const router = express.Router();

router.post("/new", isAuth, isSeller, uploadeFile, addRestaurant);
router.get("/myrestaurant", isAuth, isSeller, fetchMyRestaurant);

export default router;

import express from "express";
import { isAuth, isSeller } from "../middlewares/isAuth.js";
import uploadeFile from "../middlewares/Multer.js";
import {
  addMenu,
  deleteMenuItem,
  getAllItems,
  toggleMenuItemAvailability,
} from "../controllers/menuItem.js";

const menuRouter = express.Router();
menuRouter.post("/new", isAuth, isSeller, uploadeFile, addMenu);
menuRouter.get("/all/:id", isAuth, getAllItems);
menuRouter.delete("/:itemId", isAuth, isSeller, deleteMenuItem);
menuRouter.put("/status/:id", isAuth, isSeller, toggleMenuItemAvailability);
export default menuRouter;

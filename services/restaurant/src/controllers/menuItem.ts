import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/tryCatch.js";
import Restaurant from "../models/restaurant.js";
import MenuItems from "../models/MenuItems.js";

//Add menu
export const addMenu = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(400).json("Please Login");
  }

  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

  if (!restaurant) {
    return res.status(404).json("Restaurant not found");
  }

  const { name, description, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Name and Price must be field" });
  }

  const file = req.file;

  if (!file) {
    return res
      .status(400)
      .json({ message: "Please uplode your restaurant image" });
  }

  const fileBuffer = getBuffer(file);
  if (!fileBuffer) {
    return res.status(500).json({ message: "Failed to create file buffer" });
  }

  const { data: uplodeResult } = await axios.post(
    `${process.env.UTILS_SERVICE_URL}/api/upload`,
    {
      buffer: fileBuffer.content,
    },
  );

  const item = await MenuItems.create({
    name,
    description,
    price,
    restaurantId: restaurant._id,
    image: uplodeResult.url,
  });

  res.json({ message: "Menu added sucessfully", item });
});

//fetch all menu items
export const getAllItems = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json("Id is required");
  }

  const items = await MenuItems.find({ restaurantId: id });

  res.json(items);
});

//Delete menu item
export const deleteMenuItem = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(400).json("Please Login");
    }

    const { itemId } = req.params;
    if (!itemId) {
      return res.status(400).json("Id is required");
    }

    const item = await MenuItems.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "No item found" });
    }

    const restaurant = await Restaurant.findById({
      _id: item.restaurantId,
      ownerId: req.user._id,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant found" });
    }

    await item.deleteOne();

    res.json({ messgae: "Menu item deleted sucessfully" });
  },
);

//toggle Menu item
export const toggleMenuItemAvailability = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(400).json("Please Login");
    }

    const { itemId } = req.params;
    if (!itemId) {
      return res.status(400).json("Id is required");
    }

    const item = await MenuItems.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "No item found" });
    }

    const restaurant = await Restaurant.findById({
      _id: item.restaurantId,
      ownerId: req.user._id,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant found" });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json({
      message: `Item Marked as ${item.isAvailable ? "available" : "unavailable"}`,
      item,
    });
  },
);

import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/tryCatch.js";
import Restaurant from "../models/restaurant.js";
import Jwt from "jsonwebtoken";

export const addRestaurant = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const existingResturant = await Restaurant.findOne({
      ownerId: user?._id,
    });

    if (existingResturant) {
      return res
        .status(400)
        .json({ message: "You allready have a restaurant" });
    }

    const { name, description, latitude, longitude, formattedAddress, phone } =
      req.body;
    if (!name || !latitude || !longitude || !phone) {
      return res
        .status(400)
        .json({ message: "Please give all details properly" });
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

    const restaurant = await Restaurant.create({
      name,
      description,
      phone,
      image: uplodeResult.url,
      ownerId: user._id,
      autoLocation: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
        formattedAddress,
      },
      isVerified: false,
    });
    return res.status(201).json({
      message: "Restaturant created sucessfully",
    });
  },
);

// fecth my restaurant profile

export const fetchMyRestaurant = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Please Login",
      });
    }
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

    if (!restaurant) {
      return res.status(400).json({
        message: "No Restaurant found..!",
      });
    }

    if (!req.user.restaurantId) {
      const token = Jwt.sign(
        {
          user: {
            ...req.user,
            restaurantId: restaurant._id,
          },
        },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "15d" },
      );

      return res.json({ restaurant, token });
    }
    res.json({ restaurant });
  },
);

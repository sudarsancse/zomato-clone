import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/tryCatch.js";
import Restaurant from "../models/restaurant.js";
import Jwt from "jsonwebtoken";
import { serialize } from "node:v8";

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
      message: "restaurant created sucessfully",
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

//restaurant status update Open or Close
export const updateStatusRestaurant = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(403).json({ message: "Please Login" });
    }

    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({ message: "Status must be boolean" });
    }

    const restaurant = await Restaurant.findOneAndUpdate(
      {
        ownerId: req.user._id,
      },
      { isOpen: status },
      { returnDocument: "after" },
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json({
      message: "Resturant status updated",
      restaurant,
    });
  },
);

//resturant data update

export const updatRestaurant = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(403).json({ message: "Please Login" });
    }

    const { name, description } = req.body;

    const restaurant = await Restaurant.findOneAndUpdate(
      {
        ownerId: req.user._id,
      },
      { name, description },
      { returnDocument: "after" },
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json({
      message: "Resturant  Updated",
      restaurant,
    });
  },
);

// fetch single restaurant with in 5km
export const fetchSingleRestaurent = TryCatch(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  res.json({ success: true, restaurant });
});

// fetch all restaurant with in 5km
export const getNearbyRestaurent = TryCatch(async (req, res) => {
  const { latitude, longitude, radius = 5000, search = "" } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and Longitude are required" });
  }

  const query: any = {
    isVerified: true,
  };

  if (search && typeof search === "string") {
    query.name = { $regex: search, $options: "i" };
  }

  const restaurants = await Restaurant.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [Number(longitude), Number(latitude)],
        },
        distanceField: "distance",
        maxDistance: Number(radius),
        spherical: true,
        query,
      },
    },
    {
      $sort: {
        isOpen: -1,
        distance: 1,
      },
    },
    {
      $addFields: {
        distanceKm: {
          $round: [{ $divide: ["$distance", 1000] }, 2],
        },
      },
    },
  ]);

  res.json({ success: true, count: restaurants.length, restaurants });
});

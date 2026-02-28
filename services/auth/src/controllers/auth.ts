import User from "../model/Use.js";
import Jwt from "jsonwebtoken";
import TryCatch from "../middlewares/tryCatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { oauth2client } from "../config/google.config.js";
import axios from "axios";

export const loginUser = TryCatch(async (req, res) => {
  // Google api login
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      message: "Authorization code is required",
    });
  }

  const googleRes = await oauth2client.getToken(code);

  oauth2client.setCredentials(googleRes.tokens);
  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
  );

  // manual login
  const { name, email, picture, number } = userRes.data;

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name,
      email,
      number,
      image: picture,
    });
  }
  const token = Jwt.sign({ user }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "30m",
  });
  res.status(200).json({ message: "Logged Sucess", token, user });
});

//! ROLE BASED

const allowedRoles = ["customer", "rider", "seller"] as const;
type Role = (typeof allowedRoles)[number];

export const addUserRole = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (!req.user?._id) {
    res.status(401).json({ message: "UnAuthorized" });
  }

  const { role } = req.body as { role: Role };
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalide role" });
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { role },
    { new: true },
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = Jwt.sign({ user }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "30m",
  });

  res.json({ user, token });
});

// $ Profile Fetch

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  res.json(user);
});

// $ Google aip signup

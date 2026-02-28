import User from "../model/Use.js";
import Jwt from "jsonwebtoken";
import TryCatch from "../middlewares/tryCatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";

export const loginUser = TryCatch(async (req, res) => {
  const { name, email, picture, number } = req.body;

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
    expiresIn: "2m",
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
    expiresIn: "2m",
  });

  res.json({ user, token });
});

import User from "../model/Use.js";
import Jwt from "jsonwebtoken";
import TryCatch from "../middlewares/tryCatch.js";

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
    expiresIn: "30s",
  });
  res.status(200).json({ message: "Logged Sucess", token, user });
});

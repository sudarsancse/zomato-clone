import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string, {
      dbName: "Zomato_clone",
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};

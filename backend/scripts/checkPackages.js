import mongoose from "mongoose";
import packageModel from "../models/package.model.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const checkPackages = async () => {
  try {
    const packages = await packageModel.find({}).select("name slug country");
    console.log("📦 Packages in database:");
    packages.forEach(pkg => {
      console.log(`- ${pkg.name} (${pkg.country}) - Slug: ${pkg.slug}`);
    });
  } catch (error) {
    console.error("❌ Error checking packages:", error);
  }
};

const runScript = async () => {
  await connectDB();
  await checkPackages();
  process.exit(0);
};

runScript();

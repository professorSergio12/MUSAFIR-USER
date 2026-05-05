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

const generateSlugs = async () => {
  try {
    const packages = await packageModel.find({});
    console.log(`📦 Found ${packages.length} packages`);
    
    for (const pkg of packages) {
      const slug = pkg.name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      
      await packageModel.findByIdAndUpdate(pkg._id, { slug });
      console.log(`✅ Updated ${pkg.name} with slug: ${slug}`);
    }
    
    console.log("🎉 All slugs generated successfully!");
  } catch (error) {
    console.error("❌ Error generating slugs:", error);
  }
};

const runScript = async () => {
  await connectDB();
  await generateSlugs();
  process.exit(0);
};

runScript();

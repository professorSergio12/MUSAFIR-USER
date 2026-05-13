/**
 * Seeds low-priced packages + hotels for Razorpay test checkout (totals stay under ₹500).
 *
 * Uses a name prefix "[RZ-TEST]" so re-runs only replace these rows (does NOT wipe users/bookings).
 *
 * From MUSAFIR-Exommerce/backend with MONGODB_URI in .env:
 *   npm run seed:budget
 */

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/connection.js";
import Hotel from "../models/hotel.model.js";
import Location from "../models/location.model.js";
import FoodOption from "../models/foodOption.model.js";
import Package from "../models/package.model.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

const TAG = "[RZ-TEST]";
const MAX_TOTAL = 500;
const IMG =
  "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png";

/** Same formula as frontend `PackageDetails.jsx` (default selections = cheapest first). */
function maxPossibleTotal({
  basePrice,
  durationDays,
  hotels,
  foodOptions,
}) {
  let maxHotelCost = 0;
  for (const h of hotels) {
    const nights = h.pricePerNight ?? 0;
    const roomTypes = h.roomTypes?.length ? h.roomTypes : [{ surcharge: 0 }];
    for (const rt of roomTypes) {
      const perNight = nights + (rt.surcharge ?? 0);
      maxHotelCost = Math.max(maxHotelCost, perNight * durationDays);
    }
  }
  let maxFoodCost = 0;
  for (const f of foodOptions) {
    maxFoodCost = Math.max(maxFoodCost, (f.surchargePerDay ?? 0) * durationDays);
  }
  return basePrice + maxHotelCost + maxFoodCost;
}

function assertUnderCap(label, total) {
  if (total > MAX_TOTAL) {
    throw new Error(
      `${label}: computed max ₹${total} exceeds cap ₹${MAX_TOTAL}. Adjust seed data.`,
    );
  }
}

const seedBudgetPackages = async () => {
  try {
    console.log("Budget Razorpay test seed — packages + hotels under ₹500 checkout...\n");
    await connectDB();

    const nameRegex = new RegExp(`^${TAG.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);

    console.log("Removing previous [RZ-TEST] packages / hotels / food / locations...");
    const pkgRes = await Package.deleteMany({ name: nameRegex });
    const hotelRes = await Hotel.deleteMany({ name: nameRegex });
    const foodRes = await FoodOption.deleteMany({ name: nameRegex });
    const locRes = await Location.deleteMany({ name: nameRegex });
    console.log(
      `  Deleted packages: ${pkgRes.deletedCount}, hotels: ${hotelRes.deletedCount}, food: ${foodRes.deletedCount}, locations: ${locRes.deletedCount}\n`,
    );

    const locations = await Location.insertMany([
      {
        name: `${TAG} City Walk`,
        country: "India",
        city: "Pune",
        details: "Short city orientation walk (demo itinerary).",
        locationImage: IMG,
        day: 1,
      },
      {
        name: `${TAG} Local Market`,
        country: "India",
        city: "Pune",
        details: "Explore local market and street food (demo).",
        locationImage: IMG,
        day: 2,
      },
    ]);

    const hotels = await Hotel.insertMany([
      {
        name: `${TAG} Budget Stay Pune`,
        country: "India",
        city: "Pune",
        tier: "Budget",
        pricePerNight: 35,
        images: [IMG],
        roomTypes: [
          { name: "Standard", surcharge: 0 },
          { name: "Deluxe", surcharge: 15 },
        ],
        description: "Low nightly rate for Razorpay test payments.",
      },
      {
        name: `${TAG} Economy Lodge Lonavala`,
        country: "India",
        city: "Lonavala",
        tier: "Budget",
        pricePerNight: 45,
        images: [IMG],
        roomTypes: [
          { name: "Standard", surcharge: 0 },
          { name: "Garden View", surcharge: 10 },
        ],
        description: "Second cheap option linked to India packages.",
      },
    ]);

    const foodOptions = await FoodOption.insertMany([
      {
        name: `${TAG} Breakfast Only`,
        surchargePerDay: 0,
        foodOptions: [{ name: "Breakfast", surcharge: 0 }],
        description: "No extra meal charge — keeps total low.",
        image: IMG,
      },
    ]);

    const packageSpecs = [
      {
        name: `${TAG} 2D Pune Micro Trip`,
        description: "Two days in Pune — under ₹500 for Razorpay test mode.",
        basePrice: 120,
        durationDays: 2,
        isRecommended: true,
        bestSeason: "all",
        country: "India",
        images: IMG,
        hotelIndexes: [0],
        maxFoodIndexes: [0],
      },
      {
        name: `${TAG} 3D Pune Budget Break`,
        description: "Three days, still capped for test payments.",
        basePrice: 150,
        durationDays: 3,
        isRecommended: false,
        bestSeason: "winter",
        country: "India",
        images: IMG,
        hotelIndexes: [0, 1],
        maxFoodIndexes: [0],
      },
      {
        name: `${TAG} 2D Hill Weekend`,
        description: "Lonavala + Pune hotels; totals verified under cap.",
        basePrice: 180,
        durationDays: 2,
        isRecommended: false,
        bestSeason: "all",
        country: "India",
        images: IMG,
        hotelIndexes: [0, 1],
        maxFoodIndexes: [0],
      },
    ];

    for (const spec of packageSpecs) {
      const pkgHotels = spec.hotelIndexes.map((i) => hotels[i]);
      const pkgFood = spec.maxFoodIndexes.map((i) => foodOptions[i]);
      const maxTotal = maxPossibleTotal({
        basePrice: spec.basePrice,
        durationDays: spec.durationDays,
        hotels: pkgHotels,
        foodOptions: pkgFood,
      });
      assertUnderCap(spec.name, maxTotal);
      console.log(`  ✓ ${spec.name}: max possible total ≈ ₹${maxTotal}`);
    }

    const packagesToInsert = packageSpecs.map((spec) => {
      const pkgHotels = spec.hotelIndexes.map((i) => hotels[i]._id);
      const pkgFood = spec.maxFoodIndexes.map((i) => foodOptions[i]._id);
      const slug = spec.name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      return {
        name: spec.name,
        slug,
        description: spec.description,
        basePrice: spec.basePrice,
        durationDays: spec.durationDays,
        isRecommended: spec.isRecommended,
        bestSeason: spec.bestSeason,
        country: spec.country,
        images: spec.images,
        itinerary: locations.map((l) => l._id),
        availableHotels: pkgHotels,
        availableFoodOptions: pkgFood,
      };
    });

    const packages = await Package.insertMany(packagesToInsert);

    console.log("\nDone.");
    console.log(`  New packages: ${packages.length}`);
    console.log("  Open any [RZ-TEST] package on the site — Book should stay under ₹500.");
    console.log("  Use Razorpay test cards from docs + random CVV + future expiry.\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("seedBudgetPackages failed:", err);
    try {
      await mongoose.connection.close();
    } catch {
      /* ignore */
    }
    process.exit(1);
  }
};

seedBudgetPackages();

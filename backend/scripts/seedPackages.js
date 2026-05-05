import mongoose from "mongoose";
import dotenv from "dotenv";
import packageModel from "../models/package.model.js";
import locationModel from "../models/location.model.js";
import hotelModel from "../models/hotel.model.js";
import foodOptionModel from "../models/foodOption.model.js";

dotenv.config();

const COUNTRIES = [
  { country: "Japan", regions: ["Tokyo", "Osaka", "Kyoto"] },
  { country: "USA", regions: ["New York", "California", "Florida"] },
  { country: "China", regions: ["Beijing", "Shanghai", "Guangzhou"] },
  { country: "South Korea", regions: ["Seoul", "Busan", "Jeju"] },
  { country: "India", regions: ["Punjab", "Himachal", "Uttarakhand", "Goa", "Kerala"] },
  { country: "South Africa", regions: ["Cape Town", "Johannesburg", "Durban"] },
  { country: "Australia", regions: ["Sydney", "Melbourne", "Brisbane"] },
  { country: "New Zealand", regions: ["Auckland", "Queenstown", "Wellington"] },
  { country: "West Indies", regions: ["Barbados", "Jamaica", "Trinidad"] },
  { country: "UAE", regions: ["Dubai", "Abu Dhabi", "Sharjah"] },
  { country: "Saudi Arabia", regions: ["Riyadh", "Jeddah", "Mecca"] },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function buildImage(query, w = 800, h = 500) {
  return `https://images.unsplash.com/photo-1519681393784-d120267933ba?w=${w}&h=${h}&fit=crop&auto=format`;
}

async function connect() {
  await mongoose.connect(process.env.MONGODB_URI);
}

async function clearAll() {
  await Promise.all([
    packageModel.deleteMany({}),
    locationModel.deleteMany({}),
    hotelModel.deleteMany({}),
    foodOptionModel.deleteMany({}),
  ]);
}

async function ensureFoodOptions() {
  const defaults = [
    {
      name: "Breakfast Only",
      surchargePerDay: 0,
      includesBreakfast: true,
      description: "Daily breakfast included",
      image: buildImage("breakfast", 600, 400),
    },
    {
      name: "Half Board",
      surchargePerDay: 1500,
      includesBreakfast: true,
      includesDinner: true,
      description: "Breakfast and dinner included",
      image: buildImage("dinner", 600, 400),
    },
    {
      name: "Full Board",
      surchargePerDay: 2500,
      includesBreakfast: true,
      includesLunch: true,
      includesDinner: true,
      description: "All meals included",
      image: buildImage("meal", 600, 400),
    },
    {
      name: "All Inclusive",
      surchargePerDay: 4000,
      includesBreakfast: true,
      includesLunch: true,
      includesDinner: true,
      description: "All meals, snacks and drinks",
      image: buildImage("drinks", 600, 400),
    },
  ];

  const created = await foodOptionModel.insertMany(defaults, { ordered: false }).catch(() => null);
  const all = await foodOptionModel.find({});
  return all;
}

function createRoomTypes() {
  return [
    { name: "Standard Room", surcharge: 0 },
    { name: "Deluxe Room", surcharge: 3000 },
    { name: "Suite", surcharge: 9000 },
  ];
}

function shortId() {
  return Math.random().toString(36).slice(2, 6);
}

async function createHotel(country, city, tier, i) {
  return await hotelModel.create({
    name: `${city} ${tier} Hotel ${i + 1} ${shortId()}`,
    country,
    city,
    tier,
    pricePerNight: 8000 + Math.floor(Math.random() * 20000),
    images: [buildImage(`${city} hotel`, 700, 400)],
    roomTypes: createRoomTypes(),
    description: `${city} ${tier.toLowerCase()} hotel with comfortable rooms and amenities`,
  });
}

async function createLocation(country, city, day, i) {
  return await locationModel.create({
    name: `${city} Sight ${i + 1}`,
    country,
    city,
    details: `Explore ${city} attraction ${i + 1} with a guided experience`,
    locationImage: buildImage(`${city} landmark`, 900, 500),
    day,
  });
}

async function createPackage(country, region, foodOptions) {
  const durationDays = 5 + Math.floor(Math.random() * 5); // 5-9 days
  const basePrice = 60000 + Math.floor(Math.random() * 120000);

  // 5 locations
  const locations = await Promise.all(
    Array.from({ length: 5 }).map((_, idx) => createLocation(country, region, idx + 1, idx))
  );

  // 4 hotels (Budget/Standard/Luxury + one extra)
  const hotelTiers = ["Budget", "Standard", "Luxury", pick(["Standard", "Luxury"])];
  const hotels = await Promise.all(
    hotelTiers.map((tier, idx) => createHotel(country, region, tier, idx))
  );

  const pkg = await packageModel.create({
    name: `${region} Tour ${shortId()}`,
    description: `Discover the best of ${region}, ${country} with curated experiences across ${durationDays} days.`,
    basePrice,
    durationDays,
    isRecommended: Math.random() > 0.6,
    bestSeason: pick(["winter", "summer", "monsoon", "all"]),
    images: buildImage(`${region} city`, 1200, 600),
    country,
    itinerary: locations.map((l) => l._id),
    availableHotels: hotels.map((h) => h._id),
    availableFoodOptions: foodOptions.map((f) => f._id),
  });

  return pkg;
}

async function main() {
  await connect();
  console.log("✅ Connected to MongoDB");
  await clearAll();
  console.log("🧹 Cleared existing data");
  const foodOptions = await ensureFoodOptions();
  console.log(`🍽️ Ready food options: ${foodOptions.length}`);

  const packagesToCreate = 50; // target
  const createdPackages = [];

  // iterate regions repeatedly until we reach 50 packages
  while (createdPackages.length < packagesToCreate) {
    for (const { country, regions } of COUNTRIES) {
      for (const region of regions) {
        if (createdPackages.length >= packagesToCreate) break;
        const pkg = await createPackage(country, region, foodOptions);
        createdPackages.push(pkg);
        console.log(`📦 Created package: ${pkg.name} (${pkg.country})`);
      }
      if (createdPackages.length >= packagesToCreate) break;
    }
  }

  console.log(`🎉 Created ${createdPackages.length} packages.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});



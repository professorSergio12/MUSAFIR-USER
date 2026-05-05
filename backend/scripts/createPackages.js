import mongoose from "mongoose";
import packageModel from "../models/package.model.js";
import hotelModel from "../models/hotel.model.js";
import foodOptionModel from "../models/foodOption.model.js";
import locationModel from "../models/location.model.js";
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

const createSampleData = async () => {
  try {
    // Clear existing data
    await packageModel.deleteMany({});
    await hotelModel.deleteMany({});
    await foodOptionModel.deleteMany({});
    await locationModel.deleteMany({});
    console.log("🗑️ Cleared existing data");

    // Create Food Options
    const foodOptions = await foodOptionModel.insertMany([
      {
        name: "Breakfast Only",
        surchargePerDay: 0,
        includesBreakfast: true,
        includesLunch: false,
        includesDinner: false,
        description: "Daily breakfast included"
      },
      {
        name: "Half Board",
        surchargePerDay: 1500,
        includesBreakfast: true,
        includesLunch: false,
        includesDinner: true,
        description: "Breakfast and dinner included"
      },
      {
        name: "Full Board",
        surchargePerDay: 2500,
        includesBreakfast: true,
        includesLunch: true,
        includesDinner: true,
        description: "All meals included"
      },
      {
        name: "All Inclusive",
        surchargePerDay: 4000,
        includesBreakfast: true,
        includesLunch: true,
        includesDinner: true,
        description: "All meals + snacks + drinks included"
      }
    ]);
    console.log("🍽️ Created food options");

    // Create Hotels
    const hotels = await hotelModel.insertMany([
      // Japan Hotels
      {
        name: "Tokyo Grand Hotel",
        country: "Japan",
        city: "Tokyo",
        tier: "Luxury",
        pricePerNight: 25000,
        description: "5-star luxury hotel in the heart of Tokyo",
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop"],
        roomTypes: [
          { name: "Standard Room", surcharge: 0 },
          { name: "Deluxe Room", surcharge: 5000 },
          { name: "Suite", surcharge: 15000 }
        ]
      },
      {
        name: "Osaka Business Hotel",
        country: "Japan",
        city: "Osaka",
        tier: "Standard",
        pricePerNight: 12000,
        description: "Comfortable business hotel in Osaka",
        images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop"],
        roomTypes: [
          { name: "Single Room", surcharge: 0 },
          { name: "Double Room", surcharge: 2000 }
        ]
      },
      // USA Hotels
      {
        name: "New York Plaza",
        country: "USA",
        city: "New York",
        tier: "Luxury",
        pricePerNight: 35000,
        description: "Iconic luxury hotel in Manhattan",
        images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500&h=300&fit=crop"],
        roomTypes: [
          { name: "Standard Room", surcharge: 0 },
          { name: "Deluxe Room", surcharge: 8000 },
          { name: "Presidential Suite", surcharge: 25000 }
        ]
      },
      {
        name: "Los Angeles Inn",
        country: "USA",
        city: "Los Angeles",
        tier: "Standard",
        pricePerNight: 15000,
        description: "Modern hotel near Hollywood",
        images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop"],
        roomTypes: [
          { name: "Standard Room", surcharge: 0 },
          { name: "Pool View Room", surcharge: 3000 }
        ]
      },
      // China Hotels
      {
        name: "Beijing Palace Hotel",
        country: "China",
        city: "Beijing",
        tier: "Luxury",
        pricePerNight: 20000,
        description: "Traditional luxury hotel in Beijing",
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop"],
        roomTypes: [
          { name: "Standard Room", surcharge: 0 },
          { name: "Deluxe Room", surcharge: 4000 }
        ]
      },
      // South Korea Hotels
      {
        name: "Seoul Grand Hotel",
        country: "South Korea",
        city: "Seoul",
        tier: "Luxury",
        pricePerNight: 22000,
        description: "Modern luxury hotel in Seoul",
        images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop"],
        roomTypes: [
          { name: "Standard Room", surcharge: 0 },
          { name: "Deluxe Room", surcharge: 5000 }
        ]
      },
      // India Hotels
      {
        name: "Taj Mahal Palace",
        country: "India",
        city: "Mumbai",
        tier: "Luxury",
        pricePerNight: 30000,
        description: "Historic luxury hotel in Mumbai",
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop"],
        roomTypes: [
          { name: "Standard Room", surcharge: 0 },
          { name: "Deluxe Room", surcharge: 6000 },
          { name: "Presidential Suite", surcharge: 20000 }
        ]
      }
    ]);
    console.log("🏨 Created hotels");

    // Create Locations
    const locations = await locationModel.insertMany([
      // Japan Locations
      {
        name: "Tokyo Skytree",
        country: "Japan",
        city: "Tokyo",
        details: "Visit the tallest tower in Japan with panoramic city views",
        locationImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=300&fit=crop",
        day: 1
      },
      {
        name: "Senso-ji Temple",
        country: "Japan",
        city: "Tokyo",
        details: "Ancient Buddhist temple in Asakusa, Tokyo's oldest temple",
        locationImage: "https://images.unsplash.com/photo-1542640244-a0498c2b9d84?w=500&h=300&fit=crop",
        day: 1
      },
      {
        name: "Osaka Castle",
        country: "Japan",
        city: "Osaka",
        details: "Historic castle with beautiful gardens and historical significance",
        locationImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
        day: 2
      },
      {
        name: "Universal Studios Japan",
        country: "Japan",
        city: "Osaka",
        details: "Experience thrilling rides and attractions at this world-famous theme park",
        locationImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
        day: 3
      },
      // USA Locations
      {
        name: "Statue of Liberty",
        country: "USA",
        city: "New York",
        details: "Iconic symbol of freedom and democracy, take a ferry to Liberty Island",
        locationImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop",
        day: 1
      },
      {
        name: "Times Square",
        country: "USA",
        city: "New York",
        details: "The crossroads of the world, experience the energy of NYC",
        locationImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&h=300&fit=crop",
        day: 1
      },
      {
        name: "Central Park",
        country: "USA",
        city: "New York",
        details: "Escape the city hustle in this beautiful urban park",
        locationImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
        day: 2
      },
      {
        name: "Hollywood Walk of Fame",
        country: "USA",
        city: "Los Angeles",
        details: "Walk among the stars on this famous sidewalk",
        locationImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop",
        day: 3
      },
      // China Locations
      {
        name: "Great Wall of China",
        country: "China",
        city: "Beijing",
        details: "Walk on this ancient wonder of the world",
        locationImage: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=500&h=300&fit=crop",
        day: 1
      },
      {
        name: "Forbidden City",
        country: "China",
        city: "Beijing",
        details: "Explore the imperial palace complex of ancient China",
        locationImage: "https://images.unsplash.com/photo-1542640244-a0498c2b9d84?w=500&h=300&fit=crop",
        day: 2
      },
      // South Korea Locations
      {
        name: "Gyeongbokgung Palace",
        country: "South Korea",
        city: "Seoul",
        details: "Visit the main royal palace of the Joseon dynasty",
        locationImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
        day: 1
      },
      {
        name: "N Seoul Tower",
        country: "South Korea",
        city: "Seoul",
        details: "Enjoy panoramic views of Seoul from this iconic tower",
        locationImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=300&fit=crop",
        day: 2
      },
      // India Locations
      {
        name: "Taj Mahal",
        country: "India",
        city: "Agra",
        details: "Visit the iconic white marble mausoleum, one of the Seven Wonders",
        locationImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop",
        day: 1
      },
      {
        name: "Red Fort",
        country: "India",
        city: "Delhi",
        details: "Explore this historic fort and UNESCO World Heritage Site",
        locationImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop",
        day: 2
      },
      {
        name: "Gateway of India",
        country: "India",
        city: "Mumbai",
        details: "Visit this iconic monument overlooking the Arabian Sea",
        locationImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&h=300&fit=crop",
        day: 3
      }
    ]);
    console.log("📍 Created locations");

    // Create Packages
    const packages = await packageModel.insertMany([
      // Japan Packages
      {
        name: "Tokyo & Osaka Adventure",
        description: "Experience the best of Japan with visits to Tokyo and Osaka. Explore ancient temples, modern skyscrapers, and enjoy authentic Japanese cuisine.",
        basePrice: 125000,
        durationDays: 7,
        isRecommended: true,
        bestSeason: "summer",
        country: "Japan",
        images: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop",
        itinerary: [locations[0]._id, locations[1]._id, locations[2]._id, locations[3]._id],
        availableHotels: [hotels[0]._id, hotels[1]._id],
        availableFoodOptions: [foodOptions[0]._id, foodOptions[1]._id, foodOptions[2]._id]
      },
      {
        name: "Japan Cultural Tour",
        description: "Immerse yourself in Japanese culture with temple visits, traditional experiences, and authentic local cuisine.",
        basePrice: 95000,
        durationDays: 5,
        isRecommended: false,
        bestSeason: "winter",
        country: "Japan",
        images: "https://images.unsplash.com/photo-1542640244-a0498c2b9d84?w=800&h=400&fit=crop",
        itinerary: [locations[1]._id, locations[2]._id],
        availableHotels: [hotels[1]._id],
        availableFoodOptions: [foodOptions[0]._id, foodOptions[1]._id]
      },
      // USA Packages
      {
        name: "New York City Explorer",
        description: "Discover the Big Apple with visits to iconic landmarks, world-class museums, and vibrant neighborhoods.",
        basePrice: 180000,
        durationDays: 6,
        isRecommended: true,
        bestSeason: "summer",
        country: "USA",
        images: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=400&fit=crop",
        itinerary: [locations[4]._id, locations[5]._id, locations[6]._id],
        availableHotels: [hotels[2]._id],
        availableFoodOptions: [foodOptions[1]._id, foodOptions[2]._id, foodOptions[3]._id]
      },
      {
        name: "California Dream",
        description: "Experience the Golden State with visits to Los Angeles, Hollywood, and beautiful beaches.",
        basePrice: 160000,
        durationDays: 8,
        isRecommended: false,
        bestSeason: "summer",
        country: "USA",
        images: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=400&fit=crop",
        itinerary: [locations[7]._id],
        availableHotels: [hotels[3]._id],
        availableFoodOptions: [foodOptions[0]._id, foodOptions[1]._id]
      },
      // China Packages
      {
        name: "Beijing Heritage Tour",
        description: "Explore China's capital with visits to the Great Wall, Forbidden City, and other historic sites.",
        basePrice: 110000,
        durationDays: 5,
        isRecommended: true,
        bestSeason: "winter",
        country: "China",
        images: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=400&fit=crop",
        itinerary: [locations[8]._id, locations[9]._id],
        availableHotels: [hotels[4]._id],
        availableFoodOptions: [foodOptions[0]._id, foodOptions[1]._id, foodOptions[2]._id]
      },
      // South Korea Packages
      {
        name: "Seoul Discovery",
        description: "Experience modern Seoul with visits to palaces, markets, and K-pop culture.",
        basePrice: 98000,
        durationDays: 4,
        isRecommended: false,
        bestSeason: "summer",
        country: "South Korea",
        images: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
        itinerary: [locations[10]._id, locations[11]._id],
        availableHotels: [hotels[5]._id],
        availableFoodOptions: [foodOptions[0]._id, foodOptions[1]._id]
      },
      // India Packages
      {
        name: "Golden Triangle Tour",
        description: "Visit Delhi, Agra, and Mumbai to see the Taj Mahal, Red Fort, and Gateway of India.",
        basePrice: 75000,
        durationDays: 6,
        isRecommended: true,
        bestSeason: "winter",
        country: "India",
        images: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=400&fit=crop",
        itinerary: [locations[12]._id, locations[13]._id, locations[14]._id],
        availableHotels: [hotels[6]._id],
        availableFoodOptions: [foodOptions[0]._id, foodOptions[1]._id, foodOptions[2]._id]
      }
    ]);
    console.log("📦 Created packages");

    console.log("✅ Sample data created successfully!");
    console.log(`📊 Created: ${packages.length} packages, ${hotels.length} hotels, ${foodOptions.length} food options, ${locations.length} locations`);
    
  } catch (error) {
    console.error("❌ Error creating sample data:", error);
  }
};

const runScript = async () => {
  await connectDB();
  await createSampleData();
  process.exit(0);
};

runScript();

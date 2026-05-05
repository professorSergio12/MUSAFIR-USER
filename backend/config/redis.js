import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis connected successfully."));

export const connectRedis = async () => {
  return redisClient;
};

export default redisClient;

import IORedis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const queueConnection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

queueConnection.on("connect", () => {
  console.log("Connected to Redis from Worker");
});

queueConnection.on("error", (err) => {
  console.error("Redis Connection Error:", err);
});
export default queueConnection;

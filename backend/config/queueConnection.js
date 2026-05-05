import IORedis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const queueConnection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

queueConnection.on("error", (err) => console.log("Redis Client Error", err));

export const connectQueue = async () => {
  return queueConnection;
};

export default queueConnection;

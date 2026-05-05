import redisClient from "../config/redis.js";

export const cachePublicList = (keyPrefix) => async (req, res, next) => {
  try {
    const key = `${keyPrefix}:${JSON.stringify(req.query)}`;

    const cachedData = await redisClient.get(key);
    if (cachedData) {
      console.log(`✅ Cache HIT for key: ${key}`);
      return res.status(200).json(JSON.parse(cachedData));
    }

    res.locals.redisKey = key;
    next();
  } catch (error) {
    console.error("❌ Redis caching error:", error);
    next();
  }
};

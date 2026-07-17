const redisClient = require("../config/redis");

const acquireLock = async (hallId) => {

  const key = `hall-lock-${hallId}`;

  const result = await redisClient.set(
    key,
    "locked",
    {
      NX: true,
      EX: 10
    }
  );

  return result === "OK";
};

module.exports = {
  acquireLock
};
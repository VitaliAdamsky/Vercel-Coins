import { getDataFromRedis } from "../utility/redis/get-data-from-redis.mjs";
import { dataKeys } from "../utility/redis/data-keys.mjs";

export const fetchBlackListData = async () => {
  const redisResponse = await getDataFromRedis(dataKeys.blacklist);

  const data = redisResponse || {};

  return {
    binancePerpBlackList: data.perp?.binance || [],
    bybitPerpBlackList: data.perp?.bybit || [],
    binanceSpotBlackList: data.spot?.binance || [],
    bybitSpotBlackList: data.spot?.bybit || [],
  };
};

import { getDataFromRedis } from "../utility/redis/get-data-from-redis.mjs";
import { dataKeys } from "../utility/redis/data-keys.mjs";

export const filterCoinsByDominaceCoinsFromRedis = async (dominant) => {
  const coins = await getDataFromRedis(dataKeys.coins);
  //TODO
  console.log("Fetched coins:", coins.length);
  console.log("Dominant", dominant);

  const isBinance = (coin) => coin.exchanges?.includes("Binance");
  const isBybit = (coin) => coin.exchanges?.includes("Bybit");

  let binanceCoins, bybitCoins;

  if (dominant === "Binance") {
    binanceCoins = coins.filter(isBinance);
    bybitCoins = coins.filter((c) => isBybit(c) && !isBinance(c));
  } else if (dominant === "Bybit") {
    bybitCoins = coins.filter(isBybit);
    binanceCoins = coins.filter((c) => isBinance(c) && !isBybit(c));
  } else {
    throw new Error("Invalid dominant exchange specified");
  }

  console.log("Binance coins after Dominance:", binanceCoins.length);
  console.log("Bybit coins after Dominance:", bybitCoins.length);

  return {
    binanceCoins,
    bybitCoins,
  };
};

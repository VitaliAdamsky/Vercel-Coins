import { getDataFromRedis } from "../utility/redis/get-data-from-redis.mjs";
import { dataKeys } from "../utility/redis/data-keys.mjs";
import { blackListData } from "./black-list-data.mjs";

export const fetchDominantCoinsFromRedis = async (coinType, dominant) => {
  const coins = await getDataFromRedis(dataKeys.coins);

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

  if (coinType === "perp") {
    console.log("dataKey By Check", dataKeys.failedBybitPerpSymbols);
    const blackListBinancePerpSymbols = await getDataFromRedis(
      dataKeys.failedBinancePerpSymbols
    );
    const blackListBybitPerpSymbols = await getDataFromRedis(
      dataKeys.failedBybitPerpSymbols
    );

    const binancePerpCoins = binanceCoins
      .filter((c) => !blackListBinancePerpSymbols.includes(c.symbol))
      .sort((a, b) => a.symbol.localeCompare(b.symbol));

    const bybitPerpCoins = bybitCoins
      .filter((c) => !blackListBybitPerpSymbols.includes(c.symbol))
      .sort((a, b) => a.symbol.localeCompare(b.symbol));

    return {
      binancePerpCoins,
      bybitPerpCoins,
    };
  } else if (coinType === "spot") {
    const blackListBinanceSpotSymbols = await getDataFromRedis(
      dataKeys.failedBinanceSpotSymbols
    );
    const blackListBybitSpotSymbols = await getDataFromRedis(
      dataKeys.failedBybitSpotSymbols
    );
    const binanceSpotCoins = binanceCoins
      .filter((c) => !blackListBinanceSpotSymbols.includes(c.symbol))
      .sort((a, b) => a.symbol.localeCompare(b.symbol));

    const bybitSpotCoins = bybitCoins
      .filter((c) => !blackListBybitSpotSymbols.includes(c.symbol))
      .sort((a, b) => a.symbol.localeCompare(b.symbol));

    return {
      binanceSpotCoins,
      bybitSpotCoins,
    };
  } else {
    throw new Error("Invalid coin type specified");
  }
};

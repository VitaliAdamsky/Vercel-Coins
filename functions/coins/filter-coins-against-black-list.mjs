import { fetchBlackListData } from "./fetch-black-list-data.mjs";

export const filterCoinsAgainstBlackList = async (
  coinType,
  { binanceCoins, bybitCoins }
) => {
  console.log("coinType", coinType);
  console.log("filterCoinsAgainstBlackList binanceCoins", binanceCoins.length);
  console.log("filterCoinsAgainstBlackList bybitCoins", bybitCoins.length);
  const {
    binancePerpBlackList,
    bybitPerpBlackList,
    binanceSpotBlackList,
    bybitSpotBlackList,
  } = await fetchBlackListData();
  console.log("binancePerpBlackList", binancePerpBlackList.length);
  console.log("bybitPerpBlackList", bybitPerpBlackList.length);
  console.log("binanceSpotBlackList", binanceSpotBlackList.length);
  console.log("bybitSpotBlackList", bybitSpotBlackList.length);

  if (coinType === "perp") {
    binanceCoins = binanceCoins.filter(
      (coin) => !binancePerpBlackList.includes(coin.symbol)
    );
    bybitCoins = bybitCoins.filter(
      (coin) => !bybitPerpBlackList.includes(coin.symbol)
    );
  } else if (coinType === "spot") {
    binanceCoins = binanceCoins.filter(
      (coin) => !binanceSpotBlackList.includes(coin.symbol)
    );
    bybitCoins = bybitCoins.filter(
      (coin) => !bybitSpotBlackList.includes(coin.symbol)
    );
  } else {
    throw new Error(
      `Invalid coinType: '${coinType}'. Only 'perp' or 'spot' allowed.`
    );
  }

  console.log("filteredCoins binanceCoins", binanceCoins.length);
  console.log("filteredCoins bybitCoins", bybitCoins.length);

  return { binanceCoins, bybitCoins };
};

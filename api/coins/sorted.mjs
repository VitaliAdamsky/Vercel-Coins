import { validateRequestParams } from "../../functions/utility/validators/validate-request-params.mjs";
import { filterCoinsByDominaceCoinsFromRedis } from "../../functions/coins/filter-coins-by-dominance.mjs";
import { filterCoinsAgainstBlackList } from "../../functions/coins/filter-coins-against-black-list.mjs";

export const config = {
  runtime: "edge",
  regions: ["fra1"],
};

// THIS SCRIPT BRINGS DATA FROM REDIS AND RETURNS IT TO THE CLIENT

export default async function handler(request) {
  try {
    const params = validateRequestParams(request.url);

    // 1. Validate and return early if there's an error
    if (params instanceof Response) {
      return params;
    }

    const { coinType, dominant } = params;

    // Fetch coins filtered by dominance
    const { binanceCoins, bybitCoins } =
      await filterCoinsByDominaceCoinsFromRedis(dominant);

    const {
      binanceCoins: filteredBinanceCoins,
      bybitCoins: filteredBybitCoins,
    } = await filterCoinsAgainstBlackList(coinType, {
      binanceCoins,
      bybitCoins,
    });

    return new Response(
      JSON.stringify({
        binanceCoins: filteredBinanceCoins,
        bybitCoins: filteredBybitCoins,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

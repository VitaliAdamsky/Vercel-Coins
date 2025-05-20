import { dataKeys } from "../../functions/utility/redis/data-keys.mjs";
import { exchanges } from "../../functions/coins/exchanges.mjs";
import { validateRequestParams } from "../../functions/utility/validators/validate-request-params.mjs";
import { addFailedSymbols } from "../../functions/coins/add-failed-symbols.mjs";

export const config = {
  runtime: "edge",
  regions: ["fra1"],
};

export default async function handler(request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const params = validateRequestParams(request.url);

    // Validate and return early if there's an error
    if (params instanceof Response) {
      return params;
    }

    const { coinType, exchange } = params;
    const body = await request.json(); // Parse incoming JSON body

    if (!Array.isArray(body)) {
      return new Response(
        JSON.stringify({
          error: "Invalid data format. Expected an array of symbols.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let dataKey;
    if (coinType === "perp") {
      dataKey =
        exchange === exchanges.Binance
          ? dataKeys.failedBinancePerpSymbols
          : dataKeys.failedBybitPerpSymbols;
    } else {
      dataKey =
        exchange === exchanges.Binance
          ? dataKeys.failedBinanceSpotSymbols
          : dataKeys.failedBybitSpotSymbols;
    }

    await addFailedSymbols(dataKey, body); // Save it to Redis

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
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

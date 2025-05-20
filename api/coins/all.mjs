import { dataKeys } from "../../functions/utility/redis/data-keys.mjs";
import { getDataFromRedis } from "../../functions/utility/redis/get-data-from-redis.mjs";

export const config = {
  runtime: "edge",
  regions: ["fra1"],
};

export default async function handler(request) {
  try {
    const coins = await getDataFromRedis(dataKeys.coins);

    return new Response(JSON.stringify({ coins: coins }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

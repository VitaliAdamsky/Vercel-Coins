import { setDataInRedis } from "../../functions/utility/redis/set-data-in-redis.mjs";
import { dataKeys } from "../../functions/utility/redis/data-keys.mjs";

export const config = {
  runtime: "edge",
  regions: ["fra1"],
};

export default async function handler(request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await request.json(); // Parse incoming JSON body

    // Optionally: validate the structure of `body` here
    await setDataInRedis(dataKeys.blacklist, body); // Save it to Redis

    return new Response(JSON.stringify({ success: true, data: body }), {
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

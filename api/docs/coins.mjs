export const config = {
  runtime: "edge",
  regions: ["fra1"],
};

export default async function handler(request) {
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const file = await fetch(`${baseUrl}/coins.txt`);

    if (!file.ok) {
      throw new Error("File not found or unreadable");
    }

    const content = await file.text();

    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": 'attachment; filename="coins.txt"',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

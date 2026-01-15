import type { Handler, HandlerResponse } from "@netlify/functions";

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  const commonHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const backendUrl = "http://18.204.48.100:8080/generate/names";

    const body = event.body ? JSON.parse(event.body) : {};

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    return {
      statusCode: res.status,
      headers: {
        ...commonHeaders,
        // backend agar json nahi bhej raha, to bhi safe:
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: commonHeaders,
      body: JSON.stringify({
        error: "Proxy failed",
        details: String(err),
      }),
    };
  }
};

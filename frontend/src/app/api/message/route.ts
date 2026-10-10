import { connection } from "next/server";

export async function GET() {
  // Keep BACKEND_URL and the request at runtime, including during production builds.
  await connection();

  try {
    const url = new URL(
      "/api/message",
      process.env.BACKEND_URL || "http://127.0.0.1:8000",
    );
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error("The Python API returned an error.");

    const data: unknown = await response.json();
    if (
      typeof data !== "object" ||
      data === null ||
      !("message" in data) ||
      typeof data.message !== "string"
    ) {
      throw new Error("The Python API returned an invalid message.");
    }

    return Response.json(
      { message: data.message },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "The Python API is unavailable. Please try again." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

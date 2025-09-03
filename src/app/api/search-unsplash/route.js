import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

  if (!UNSPLASH_ACCESS_KEY) {
    return NextResponse.json(
      { error: "Unsplash API key not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=12&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Unsplash API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Unsplash images" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "This endpoint moved to /api/v1/links",
      documentation: "/docs",
    },
    {
      status: 308,
      headers: { Location: "/api/v1/links" },
    },
  );
}

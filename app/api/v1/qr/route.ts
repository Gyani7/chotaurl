import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  url: z.url(),
  size: z.coerce.number().int().min(128).max(2048).default(512),
  format: z.enum(["svg", "png"]).default("svg"),
});

export async function GET(request: Request) {
  const parsed = querySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams.entries()),
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid QR code request" }, { status: 400 });
  }

  const { url, size, format } = parsed.data;
  if (format === "svg") {
    const svg = await QRCode.toString(url, {
      type: "svg",
      width: size,
      margin: 2,
      color: { dark: "#111318", light: "#ffffff" },
    });
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const png = await QRCode.toBuffer(url, {
    type: "png",
    width: size,
    margin: 2,
  });
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

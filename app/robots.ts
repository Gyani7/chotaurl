import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://chotaurl.pro";
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/docs"],
      disallow: ["/dashboard", "/admin", "/api", "/invite", "/unlock"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

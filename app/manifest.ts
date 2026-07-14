import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ChotaURL",
    short_name: "ChotaURL",
    description: "Premium link infrastructure, free forever.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#07080b",
    theme_color: "#92eb28",
    icons: [],
  };
}

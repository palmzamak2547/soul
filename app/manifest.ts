import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SOUL — Digital Memory Platform",
    short_name: "SOUL",
    description: "A card you tap. A lifetime you unlock.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffafb",
    theme_color: "#e91e63",
    lang: "th",
  };
}

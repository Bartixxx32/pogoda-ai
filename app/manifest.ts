import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prognoza Pogody",
    short_name: "Pogoda",
    description: "Aplikacja pogodowa z prognozą na 3 dni",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    orientation: "portrait",
    icons: [
      {
        src: "https://placehold.co/192x192/3b82f6/FFFFFF.png?text=Weather",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "https://placehold.co/512x512/3b82f6/FFFFFF.png?text=Weather",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "https://placehold.co/192x192/3b82f6/FFFFFF.png?text=W",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "https://placehold.co/512x512/3b82f6/FFFFFF.png?text=W",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}


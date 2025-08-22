import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: process.env.NEXT_PUBLIC_PRODUCTION_URL },
    { url: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/form` },
    { url: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/feedback` },
    { url: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/privacy-policy` },
    { url: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/terms-of-service` },
  ]
}

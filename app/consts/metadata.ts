import type { Metadata, Viewport } from "next"
import { businessInfo } from "./businessInfo"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

const city = businessInfo.address.city
const county = businessInfo.address.county
const servicesPreview = businessInfo.primaryServices.slice(0, 4).join(", ")
const years = businessInfo.yearsInBusiness
const guarantee = businessInfo.yearsOfGuarantee

export const siteMetadata: Metadata = {
  metadataBase: new URL(businessInfo.websiteUrl),
  title: {
    template: `%s | ${businessInfo.name} - Professional Autodetailing in ${city}`,
    default: `${businessInfo.name} - Expert Autodetailing & Ceramic Coatings in ${city} | ${years} year${years > 1 ? "s" : ""} experience`,
  },
  description: `${businessInfo.name} provides professional autodetailing services in ${city}, specialising in ${businessInfo.primaryServices.join(
    ", ",
  )}. ${years} year${years > 1 ? "s" : ""} in business with a ${guarantee}-year satisfaction guarantee. Mobile valets, drop-off details, machine polishing and ceramic protection across ${county}.`,
  keywords: [
    `autodetailing ${city}`,
    `car valeting ${city}`,
    `ceramic coating ${county}`,
    "car detailing near me",
    "mobile car valet",
    "machine polish",
    "interior car detailing",
    "exterior car wash",
    "ceramic protection",
    "car detailing prices",
    businessInfo.email,
  ].join(", "),
  authors: [{ name: `${businessInfo.name} Team`, url: businessInfo.instagramUrl }],
  generator: "Next.js",
  applicationName: businessInfo.name,
  referrer: "origin-when-cross-origin",
  creator: `${businessInfo.name} Team`,
  publisher: businessInfo.name,
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  category: "Auto Detailing",
  openGraph: {
    type: "website",
    locale: "en_GB",
    title: `${businessInfo.name} - Autodetailing & Ceramic Coatings in ${city} | ${years} year${years > 1 ? "s" : ""} experience`,
    description: `${businessInfo.name} delivers premium ${servicesPreview} and more across ${county}. Mobile valets, full detail packages, and industry-standard ceramic coatings backed by a ${guarantee}-year satisfaction guarantee.`,
    url: businessInfo.websiteUrl,
    siteName: businessInfo.name,
    images: [
      {
        url: businessInfo.logoUrl,
        width: 1200,
        height: 630,
        alt: `${businessInfo.name} - Autodetailing Services`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${businessInfo.name} - Autodetailing & Ceramic Coatings in ${city}`,
    description: `Trusted autodetailing specialists in ${city}. Services include ${servicesPreview} and more. ${guarantee}-year satisfaction guarantee. Call: ${businessInfo.phone}`,
    images: [
      {
        url: businessInfo.logoUrl,
        alt: `${businessInfo.name} - Autodetailing Services`,
      },
    ],
  },
  alternates: {
    canonical: businessInfo.websiteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

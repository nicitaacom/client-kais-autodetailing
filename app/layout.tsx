import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import SchemaOrgScript from "@/components/SchemaOrgScript"
import { siteMetadata } from "./consts/metadata"

// Use variable fonts for better performance
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

// Export metadata from the separate file
export const metadata: Metadata = siteMetadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" type="image/png" sizes="180x180" />
      </head>
      <body className={inter.className}>
        {children}
        <SchemaOrgScript />
      </body>
    </html>
  )
}

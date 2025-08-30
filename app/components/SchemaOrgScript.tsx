import Script from "next/script"
import { businessInfo } from "@/consts/businessInfo"

const SchemaOrgScript = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "AutoDetailing", // ✅ correct type for detailing businesses
    name: businessInfo.name,
    image: businessInfo.logoUrl,
    url: businessInfo.websiteUrl,
    telephone: businessInfo.phone,
    email: businessInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessInfo.address,
      addressLocality: businessInfo.address.city,
      addressRegion: businessInfo.address.county,
      postalCode: businessInfo.address.postalCode,
      addressCountry: businessInfo.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: businessInfo.coordinates.latitude,
      longitude: businessInfo.coordinates.longitude,
    },
    openingHoursSpecification: Object.entries(businessInfo.businessHours).map(([day, hours]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [day.charAt(0).toUpperCase() + day.slice(1)], // Monday, Tuesday...
      opens: hours.opens,
      closes: hours.closes,
    })),
    sameAs: [businessInfo.instagramUrl, businessInfo.facebookUrl],
    priceRange: businessInfo.priceRange,
    areaServed: businessInfo.areasServed,
    description: `${businessInfo.name} provides expert autodetailing services including ceramic coatings, full valeting, interior & exterior detailing, and premium car washes. With ${businessInfo.yearsInBusiness}+ years in business, we offer a ${businessInfo.yearsOfGuarantee}-year guarantee for lasting results.`,
    foundingDate: businessInfo.foundingYear,
    founders: businessInfo.founders.map(founder => ({ "@type": "Person", name: founder })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Autodetailing Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Ceramic Coating",
            description: "Long-lasting ceramic paint protection with hydrophobic properties",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Full Valeting",
            description: "Comprehensive interior and exterior valet for a showroom finish",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Car Wash & Quick Detailing",
            description: "Fast, effective car wash and maintenance detailing packages",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Interior Deep Clean",
            description: "Professional upholstery, carpets, and dashboard cleaning",
          },
        },
      ],
    },
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: businessInfo.rating.average.toString(),
        bestRating: businessInfo.rating.max.toString(),
      },
      author: {
        "@type": "Person",
        name: "Local Customer",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: businessInfo.rating.average.toString(),
      ratingCount: businessInfo.rating.count.toString(),
      bestRating: businessInfo.rating.max.toString(),
    },
  }

  return (
    <Script
      id="schema-auto-detailing"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}

export default SchemaOrgScript

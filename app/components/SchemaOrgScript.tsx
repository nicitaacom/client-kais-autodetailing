import Script from "next/script"
import { businessInfo } from "@/consts/businessInfo"
import { consts } from "@/consts/consts"

interface BusinessHours {
  [key: string]: { opens: string; closes: string } | null
}

const SchemaOrgScript = () => {
  // 1. Define day order for sorting
  const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

  // 2. Group valid hours by identical opening/closing times
  const groupedHours = Object.entries(businessInfo.businessHours as BusinessHours).reduce(
    (acc: Record<string, string[]>, [day, hours]) => {
      if (hours) {
        const key = `${hours.opens}-${hours.closes}`
        acc[key] = acc[key] ? [...acc[key], day] : [day]
      }
      return acc
    },
    {},
  )

  // 3. Create opening hours specifications from groups
  const openingHoursSpecification = Object.entries(groupedHours).map(([key, days]) => {
    const sortedDays = days.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
    const [opens, closes] = key.split("-")
    return {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: sortedDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)),
      opens,
      closes,
    }
  })

  // 4. Format areaServed as array of AdministrativeArea
  const areaServed = businessInfo.areasServed.map(area => ({
    "@type": "AdministrativeArea",
    name: area,
  }))

  // 5. Create review array from consts.reviews with ISO date formatting
  const reviews = consts.reviews.map(review => {
    const [day, month, year] = review.date.split(".")
    const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    return {
      "@type": "Review",
      reviewBody: review.reviewMessage,
      datePublished: isoDate,
      author: { "@type": "Person", name: review.username },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.amountOfStars.toString(),
        bestRating: businessInfo.rating.max.toString(),
      },
    }
  })

  // 6. Create offer catalog from primaryServices
  const hasOfferCatalog = {
    "@type": "OfferCatalog",
    name: "Auto Detailing Services",
    itemListElement: businessInfo.primaryServices.map(service => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: `Includes: ${service.includes.join(", ")}`,
      },
    })),
  }

  // 7. Generate dynamic description with sections from businessInfo and consts
  const primaryServiceNames = consts.ourServices.map(s => s.serviceName.toLowerCase()).join(", ")
  const servicesText = `Expert car detailing services in ${businessInfo.address.city}, including ${primaryServiceNames}.`
  const guaranteeText = businessInfo.yearsOfGuarantee
    ? `Backed by a ${businessInfo.yearsOfGuarantee}-year ${consts.notificationBarOffer.toLowerCase()}.`
    : ""
  const weServeText = `Serving ${businessInfo.areasServed.length} areas across ${businessInfo.address.county} with ${businessInfo.yearsInBusiness}+ years in business.`
  const description = [businessInfo.name, servicesText, guaranteeText, weServeText].filter(Boolean).join("\n")

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    name: businessInfo.name,
    image: businessInfo.logoUrl,
    url: businessInfo.websiteUrl,
    telephone: businessInfo.phone,
    email: businessInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessInfo.address.street,
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
    openingHoursSpecification,
    sameAs: [businessInfo.instagramUrl, businessInfo.facebookUrl, businessInfo.yellPagesUrl].filter(url => url),
    priceRange: businessInfo.priceRange,
    areaServed,
    description,
    foundingDate: businessInfo.foundingYear.toString(),
    founder: businessInfo.founders.map(founder => ({ "@type": "Person", name: founder })),
    hasOfferCatalog,
    review: reviews,
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

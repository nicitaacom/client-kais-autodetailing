// 1. Core business data used across the app (contact, hours, location, rating)
export const businessInfo = {
  name: "Kai's Enhancements",
  yearsInBusiness: 1, // numeric for easy usage in UI
  yearsOfGuarantee: 1, // satisfaction guarantee in years
  phone: "+44 7765 441559",
  email: "14enhancements@gmail.com",
  websiteUrl: "https://kais-autodetailing.com",
  yellPagesUrl: "",
  logoUrl: "https://i.imgur.com/1HY8d2x.jpeg",
  cta: "get free quote",

  // 2. Location / map
  address: {
    street: "135 Deansfield Road",
    city: "Wolverhampton",
    county: "West Midlands",
    postalCode: "WV1 2JZ",
    country: "United Kingdom",
  },
  coordinates: { latitude: 52.5914, longitude: -2.11 },
  mapUrl:
    // TODO - update google maps url
    "",

  // 3. Hours & service area
  businessHours: {
    monday: { opens: "06:00", closes: "20:00" },
    tuesday: { opens: "06:00", closes: "20:00" },
    wednesday: { opens: "06:00", closes: "20:00" },
    thursday: { opens: "06:00", closes: "20:00" },
    friday: { opens: "06:00", closes: "20:00" },
    saturday: { opens: "06:00", closes: "20:00" },
    sunday: { opens: "06:00", closes: "20:00" },
  },
  areasServed: ["West Midlands"],

  // 4. High-level services (used for meta / schema)
  primaryServices: [
    {
      name: "Full Detail (Mobile)",
      includes: [
        "Exterior wash",
        "Wax",
        "Wheel & tyre clean",
        "Vacuum (seats, carpets, trunk)",
        "Dashboard & console clean",
        "Glass inside & outside",
        "Light polish",
      ],
    },
    {
      name: "Full Detail (Drop-off)",
      includes: [
        "Exterior wash",
        "Wax",
        "Wheel & tyre clean",
        "Vacuum (seats, carpets, trunk)",
        "Dashboard & console clean",
        "Interior glass",
        "Machine polish",
      ],
    },
    {
      name: "Interior Detail",
      includes: [
        "Vacuum (seats, carpets, trunk)",
        "Carpet & upholstery shampoo",
        "Leather conditioning",
        "Dashboard & console clean",
        "Trim & buttons detail",
        "Glass inside",
      ],
    },
    {
      name: "Exterior Detail",
      includes: ["Exterior wash", "Clay bar", "Wax", "Wheel & tyre clean", "Glass outside"],
    },
    {
      name: "Machine Polish",
      includes: ["Exterior wash", "Clay bar", "Machine polish", "Gloss enhancement", "Sealant"],
    },
    {
      name: "Ceramic Coating & Protection",
      includes: ["Exterior wash", "Clay bar", "Machine polish", "Ceramic coating"],
    },
  ],

  // 5. socials & business meta
  facebookUrl: "https://www.facebook.com/share/1J3z4nNCTr/",
  instagramUrl: "https://www.instagram.com/kais.enhancements?igsh=MWl1ZjVoaWY2MnNqdQ==",
  foundingYear: 2024,
  founders: ["Kairo"],
  priceRange: "££",
  guarantee: "Satisfaction Guarantee - If you’re not 100% satisfied, I’ll make it right before you leave.",

  // 6. Rating info (numbers, ready for structured data)
  rating: {
    average: 5,
    count: 25,
    googleMaps: 5,
    yelp: 5,
    max: 5,
  },
}

// 1. Core business data used across the app (contact, hours, location, rating)
export const businessInfo = {
  name: "Kai's Enhancements",
  yearsInBusiness: 1, // numeric for easy usage in UI
  yearsOfGuarantee: 1, // satisfaction guarantee in years
  phone: "+44 7765 441559",
  timezone: "Europe/London",
  email: "14enhancements@gmail.com",
  websiteUrl: "https://kais-autodetailing.com",
  logoUrl: "/logo.jpeg",
  cta: "Get free quote",

  // 2. Location / map
  address: {
    street: "135 Deansfield Road",
    city: "Wolverhampton",
    county: "West Midlands",
    postalCode: "WV1 2JZ",
    country: "United Kingdom",
  },
  coordinates: { latitude: 52.5914, longitude: -2.11 },
  mapUrl: "",

  areasServed: ["West Midlands"],

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

  // 5. socials & business meta
  yellPagesUrl: "",
  facebookUrl: "https://www.facebook.com/share/1J3z4nNCTr/",
  instagramUrl: "https://www.instagram.com/kais.enhancements?igsh=MWl1ZjVoaWY2MnNqdQ==",
  foundingYear: 2024,
  founders: ["Kairo"],
  priceRange: "££",
  guarantee: "Satisfaction Guarantee - If you’re not 100% satisfied, I’ll make it right before you leave.",

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

  // 6. Rating info (numbers, ready for structured data)
  rating: {
    average: 5,
    count: 25,
    googleMaps: 5,
    yelp: 5,
    max: 5,
  },
}

/*


when client book an appointment with you where would you like to receive notification?
Email or SMS?

Answer: Email

-------------------------------

when client fills out "Contact us" form where would you like to receive notification?
Email or SMS?

Answer: Email


-------------------------------

 what style/design would you like to be on your website?
 for example we I did 1 website for client in ghost style for other client in black and purple minimalistic design
 so maybe you have some assotiation with your business? like maybe some your favorite animal or favorite number?
 or maybe you saw website somewhere and you want something similar

take some impression from here: (use search)
https://dribbble.com/
https://mobbin.com/discover/sites/latest
https://iwash-uk.booking.getautomate.io/packages?category=635b521f7cadec879afcd6988154e99b


Answer: same


-------------------------------


what colours would you like on your website? e.g red&black

Answer: red&black



-------------------------------


what fetures would you like to see on your website? e.g repuration-management + appointment-booking + before-after images

Answer: appointment-booking - repuration-management - before-after images




-------------------------------

are you providing 24/7 service?
e.g emergency call

Answer: 

If yes - remove that "Need 24/7?" from footer


-------------------------------


should I add some additional section with examples of your work or should I keep it as is?

Answer: 
*/

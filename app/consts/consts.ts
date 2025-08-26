// 1. UI constants that reference businessInfo to avoid duplication
import { businessInfo } from "./businessInfo"

export const consts = {
  // 1. small derived values for UI (no duplicates — derive from businessInfo)
  yoe: businessInfo.yearsInBusiness,
  yog: businessInfo.yearsOfGuarantee,
  notificationBarOffer: `Satisfaction guarantee — ${businessInfo.yearsOfGuarantee} year${businessInfo.yearsOfGuarantee > 1 ? "s" : ""}`,

  // 2. map + socials (re-using references is OK)
  mapUrl: businessInfo.mapUrl,
  social: { facebook: businessInfo.facebookUrl, instagram: businessInfo.instagramUrl },

  // 3. Services (images + labels) for listing cards / grid
  ourServices: [
    { imgUrl: "/services/img-1.jpg", serviceName: "Full Detail (Mobile) - £75" },
    { imgUrl: "/services/img-2.jpg", serviceName: "Full Detail (Drop-off) - £70" },
    { imgUrl: "/services/img-3.jpg", serviceName: "Interior Detail (Mobile or Drop-off) - £50" },
    { imgUrl: "/services/img-4.jpg", serviceName: "Exterior Detail (Drop-off) - £35" },
    { imgUrl: "/services/img-5.jpg", serviceName: "Exterior Detail (Mobile) - £40" },
    {
      imgUrl: "/services/img-6.jpg",
      serviceName: "Full Detail + Machine Polish + Ceramic Protection - £175",
    },
  ],

  // 4. Reviews (UI-ready)
  reviews: [
    {
      usrAvatarUrl: "/reviews/A-red.png",
      username: "James Turner",
      date: "12.05.2025",
      reviewMessage:
        "Absolutely transformed my car inside and out! The ceramic coating looks unreal - water just beads right off. Highly recommend!",
      amountOfStars: 5,
    },
    {
      usrAvatarUrl: "/reviews/D-green.png",
      username: "Hannah Brooks",
      date: "05.03.2025",
      reviewMessage:
        "Booked a mobile valet - on time, professional, and my car looks like new again. Great value for money.",
      amountOfStars: 5,
    },
    {
      usrAvatarUrl: "/reviews/Chloe-Stanley.png",
      username: "Chloe Stanley",
      date: "19.03.2025",
      reviewMessage: "Super friendly service and amazing results. My seats look spotless now!",
      amountOfStars: 5,
    },
    {
      usrAvatarUrl: "/reviews/L-blue.png",
      username: "Liam Harwood",
      date: "17.02.2025",
      reviewMessage: "Fast, detailed, and really thorough. Will definitely book again.",
      amountOfStars: 5,
    },
    {
      usrAvatarUrl: "/reviews/Tom-Jackson.png",
      username: "Tom Jackson",
      date: "15.02.2025",
      reviewMessage: "Great job with the exterior polish - my car shines better than showroom finish.",
      amountOfStars: 5,
    },
  ],

  // 5. How-we-work tabs (flow steps used on services pages)
  howWeWorkTabs: [
    {
      text: "Full Detail",
      iconSrc: "/how-do-we-work/tabs/magic.png",
      steps: [
        {
          iconSrc: "/how-do-we-work/check.png",
          title: "Initial Check",
          description: "We inspect your vehicle and note down areas needing special attention.",
        },
        {
          iconSrc: "/how-do-we-work/exterior-wash.png",
          title: "Exterior Wash",
          description: "Thorough safe wash, including wheels and arches.",
        },
        {
          iconSrc: "/how-do-we-work/interior-detail.png",
          title: "Interior Clean",
          description: "Deep clean carpets, seats, plastics and vents.",
        },
        {
          iconSrc: "/how-do-we-work/polish-icon.png",
          title: "Polish & Finish",
          description: "Polish paintwork and dress trims for a showroom finish.",
        },
        {
          iconSrc: "/how-do-we-work/100.png",
          title: "Final Walkthrough",
          description: "We review the detail with you to ensure you’re 100% satisfied.",
        },
      ],
    },
    {
      text: "Ceramic Coating",
      iconSrc: "/how-do-we-work/tabs/ceramic-coating-icon.png",
      steps: [
        {
          iconSrc: "/how-do-we-work/decontamination.png",
          title: "Decontamination",
          description: "Full decontamination wash including clay bar treatment.",
        },
        {
          iconSrc: "/how-do-we-work/paint-correction.png",
          title: "Paint Correction",
          description: "Single or multi-stage machine polish to remove swirls & defects.",
        },
        {
          iconSrc: "/how-do-we-work/shield.png",
          title: "Apply Ceramic",
          description: "Layer ceramic coating for deep gloss & hydrophobic protection.",
        },
        {
          iconSrc: "/how-do-we-work/time.png",
          title: "Curing Time",
          description: "Allow coating to bond and cure properly for long-lasting results.",
        },
        {
          iconSrc: "/how-do-we-work/finish.png",
          title: "Inspection",
          description: "Check every panel for flawless finish.",
        },
      ],
    },
    {
      text: "Interior Detail",
      iconSrc: "/how-do-we-work/tabs/interior-detail.png",
      steps: [
        {
          iconSrc: "/how-do-we-work/vacuum.png",
          title: "Vacuum",
          description: "Thorough vacuum for carpets, mats, and seats — every crumb gone.",
        },
        {
          iconSrc: "/how-do-we-work/shampoo.png",
          title: "Shampoo & Extraction",
          description: "Stubborn stains and odours lifted with deep shampoo & hot-water extraction.",
        },
        {
          iconSrc: "/how-do-we-work/streeing-wheel.png",
          title: "Leather Care",
          description: "Leather seats and trims cleansed, conditioned, and revived.",
        },
        {
          iconSrc: "/how-do-we-work/vents.png",
          title: "Detailing",
          description: "Dashboard, vents, and hidden crevices cleaned with precision.",
        },
        {
          iconSrc: "/how-do-we-work/perfection.png",
          title: "Final Touches",
          description: "Air freshener and presentation check for absolute perfection.",
        },
      ],
    },
  ],
}

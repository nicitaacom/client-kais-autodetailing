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
    { imgUrl: "/services/full-detail-mobile.jpg", serviceName: "Full Detail (Mobile) - £75" },
    { imgUrl: "/services/full-detail-dropoff.jpg", serviceName: "Full Detail (Drop-off) - £70" },
    { imgUrl: "/services/interior-detail.jpg", serviceName: "Interior Detail (Mobile or Drop-off) - £50" },
    { imgUrl: "/services/exterior-detail-dropoff.jpg", serviceName: "Exterior Detail (Drop-off) - £35" },
    { imgUrl: "/services/exterior-detail-mobile.jpg", serviceName: "Exterior Detail (Mobile) - £40" },
    { imgUrl: "/services/exterior-polish.jpg", serviceName: "Exterior Detail + Machine Polish - £135" },
    {
      imgUrl: "/services/full-detail-ceramic.jpg",
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
      reviewMessage: "Great job with the exterior polish – my car shines better than showroom finish.",
      amountOfStars: 5,
    },
  ],

  // 5. How-we-work tabs (flow steps used on services pages)
  howWeWorkTabs: [
    {
      text: "Full Detail",
      iconSrc: "/how-do-we-work/tabs/full-detail.png",
      steps: [
        {
          iconSrc: "/how-do-we-work/inspect.png",
          title: "Initial Check",
          description: "We inspect your vehicle and note down areas needing special attention.",
        },
        {
          iconSrc: "/how-do-we-work/exterior.png",
          title: "Exterior Wash",
          description: "Thorough safe wash, including wheels and arches.",
        },
        {
          iconSrc: "/how-do-we-work/interior.png",
          title: "Interior Clean",
          description: "Deep clean carpets, seats, plastics and vents.",
        },
        {
          iconSrc: "/how-do-we-work/polish.png",
          title: "Polish & Finish",
          description: "Polish paintwork and dress trims for a showroom finish.",
        },
        {
          iconSrc: "/how-do-we-work/final.png",
          title: "Final Walkthrough",
          description: "We review the detail with you to ensure you’re 100% satisfied.",
        },
      ],
    },
    {
      text: "Ceramic Coating",
      iconSrc: "/how-do-we-work/tabs/ceramic.png",
      steps: [
        {
          iconSrc: "/how-do-we-work/decontaminate.png",
          title: "Decontamination",
          description: "Full decontamination wash including clay bar treatment.",
        },
        {
          iconSrc: "/how-do-we-work/polish.png",
          title: "Paint Correction",
          description: "Single or multi-stage machine polish to remove swirls & defects.",
        },
        {
          iconSrc: "/how-do-we-work/apply.png",
          title: "Apply Ceramic",
          description: "Layer ceramic coating for deep gloss & hydrophobic protection.",
        },
        {
          iconSrc: "/how-do-we-work/cure.png",
          title: "Curing Time",
          description: "Allow coating to bond and cure properly for long-lasting results.",
        },
        {
          iconSrc: "/how-do-we-work/final.png",
          title: "Inspection",
          description: "Check every panel for flawless finish.",
        },
      ],
    },
    {
      text: "Interior Detail",
      iconSrc: "/how-do-we-work/tabs/interior.png",
      steps: [
        {
          iconSrc: "/how-do-we-work/vacuum.png",
          title: "Vacuum",
          description: "Deep vacuum of carpets, mats, and seats.",
        },
        {
          iconSrc: "/how-do-we-work/shampoo.png",
          title: "Shampoo & Extraction",
          description: "Remove stains and odours with fabric shampoo and extraction.",
        },
        {
          iconSrc: "/how-do-we-work/leather.png",
          title: "Leather Care",
          description: "Clean and condition leather seats and trims.",
        },
        {
          iconSrc: "/how-do-we-work/dashboard.png",
          title: "Detailing",
          description: "Clean vents, dashboard, and crevices with precision.",
        },
        {
          iconSrc: "/how-do-we-work/final.png",
          title: "Final Touches",
          description: "Air freshener and presentation check before handover.",
        },
      ],
    },
  ],
}

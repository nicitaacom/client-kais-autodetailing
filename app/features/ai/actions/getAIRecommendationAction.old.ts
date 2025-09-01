"use server"

import { businessInfo } from "@/consts/businessInfo"
import openai from "@/libs/openai"

export async function getAIRecommendationAction(
  carModel: string,
  userNeeds: string,
): Promise<{ recommendation: string } | string> {
  try {
    if (!carModel || !userNeeds) return "Car model and user needs are required"
    console.log(12, "userNeeds - ", userNeeds)

    // 1. System prompt: expert UK car-detailing advisor
    const systemContent = `You are an expert UK car-detailing advisor. Be conversational, friendly, and helpful. 
  Write like you're talking to a customer in person - natural and easy to read.`

    // 2. User prompt: natural conversational output
    const userContent = `Car: ${carModel}
  Needs: ${userNeeds}



  EXAMPLES:
  - "I just want to make it as new" → CLARIFICATION
  - "make it new inside and outside" → provide recommendation based on Primary services
  - "clean exterior only" - recommend EXTERIOR ONLY
  - "what is your inst?" - provide instagram url
  - "when can I call you?" - provide business hours in human readable format

  RESPONSE FORMAT (for FULL SERVICE):
  <p>For your ${carModel}, I recommend a [your recommendation based on primary services] - here's why:</p>
  <p>Since you want to focus on [their focus e.g "interior only"], I would recommend :</p>

  Then follow this structure
  
  <h3 class="text-danger font-bold text-lg tablet:text-xl mb-3 tablet:mb-4">[e.g Exterior] services:</h3>
  <div class="mb-6 tablet:mb-8">
    <p class="mb-3 text-foreground"><strong class="block tablet:inline">• Wash</strong><span class="block tablet:inline tablet:ml-1 tablet:before:content-['-']">removes dirt and grime</span></p>
    <p class="mb-3 text-foreground"><strong class="block tablet:inline">• Ceramic coating</strong><span class="block tablet:inline tablet:ml-1 tablet:before:content-['-']">long-lasting protection</span></p>
    // add more services here if needed (if you are not sure then as user if they want [BENEFIT] from [primary service e.g Ceramic coating])  
  </div>
  
  CLARIFICATION RESPONSE:
  <p class="text-foreground"><em>Do you want to focus on making it new outside only? Or should we make it as new inside as well?</em></p>
  
  If user already provided enough data then after your recommendation ask:
  <p class="text-foreground"><em>Do you want to book based on my recommendations or would you like to add/remove something?</em></p>

  Business info and FAQ:
    Name: ${businessInfo.name}
    Years in business: ${businessInfo.yearsInBusiness}
    Guarantee: ${businessInfo.guarantee}
    Phone: ${businessInfo.phone}
    Email: ${businessInfo.email}
    Website: ${businessInfo.websiteUrl}
    Address: ${businessInfo.address.street}, ${businessInfo.address.city}, ${businessInfo.address.county}, 
    ${businessInfo.address.postalCode}, ${businessInfo.address.country}
    Opens: ${businessInfo.businessHours.monday.opens}
    Closes: ${businessInfo.businessHours.monday.closes}
    Areas served: ${businessInfo.areasServed.join(", ")}
    Primary services: ${businessInfo.primaryServices.join(", ")}
    Rating: ${businessInfo.rating.average} (${businessInfo.rating.count} reviews)
    Price range: ${businessInfo.priceRange}
    Founders: ${businessInfo.founders.join(", ")}
    Founding year: ${businessInfo.foundingYear}
    Facebook: ${businessInfo.facebookUrl}
    Instagram: ${businessInfo.instagramUrl}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: userContent },
      ],
      max_tokens: 720,
      temperature: 0.4,
    })

    const recommendation = completion.choices?.[0]?.message?.content?.trim()
    if (!recommendation) return "Failed to generate recommendation"
    console.log(98, "recommendation - ", recommendation)
    return { recommendation }
  } catch (error) {
    console.error("AI recommendation error:", error)
    return "Internal server error"
  }
}

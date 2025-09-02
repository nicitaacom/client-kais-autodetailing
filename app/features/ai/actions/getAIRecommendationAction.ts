"use server"

import { businessInfo } from "@/consts/businessInfo"
import openai from "@/libs/openai"

export async function getAIRecommendationAction(
  carModel: string,
  userNeeds: string,
): Promise<{ recommendation: string } | string> {
  try {
    if (!carModel || !userNeeds) return "Car model and user needs are required"

    // 1. System prompt: expert UK car-detailing advisor
    const systemContent = `You are an expert UK car-detailing advisor. Be conversational, friendly, and helpful. 

1. reply with html but without \`\`\`html
2. if user ask about something from FAQ - send a link or reply shortly
3. if user don't specify details in needs e.g inside or outside - ask about it
   Example 1:
   Needs: I just want to make it as new
   Response:
<h3 class="text-danger font-bold text-lg tablet:text-xl">Let's clarify it:</h3>
<div class="mb-6">
<span class="block tablet:inline tablet:ml-1 tablet:before:content-['-']">do you want to make it as new inside or outside as well?</span>
</div>
   Example 2:
   Needs: I just want to make it as new. Inside and I'm not sure about outside.
   Response:
<h3 class="text-danger font-bold text-lg tablet:text-xl">Let's clarify it:</h3>
<div class="mb-6">
<span class="block tablet:inline tablet:ml-1 tablet:before:content-['-']">I already like that you know that you want to make it inside as new.</span>
<span class="block tablet:inline tablet:ml-1 tablet:before:content-['-']">But maybe you can share a bit more details about your car [inside or outside (in this case right is "outside" because user specified inside)] so I understand it better?</span>
</div>
4. Once user specified his needs (inside or outside or both) then you reply based on user needs
   Needs: I just want to make it as new. Inside
   Response:
<div class="flex flex-col gap-y-4 mt-4">
  <h3 class="text-danger font-bold text-lg tablet:text-xl mb-3 tablet:mb-4">Interior services:</h3>
  <div class="flex flex-col">
    <strong class="text-brand block tablet:inline">• Vacuum</strong>
    <span class="block tablet:inline tablet:ml-1 tablet:before:content-['-']">
      removes dirt, dust and grime from seats, carpets, trunk, dashboard
    </span>
  </div>
  <div class="flex flex-col">
    <strong class="text-brand block tablet:inline">• Carpet &amp; upholstery shampoo</strong>
    <span class="block tablet:inline tablet:ml-1 tablet:before:content-['-']">
      [include benefits of this]
    </span>
  </div>
  <!-- continue with what it includes and benefits of it -->
</div>
<p style="margin-top:16px">
  <em>Do you want to book based on my recommendations or would you like to add/remove something?</em>
</p>

Business info and FAQ:
Name: ${businessInfo.name}
Years in business: ${businessInfo.yearsInBusiness}
Guarantee: ${businessInfo.guarantee}
Phone: ${businessInfo.phone}
Email: ${businessInfo.email}
Website: ${businessInfo.websiteUrl}
Address: ${businessInfo.address.street}, ${businessInfo.address.city}, ${businessInfo.address.county}, ${businessInfo.address.postalCode}, ${businessInfo.address.country}
Opens: ${businessInfo.businessHours.monday.opens}
Closes: ${businessInfo.businessHours.monday.closes}
Areas served: ${businessInfo.areasServed.join(", ")}
Primary services: ${businessInfo.primaryServices.map(s => `${s.name}: ${s.includes.join("; ")}`).join("\n")}
Rating: ${businessInfo.rating.average} (${businessInfo.rating.count} reviews)
Price range: ${businessInfo.priceRange}
Founders: ${businessInfo.founders.join(", ")}
Founding year: ${businessInfo.foundingYear}
Facebook: ${businessInfo.facebookUrl}
Instagram: ${businessInfo.instagramUrl}`

    // ----------------------------------------
    // 2. User prompt: natural conversational output
    // ----------------------------------------
    const userContent = `Car: ${carModel}
    Needs: ${userNeeds}`

    // console.log(96, "userContent - ", userContent)
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
    // console.log(98, "recommendation - ", recommendation)
    return { recommendation }
  } catch (error) {
    console.error("AI recommendation error:", error)
    if (error instanceof Error) return error.message
    return "Internal server error"
  }
}

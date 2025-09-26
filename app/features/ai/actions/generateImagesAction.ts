// app/features/ai/actions/generateImages.ts
"use server"

import openai from "@/libs/openai"

export async function generateImagesAction(carModel: string, recommendation: string) {
  try {
    if (!carModel || !recommendation) return "Car model and recommendation are required"

    // 1. "Before" prompt - dirty car in professional detailing shop
    const beforePrompt = `Professional automotive detailing shop interior with fixed black walls and subtle red LED lighting at 20% intensity in background.
     A ${carModel} car positioned in center, captured from a fixed 237-degree frontal three-quarter angle at eye level (1.5m height),
     from a distance of 3 meters, filling 70% of the frame. The car appears dirty, with visible dust, water spots, swirl marks on paint,
     grimy wheels, and a slightly worn exterior. Shot with a professional camera, shallow depth of field (f/2.8),
     identical blurred background with fixed red accent lighting and no variations in background elements.
     Consistent dark, cinematic lighting at 30% intensity with focused illumination on the vehicle, identical to the 'after' image setup.
     Realistic photography style, high quality, cinematic composition.`

    // 2. "After" prompt - pristine car in same professional setup
    const afterPrompt = `Professional automotive detailing shop interior with fixed black walls and subtle red LED lighting at 20% intensity in background.
    A ${carModel} car positioned in center, captured from the same fixed 237-degree frontal three-quarter angle at eye level (1.5m height)
     as the 'before' image, from a distance of 3 meters, filling 70% of the frame. The car is pristine, with mirror-like paint finish, spotless chrome, 
     perfectly clean wheels with tire shine, and crystal-clear windows, showcasing the results of: ${recommendation}. Shot with a professional camera, 
     shallow depth of field (f/2.8), identical blurred background with fixed red accent lighting and no variations in background elements.
     Consistent dark, cinematic lighting at 30% intensity with focused illumination on the vehicle, identical to the 'before' image setup.
     Realistic photography style, high quality, cinematic composition.`

    // 3. Generate both images concurrently
    const [beforeResponse, afterResponse] = await Promise.all([
      openai.images.generate({
        model: "dall-e-3",
        prompt: beforePrompt,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      }),
      openai.images.generate({
        model: "dall-e-3",
        prompt: afterPrompt,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      }),
    ])

    // 4. Extract URLs safely
    const beforeImageUrl = beforeResponse?.data?.[0]?.url
    const afterImageUrl = afterResponse?.data?.[0]?.url
    // console.log(47, "beforeImageUrl - ", beforeImageUrl)
    // console.log(46, "afterImageUrl - ", afterImageUrl)

    if (!beforeImageUrl || !afterImageUrl) return "Failed to generate images"

    return { beforeImageUrl, afterImageUrl }
  } catch (error) {
    console.error("Image generation error:", error)
    return "Internal server error"
  }
}

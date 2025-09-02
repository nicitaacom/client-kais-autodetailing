// app/features/ai/actions/generateImages.ts
"use server"

import openai from "@/libs/openai"

export async function generateImagesAction(carModel: string, recommendation: string) {
  try {
    if (!carModel || !recommendation) return "Car model and recommendation are required"

    // 1. "Before" prompt - dirty car in professional detailing shop
    const beforePrompt = `Professional automotive detailing shop interior with black walls and subtle red LED lighting in background.
    A ${carModel} car positioned in center that needs detailing service. The car should look dirty, dusty, with water spots,
    swirl marks on paint, dirty wheels, and slightly worn appearance. Shot with professional camera, shallow depth of field,
    blurred background with red accent lighting creating atmospheric mood. Dark, moody lighting with focused illumination on
    the vehicle. Realistic photography style, high quality, cinematic composition.`

    // 2. "After" prompt - pristine car in same professional setup
    const afterPrompt = `Professional automotive detailing shop interior with black walls and subtle red LED lighting in background.
    A ${carModel} car positioned in center after professional detailing service. The car should look absolutely pristine with
    mirror-like paint finish, spotless chrome, perfectly clean wheels with tire shine, crystal clear windows. Show the results
    of: ${recommendation}. Shot with professional camera, shallow depth of field, blurred background with red accent lighting
    creating dramatic atmosphere. Perfect studio lighting highlighting the flawless finish. Realistic photography style,
    high quality, cinematic composition.`

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
    console.log(47, "beforeImageUrl - ", beforeImageUrl)
    console.log(46, "afterImageUrl - ", afterImageUrl)

    if (!beforeImageUrl || !afterImageUrl) return "Failed to generate images"

    return { beforeImageUrl, afterImageUrl }
  } catch (error) {
    console.error("Image generation error:", error)
    return "Internal server error"
  }
}

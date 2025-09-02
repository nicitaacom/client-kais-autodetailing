import { getAIRecommendationAction } from "../actions/getAIRecommendationAction"
import { generateImagesAction } from "../actions/generateImagesAction"

interface RecommendationResponse {
  recommendation: string
}

interface ImageGenerationResponse {
  beforeImageUrl: string
  afterImageUrl: string
}

export class AISDK {
  // 1. Get AI recommendation from server action
  static async getRecommendation(carModel: string, userNeeds: string): Promise<RecommendationResponse | string> {
    const result = await getAIRecommendationAction(carModel, userNeeds)
    return result
  }

  // 2. Generate before/after images from server action
  static async generateImages(carModel: string, recommendation: string): Promise<ImageGenerationResponse | string> {
    const result = await generateImagesAction(carModel, recommendation)
    return result
  }

  // 3. Validate car model input
  static validateCarModel(model: string): string {
    if (!model.trim()) return "Car model is required"
    if (model.trim().length < 3) return "Please enter a valid car model"
    return ""
  }

  // 4. Validate user needs input
  static validateUserNeeds(needs: string): string {
    if (!needs.trim()) return "Please describe what service you need"
    if (needs.trim().length < 10) return "Please provide more details about your needs"
    return ""
  }

  // 5. Validate image file
  static validateImageFile(file: File | null): string {
    if (!file) return ""

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) return "Please upload a valid image file (JPEG, PNG, WebP)"

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) return "Image file size should be less than 5MB"

    return ""
  }

  static isRecommendationResponse(result: RecommendationResponse | string): result is RecommendationResponse {
    return typeof result === "object" && "recommendation" in result
  }

  static isImageGenerationResponse(result: ImageGenerationResponse | string): result is ImageGenerationResponse {
    return typeof result === "object" && "beforeImage" in result && "afterImage" in result
  }
}

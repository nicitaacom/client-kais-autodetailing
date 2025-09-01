import OpenAI from "openai"

const openai = new OpenAI({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_KEY,
})

export default openai

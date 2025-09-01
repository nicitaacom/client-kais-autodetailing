declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_PRODUCTION_URL: string
      OPENAI_KEY: string
      ORGANIZATION_ID: string
    }
  }
}

export {}

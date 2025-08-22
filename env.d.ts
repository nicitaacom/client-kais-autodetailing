declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_PRODUCTION_URL: string
    }
  }
}

export {}

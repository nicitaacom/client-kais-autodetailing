import { create } from "zustand"

interface AIStates {
  carModel: string
  userNeeds: string
  aiRecommendation: string
  beforeImage: string
  afterImage: string
  loading: boolean
  error: string
  step: 1 | 2 | 3 | 4
}

interface AISetters {
  setCarModel: (model: string) => void
  setUserNeeds: (needs: string) => void
  setAIRecommendation: (recommendation: string) => void
  setBeforeImage: (url: string) => void
  setAfterImage: (url: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string) => void
  setStep: (step: 1 | 2 | 3 | 4) => void
  resetState: () => void
  clearError: () => void
}

type AIStore = AIStates & AISetters

const initialState: AIStates = {
  carModel: "",
  userNeeds: "",
  aiRecommendation: "",
  beforeImage: "",
  afterImage: "",
  loading: false,
  error: "",
  step: 1,
}

export const useAI = create<AIStore>(set => ({
  ...initialState,

  // 1. State setters
  setCarModel: model => set({ carModel: model }),
  setUserNeeds: needs => set({ userNeeds: needs }),
  setAIRecommendation: recommendation => set({ aiRecommendation: recommendation }),
  setBeforeImage: url => set({ beforeImage: url }),
  setAfterImage: url => set({ afterImage: url }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  setStep: step => set({ step }),

  // 2. Actions
  resetState: () => set(initialState),
  clearError: () => set({ error: "" }),
}))

// app/components/AICarService.tsx
"use client"

import { useRef, useState } from "react"
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider"
import { motion, AnimatePresence } from "framer-motion"
import { FiMessageSquare, FiImage, FiAlertCircle, FiX, FiCalendar } from "react-icons/fi"
import { FaCar } from "react-icons/fa"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaRegCalendarAlt } from "react-icons/fa"

import { useAI } from "@/features/ai/store/useAI"
import { AISDK } from "@/features/ai/class/AISDK"
import CalendarContainer from "@/widgets/Calendar/CalendarContainer"
import { businessInfo } from "@/consts/businessInfo"
import { generateAvailableTimes } from "../Calendar/functions/generateAvailableTimesFn"

export function AICarService() {
  const {
    carModel,
    userNeeds,
    aiRecommendation,
    beforeImage,
    afterImage,
    loading,
    error,
    step,
    setCarModel,
    setUserNeeds,
    setAIRecommendation,
    setBeforeImage,
    setAfterImage,
    setLoading,
    setError,
    setStep,
    resetState,
    clearError,
  } = useAI()
  const [highlightNeeds, setHighlightNeeds] = useState(false)
  const [allowEditNeeds, setAllowEditNeeds] = useState(false)
  const [direction, setDirection] = useState(0)
  const userNeedsReference = useRef<HTMLTextAreaElement>(null)

  // 2. get recommendation
  const getAIRecommendation = async (): Promise<void> => {
    const modelError = AISDK.validateCarModel?.(carModel) ?? null
    const needsError = AISDK.validateUserNeeds?.(userNeeds) ?? null
    if (modelError) return void setError(modelError)
    if (needsError) return void setError(needsError)
    setLoading(true)
    clearError()

    const result = await AISDK.getRecommendation(carModel, userNeeds)
    if (typeof result === "string") return void (setError(result), setLoading(false))
    if (AISDK.isRecommendationResponse?.(result)) {
      setAIRecommendation(result.recommendation)
      setLoading(false)
      if (result.recommendation.includes("Do you want to book based on my recommendations")) {
        setAllowEditNeeds(false)
        setHighlightNeeds(false)
      } else if (result.recommendation.includes("?")) {
        setAllowEditNeeds(true)
        userNeedsReference.current?.focus()
        setHighlightNeeds(true)
        setTimeout(() => {
          setHighlightNeeds(false)
          userNeedsReference.current?.focus()
        }, 2000)
      } else {
        setAllowEditNeeds(false)
        setHighlightNeeds(false)
      }
      setDirection(1)
      setStep(2)
    }
  }

  // 3. generate before/after images
  const generateImages = async (): Promise<void> => {
    setLoading(true)
    clearError()
    const result = await AISDK.generateImages(carModel, aiRecommendation)
    if (typeof result === "string") return void (setError(result), setLoading(false))
    if (AISDK.isImageGenerationResponse?.(result)) {
      setBeforeImage(result.beforeImageUrl)
      setAfterImage(result.afterImageUrl)
      setDirection(1)
      setStep(3)
    }
    setLoading(false)
  }

  // book service
  const bookService = (): void => {
    setDirection(1)
    setStep(4)
  }

  // 4. animations & helpers
  const containerVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, staggerChildren: 0.06 } },
  }
  const itemVariants = { hidden: { opacity: 0, x: -14 }, visible: { opacity: 1, x: 0, transition: { duration: 0.32 } } }
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.36 } },
  }
  const stepVariants = {
    hidden: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0, transition: { duration: 0.3 } }),
  }
  const steps: { id: 1 | 2 | 3 | 4; label: string }[] = [
    { id: 1, label: "Vehicle" },
    { id: 2, label: "Recommendation" },
    { id: 3, label: "Preview" },
    { id: 4, label: "Schedule" },
  ]
  const goToStep = (target: 1 | 2 | 3 | 4) => {
    if (target > step) return
    setDirection(target > step ? 1 : -1)
    setStep(target)
  }

  return (
    <motion.div
      className="flex flex-col gap-4 max-w-5xl mx-auto p-4 mobile:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible">
      {/* Header */}
      <motion.div className="flex flex-col gap-2" variants={itemVariants}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FaCar className="text-brand text-2xl" />
            <div>
              <h2 className="text-2xl tablet:text-3xl font-bold text-title">AI Car Detailing Service</h2>
              <p className="text-subTitle text-sm tablet:text-base">
                AI suggests, you choose - preview before & after.
              </p>
            </div>
          </div>
          {/* Step Indicators */}
          <div className="hidden mobile:flex items-center gap-2">
            {steps.map(s => {
              const active = s.id === step
              return (
                <motion.button
                  key={s.id}
                  type="button"
                  aria-current={active}
                  onClick={() => goToStep(s.id)}
                  whileTap={{ scale: 0.94 }}
                  className={`rounded-full w-8 h-8 flex items-center justify-center transition-colors focus:outline-none border border-brand/40 ${
                    active ? "bg-brand text-title-foreground" : "bg-background/20 text-subTitle hover:bg-brand/10"
                  }`}>
                  <span className="text-sm font-semibold">{s.id}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
        {/* mobile step indicator with labels */}
        <div className="flex mobile:hidden items-center justify-between gap-2">
          {steps.map(s => {
            const active = s.id === step
            return (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => goToStep(s.id)}
                whileTap={{ scale: 0.94 }}
                className={`flex-1 rounded-full py-1.5 text-xs font-medium transition-colors border border-brand/40 ${
                  active ? "bg-brand text-title-foreground" : "bg-background/20 text-subTitle"
                }`}>
                {s.label}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="bg-danger/6 border border-danger/20 rounded-md p-2 flex items-start gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}>
            <FiAlertCircle className="text-danger mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-danger text-sm">{error}</p>
            </div>
            <button type="button" className="p-0.5 rounded hover:bg-danger/10" onClick={clearError}>
              <FiX className="text-danger" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            className="bg-foreground rounded-md p-4 border border-border-color"
            variants={stepVariants}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit">
            <div className="flex items-center gap-2 mb-2">
              <FaCar className="text-brand text-lg" />
              <h3 className="text-lg tablet:text-xl font-semibold text-title">Step 1: Your Vehicle</h3>
            </div>
            <div>
              <label className="block text-subTitle mb-1 text-sm">Car Model *</label>
              <motion.input
                className="w-full bg-background border border-border-color rounded-md px-3 py-2 text-title focus:border-brand focus:outline-none transition-colors"
                placeholder="e.g., Tesla Model 3, BMW X5"
                value={carModel}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCarModel(event.target.value)}
                disabled={loading}
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.14 }}
              />
            </div>
            <div className="mt-3">
              <label className="block text-subTitle mb-1 text-sm">What do you want? *</label>
              <motion.textarea
                ref={userNeedsReference}
                className={`w-full bg-background border border-border-color rounded-md px-3 py-2 text-title focus:border-brand focus:outline-none h-20 resize-none transition-colors ${
                  highlightNeeds ? "border-brand shadow-brand/50" : ""
                }`}
                placeholder="Describe - paint correction, ceramic coating, interior deep clean, etc."
                value={userNeeds}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setUserNeeds(event.target.value)}
                disabled={loading}
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.14 }}
              />
            </div>
            <motion.button
              className={`mt-3 bg-brand hover:bg-brand/90 text-title-foreground px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-1.5 ${loading ? "opacity-50 cursor-default pointer-events-none" : ""}`}
              onClick={getAIRecommendation}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}>
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin text-title-foreground" />
              ) : (
                <FiMessageSquare className="text-title-foreground" />
              )}
              <span className="text-black">Get AI Recommendation</span>
            </motion.button>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="step2"
            className="bg-foreground rounded-md p-4 border border-border-color"
            variants={stepVariants}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit">
            <div className="flex items-center gap-2 mb-2">
              <FiMessageSquare className="text-brand text-lg" />
              <h3 className="text-lg tablet:text-xl font-semibold text-title">Step 2: AI Recommendation</h3>
            </div>
            <motion.div
              className="bg-background rounded-md p-3 border border-border-color text-base tablet:text-lg leading-relaxed"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              dangerouslySetInnerHTML={{
                __html: aiRecommendation || `<p><strong>No recommendation</strong></p><p><em>Generate one.</em></p>`,
              }}
            />
            {allowEditNeeds && (
              <div className="mt-3">
                <label className="block text-subTitle mb-1 text-sm">Update your needs *</label>
                <motion.textarea
                  ref={userNeedsReference}
                  className={`w-full bg-background border border-border-color rounded-md px-3 py-2 text-title focus:border-brand focus:outline-none h-20 resize-none transition-colors ${
                    highlightNeeds ? "border-brand shadow-brand/50" : ""
                  }`}
                  placeholder="Describe - paint correction, ceramic coating, interior deep clean, etc."
                  value={userNeeds}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setUserNeeds(event.target.value)}
                  disabled={loading}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.14 }}
                />
              </div>
            )}
            <div className="flex flex-col mobile:flex-row gap-2 mt-3">
              {allowEditNeeds ? (
                <motion.button
                  className={`bg-brand hover:bg-brand/90 text-title-foreground px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-1.5
                     ${loading ? "opacity-50 cursor-default pointer-events-none" : ""}`}
                  onClick={getAIRecommendation}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}>
                  {loading ? (
                    <AiOutlineLoading3Quarters className="animate-spin text-title-foreground" />
                  ) : (
                    <FiMessageSquare className="text-title-foreground" />
                  )}
                  <span className="text-black">Update Recommendation</span>
                </motion.button>
              ) : null}
              <motion.button
                className={`bg-brand hover:bg-brand/90 text-title-foreground px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-1.5
                   ${loading ? "opacity-50 cursor-default pointer-events-none" : ""}`}
                onClick={generateImages}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}>
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin text-title-foreground" />
                ) : (
                  <FiImage className="text-title-foreground" />
                )}
                <span className="text-black">Generate Preview Images</span>
              </motion.button>
              <motion.button
                className="bg-brand hover:bg-brand/90 text-title-foreground flex items-center gap-1.5 px-4 py-2 rounded-md font-medium transition-colors"
                onClick={bookService}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}>
                <FaRegCalendarAlt />
                Book Appointment
              </motion.button>
              <motion.button
                className="bg-foreground-accent hover:bg-foreground-accent/80 text-title px-4 py-2 rounded-md font-medium transition-colors border
                 border-border-color"
                onClick={() => goToStep(1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}>
                Modify Request
              </motion.button>
            </div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="step3"
            className="bg-foreground rounded-md p-4 border border-border-color"
            variants={stepVariants}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit">
            <div className="flex items-center gap-2 mb-3">
              <FiImage className="text-brand text-lg" />
              <h3 className="text-lg tablet:text-xl font-semibold text-title">Step 3: Service Preview</h3>
            </div>
            <motion.div variants={itemVariants}>
              <h4 className="text-base tablet:text-lg font-medium text-title mb-1">Before / After</h4>
              <motion.div
                className="bg-background rounded-md overflow-hidden border border-border-color h-48 tablet:h-64 laptop:h-72"
                variants={imageVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.26 }}>
                {beforeImage && afterImage ? (
                  <ReactCompareSlider
                    itemOne={<ReactCompareSliderImage src={beforeImage} alt="Before detailing service" />}
                    itemTwo={<ReactCompareSliderImage src={afterImage} alt="After detailing service" />}
                  />
                ) : (
                  <div className="text-subTitle flex items-center justify-center h-full">No preview available</div>
                )}
              </motion.div>
            </motion.div>
            <div className="flex flex-col mobile:flex-row gap-2 mt-3">
              <motion.button
                className="bg-brand hover:bg-brand/90 text-title-foreground px-4 py-2 rounded-md font-medium transition-colors"
                onClick={bookService}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}>
                Book This Service
              </motion.button>
              <motion.button
                className="bg-foreground-accent hover:bg-foreground-accent/80 text-title px-4 py-2 rounded-md font-medium transition-colors border border-border-color"
                onClick={resetState}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}>
                Start Over
              </motion.button>
            </div>
          </motion.div>
        )}
        {step === 4 && (
          <motion.div
            key="step4"
            className="bg-foreground rounded-md p-4 border border-border-color"
            variants={stepVariants}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit">
            <div className="flex items-center gap-2 mb-3">
              <FiCalendar className="text-brand text-lg" />
              <h3 className="text-lg tablet:text-xl font-semibold text-title">Step 4: Schedule Appointment</h3>
            </div>
            <CalendarContainer businessHours={businessInfo.businessHours} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

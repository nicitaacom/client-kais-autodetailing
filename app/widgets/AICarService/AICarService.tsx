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
            <FaCar className="text-red-400 text-2xl drop-shadow-sm" />
            <div>
              <h2 className="text-2xl tablet:text-3xl font-bold text-white drop-shadow-md">AI Car Detailing Service</h2>
              <p className="text-white/80 text-sm tablet:text-base drop-shadow-sm">
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
                  className={`rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 focus:outline-none ${
                    active
                      ? "bg-red-600/80 text-white border border-red-400/50 shadow-lg shadow-red-500/20"
                      : "bg-black/30 backdrop-blur-sm text-white/80 hover:bg-red-900/30 border border-white/10 hover:border-red-500/30"
                  }`}>
                  <span className="text-sm font-semibold drop-shadow-sm">{s.id}</span>
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
                className={`flex-1 rounded-full py-1.5 text-xs font-medium transition-all duration-300 ${
                  active
                    ? "bg-red-600/80 text-white border border-red-400/50"
                    : "bg-black/30 backdrop-blur-sm text-white/80 border border-white/10"
                }`}>
                <span className="drop-shadow-sm">{s.label}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-3 flex items-start gap-2 shadow-lg shadow-red-500/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}>
            <FiAlertCircle className="text-red-400 mt-0.5 flex-shrink-0 drop-shadow-sm" />
            <div className="flex-1">
              <p className="text-red-200 text-sm drop-shadow-sm">{error}</p>
            </div>
            <button type="button" className="p-0.5 rounded hover:bg-red-900/30 transition-colors" onClick={clearError}>
              <FiX className="text-red-400 drop-shadow-sm" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 hover:border-red-500/30 p-6 shadow-2xl shadow-black/50 transition-all duration-300"
            variants={stepVariants}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit">
            <div className="flex items-center gap-2 mb-4">
              <FaCar className="text-red-400 text-lg drop-shadow-sm" />
              <h3 className="text-lg tablet:text-xl font-semibold text-white drop-shadow-md">Step 1: Your Vehicle</h3>
            </div>
            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium drop-shadow-sm">Car Model *</label>
              <motion.input
                className="w-full bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-red-500/50 focus:outline-none transition-all duration-300 focus:shadow-lg focus:shadow-red-500/10"
                placeholder="e.g., Tesla Model 3, BMW X5"
                value={carModel}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCarModel(event.target.value)}
                disabled={loading}
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.14 }}
              />
            </div>
            <div className="mt-4">
              <label className="block text-white/80 mb-2 text-sm font-medium drop-shadow-sm">What do you want? *</label>
              <motion.textarea
                ref={userNeedsReference}
                className={`w-full bg-black/20 backdrop-blur-sm border rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none h-24 resize-none transition-all duration-300 ${
                  highlightNeeds
                    ? "border-red-500/50 shadow-lg shadow-red-500/20"
                    : "border-white/20 focus:border-red-500/50 focus:shadow-lg focus:shadow-red-500/10"
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
              className={`mt-4 bg-red-600/80 hover:bg-red-700/80 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-red-500/20 hover:scale-[1.02] backdrop-blur-sm border border-red-500/30 ${loading ? "opacity-50 cursor-default pointer-events-none" : ""}`}
              onClick={getAIRecommendation}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}>
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin text-white drop-shadow-sm" />
              ) : (
                <FiMessageSquare className="text-white drop-shadow-sm" />
              )}
              <span className="drop-shadow-sm">Get AI Recommendation</span>
            </motion.button>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="step2"
            className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 hover:border-red-500/30 p-6 shadow-2xl shadow-black/50 transition-all duration-300"
            variants={stepVariants}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit">
            <div className="flex items-center gap-2 mb-4">
              <FiMessageSquare className="text-red-400 text-lg drop-shadow-sm" />
              <h3 className="text-lg tablet:text-xl font-semibold text-white drop-shadow-md">
                Step 2: AI Recommendation
              </h3>
            </div>
            <motion.div
              className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-base tablet:text-lg leading-relaxed text-white/90"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              dangerouslySetInnerHTML={{
                __html: aiRecommendation || `<p><strong>No recommendation</strong></p><p><em>Generate one.</em></p>`,
              }}
            />
            {allowEditNeeds && (
              <div className="mt-4">
                <label className="block text-white/80 mb-2 text-sm font-medium drop-shadow-sm">
                  Update your needs *
                </label>
                <motion.textarea
                  ref={userNeedsReference}
                  className={`w-full bg-black/20 backdrop-blur-sm border rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none h-24 resize-none transition-all duration-300 ${
                    highlightNeeds
                      ? "border-red-500/50 shadow-lg shadow-red-500/20"
                      : "border-white/20 focus:border-red-500/50 focus:shadow-lg focus:shadow-red-500/10"
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
            <div className="flex flex-col mobile:flex-row gap-3 mt-4">
              {allowEditNeeds ? (
                <motion.button
                  className={`bg-red-600/80 hover:bg-red-700/80 text-white px-3 py-1.5
                     rounded-xl font-semibold transition-all duration-300 flex items-center gap-2
                      shadow-lg hover:shadow-red-500/20 hover:scale-[1.02] backdrop-blur-sm border border-red-500/30
                   ${loading ? "opacity-50 cursor-default pointer-events-none" : ""}`}
                  onClick={getAIRecommendation}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}>
                  {loading ? (
                    <AiOutlineLoading3Quarters className="animate-spin text-white drop-shadow-sm" />
                  ) : (
                    <FiMessageSquare className="text-white drop-shadow-sm" />
                  )}
                  <span className="drop-shadow-sm">Update Recommendation</span>
                </motion.button>
              ) : null}
              <motion.button
                className={`bg-red-600/80 hover:bg-red-700/80 text-white px-3 py-1.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-red-500/20 hover:scale-[1.02] backdrop-blur-sm border border-red-500/30
                 ${loading ? "opacity-50 cursor-default pointer-events-none" : ""}`}
                onClick={generateImages}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}>
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin text-white drop-shadow-sm" />
                ) : (
                  <FiImage className="text-white drop-shadow-sm" />
                )}
                <span className="drop-shadow-sm">Generate Preview Images</span>
              </motion.button>
              <motion.button
                className="bg-red-600/80 hover:bg-red-700/80 text-white flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/20 hover:scale-[1.02] backdrop-blur-sm border border-red-500/30"
                onClick={bookService}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}>
                <FaRegCalendarAlt className="drop-shadow-sm" />
                <span className="drop-shadow-sm">Book Appointment</span>
              </motion.button>
              <motion.button
                className="bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white px-3 py-1.5 rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:border-red-500/30 hover:scale-[1.02]"
                onClick={() => goToStep(1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}>
                <span className="drop-shadow-sm">Modify Request</span>
              </motion.button>
            </div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="step3"
            className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 hover:border-red-500/30 p-6 shadow-2xl shadow-black/50 transition-all duration-300"
            variants={stepVariants}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit">
            <div className="flex items-center gap-2 mb-4">
              <FiImage className="text-red-400 text-lg drop-shadow-sm" />
              <h3 className="text-lg tablet:text-xl font-semibold text-white drop-shadow-md">
                Step 3: Service Preview
              </h3>
            </div>
            <motion.div variants={itemVariants}>
              <h4 className="text-base tablet:text-lg font-medium text-white mb-2 drop-shadow-sm">Before / After</h4>
              <motion.div
                className="bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 h-48 tablet:h-64 laptop:h-72 shadow-lg"
                variants={imageVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.26 }}>
                {beforeImage && afterImage ? (
                  <ReactCompareSlider
                    itemOne={<ReactCompareSliderImage src={beforeImage} alt="Before detailing service" />}
                    itemTwo={<ReactCompareSliderImage src={afterImage} alt="After detailing service" />}
                  />
                ) : (
                  <div className="text-white/60 flex items-center justify-center h-full drop-shadow-sm">
                    No preview available
                  </div>
                )}
              </motion.div>
            </motion.div>
            <div className="flex flex-col mobile:flex-row gap-3 mt-4">
              <motion.button
                className="bg-red-600/80 hover:bg-red-700/80 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/20 hover:scale-[1.02] backdrop-blur-sm border border-red-500/30"
                onClick={bookService}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}>
                <span className="drop-shadow-sm">Book This Service</span>
              </motion.button>
              <motion.button
                className="bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:border-red-500/30 hover:scale-[1.02]"
                onClick={resetState}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}>
                <span className="drop-shadow-sm">Start Over</span>
              </motion.button>
            </div>
          </motion.div>
        )}
        {step === 4 && (
          <motion.div
            key="step4"
            className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 hover:border-red-500/30 p-6 shadow-2xl shadow-black/50 transition-all duration-300"
            variants={stepVariants}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit">
            <div className="flex items-center gap-2 mb-4">
              <FiCalendar className="text-red-400 text-lg drop-shadow-sm" />
              <h3 className="text-lg tablet:text-xl font-semibold text-white drop-shadow-md">
                Step 4: Schedule Appointment
              </h3>
            </div>
            <CalendarContainer
              businessHours={businessInfo.businessHours}
              maxBookingDaysInAdvance={28}
              defaultTimezone={businessInfo.timezone}
              phonePlaceholder="e.g +44 123 456 78 90"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

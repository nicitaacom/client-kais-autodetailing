"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2"

export function WorkExamples() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(null)

  // 1. Generate work image paths
  const workImages = Array.from({ length: 39 }, (_, i) => `/work/work-${i + 1}.jpg`)

  // 2. Handle navigation with smooth animation
  const goToPrevious = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(prev => (prev === 0 ? workImages.length - 1 : prev - 1))
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const goToNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(prev => (prev === workImages.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsTransitioning(false), 300)
  }

  // 3. Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious()
      if (e.key === "ArrowRight") goToNext()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isTransitioning])

  // 4. Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles: Array<{ x: number; y: number; vx: number; vy: number; opacity: number; size: number }> = []

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.2 + 0.05,
      size: Math.random() * 2 + 1,
    })

    // 5. Initialize particles (reduced count for performance)
    for (let i = 0; i < 30; i++) {
      particles.push(createParticle())
    }

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 2)
        gradient.addColorStop(0, `hsla(0, 85%, 55%, ${particle.opacity})`)
        gradient.addColorStop(0.5, `hsla(10, 70%, 50%, ${particle.opacity * 0.7})`)
        gradient.addColorStop(1, `hsla(0, 85%, 55%, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Add soft glow effect
        ctx.shadowColor = `hsla(0, 85%, 55%, ${particle.opacity * 0.5})`
        ctx.shadowBlur = particle.size * 2
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    resizeCanvas()
    animate()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div className="relative w-full mx-auto">
      {/* 6. Animated canvas border */}
      <div className="relative p-1 bg-black rounded-xl overflow-hidden w-full opacity-95 backdrop-blur-sm">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ width: "100%", height: "100%" }} />

        <div className="relative bg-black rounded-lg overflow-hidden border-2 border-brand/30 w-full">
          {/* 7. Main image display with blur transition */}
          <div className="relative aspect-video bg-foreground overflow-hidden">
            <div
              className={`absolute inset-0 transition-all duration-300 ease-out ${
                isTransitioning
                  ? "opacity-30 scale-105 blur-md filter brightness-75"
                  : "opacity-100 scale-100 blur-0 filter brightness-100"
              }`}>
              <Image
                src={workImages[currentIndex]}
                alt={`Work example ${currentIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority={currentIndex < 3}
                quality={85}
              />
            </div>

            {/* 8. Loading overlay during transition */}
            {isTransitioning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                <div className="w-12 h-12 border-2 border-brand border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* 9. Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

            {/* 10. Navigation arrows */}
            <button
              onClick={goToPrevious}
              disabled={isTransitioning}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-black/70 hover:bg-black/90 disabled:opacity-50 rounded-full text-brand transition-all hover:scale-110 active:scale-95">
              <HiChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={goToNext}
              disabled={isTransitioning}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-black/70 hover:bg-black/90 disabled:opacity-50 rounded-full text-brand transition-all hover:scale-110 active:scale-95">
              <HiChevronRight className="w-8 h-8" />
            </button>

            {/* 11. Image counter with glow */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 backdrop-blur-sm rounded-full text-title text-lg font-medium border border-brand/30">
              <span className="text-brand">{currentIndex + 1}</span>
              <span className="text-subTitle mx-2">/</span>
              <span>{workImages.length}</span>
            </div>
          </div>

          {/* 12. Enhanced thumbnail strip */}
          <div className="p-6 bg-gradient-to-r from-black via-foreground to-black">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {workImages.map((src, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (isTransitioning || index === currentIndex) return
                    setIsTransitioning(true)
                    setCurrentIndex(index)
                    setTimeout(() => setIsTransitioning(false), 300)
                  }}
                  className={`flex-shrink-0 relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                    index === currentIndex
                      ? "border-brand shadow-lg shadow-brand/30 scale-110"
                      : "border-border-color hover:border-brand/50 opacity-70 hover:opacity-100"
                  }`}>
                  <Image src={src} alt={`Thumbnail ${index + 1}`} fill className="object-cover" sizes="80px" />
                  {index === currentIndex && <div className="absolute inset-0 bg-brand/10" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

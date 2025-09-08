"use client"

import React, { useEffect, useRef } from "react"
import Image from "next/image"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  type: "steam" | "dot" | "glow"
  color: string
}

interface CanvasBackgroundProps {
  children: React.ReactNode
  imgSrc: string
  imageOpacity?: number
  vignetteOpacity?: number
}

export function CanvasBackground({ children, imgSrc, imageOpacity = 100, vignetteOpacity = 0 }: CanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // 1. Setup canvas size and reinitialize particles on resize
    function resizeCanvas() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particlesRef.current = initParticles()
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // 2. Load and setup image
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      imageRef.current = img
    }
    img.src = imgSrc

    // 3. Initialize particles with automotive theme
    function initParticles() {
      if (!canvas) return []
      const particles: Particle[] = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 12000)
      for (let i = 0; i < particleCount; i++) {
        const type = Math.random() < 0.4 ? "steam" : Math.random() < 0.7 ? "dot" : "glow"
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: type === "steam" ? (Math.random() - 0.5) * 0.1 : (Math.random() - 0.5) * 0.3,
          vy: type === "steam" ? -Math.random() * 0.5 - 0.2 : (Math.random() - 0.5) * 0.2,
          size:
            type === "steam" ? Math.random() * 8 + 4 : type === "dot" ? Math.random() * 2 + 1 : Math.random() * 12 + 8,
          opacity: type === "steam" ? Math.random() * 0.15 + 0.05 : Math.random() * 0.4 + 0.1,
          life: type === "steam" ? Math.random() * 400 + 200 : Math.random() * 300 + 150,
          type,
          color:
            type === "glow" && Math.random() < 0.3
              ? "hsl(0, 85%, 55%)"
              : type === "steam"
                ? "rgba(150, 150, 150, 0.3)"
                : "#666666",
        })
      }
      return particles
    }

    particlesRef.current = initParticles()

    // 4. Animation loop with moving camera effect
    function animate() {
      if (!canvas || !context) return
      timeRef.current += 0.01
      context.clearRect(0, 0, canvas.width, canvas.height)

      // 5. Draw background image with moving camera effect and opacity
      if (imageRef.current) {
        context.save()
        const img = imageRef.current
        const imgAspect = img.width / img.height
        const canvasAspect = canvas.width / canvas.height
        let drawWidth = canvasAspect < imgAspect ? canvas.height * imgAspect : canvas.width
        let drawHeight = canvasAspect < imgAspect ? canvas.height : canvas.width / imgAspect
        let offsetX = canvasAspect < imgAspect ? (canvas.width - drawWidth) / 2 : 0
        let offsetY = canvasAspect < imgAspect ? 0 : (canvas.height - drawHeight) / 2
        const baseScale = 1.12
        const scaleVariation = Math.sin(timeRef.current * 0.5) * 0.02
        const scale = baseScale + scaleVariation
        const moveX = Math.sin(timeRef.current * 0.3) * 15 + Math.sin(timeRef.current * 0.8) * 8
        const moveY = Math.cos(timeRef.current * 0.4) * 12 + Math.sin(timeRef.current * 0.7) * 6
        const rotation = Math.sin(timeRef.current * 0.25) * 0.008 + Math.cos(timeRef.current * 0.6) * 0.004
        const finalWidth = drawWidth * scale
        const finalHeight = drawHeight * scale
        const finalX = offsetX - (finalWidth - drawWidth) / 2 + moveX
        const finalY = offsetY - (finalHeight - drawHeight) / 2 + moveY
        context.translate(canvas.width / 2, canvas.height / 2)
        context.rotate(rotation)
        context.translate(-canvas.width / 2, -canvas.height / 2)
        context.globalAlpha = imageOpacity / 100
        context.drawImage(img, finalX, finalY, finalWidth, finalHeight)
        context.globalAlpha = 1
        context.fillStyle = "rgba(0, 0, 0, 0.4)"
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.restore()

        // 6. Draw corner vignettes
        const vignetteAlpha = vignetteOpacity / 100
        if (vignetteAlpha > 0) {
          context.save()
          context.globalAlpha = vignetteAlpha
          const radius = Math.min(canvas.width * 0.1, canvas.height * 0.1)
          // Top-left
          let gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius)
          gradient.addColorStop(0, "rgba(0, 0, 0, 1)")
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
          context.fillStyle = gradient
          context.fillRect(0, 0, canvas.width, canvas.height)
          // Top-right
          gradient = context.createRadialGradient(canvas.width, 0, 0, canvas.width, 0, radius)
          gradient.addColorStop(0, "rgba(0, 0, 0, 1)")
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
          context.fillStyle = gradient
          context.fillRect(0, 0, canvas.width, canvas.height)
          // Bottom-left
          gradient = context.createRadialGradient(0, canvas.height, 0, 0, canvas.height, radius)
          gradient.addColorStop(0, "rgba(0, 0, 0, 1)")
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
          context.fillStyle = gradient
          context.fillRect(0, 0, canvas.width, canvas.height)
          // Bottom-right
          gradient = context.createRadialGradient(canvas.width, canvas.height, 0, canvas.width, canvas.height, radius)
          gradient.addColorStop(0, "rgba(0, 0, 0, 1)")
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
          context.fillStyle = gradient
          context.fillRect(0, 0, canvas.width, canvas.height)
          context.restore()
        }
      } else {
        // Fallback gradient while image loads
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "#0a0a0a")
        gradient.addColorStop(0.3, "#141414")
        gradient.addColorStop(0.7, "#0f0f0f")
        gradient.addColorStop(1, "#080808")
        context.fillStyle = gradient
        context.fillRect(0, 0, canvas.width, canvas.height)
      }

      // 7. Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life--
        if (particle.type === "steam") {
          particle.opacity *= 0.995
          particle.size *= 1.002
        }
        if (particle.type !== "steam") {
          particle.x = particle.x < 0 ? canvas.width : particle.x > canvas.width ? 0 : particle.x
          particle.y = particle.y < 0 ? canvas.height : particle.y > canvas.height ? 0 : particle.y
        }
        if (particle.type === "steam" && particle.y < -50) return false
        context.save()
        context.globalAlpha = particle.opacity
        if (particle.type === "steam") {
          const steamGradient = context.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size,
          )
          steamGradient.addColorStop(0, particle.color)
          steamGradient.addColorStop(1, "rgba(150, 150, 150, 0)")
          context.fillStyle = steamGradient
          context.beginPath()
          context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          context.fill()
        } else if (particle.type === "glow") {
          const glowGradient = context.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size,
          )
          glowGradient.addColorStop(0, particle.color)
          glowGradient.addColorStop(
            0.4,
            particle.color.includes("hsl") ? "rgba(220, 38, 38, 0.2)" : "rgba(100, 100, 100, 0.2)",
          )
          glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
          context.fillStyle = glowGradient
          context.beginPath()
          context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          context.fill()
        } else {
          context.fillStyle = particle.color
          context.beginPath()
          context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          context.fill()
        }
        context.restore()
        return particle.life > 0 && particle.opacity > 0.01
      })

      // 8. Add new particles occasionally
      if (Math.random() < 0.03) {
        const type = Math.random() < 0.5 ? "steam" : Math.random() < 0.8 ? "dot" : "glow"
        const isRedGlow = type === "glow" && Math.random() < 0.25
        particlesRef.current.push({
          x: type === "steam" ? Math.random() * canvas.width : Math.random() * canvas.width,
          y: type === "steam" ? canvas.height + 20 : Math.random() * canvas.height,
          vx: type === "steam" ? (Math.random() - 0.5) * 0.1 : (Math.random() - 0.5) * 0.3,
          vy: type === "steam" ? -Math.random() * 0.5 - 0.3 : (Math.random() - 0.5) * 0.2,
          size:
            type === "steam" ? Math.random() * 6 + 3 : type === "dot" ? Math.random() * 2 + 1 : Math.random() * 10 + 6,
          opacity: type === "steam" ? Math.random() * 0.2 + 0.05 : Math.random() * 0.4 + 0.1,
          life: type === "steam" ? Math.random() * 500 + 250 : Math.random() * 400 + 200,
          type,
          color: isRedGlow ? "hsl(0, 85%, 55%)" : type === "steam" ? "rgba(150, 150, 150, 0.3)" : "#666666",
        })
      }

      // 9. Draw subtle connection lines between nearby dots only
      context.strokeStyle = "rgba(100, 100, 100, 0.08)"
      context.lineWidth = 0.3
      const dots = particlesRef.current.filter(p => p.type === "dot")
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const p1 = dots[i]
          const p2 = dots[j]
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
          if (distance < 100) {
            context.globalAlpha = ((100 - distance) / 100) * 0.05
            context.beginPath()
            context.moveTo(p1.x, p1.y)
            context.lineTo(p2.x, p2.y)
            context.stroke()
          }
        }
      }
      context.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [imgSrc, imageOpacity, vignetteOpacity])

  return (
    <div className="relative min-h-screen">
      <Image
        src={imgSrc}
        alt="Background"
        fill
        priority
        className="fixed inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
        style={{ zIndex: -1 }}
      />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
        style={{ background: "#0a0a0a" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

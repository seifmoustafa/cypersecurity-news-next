"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

// Helper function to convert hex to rgb
function hexToRgb(hex: string) {
  // Remove leading "#"
  hex = hex.replace(/^#/, "")
  // If shorthand notation (#RGB), expand it to (#RRGGBB)
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("")
  }
  const bigint = Number.parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b]
}

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    let shields: Shield[] = []
    let connections: Connection[] = []
    let dataStreams: DataStream[] = []
    const mousePosition = { x: 0, y: 0 }
    let width = window.innerWidth
    let height = window.innerHeight

    // Set Canvas Dimensions + Initialize
    function setCanvasDimensions() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      initElements()
    }

    // Particle Class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
      connected: boolean
      isBinary: boolean
      binaryChar: string

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 1.5 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
        this.color = isDark ? "#ffffff" : "#000000"
        this.opacity = Math.random() * 0.5 + 0.2
        this.connected = false
        this.isBinary = Math.random() > 0.8
        this.binaryChar = Math.random() > 0.5 ? "1" : "0"
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.x < 0 || this.x > width) this.speedX *= -1
        if (this.y < 0 || this.y > height) this.speedY *= -1
        this.connected = false

        // Occasionally change binary character
        if (this.isBinary && Math.random() > 0.95) {
          this.binaryChar = Math.random() > 0.5 ? "1" : "0"
        }
      }

      draw() {
        if (!ctx) return

        if (this.isBinary) {
          ctx.font = `${this.size * 8}px monospace`
          ctx.fillStyle = `rgba(0, 150, 255, ${this.opacity})`
          ctx.textAlign = "center"
          ctx.fillText(this.binaryChar, this.x, this.y)
        } else {
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          const [r, g, b] = hexToRgb(this.color)
          ctx.fillStyle = `rgba(${r},${g},${b},${this.opacity})`
          ctx.fill()
        }
      }
    }

    // Shield Class
    class Shield {
      x: number
      y: number
      size: number
      rotation: number
      rotationSpeed: number
      pulsePhase: number
      pulseSpeed: number

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 20 + 15
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.01
        this.pulsePhase = Math.random() * Math.PI * 2
        this.pulseSpeed = 0.03 + Math.random() * 0.02
      }

      update() {
        this.rotation += this.rotationSpeed
        this.pulsePhase += this.pulseSpeed

        // Slowly drift
        this.x += (Math.random() - 0.5) * 0.5
        this.y += (Math.random() - 0.5) * 0.5

        // Keep within bounds
        if (this.x < 0) this.x = 0
        if (this.x > width) this.x = width
        if (this.y < 0) this.y = 0
        if (this.y > height) this.y = height
      }

      draw() {
        if (!ctx) return

        const pulseFactor = 1 + 0.2 * Math.sin(this.pulsePhase)
        const currentSize = this.size * pulseFactor

        // Draw shield
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)

        // Shield body
        ctx.beginPath()
        ctx.moveTo(0, -currentSize)
        ctx.bezierCurveTo(currentSize * 0.7, -currentSize * 0.7, currentSize, 0, currentSize * 0.7, currentSize * 0.7)
        ctx.bezierCurveTo(0, currentSize, -currentSize * 0.7, currentSize * 0.7, -currentSize, 0)
        ctx.bezierCurveTo(-currentSize * 0.7, -currentSize * 0.7, 0, -currentSize, 0, -currentSize)
        ctx.closePath()

        // Shield gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize)
        gradient.addColorStop(0, `rgba(0, 150, 255, 0.2)`)
        gradient.addColorStop(0.7, `rgba(0, 100, 255, 0.1)`)
        gradient.addColorStop(1, `rgba(0, 50, 255, 0)`)

        ctx.fillStyle = gradient
        ctx.fill()

        // Shield border
        ctx.strokeStyle = `rgba(0, 150, 255, ${0.3 + 0.2 * Math.sin(this.pulsePhase)})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Shield emblem
        ctx.beginPath()
        ctx.moveTo(0, -currentSize * 0.5)
        ctx.lineTo(currentSize * 0.4, 0)
        ctx.lineTo(0, currentSize * 0.5)
        ctx.lineTo(-currentSize * 0.4, 0)
        ctx.closePath()

        ctx.fillStyle = `rgba(0, 200, 255, ${0.2 + 0.1 * Math.sin(this.pulsePhase + Math.PI)})`
        ctx.fill()

        ctx.restore()
      }
    }

    // Connection Class
    class Connection {
      from: Particle
      to: Particle
      distance: number
      opacity: number
      active: boolean

      constructor(from: Particle, to: Particle) {
        this.from = from
        this.to = to
        this.distance = 0
        this.opacity = 0
        this.active = false
        this.updateDistance()
      }

      updateDistance() {
        const dx = this.from.x - this.to.x
        const dy = this.from.y - this.to.y
        this.distance = Math.sqrt(dx * dx + dy * dy)

        const maxDist = Math.min(width, height) * 0.15
        this.active = this.distance < maxDist
        this.opacity = this.active ? (1 - this.distance / maxDist) * 0.5 : 0

        if (this.active) {
          this.from.connected = true
          this.to.connected = true
        }
      }

      draw() {
        if (!ctx || !this.active) return

        // Use cybersecurity-themed colors
        const primaryColor = "#0050bc"
        const secondaryColor = "#00c2ff"

        const [pr, pg, pb] = hexToRgb(primaryColor)
        const [sr, sg, sb] = hexToRgb(secondaryColor)

        const gradient = ctx.createLinearGradient(this.from.x, this.from.y, this.to.x, this.to.y)
        gradient.addColorStop(0, `rgba(${pr},${pg},${pb},${(this.opacity * 0.8).toFixed(2)})`)
        gradient.addColorStop(1, `rgba(${sr},${sg},${sb},${(this.opacity * 0.8).toFixed(2)})`)

        ctx.beginPath()
        ctx.moveTo(this.from.x, this.from.y)
        ctx.lineTo(this.to.x, this.to.y)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 0.5
        ctx.stroke()

        // Add data packet animation along the connection
        if (Math.random() > 0.98) {
          const packetPosition = Math.random()
          const packetX = this.from.x + (this.to.x - this.from.x) * packetPosition
          const packetY = this.from.y + (this.to.y - this.from.y) * packetPosition

          ctx.beginPath()
          ctx.arc(packetX, packetY, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0, 255, 200, 0.8)`
          ctx.fill()
        }
      }
    }

    // Data Stream Class
    class DataStream {
      startX: number
      startY: number
      endX: number
      endY: number
      segments: number
      points: { x: number; y: number }[]
      speed: number
      width: number
      color: string
      progress: number
      lifetime: number
      age: number

      constructor() {
        // Start from edge of screen
        const side = Math.floor(Math.random() * 4)
        switch (side) {
          case 0: // Top
            this.startX = Math.random() * width
            this.startY = 0
            break
          case 1: // Right
            this.startX = width
            this.startY = Math.random() * height
            break
          case 2: // Bottom
            this.startX = Math.random() * width
            this.startY = height
            break
          case 3: // Left
            this.startX = 0
            this.startY = Math.random() * height
            break
        }

        // End at random position
        this.endX = Math.random() * width
        this.endY = Math.random() * height

        // Create path with segments
        this.segments = 2 + Math.floor(Math.random() * 3)
        this.points = [{ x: this.startX, y: this.startY }]

        // Create intermediate points
        for (let i = 1; i < this.segments; i++) {
          this.points.push({
            x: this.startX + (this.endX - this.startX) * (i / this.segments) + (Math.random() - 0.5) * 100,
            y: this.startY + (this.endY - this.startY) * (i / this.segments) + (Math.random() - 0.5) * 100,
          })
        }

        this.points.push({ x: this.endX, y: this.endY })

        this.speed = 0.01 + Math.random() * 0.02
        this.width = 1 + Math.random() * 2
        this.color = Math.random() > 0.7 ? "#00ff88" : "#0088ff"
        this.progress = 0
        this.lifetime = 100 + Math.random() * 100
        this.age = 0
      }

      update() {
        this.progress += this.speed
        this.age++

        return this.age < this.lifetime
      }

      draw() {
        if (!ctx) return

        const currentProgress = Math.min(this.progress, 1)
        const fadeOpacity =
          this.age < 20 ? this.age / 20 : this.age > this.lifetime - 20 ? (this.lifetime - this.age) / 20 : 1

        // Draw path segments
        for (let i = 0; i < this.segments; i++) {
          const segmentProgress = currentProgress * (this.segments + 1) - i

          if (segmentProgress > 0 && segmentProgress <= 1 && i < this.points.length - 1) {
            const startX = this.points[i].x
            const startY = this.points[i].y
            const endX = this.points[i + 1].x
            const endY = this.points[i + 1].y

            const currentX = startX + (endX - startX) * segmentProgress
            const currentY = startY + (endY - startY) * segmentProgress

            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.lineTo(currentX, currentY)

            const [r, g, b] = hexToRgb(this.color)
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${fadeOpacity * 0.7})`
            ctx.lineWidth = this.width
            ctx.stroke()

            // Add data packet at the end of the line
            ctx.beginPath()
            ctx.arc(currentX, currentY, this.width * 1.5, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fadeOpacity})`
            ctx.fill()

            // Add binary trail
            if (Math.random() > 0.9) {
              const trailX = startX + (currentX - startX) * Math.random()
              const trailY = startY + (currentY - startY) * Math.random()
              const binaryChar = Math.random() > 0.5 ? "1" : "0"

              ctx.font = `${this.width * 4}px monospace`
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fadeOpacity * 0.5})`
              ctx.textAlign = "center"
              ctx.fillText(binaryChar, trailX, trailY)
            }
          }
        }
      }
    }

    // Initialize Particles + Connections
    function initElements() {
      // Create particles
      const particleCount = Math.min(100, Math.floor((width * height) / 10000))
      particles = []
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }

      // Create shields
      const shieldCount = Math.min(5, Math.floor((width * height) / 100000))
      shields = []
      for (let i = 0; i < shieldCount; i++) {
        shields.push(new Shield())
      }

      // Create connections
      connections = []
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          connections.push(new Connection(particles[i], particles[j]))
        }
      }

      // Initialize data streams
      dataStreams = []
      for (let i = 0; i < 3; i++) {
        dataStreams.push(new DataStream())
      }
    }

    // Handlers + Animation
    function handleMouseMove(e: MouseEvent) {
      mousePosition.x = e.x
      mousePosition.y = e.y
    }

    function handleTouch(e: TouchEvent) {
      if (e.touches.length > 0) {
        mousePosition.x = e.touches[0].clientX
        mousePosition.y = e.touches[0].clientY
      }
    }

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      // Update & draw connections
      connections.forEach((c) => {
        c.updateDistance()
        c.draw()
      })

      // Update & draw particles
      particles.forEach((p) => {
        p.update()
        p.draw()
      })

      // Update & draw shields
      shields.forEach((s) => {
        s.update()
        s.draw()
      })

      // Update & draw data streams
      for (let i = dataStreams.length - 1; i >= 0; i--) {
        const isAlive = dataStreams[i].update()
        dataStreams[i].draw()

        if (!isAlive) {
          dataStreams.splice(i, 1)
          if (Math.random() > 0.7) {
            dataStreams.push(new DataStream())
          }
        }
      }

      // Occasionally add new data streams
      if (Math.random() > 0.99 && dataStreams.length < 10) {
        dataStreams.push(new DataStream())
      }

      // Glow effect near mouse
      const primaryColor = "#0050bc"
      const [mr, mg, mb] = hexToRgb(primaryColor)

      const glowGradient = ctx.createRadialGradient(
        mousePosition.x,
        mousePosition.y,
        0,
        mousePosition.x,
        mousePosition.y,
        150,
      )

      glowGradient.addColorStop(0, `rgba(${mr}, ${mg}, ${mb}, 0.2)`)
      glowGradient.addColorStop(1, `rgba(${mr}, ${mg}, ${mb}, 0)`)

      ctx.fillStyle = glowGradient
      ctx.fillRect(0, 0, width, height)

      animationFrameId = requestAnimationFrame(animate)
    }

    // Start
    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouch)
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouch)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isDark, theme])

  return (
    <>
      {/* Base gradient background */}
      <div
        className={`absolute inset-0 z-0 ${
          isDark
            ? "bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900"
            : "bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700"
        }`}
      />

      {/* Animated canvas with particles & lines */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 opacity-100" />
    </>
  )
}

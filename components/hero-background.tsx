"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = 500 // Fixed height for hero section
    }

    // Call once and add resize listener
    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Define nodes (connection points)
    const nodes: Node[] = []
    const numNodes = 15

    // Create nodes
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 2,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        type: Math.random() > 0.7 ? getRandomNodeType() : "default",
      })
    }

    // Create data packets
    const packets: Packet[] = []
    const createPacket = () => {
      if (nodes.length < 2) return

      // Select two different nodes
      const startNodeIndex = Math.floor(Math.random() * nodes.length)
      let endNodeIndex
      do {
        endNodeIndex = Math.floor(Math.random() * nodes.length)
      } while (endNodeIndex === startNodeIndex)

      const startNode = nodes[startNodeIndex]
      const endNode = nodes[endNodeIndex]

      packets.push({
        x: startNode.x,
        y: startNode.y,
        targetX: endNode.x,
        targetY: endNode.y,
        progress: 0,
        speed: 0.01 + Math.random() * 0.02,
        color: getRandomPacketColor(theme),
        size: 2 + Math.random() * 3,
      })
    }

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set global opacity based on theme
      ctx.globalAlpha = theme === "dark" ? 1.0 : 0.7

      // Draw connections between nodes
      drawConnections(ctx, nodes, theme)

      // Update and draw nodes
      nodes.forEach((node) => {
        // Move nodes
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Draw node
        drawNode(ctx, node, theme)
      })

      // Update and draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const packet = packets[i]
        packet.progress += packet.speed

        // Calculate current position
        packet.x = lerp(packet.x, packet.targetX, packet.speed)
        packet.y = lerp(packet.y, packet.targetY, packet.speed)

        // Draw packet
        drawPacket(ctx, packet)

        // Remove packet if it reached its destination
        if (Math.abs(packet.x - packet.targetX) < 5 && Math.abs(packet.y - packet.targetY) < 5) {
          packets.splice(i, 1)
        }
      }

      // Randomly create new packets
      if (Math.random() < 0.05 && packets.length < 20) {
        createPacket()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Clean up
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
}

// Helper functions and types
type NodeType = "default" | "shield" | "lock" | "server"

interface Node {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  type: NodeType
}

interface Packet {
  x: number
  y: number
  targetX: number
  targetY: number
  progress: number
  speed: number
  color: string
  size: number
}

function getRandomNodeType(): NodeType {
  const types: NodeType[] = ["shield", "lock", "server"]
  return types[Math.floor(Math.random() * types.length)]
}

function getRandomPacketColor(theme: string | undefined): string {
  const darkModeColors = [
    "rgba(56, 189, 248, 0.8)", // Bright cyan
    "rgba(232, 121, 249, 0.8)", // Bright pink
    "rgba(74, 222, 128, 0.8)", // Bright green
    "rgba(250, 204, 21, 0.8)", // Bright yellow
    "rgba(248, 113, 113, 0.8)", // Bright red
  ]

  const lightModeColors = [
    "rgba(2, 132, 199, 0.8)", // Blue
    "rgba(162, 28, 175, 0.8)", // Purple
    "rgba(22, 163, 74, 0.8)", // Green
    "rgba(202, 138, 4, 0.8)", // Yellow
    "rgba(220, 38, 38, 0.8)", // Red
  ]

  const colors = theme === "dark" ? darkModeColors : lightModeColors
  return colors[Math.floor(Math.random() * colors.length)]
}

function drawConnections(ctx: CanvasRenderingContext2D, nodes: Node[], theme: string | undefined) {
  const connectionDistance = 150
  const lineColor = theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"

  ctx.strokeStyle = lineColor
  ctx.lineWidth = theme === "dark" ? 0.8 : 0.5

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < connectionDistance) {
        const opacity = 1 - distance / connectionDistance
        ctx.globalAlpha = opacity * (theme === "dark" ? 0.3 : 0.15)

        ctx.beginPath()
        ctx.moveTo(nodes[i].x, nodes[i].y)
        ctx.lineTo(nodes[j].x, nodes[j].y)
        ctx.stroke()
      }
    }
  }

  ctx.globalAlpha = theme === "dark" ? 1.0 : 0.7
}

function drawNode(ctx: CanvasRenderingContext2D, node: Node, theme: string | undefined) {
  const isDark = theme === "dark"

  if (node.type === "default") {
    // Draw regular node
    ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.5)"
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
    ctx.fill()

    // Add glow effect in dark mode
    if (isDark) {
      ctx.shadowColor = "rgba(255, 255, 255, 0.5)"
      ctx.shadowBlur = 5
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius * 0.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }
  } else {
    // Draw special node types
    const size = 12
    ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.7)"

    // Draw different shapes based on node type
    switch (node.type) {
      case "shield":
        drawShield(ctx, node.x, node.y, size, isDark)
        break
      case "lock":
        drawLock(ctx, node.x, node.y, size, isDark)
        break
      case "server":
        drawServer(ctx, node.x, node.y, size, isDark)
        break
    }

    // Add pulse effect
    drawPulse(ctx, node.x, node.y, isDark)
  }
}

function drawShield(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isDark: boolean) {
  ctx.fillStyle = isDark ? "#60a5fa" : "#3b82f6" // Blue
  ctx.beginPath()
  ctx.moveTo(x, y - size)
  ctx.lineTo(x + size, y - size / 2)
  ctx.lineTo(x + size, y + size / 2)
  ctx.lineTo(x, y + size)
  ctx.lineTo(x - size, y + size / 2)
  ctx.lineTo(x - size, y - size / 2)
  ctx.closePath()
  ctx.fill()

  // Inner details
  ctx.fillStyle = isDark ? "white" : "#1e40af"
  ctx.beginPath()
  ctx.moveTo(x, y - size / 2)
  ctx.lineTo(x + size / 2, y)
  ctx.lineTo(x, y + size / 2)
  ctx.lineTo(x - size / 2, y)
  ctx.closePath()
  ctx.fill()
}

function drawLock(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isDark: boolean) {
  // Lock body
  ctx.fillStyle = isDark ? "#f59e0b" : "#d97706" // Amber
  ctx.fillRect(x - size / 2, y - size / 3, size, size)

  // Lock arc
  ctx.strokeStyle = isDark ? "#f59e0b" : "#d97706"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(x, y - size / 3, size / 2, Math.PI, 0)
  ctx.stroke()

  // Keyhole
  ctx.fillStyle = isDark ? "white" : "#7c2d12"
  ctx.beginPath()
  ctx.arc(x, y, size / 4, 0, Math.PI * 2)
  ctx.fill()
}

function drawServer(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isDark: boolean) {
  // Server rack
  ctx.fillStyle = isDark ? "#a855f7" : "#9333ea" // Purple
  ctx.fillRect(x - size / 2, y - size, size, size * 2)

  // Server details
  const serverLevels = 3
  const levelHeight = (size * 2) / serverLevels

  ctx.fillStyle = isDark ? "white" : "#581c87"
  for (let i = 0; i < serverLevels; i++) {
    const levelY = y - size + i * levelHeight + levelHeight / 4
    ctx.fillRect(x - size / 3, levelY, size / 1.5, levelHeight / 2)
  }
}

function drawPulse(ctx: CanvasRenderingContext2D, x: number, y: number, isDark: boolean) {
  const time = Date.now() / 1000
  const maxRadius = 20
  const pulseSpeed = 1.5

  // Calculate pulse radius based on time
  const pulseRadius = ((Math.sin(time * pulseSpeed) + 1) / 2) * maxRadius

  // Draw pulse circle
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, pulseRadius)

  if (isDark) {
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)")
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
  } else {
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.2)")
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
  }

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(x, y, pulseRadius, 0, Math.PI * 2)
  ctx.fill()
}

function drawPacket(ctx: CanvasRenderingContext2D, packet: Packet) {
  ctx.fillStyle = packet.color
  ctx.beginPath()
  ctx.arc(packet.x, packet.y, packet.size, 0, Math.PI * 2)
  ctx.fill()
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

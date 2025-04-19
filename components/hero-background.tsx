"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface Node {
  x: number
  y: number
  radius: number
  type: "shield" | "lock" | "server"
  connections: number[]
  pulseRadius: number
  pulseOpacity: number
  pulseDirection: number
}

interface DataPacket {
  sourceIndex: number
  targetIndex: number
  x: number
  y: number
  progress: number
  speed: number
  color: string
}

const HeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with proper DPI scaling
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = 400 * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = "400px"
      ctx.scale(dpr, dpr)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create security nodes
    const nodes: Node[] = []
    const numNodes = 12
    const minDistance = 150

    // Create nodes with minimum distance between them
    for (let i = 0; i < numNodes; i++) {
      let x, y
      let tooClose
      do {
        tooClose = false
        x = Math.random() * (window.innerWidth - 100) + 50
        y = Math.random() * (350 - 100) + 50

        // Check distance from other nodes
        for (let j = 0; j < nodes.length; j++) {
          const dx = x - nodes[j].x
          const dy = y - nodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < minDistance) {
            tooClose = true
            break
          }
        }
      } while (tooClose)

      // Assign node type
      let type: "shield" | "lock" | "server"
      const typeRand = Math.random()
      if (typeRand < 0.33) {
        type = "shield"
      } else if (typeRand < 0.66) {
        type = "lock"
      } else {
        type = "server"
      }

      nodes.push({
        x,
        y,
        radius: 15 + Math.random() * 10,
        type,
        connections: [],
        pulseRadius: 0,
        pulseOpacity: 0,
        pulseDirection: 1,
      })
    }

    // Create connections between nodes
    for (let i = 0; i < nodes.length; i++) {
      const numConnections = 1 + Math.floor(Math.random() * 2) // 1-2 connections per node
      const possibleTargets = [...Array(nodes.length).keys()].filter((j) => j !== i)
      possibleTargets.sort(() => Math.random() - 0.5) // Shuffle

      for (let c = 0; c < Math.min(numConnections, possibleTargets.length); c++) {
        const targetIndex = possibleTargets[c]
        if (!nodes[i].connections.includes(targetIndex)) {
          nodes[i].connections.push(targetIndex)
        }
      }
    }

    // Create data packets
    const dataPackets: DataPacket[] = []
    const createDataPacket = () => {
      const sourceIndex = Math.floor(Math.random() * nodes.length)
      if (nodes[sourceIndex].connections.length === 0) return

      const targetIndex =
        nodes[sourceIndex].connections[Math.floor(Math.random() * nodes[sourceIndex].connections.length)]

      // Determine color based on node type (security-themed)
      let color
      switch (nodes[sourceIndex].type) {
        case "shield":
          color = "rgba(0, 150, 255, 0.8)" // Blue for shield (protection)
          break
        case "lock":
          color = "rgba(0, 255, 150, 0.8)" // Green for lock (secure)
          break
        case "server":
          color = "rgba(255, 200, 0, 0.8)" // Yellow for server (data)
          break
        default:
          color = "rgba(0, 150, 255, 0.8)"
      }

      dataPackets.push({
        sourceIndex,
        targetIndex,
        x: nodes[sourceIndex].x,
        y: nodes[sourceIndex].y,
        progress: 0,
        speed: 0.005 + Math.random() * 0.01,
        color,
      })
    }

    // Draw shield icon
    const drawShield = (x: number, y: number, radius: number, color: string) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.beginPath()
      ctx.moveTo(0, -radius)
      ctx.bezierCurveTo(radius * 0.8, -radius * 0.8, radius, -radius * 0.5, radius, 0)
      ctx.bezierCurveTo(radius, radius * 0.6, radius * 0.5, radius, 0, radius)
      ctx.bezierCurveTo(-radius * 0.5, radius, -radius, radius * 0.6, -radius, 0)
      ctx.bezierCurveTo(-radius, -radius * 0.5, -radius * 0.8, -radius * 0.8, 0, -radius)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()

      // Draw checkmark inside shield
      ctx.beginPath()
      ctx.moveTo(-radius * 0.3, 0)
      ctx.lineTo(-radius * 0.1, radius * 0.3)
      ctx.lineTo(radius * 0.4, -radius * 0.3)
      ctx.strokeStyle = isDark ? "#111827" : "#ffffff"
      ctx.lineWidth = radius * 0.15
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.stroke()
      ctx.restore()
    }

    // Draw lock icon
    const drawLock = (x: number, y: number, radius: number, color: string) => {
      ctx.save()
      ctx.translate(x, y)

      // Lock body
      ctx.beginPath()
      ctx.roundRect(-radius * 0.7, -radius * 0.3, radius * 1.4, radius * 1.3, radius * 0.3)
      ctx.fillStyle = color
      ctx.fill()

      // Lock shackle
      ctx.beginPath()
      ctx.moveTo(-radius * 0.3, -radius * 0.3)
      ctx.arcTo(-radius * 0.3, -radius, 0, -radius, radius * 0.3)
      ctx.arcTo(radius * 0.3, -radius, radius * 0.3, -radius * 0.3, radius * 0.3)
      ctx.lineTo(radius * 0.3, -radius * 0.3)
      ctx.lineWidth = radius * 0.2
      ctx.strokeStyle = color
      ctx.stroke()

      // Keyhole
      ctx.beginPath()
      ctx.arc(0, radius * 0.2, radius * 0.2, 0, Math.PI * 2)
      ctx.fillStyle = isDark ? "#111827" : "#ffffff"
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(0, radius * 0.2)
      ctx.lineTo(0, radius * 0.6)
      ctx.lineWidth = radius * 0.15
      ctx.strokeStyle = isDark ? "#111827" : "#ffffff"
      ctx.stroke()

      ctx.restore()
    }

    // Draw server icon
    const drawServer = (x: number, y: number, radius: number, color: string) => {
      ctx.save()
      ctx.translate(x, y)

      // Server rack
      ctx.beginPath()
      ctx.roundRect(-radius * 0.7, -radius, radius * 1.4, radius * 2, radius * 0.2)
      ctx.fillStyle = color
      ctx.fill()

      // Server units
      const unitHeight = radius * 0.4
      const unitSpacing = radius * 0.1
      const startY = -radius + unitSpacing

      for (let i = 0; i < 3; i++) {
        const unitY = startY + i * (unitHeight + unitSpacing)
        ctx.beginPath()
        ctx.roundRect(-radius * 0.6, unitY, radius * 1.2, unitHeight, radius * 0.1)
        ctx.fillStyle = isDark ? "#111827" : "#ffffff"
        ctx.fill()

        // LED
        ctx.beginPath()
        ctx.arc(radius * 0.4, unitY + unitHeight * 0.5, radius * 0.05, 0, Math.PI * 2)
        ctx.fillStyle = i % 2 === 0 ? "#10B981" : "#3B82F6"
        ctx.fill()
      }

      ctx.restore()
    }

    // Animation loop
    let animationFrameId: number
    let lastTime = 0
    const fps = 60
    const interval = 1000 / fps

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate)

      const delta = currentTime - lastTime
      if (delta < interval) return

      lastTime = currentTime - (delta % interval)

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid background
      const gridSize = 30
      const gridColor = isDark ? "rgba(30, 58, 138, 0.1)" : "rgba(30, 58, 138, 0.05)"

      ctx.beginPath()
      for (let x = 0; x < window.innerWidth; x += gridSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 400)
      }
      for (let y = 0; y < 400; y += gridSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(window.innerWidth, y)
      }
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        for (const targetIndex of node.connections) {
          const targetNode = nodes[targetIndex]
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(targetNode.x, targetNode.y)
          ctx.strokeStyle = isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.15)"
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // Update and draw data packets
      for (let i = dataPackets.length - 1; i >= 0; i--) {
        const packet = dataPackets[i]
        packet.progress += packet.speed

        if (packet.progress >= 1) {
          // Remove completed packet
          dataPackets.splice(i, 1)
          continue
        }

        const sourceNode = nodes[packet.sourceIndex]
        const targetNode = nodes[packet.targetIndex]

        packet.x = sourceNode.x + (targetNode.x - sourceNode.x) * packet.progress
        packet.y = sourceNode.y + (targetNode.y - sourceNode.y) * packet.progress

        // Draw data packet
        ctx.beginPath()
        ctx.arc(packet.x, packet.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = packet.color
        ctx.fill()
      }

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        // Update pulse effect
        if (node.pulseDirection > 0) {
          node.pulseRadius += 0.5
          node.pulseOpacity -= 0.01
          if (node.pulseRadius > node.radius * 2) {
            node.pulseDirection = -1
          }
        } else {
          node.pulseRadius -= 0.5
          node.pulseOpacity += 0.01
          if (node.pulseRadius < node.radius * 0.5) {
            node.pulseDirection = 1
          }
        }

        // Draw pulse
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.pulseRadius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${node.pulseOpacity * 0.2})`
        ctx.fill()

        // Draw node based on type
        const nodeColor = isDark ? "rgba(59, 130, 246, 0.8)" : "rgba(59, 130, 246, 0.7)"

        switch (node.type) {
          case "shield":
            drawShield(node.x, node.y, node.radius, nodeColor)
            break
          case "lock":
            drawLock(node.x, node.y, node.radius, nodeColor)
            break
          case "server":
            drawServer(node.x, node.y, node.radius, nodeColor)
            break
        }
      }

      // Randomly create new data packets
      if (Math.random() < 0.03) {
        createDataPacket()
      }
    }

    animate(0)

    // Create initial data packets
    for (let i = 0; i < 5; i++) {
      createDataPacket()
    }

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-[400px]" style={{ opacity: 0.9 }} />
    </div>
  )
}

export default HeroBackground

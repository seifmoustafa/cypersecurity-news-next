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

    // Types
    interface Server {
      x: number
      y: number
      size: number
      type: "server" | "database" | "cloud"
      isProtected: boolean
      shieldRadius: number
      shieldOpacity: number
      shieldPulse: number
      dataStored: number
      encryptionLevel: number
      isUnderAttack: boolean
      connections: number[] // IDs of connected servers
    }

    interface Connection {
      from: number
      to: number
      width: number
      security: number
      pulsePosition: number
      pulseDirection: number
    }

    interface DataPacket {
      x: number
      y: number
      fromServer: number
      toServer: number
      progress: number
      speed: number
      size: number
      isEncrypted: boolean
      encryptionAnimation: number
      color: string
    }

    interface EncryptionKey {
      serverId: number
      angle: number
      distance: number
      rotationSpeed: number
      size: number
    }

    interface Shield {
      serverId: number
      opacity: number
      pulseRate: number
      pulseAmount: number
      currentPulse: number
    }

    interface Attacker {
      x: number
      y: number
      targetServerId: number
      speed: number
      size: number
      attackStrength: number
      isActive: boolean
      activationTime: number
      lastActivationCheck: number
    }

    interface AttackVisual {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      life: number
      color: string
    }

    interface ShieldBlock {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      life: number
      color: string
    }

    // Create a structured network layout
    const servers: Server[] = []
    const connections: Connection[] = []
    const dataPackets: DataPacket[] = []
    const encryptionKeys: EncryptionKey[] = []
    const shields: Shield[] = []
    const attackers: Attacker[] = []

    // Initialize visual effects arrays BEFORE they're used
    const attackVisuals: AttackVisual[] = []
    const shieldBlocks: ShieldBlock[] = []

    // Initialize servers in a structured layout
    const initializeServers = () => {
      const numServers = 5
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) * 0.3

      // Create a central server
      servers.push({
        x: centerX,
        y: centerY,
        size: 40,
        type: "database",
        isProtected: true,
        shieldRadius: 60,
        shieldOpacity: 0.8,
        shieldPulse: 0,
        dataStored: 100,
        encryptionLevel: 100,
        isUnderAttack: false,
        connections: [],
      })

      // Create servers in a circle around the central server
      for (let i = 0; i < numServers; i++) {
        const angle = (i * Math.PI * 2) / numServers
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        const serverType = i % 2 === 0 ? "server" : "cloud"

        servers.push({
          x,
          y,
          size: 30,
          type: serverType,
          isProtected: true,
          shieldRadius: 45,
          shieldOpacity: 0.6,
          shieldPulse: Math.random(),
          dataStored: 70 + Math.random() * 30,
          encryptionLevel: 80 + Math.random() * 20,
          isUnderAttack: false,
          connections: [],
        })
      }
    }

    // Create connections between servers
    const createConnections = () => {
      // Connect central server to all other servers
      for (let i = 1; i < servers.length; i++) {
        connections.push({
          from: 0,
          to: i,
          width: 3,
          security: 100,
          pulsePosition: Math.random(),
          pulseDirection: 1,
        })

        // Add connection reference to servers
        servers[0].connections.push(i)
        servers[i].connections.push(0)
      }

      // Connect some peripheral servers to each other
      for (let i = 1; i < servers.length - 1; i++) {
        connections.push({
          from: i,
          to: i + 1,
          width: 2,
          security: 90,
          pulsePosition: Math.random(),
          pulseDirection: 1,
        })

        // Add connection reference to servers
        servers[i].connections.push(i + 1)
        servers[i + 1].connections.push(i)
      }

      // Connect last to first to complete the circle
      connections.push({
        from: servers.length - 1,
        to: 1,
        width: 2,
        security: 90,
        pulsePosition: Math.random(),
        pulseDirection: 1,
      })

      servers[servers.length - 1].connections.push(1)
      servers[1].connections.push(servers.length - 1)
    }

    // Create encryption keys
    const createEncryptionKeys = () => {
      for (let i = 0; i < servers.length; i++) {
        encryptionKeys.push({
          serverId: i,
          angle: Math.random() * Math.PI * 2,
          distance: servers[i].size * 0.8,
          rotationSpeed: 0.01 + Math.random() * 0.02,
          size: 10 + Math.random() * 5,
        })
      }
    }

    // Create shields around servers
    const createShields = () => {
      for (let i = 0; i < servers.length; i++) {
        shields.push({
          serverId: i,
          opacity: 0.7,
          pulseRate: 0.02 + Math.random() * 0.01,
          pulseAmount: 0.2,
          currentPulse: Math.random(),
        })
      }
    }

    // Create attackers
    const createAttackers = () => {
      const numAttackers = 3
      for (let i = 0; i < numAttackers; i++) {
        // Position attackers outside the canvas
        const angle = Math.random() * Math.PI * 2
        const distance = Math.max(canvas.width, canvas.height)
        const x = canvas.width / 2 + Math.cos(angle) * distance
        const y = canvas.height / 2 + Math.sin(angle) * distance

        // Target a random server
        const targetServer = Math.floor(Math.random() * servers.length)

        attackers.push({
          x,
          y,
          targetServerId: targetServer,
          speed: 0.5 + Math.random() * 0.5,
          size: 15,
          attackStrength: 30 + Math.random() * 20,
          isActive: false,
          activationTime: 3000 + Math.random() * 5000, // Random delay before activation
          lastActivationCheck: 0,
        })
      }
    }

    // Visual effects functions
    function createAttackVisual(x: number, y: number, server: Server, theme: string | undefined) {
      const particleCount = 10
      const color = theme === "dark" ? "rgba(248, 113, 113, 0.9)" : "rgba(220, 38, 38, 0.9)"

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 1 + Math.random() * 2
        const size = 3 + Math.random() * 3

        attackVisuals.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size,
          life: 1.0,
          color,
        })
      }
    }

    function createShieldBlockEffect(x: number, y: number, server: Server, theme: string | undefined) {
      const particleCount = 15
      const color = theme === "dark" ? "rgba(56, 189, 248, 0.9)" : "rgba(2, 132, 199, 0.9)"

      // Calculate angle from attacker to server center
      const dx = server.x - x
      const dy = server.y - y
      const angle = Math.atan2(dy, dx)

      for (let i = 0; i < particleCount; i++) {
        // Particles should spread in a cone away from the server
        const particleAngle = angle + Math.PI + ((Math.random() - 0.5) * Math.PI) / 2
        const speed = 2 + Math.random() * 3
        const size = 4 + Math.random() * 4

        shieldBlocks.push({
          x,
          y,
          vx: Math.cos(particleAngle) * speed,
          vy: Math.sin(particleAngle) * speed,
          size,
          life: 1.0,
          color,
        })
      }
    }

    function updateVisualEffects(ctx: CanvasRenderingContext2D) {
      // Update attack visuals
      for (let i = attackVisuals.length - 1; i >= 0; i--) {
        const visual = attackVisuals[i]
        visual.x += visual.vx
        visual.y += visual.vy
        visual.life -= 0.03

        if (visual.life <= 0) {
          attackVisuals.splice(i, 1)
          continue
        }

        ctx.globalAlpha = visual.life
        ctx.fillStyle = visual.color
        ctx.beginPath()
        ctx.arc(visual.x, visual.y, visual.size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Update shield block effects
      for (let i = shieldBlocks.length - 1; i >= 0; i--) {
        const block = shieldBlocks[i]
        block.x += block.vx
        block.y += block.vy
        block.life -= 0.02

        if (block.life <= 0) {
          shieldBlocks.splice(i, 1)
          continue
        }

        ctx.globalAlpha = block.life
        ctx.fillStyle = block.color
        ctx.beginPath()
        ctx.arc(block.x, block.y, block.size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1.0
    }

    // Initialize all elements
    initializeServers()
    createConnections()
    createEncryptionKeys()
    createShields()
    createAttackers()

    // Create a data packet
    const createDataPacket = (fromServer: number, toServer: number, isEncrypted = true) => {
      const from = servers[fromServer]
      const to = servers[toServer]

      dataPackets.push({
        x: from.x,
        y: from.y,
        fromServer: fromServer,
        toServer: toServer,
        progress: 0,
        speed: 0.005 + Math.random() * 0.005,
        size: 8,
        isEncrypted,
        encryptionAnimation: 0,
        color: isEncrypted
          ? theme === "dark"
            ? "rgba(56, 189, 248, 0.9)"
            : "rgba(2, 132, 199, 0.9)"
          : theme === "dark"
            ? "rgba(248, 113, 113, 0.9)"
            : "rgba(220, 38, 38, 0.9)",
      })
    }

    // Animation variables
    let lastTime = 0
    let packetTimer = 0
    let attackTimer = 0
    let animationFrameId: number

    // Animation loop
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime
      lastTime = timestamp

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      drawConnections(ctx, servers, connections, theme)

      // Update and draw servers
      servers.forEach((server, index) => {
        // Update shield pulse
        server.shieldPulse = (server.shieldPulse + 0.01) % 1

        drawServer(ctx, server, theme)
      })

      // Update and draw encryption keys
      encryptionKeys.forEach((key) => {
        // Rotate keys around servers
        key.angle += key.rotationSpeed

        drawEncryptionKey(ctx, key, servers[key.serverId], theme)
      })

      // Update and draw shields
      shields.forEach((shield) => {
        const server = servers[shield.serverId]
        shield.currentPulse = (shield.currentPulse + shield.pulseRate) % 1
        const pulseEffect = Math.sin(shield.currentPulse * Math.PI * 2) * shield.pulseAmount

        // Only draw shield if server is protected
        if (server.isProtected) {
          drawShield(ctx, server, shield, pulseEffect, theme)
        }
      })

      // Update and draw data packets
      for (let i = dataPackets.length - 1; i >= 0; i--) {
        const packet = dataPackets[i]
        const fromServer = servers[packet.fromServer]
        const toServer = servers[packet.toServer]

        // Update packet position
        packet.progress += packet.speed
        if (packet.progress >= 1) {
          // Packet reached destination
          dataPackets.splice(i, 1)
          continue
        }

        // Calculate current position
        packet.x = fromServer.x + (toServer.x - fromServer.x) * packet.progress
        packet.y = fromServer.y + (toServer.y - fromServer.y) * packet.progress

        // Update encryption animation
        packet.encryptionAnimation = (packet.encryptionAnimation + 0.05) % 1

        drawDataPacket(ctx, packet, theme, servers)
      }

      // Update and draw attackers
      for (let i = attackers.length - 1; i >= 0; i--) {
        const attacker = attackers[i]
        const targetServer = servers[attacker.targetServerId]

        // Check if attacker should activate
        if (!attacker.isActive) {
          if (timestamp - attacker.lastActivationCheck > attacker.activationTime) {
            attacker.isActive = true
          }
          attacker.lastActivationCheck = timestamp
          continue
        }

        // Move attacker toward target
        const dx = targetServer.x - attacker.x
        const dy = targetServer.y - attacker.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > targetServer.shieldRadius + 10) {
          // Move toward target
          attacker.x += (dx / distance) * attacker.speed
          attacker.y += (dy / distance) * attacker.speed
        } else {
          // Attack the server
          targetServer.isUnderAttack = true

          // Create attack visual
          createAttackVisual(attacker.x, attacker.y, targetServer, theme)

          // If server is protected, show shield blocking
          if (targetServer.isProtected) {
            // Shield blocks attack
            createShieldBlockEffect(attacker.x, attacker.y, targetServer, theme)

            // Reset attacker position
            const newAngle = Math.random() * Math.PI * 2
            const newDistance = Math.max(canvas.width, canvas.height)
            attacker.x = canvas.width / 2 + Math.cos(newAngle) * newDistance
            attacker.y = canvas.height / 2 + Math.sin(newAngle) * newDistance

            // Target a different server
            attacker.targetServerId = Math.floor(Math.random() * servers.length)
            attacker.isActive = false
            attacker.activationTime = 3000 + Math.random() * 5000
          } else {
            // Attack succeeds
            targetServer.encryptionLevel -= attacker.attackStrength / 100
            if (targetServer.encryptionLevel < 0) targetServer.encryptionLevel = 0

            // Reset attacker
            attackers.splice(i, 1)
          }
        }

        drawAttacker(ctx, attacker, theme)
      }

      // Create new data packets periodically
      packetTimer += deltaTime
      if (packetTimer > 1000) {
        // Select random source and destination servers
        const fromServer = Math.floor(Math.random() * servers.length)
        let toServer
        if (servers[fromServer].connections.length > 0) {
          // Select a connected server
          const connectedServers = servers[fromServer].connections
          toServer = connectedServers[Math.floor(Math.random() * connectedServers.length)]
        } else {
          // Fallback to a random server
          do {
            toServer = Math.floor(Math.random() * servers.length)
          } while (toServer === fromServer)
        }

        // 90% chance of encrypted packet, 10% chance of unencrypted
        const isEncrypted = Math.random() < 0.9
        createDataPacket(fromServer, toServer, isEncrypted)
        packetTimer = 0
      }

      // Create new attackers periodically
      attackTimer += deltaTime
      if (attackTimer > 8000 && attackers.length < 5) {
        createAttackers()
        attackTimer = 0
      }

      // Update connection pulses
      connections.forEach((connection) => {
        connection.pulsePosition += 0.005 * connection.pulseDirection
        if (connection.pulsePosition > 1) {
          connection.pulsePosition = 1
          connection.pulseDirection = -1
        } else if (connection.pulsePosition < 0) {
          connection.pulsePosition = 0
          connection.pulseDirection = 1
        }
      })

      // Reset attack status after a delay
      servers.forEach((server) => {
        if (server.isUnderAttack) {
          server.isUnderAttack = false
        }
      })

      // Update visual effects
      updateVisualEffects(ctx)

      animationFrameId = requestAnimationFrame(animate)
    }

    // Start animation
    animate(0)

    // Clean up
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
}

// Drawing functions
function drawConnections(ctx: CanvasRenderingContext2D, servers: any[], connections: any[], theme: string | undefined) {
  const isDark = theme === "dark"

  connections.forEach((connection) => {
    const fromServer = servers[connection.from]
    const toServer = servers[connection.to]

    // Draw main connection line
    ctx.strokeStyle = isDark ? "rgba(148, 163, 184, 0.7)" : "rgba(71, 85, 105, 0.6)"
    ctx.lineWidth = connection.width
    ctx.beginPath()
    ctx.moveTo(fromServer.x, fromServer.y)
    ctx.lineTo(toServer.x, toServer.y)
    ctx.stroke()

    // Draw security level indicator (thicker = more secure)
    const securityWidth = (connection.security / 100) * connection.width * 2
    ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.8)" : "rgba(2, 132, 199, 0.7)"
    ctx.lineWidth = securityWidth
    ctx.beginPath()
    ctx.moveTo(fromServer.x, fromServer.y)
    ctx.lineTo(toServer.x, toServer.y)
    ctx.stroke()

    // Draw pulse along the connection
    const pulseX = fromServer.x + (toServer.x - fromServer.x) * connection.pulsePosition
    const pulseY = fromServer.y + (toServer.y - fromServer.y) * connection.pulsePosition

    ctx.fillStyle = isDark ? "rgba(56, 189, 248, 0.9)" : "rgba(2, 132, 199, 0.8)"
    ctx.beginPath()
    ctx.arc(pulseX, pulseY, connection.width * 2, 0, Math.PI * 2)
    ctx.fill()
  })
}

function drawServer(ctx: CanvasRenderingContext2D, server: any, theme: string | undefined) {
  const isDark = theme === "dark"

  // Draw server based on type
  switch (server.type) {
    case "server":
      drawServerRack(ctx, server, isDark)
      break
    case "database":
      drawDatabase(ctx, server, isDark)
      break
    case "cloud":
      drawCloud(ctx, server, isDark)
      break
  }

  // Draw encryption level indicator
  drawEncryptionLevel(ctx, server, isDark)

  // Draw attack effect if under attack
  if (server.isUnderAttack) {
    drawAttackEffect(ctx, server, isDark)
  }
}

function drawServerRack(ctx: CanvasRenderingContext2D, server: any, isDark: boolean) {
  // Server rack body
  const rackWidth = server.size * 1.5
  const rackHeight = server.size * 2

  // Draw server rack shadow
  ctx.fillStyle = isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(148, 163, 184, 0.5)"
  ctx.fillRect(server.x - rackWidth / 2 + 4, server.y - rackHeight / 2 + 4, rackWidth, rackHeight)

  // Draw server rack body
  ctx.fillStyle = isDark ? "rgba(71, 85, 105, 0.9)" : "rgba(226, 232, 240, 0.9)"
  ctx.fillRect(server.x - rackWidth / 2, server.y - rackHeight / 2, rackWidth, rackHeight)

  // Draw server units
  const unitCount = 5
  const unitHeight = rackHeight / (unitCount + 1)
  const unitWidth = rackWidth * 0.8

  for (let i = 0; i < unitCount; i++) {
    const unitY = server.y - rackHeight / 2 + (i + 1) * unitHeight

    // Unit background
    ctx.fillStyle = isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(100, 116, 139, 0.8)"
    ctx.fillRect(server.x - unitWidth / 2, unitY - unitHeight / 2, unitWidth, unitHeight * 0.8)

    // Unit LEDs
    const ledSize = 3
    const ledCount = 3
    const ledSpacing = unitWidth / (ledCount + 1)

    for (let j = 0; j < ledCount; j++) {
      const ledX = server.x - unitWidth / 2 + (j + 1) * ledSpacing
      const ledY = unitY

      // Randomly determine if LED is active
      const isActive = Math.random() > 0.3

      ctx.fillStyle = isActive
        ? isDark
          ? "rgba(34, 197, 94, 0.9)"
          : "rgba(22, 163, 74, 0.9)"
        : isDark
          ? "rgba(248, 113, 113, 0.9)"
          : "rgba(220, 38, 38, 0.9)"

      ctx.beginPath()
      ctx.arc(ledX, ledY, ledSize, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function drawDatabase(ctx: CanvasRenderingContext2D, server: any, isDark: boolean) {
  const dbWidth = server.size * 1.5
  const dbHeight = server.size * 2

  // Draw cylinder shadow
  ctx.fillStyle = isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(148, 163, 184, 0.5)"
  ctx.beginPath()
  ctx.ellipse(server.x + 4, server.y - dbHeight / 2 + 4, dbWidth / 2, dbWidth / 4, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(148, 163, 184, 0.5)"
  ctx.beginPath()
  ctx.ellipse(server.x + 4, server.y + dbHeight / 2 + 4, dbWidth / 2, dbWidth / 4, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(148, 163, 184, 0.5)"
  ctx.fillRect(server.x - dbWidth / 2 + 4, server.y - dbHeight / 2 + 4, dbWidth, dbHeight)

  // Draw cylinder body
  // Top ellipse
  ctx.fillStyle = isDark ? "rgba(56, 189, 248, 0.9)" : "rgba(2, 132, 199, 0.8)"
  ctx.beginPath()
  ctx.ellipse(server.x, server.y - dbHeight / 2, dbWidth / 2, dbWidth / 4, 0, 0, Math.PI * 2)
  ctx.fill()

  // Bottom ellipse
  ctx.fillStyle = isDark ? "rgba(56, 189, 248, 0.9)" : "rgba(2, 132, 199, 0.8)"
  ctx.beginPath()
  ctx.ellipse(server.x, server.y + dbHeight / 2, dbWidth / 2, dbWidth / 4, 0, 0, Math.PI * 2)
  ctx.fill()

  // Rectangle connecting ellipses
  ctx.fillStyle = isDark ? "rgba(56, 189, 248, 0.9)" : "rgba(2, 132, 199, 0.8)"
  ctx.fillRect(server.x - dbWidth / 2, server.y - dbHeight / 2, dbWidth, dbHeight)

  // Database details - horizontal lines
  ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.7)"
  ctx.lineWidth = 2

  // Draw horizontal lines
  for (let i = 1; i < 3; i++) {
    const lineY = server.y - dbHeight / 2 + (dbHeight * i) / 3
    ctx.beginPath()
    ctx.ellipse(server.x, lineY, dbWidth / 2, dbWidth / 4, 0, 0, Math.PI)
    ctx.stroke()
  }

  // Draw data symbols
  const symbolCount = 3
  for (let i = 0; i < symbolCount; i++) {
    const symbolX = server.x - dbWidth / 3 + (i * dbWidth) / 1.5
    const symbolY = server.y

    ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.9)"
    ctx.font = "bold 14px monospace"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("01", symbolX, symbolY)
  }
}

function drawCloud(ctx: CanvasRenderingContext2D, server: any, isDark: boolean) {
  const cloudRadius = server.size

  // Draw cloud shadow
  ctx.fillStyle = isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(148, 163, 184, 0.5)"
  drawCloudShape(ctx, server.x + 4, server.y + 4, cloudRadius)

  // Draw cloud
  ctx.fillStyle = isDark ? "rgba(148, 163, 184, 0.9)" : "rgba(226, 232, 240, 0.9)"
  drawCloudShape(ctx, server.x, server.y, cloudRadius)

  // Draw server icon inside cloud
  const serverIconSize = cloudRadius * 0.6
  ctx.fillStyle = isDark ? "rgba(56, 189, 248, 0.9)" : "rgba(2, 132, 199, 0.8)"
  ctx.fillRect(server.x - serverIconSize / 2, server.y - serverIconSize / 2, serverIconSize, serverIconSize)

  // Draw server details
  const lineSpacing = serverIconSize / 4
  ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.9)"
  ctx.lineWidth = 1.5

  for (let i = 0; i < 3; i++) {
    const lineY = server.y - serverIconSize / 3 + i * lineSpacing
    ctx.beginPath()
    ctx.moveTo(server.x - serverIconSize / 3, lineY)
    ctx.lineTo(server.x + serverIconSize / 3, lineY)
    ctx.stroke()
  }
}

function drawCloudShape(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  ctx.beginPath()
  // Draw cloud circles
  ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2)
  ctx.arc(x + radius * 0.5, y - radius * 0.3, radius * 0.5, 0, Math.PI * 2)
  ctx.arc(x - radius * 0.5, y - radius * 0.2, radius * 0.6, 0, Math.PI * 2)
  ctx.arc(x + radius * 0.6, y + radius * 0.2, radius * 0.4, 0, Math.PI * 2)
  ctx.arc(x - radius * 0.6, y + radius * 0.3, radius * 0.5, 0, Math.PI * 2)
  ctx.fill()
}

function drawEncryptionLevel(ctx: CanvasRenderingContext2D, server: any, isDark: boolean) {
  const radius = server.size * 1.2
  const encryptionPercentage = server.encryptionLevel / 100

  // Draw encryption level indicator
  ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(server.x, server.y, radius, 0, Math.PI * 2)
  ctx.stroke()

  // Draw filled portion based on encryption level
  ctx.strokeStyle =
    encryptionPercentage > 0.7
      ? isDark
        ? "rgba(34, 197, 94, 0.9)"
        : "rgba(22, 163, 74, 0.8)" // Green for high encryption
      : encryptionPercentage > 0.3
        ? isDark
          ? "rgba(250, 204, 21, 0.9)"
          : "rgba(202, 138, 4, 0.8)" // Yellow for medium
        : isDark
          ? "rgba(248, 113, 113, 0.9)"
          : "rgba(220, 38, 38, 0.8)" // Red for low

  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(server.x, server.y, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * encryptionPercentage)
  ctx.stroke()
}

function drawAttackEffect(ctx: CanvasRenderingContext2D, server: any, isDark: boolean) {
  const radius = server.size * 1.5

  // Draw pulsing attack indicator
  const pulseSize = Math.sin(Date.now() / 100) * 5

  ctx.strokeStyle = isDark ? "rgba(248, 113, 113, 0.8)" : "rgba(220, 38, 38, 0.7)"
  ctx.lineWidth = 3 + pulseSize
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.arc(server.x, server.y, radius, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  // Draw warning symbol
  ctx.fillStyle = isDark ? "rgba(248, 113, 113, 0.9)" : "rgba(220, 38, 38, 0.8)"
  ctx.beginPath()
  ctx.moveTo(server.x, server.y - server.size / 2)
  ctx.lineTo(server.x + server.size / 2, server.y + server.size / 2)
  ctx.lineTo(server.x - server.size / 2, server.y + server.size / 2)
  ctx.closePath()
  ctx.fill()

  // Draw exclamation mark
  ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.9)"
  ctx.font = `bold ${server.size / 2}px sans-serif`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("!", server.x, server.y)
}

function drawEncryptionKey(ctx: CanvasRenderingContext2D, key: any, server: any, theme: string | undefined) {
  const isDark = theme === "dark"

  // Calculate position around server
  const x = server.x + Math.cos(key.angle) * key.distance
  const y = server.y + Math.sin(key.angle) * key.distance

  // Draw key
  ctx.fillStyle = isDark ? "rgba(250, 204, 21, 0.9)" : "rgba(202, 138, 4, 0.8)" // Gold/yellow for keys

  // Draw key head (circle)
  ctx.beginPath()
  ctx.arc(x, y, key.size / 2, 0, Math.PI * 2)
  ctx.fill()

  // Draw key teeth
  const keyLength = key.size * 1.5
  const angle = key.angle + Math.PI / 2 // Rotate 90 degrees

  const endX = x + Math.cos(angle) * keyLength
  const endY = y + Math.sin(angle) * keyLength

  // Key shaft
  ctx.lineWidth = key.size / 3
  ctx.strokeStyle = isDark ? "rgba(250, 204, 21, 0.9)" : "rgba(202, 138, 4, 0.8)"
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(endX, endY)
  ctx.stroke()

  // Key teeth
  const teethCount = 3
  const teethLength = key.size / 2
  const teethSpacing = keyLength / (teethCount + 1)

  for (let i = 1; i <= teethCount; i++) {
    const teethX = x + Math.cos(angle) * (i * teethSpacing)
    const teethY = y + Math.sin(angle) * (i * teethSpacing)

    const perpAngle = angle - Math.PI / 2 // Perpendicular to key shaft

    ctx.beginPath()
    ctx.moveTo(teethX, teethY)
    ctx.lineTo(teethX + Math.cos(perpAngle) * teethLength, teethY + Math.sin(perpAngle) * teethLength)
    ctx.stroke()
  }

  // Add glow effect in dark mode
  if (isDark) {
    ctx.shadowColor = "rgba(250, 204, 21, 0.6)"
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(x, y, key.size / 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

function drawShield(
  ctx: CanvasRenderingContext2D,
  server: any,
  shield: any,
  pulseEffect: number,
  theme: string | undefined,
) {
  const isDark = theme === "dark"
  const radius = server.shieldRadius * (1 + pulseEffect * 0.1)

  // Create gradient for shield
  const gradient = ctx.createRadialGradient(server.x, server.y, server.size, server.x, server.y, radius)

  if (isDark) {
    gradient.addColorStop(0, "rgba(56, 189, 248, 0.1)")
    gradient.addColorStop(0.7, "rgba(56, 189, 248, 0.05)")
    gradient.addColorStop(1, "rgba(56, 189, 248, 0)")
  } else {
    gradient.addColorStop(0, "rgba(2, 132, 199, 0.1)")
    gradient.addColorStop(0.7, "rgba(2, 132, 199, 0.05)")
    gradient.addColorStop(1, "rgba(2, 132, 199, 0)")
  }

  // Fill shield area
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(server.x, server.y, radius, 0, Math.PI * 2)
  ctx.fill()

  // Draw shield perimeter
  ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.5)" : "rgba(2, 132, 199, 0.4)"
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.arc(server.x, server.y, radius, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  // Draw shield icons at cardinal points
  const shieldIconSize = server.size / 3
  const iconDistance = radius * 0.8

  for (let i = 0; i < 4; i++) {
    const iconAngle = (i * Math.PI) / 2
    const iconX = server.x + Math.cos(iconAngle) * iconDistance
    const iconY = server.y + Math.sin(iconAngle) * iconDistance

    // Draw small shield icon
    ctx.fillStyle = isDark ? "rgba(56, 189, 248, 0.8)" : "rgba(2, 132, 199, 0.7)"
    ctx.beginPath()
    ctx.moveTo(iconX, iconY - shieldIconSize)
    ctx.lineTo(iconX + shieldIconSize, iconY)
    ctx.lineTo(iconX, iconY + shieldIconSize)
    ctx.lineTo(iconX - shieldIconSize, iconY)
    ctx.closePath()
    ctx.fill()
  }
}

function drawDataPacket(ctx: CanvasRenderingContext2D, packet: any, theme: string | undefined, servers: any[]) {
  const isDark = theme === "dark"

  // Draw packet
  ctx.fillStyle = packet.color
  ctx.beginPath()
  ctx.arc(packet.x, packet.y, packet.size, 0, Math.PI * 2)
  ctx.fill()

  // Draw encryption symbols for encrypted packets
  if (packet.isEncrypted) {
    // Draw binary or lock symbols around the packet
    const symbolSize = packet.size * 1.5
    const symbolAngle = packet.encryptionAnimation * Math.PI * 2

    for (let i = 0; i < 4; i++) {
      const angle = symbolAngle + (i * Math.PI) / 2
      const symbolX = packet.x + Math.cos(angle) * symbolSize
      const symbolY = packet.y + Math.sin(angle) * symbolSize

      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.7)"
      ctx.font = `${packet.size}px monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Alternate between 0 and 1
      ctx.fillText(i % 2 === 0 ? "0" : "1", symbolX, symbolY)
    }

    // Add glow effect
    ctx.shadowColor = packet.color
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(packet.x, packet.y, packet.size / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  } else {
    // Draw warning symbol for unencrypted packets
    ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.7)"
    ctx.font = `bold ${packet.size}px sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("!", packet.x, packet.y)
  }

  // Draw trail effect
  ctx.strokeStyle = packet.color
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.5

  // Calculate direction vector
  const fromServer = servers[packet.fromServer]
  const toServer = servers[packet.toServer]
  const dx = toServer.x - fromServer.x
  const dy = toServer.y - fromServer.y
  const angle = Math.atan2(dy, dx)

  // Draw trail
  const trailLength = packet.size * 3
  ctx.beginPath()
  ctx.moveTo(packet.x, packet.y)
  ctx.lineTo(packet.x - Math.cos(angle) * trailLength, packet.y - Math.sin(angle) * trailLength)
  ctx.stroke()

  ctx.globalAlpha = 1.0
}

function drawAttacker(ctx: CanvasRenderingContext2D, attacker: any, theme: string | undefined) {
  const isDark = theme === "dark"

  // Draw attacker base (skull shape for malicious entity)
  ctx.fillStyle = isDark ? "rgba(248, 113, 113, 0.9)" : "rgba(220, 38, 38, 0.8)"

  // Draw skull shape
  ctx.beginPath()
  ctx.arc(attacker.x, attacker.y, attacker.size, 0, Math.PI * 2)
  ctx.fill()

  // Draw skull eyes
  const eyeSize = attacker.size / 4
  const eyeOffset = attacker.size / 3

  ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)"

  // Left eye
  ctx.beginPath()
  ctx.arc(attacker.x - eyeOffset, attacker.y - eyeOffset / 2, eyeSize, 0, Math.PI * 2)
  ctx.fill()

  // Right eye
  ctx.beginPath()
  ctx.arc(attacker.x + eyeOffset, attacker.y - eyeOffset / 2, eyeSize, 0, Math.PI * 2)
  ctx.fill()

  // Draw teeth
  ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)"
  const teethWidth = attacker.size / 6
  const teethHeight = attacker.size / 3
  const teethY = attacker.y + attacker.size / 3

  for (let i = -1; i <= 1; i++) {
    ctx.fillRect(attacker.x + i * teethWidth * 1.2, teethY, teethWidth, teethHeight)
  }

  // Add glow effect in dark mode
  if (isDark) {
    ctx.shadowColor = "rgba(248, 113, 113, 0.8)"
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.arc(attacker.x, attacker.y, attacker.size / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

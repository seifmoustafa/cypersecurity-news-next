"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function CybersecurityHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight < 500 ? window.innerHeight : 400;
      }
    };

    // Call once and add resize listener
    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Types
    interface SecurityNode {
      x: number;
      y: number;
      size: number;
      opacity: number;
      pulse: number;
      pulseSpeed: number;
      color: string;
      type: "firewall" | "encryption" | "ids" | "vpn" | "backup" | "monitoring";
      rotation: number;
      rotationSpeed: number;
    }

    interface SecurityConnection {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      opacity: number;
      pulse: number;
      pulseSpeed: number;
      width: number;
      type: "primary" | "secondary" | "tertiary";
    }

    interface DataFlow {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      color: string;
    }

    interface SecurityZone {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      pulse: number;
      pulseSpeed: number;
      color: string;
    }

    // Initialize arrays
    const securityNodes: SecurityNode[] = [];
    const securityConnections: SecurityConnection[] = [];
    const dataFlows: DataFlow[] = [];
    const securityZones: SecurityZone[] = [];

    // Initialize security nodes
    const initializeSecurityNodes = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.25;

      // Central firewall node
      securityNodes.push({
        x: centerX,
        y: centerY,
        size: 60,
        opacity: 0.9,
        pulse: 0,
        pulseSpeed: 0.015,
        color: theme === "dark" ? "rgba(239, 68, 68, 0.8)" : "rgba(220, 38, 38, 0.7)",
        type: "firewall",
        rotation: 0,
        rotationSpeed: 0.003,
      });

      // Encryption nodes
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const distance = maxRadius * 0.6;
        securityNodes.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          size: 35 + Math.random() * 8,
          opacity: 0.8 + Math.random() * 0.1,
          pulse: Math.random(),
          pulseSpeed: 0.01 + Math.random() * 0.005,
          color: theme === "dark" ? "rgba(59, 130, 246, 0.7)" : "rgba(37, 99, 235, 0.6)",
          type: "encryption",
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.006,
        });
      }

      // IDS nodes
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8 + Math.PI / 8;
        const distance = maxRadius * 0.9;
        securityNodes.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          size: 25 + Math.random() * 6,
          opacity: 0.7 + Math.random() * 0.15,
          pulse: Math.random(),
          pulseSpeed: 0.008 + Math.random() * 0.004,
          color: theme === "dark" ? "rgba(34, 197, 94, 0.6)" : "rgba(22, 163, 74, 0.5)",
          type: "ids",
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.004,
        });
      }
    };

    // Initialize security connections
    const initializeSecurityConnections = () => {
      // Connect firewall to encryption nodes
      for (let i = 1; i <= 6; i++) {
        securityConnections.push({
          x1: securityNodes[0].x,
          y1: securityNodes[0].y,
          x2: securityNodes[i].x,
          y2: securityNodes[i].y,
          opacity: 0.5,
          pulse: Math.random(),
          pulseSpeed: 0.008,
          width: 2,
          type: "primary",
        });
      }

      // Connect encryption nodes to each other
      for (let i = 1; i <= 6; i++) {
        const nextIndex = i === 6 ? 1 : i + 1;
        securityConnections.push({
          x1: securityNodes[i].x,
          y1: securityNodes[i].y,
          x2: securityNodes[nextIndex].x,
          y2: securityNodes[nextIndex].y,
          opacity: 0.3,
          pulse: Math.random(),
          pulseSpeed: 0.006,
          width: 1.5,
          type: "secondary",
        });
      }

      // Connect encryption to IDS nodes
      for (let i = 1; i <= 6; i++) {
        const idsIndex = 7 + (i % 8);
        securityConnections.push({
          x1: securityNodes[i].x,
          y1: securityNodes[i].y,
          x2: securityNodes[idsIndex].x,
          y2: securityNodes[idsIndex].y,
          opacity: 0.25,
          pulse: Math.random(),
          pulseSpeed: 0.004,
          width: 1,
          type: "tertiary",
        });
      }
    };

    // Initialize security zones
    const initializeSecurityZones = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.3;

      // Inner security zone
      securityZones.push({
        x: centerX,
        y: centerY,
        radius: maxRadius * 0.4,
        opacity: 0.08,
        pulse: 0,
        pulseSpeed: 0.006,
        color: theme === "dark" ? "rgba(239, 68, 68, 0.08)" : "rgba(220, 38, 38, 0.06)",
      });

      // Outer security zone
      securityZones.push({
        x: centerX,
        y: centerY,
        radius: maxRadius * 0.8,
        opacity: 0.05,
        pulse: Math.random(),
        pulseSpeed: 0.004,
        color: theme === "dark" ? "rgba(59, 130, 246, 0.06)" : "rgba(37, 99, 235, 0.04)",
      });
    };

    // Create data flow
    const createDataFlow = () => {
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0, vx = 0, vy = 0;

      switch (side) {
        case 0: // top
          x = Math.random() * canvas.width;
          y = -8;
          vx = (Math.random() - 0.5) * 0.8;
          vy = Math.random() * 0.3 + 0.2;
          break;
        case 1: // right
          x = canvas.width + 8;
          y = Math.random() * canvas.height;
          vx = -(Math.random() * 0.3 + 0.2);
          vy = (Math.random() - 0.5) * 0.8;
          break;
        case 2: // bottom
          x = Math.random() * canvas.width;
          y = canvas.height + 8;
          vx = (Math.random() - 0.5) * 0.8;
          vy = -(Math.random() * 0.3 + 0.2);
          break;
        case 3: // left
          x = -8;
          y = Math.random() * canvas.height;
          vx = Math.random() * 0.3 + 0.2;
          vy = (Math.random() - 0.5) * 0.8;
          break;
      }

      dataFlows.push({
        x,
        y,
        vx,
        vy,
        size: 2 + Math.random() * 2,
        life: 1.0,
        maxLife: 1.0,
        color: theme === "dark" ? "rgba(59, 130, 246, 0.6)" : "rgba(37, 99, 235, 0.5)",
      });
    };

    // Initialize all elements
    initializeSecurityNodes();
    initializeSecurityConnections();
    initializeSecurityZones();

    // Animation variables
    let lastTime = 0;
    let dataFlowTimer = 0;
    let animationFrameId: number;

    // Draw security node
    const drawSecurityNode = (node: SecurityNode) => {
      ctx.save();
      ctx.translate(node.x, node.y);
      ctx.rotate(node.rotation);
      ctx.globalAlpha = node.opacity;

      const size = node.size * (1 + Math.sin(node.pulse * Math.PI * 2) * 0.02);

      // Draw subtle glow
      const glowRadius = size * 1.3;
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
      gradient.addColorStop(0, node.color);
      gradient.addColorStop(0.7, (node.color.replace(/[\d.]+\)$/, '0.12)') || node.color));
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw node based on type
      switch (node.type) {
        case "firewall":
          // Draw firewall as a shield shape
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.moveTo(0, -size * 0.7);
          ctx.lineTo(-size * 0.5, -size * 0.2);
          ctx.lineTo(-size * 0.5, size * 0.3);
          ctx.lineTo(0, size * 0.8);
          ctx.lineTo(size * 0.5, size * 0.3);
          ctx.lineTo(size * 0.5, -size * 0.2);
          ctx.closePath();
          ctx.fill();

          // Draw shield border
          ctx.strokeStyle = theme === "dark" ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.5)";
          ctx.lineWidth = 2;
          ctx.stroke();
          break;

        case "encryption":
          // Draw encryption as a lock symbol
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.rect(-size * 0.3, -size * 0.2, size * 0.6, size * 0.4);
          ctx.fill();

          // Draw lock body
          ctx.beginPath();
          ctx.arc(0, -size * 0.05, size * 0.2, 0, Math.PI * 2);
          ctx.fill();

          // Draw lock shackle
          ctx.beginPath();
          ctx.rect(-size * 0.12, -size * 0.3, size * 0.24, size * 0.15);
          ctx.fill();

          // Draw border
          ctx.strokeStyle = theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.4)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          break;

        case "ids":
          // Draw IDS as a hexagon
          ctx.fillStyle = node.color;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const x = Math.cos(angle) * size * 0.5;
            const y = Math.sin(angle) * size * 0.5;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();

          // Draw border
          ctx.strokeStyle = theme === "dark" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          break;
      }

      ctx.restore();
    };

    // Draw security connection
    const drawSecurityConnection = (connection: SecurityConnection) => {
      ctx.save();
      ctx.globalAlpha = connection.opacity * (1 + Math.sin(connection.pulse * Math.PI * 2) * 0.15);

      let strokeColor: string;
      switch (connection.type) {
        case "primary":
          strokeColor = theme === "dark" ? "rgba(239, 68, 68, 0.5)" : "rgba(220, 38, 38, 0.4)";
          break;
        case "secondary":
          strokeColor = theme === "dark" ? "rgba(59, 130, 246, 0.4)" : "rgba(37, 99, 235, 0.3)";
          break;
        case "tertiary":
          strokeColor = theme === "dark" ? "rgba(34, 197, 94, 0.3)" : "rgba(22, 163, 74, 0.2)";
          break;
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = connection.width;
      ctx.lineCap = 'round';
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(connection.x1, connection.y1);
      ctx.lineTo(connection.x2, connection.y2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();
    };

    // Draw security zone
    const drawSecurityZone = (zone: SecurityZone) => {
      ctx.save();
      ctx.globalAlpha = zone.opacity * (1 + Math.sin(zone.pulse * Math.PI * 2) * 0.2);

      const currentRadius = zone.radius * (1 + Math.sin(zone.pulse * Math.PI * 2) * 0.01);

      ctx.strokeStyle = zone.color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([12, 6]);
      ctx.beginPath();
      ctx.arc(zone.x, zone.y, currentRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();
    };

    // Animation loop
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2
      );

      if (theme === "dark") {
        gradient.addColorStop(0, "rgba(15, 23, 42, 0.95)");
        gradient.addColorStop(0.4, "rgba(30, 41, 59, 0.85)");
        gradient.addColorStop(0.7, "rgba(51, 65, 85, 0.7)");
        gradient.addColorStop(1, "rgba(71, 85, 105, 0.5)");
      } else {
        gradient.addColorStop(0, "rgba(248, 250, 252, 0.95)");
        gradient.addColorStop(0.4, "rgba(241, 245, 249, 0.85)");
        gradient.addColorStop(0.7, "rgba(226, 232, 240, 0.7)");
        gradient.addColorStop(1, "rgba(203, 213, 225, 0.5)");
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw security zones
      securityZones.forEach((zone) => {
        zone.pulse = (zone.pulse + zone.pulseSpeed) % 1;
        drawSecurityZone(zone);
      });

      // Update and draw security connections
      securityConnections.forEach((connection) => {
        connection.pulse = (connection.pulse + connection.pulseSpeed) % 1;
        drawSecurityConnection(connection);
      });

      // Update and draw security nodes
      securityNodes.forEach((node) => {
        node.pulse = (node.pulse + node.pulseSpeed) % 1;
        node.rotation = (node.rotation + node.rotationSpeed) % (Math.PI * 2);
        drawSecurityNode(node);
      });

      // Update and draw data flows
      for (let i = dataFlows.length - 1; i >= 0; i--) {
        const flow = dataFlows[i];
        
        flow.x += flow.vx;
        flow.y += flow.vy;
        flow.life -= 0.008;

        if (flow.life <= 0) {
          dataFlows.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = flow.life * 0.7;
        ctx.fillStyle = flow.color;
        ctx.beginPath();
        ctx.arc(flow.x, flow.y, flow.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw subtle glow
        ctx.shadowColor = flow.color;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(flow.x, flow.y, flow.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1.0;

      // Create new data flows periodically
      dataFlowTimer += deltaTime;
      if (dataFlowTimer > 1000 && dataFlows.length < 3) {
        createDataFlow();
        dataFlowTimer = 0;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    animate(0);

    // Clean up
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
}

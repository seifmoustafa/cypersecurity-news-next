"use client";

import { useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

interface RealtimeStats {
      activeUsers: number;
      totalVisits: number;
}

const HUB_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") + "/hubs/stats";

// Singleton connection - shared across all components
let globalConnection: signalR.HubConnection | null = null;
let connectionPromise: Promise<void> | null = null;
let isSessionRegistered = false;
let subscribers: Set<(stats: RealtimeStats) => void> = new Set();
let currentStats: RealtimeStats = { activeUsers: 0, totalVisits: 0 };

// Get or create session ID (persists for browser session)
function getSessionId(): string | null {
      if (typeof window === "undefined") return null;

      let sessionId = sessionStorage.getItem("visitor_session_id");
      if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
            sessionStorage.setItem("visitor_session_id", sessionId);
      }
      return sessionId;
}

// Initialize singleton connection
async function initConnection(): Promise<void> {
      if (globalConnection?.state === signalR.HubConnectionState.Connected) {
            return; // Already connected
      }

      if (connectionPromise) {
            return connectionPromise; // Connection in progress
      }

      const sessionId = getSessionId();
      if (!sessionId) return;

      globalConnection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
                  withCredentials: true,
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .configureLogging(signalR.LogLevel.Warning)
            .build();

      // Handle stats updates - notify all subscribers
      globalConnection.on("StatsUpdated", (data: RealtimeStats) => {
            currentStats = data;
            subscribers.forEach(callback => callback(data));
      });

      globalConnection.onreconnected(async () => {
            // Re-register session after reconnect (doesn't create new visit)
            if (globalConnection && sessionId) {
                  await globalConnection.invoke("RegisterSession", sessionId).catch(console.error);
            }
      });

      connectionPromise = (async () => {
            try {
                  await globalConnection!.start();

                  // Register session only once per browser session
                  if (!isSessionRegistered) {
                        await globalConnection!.invoke("RegisterSession", sessionId);
                        isSessionRegistered = true;
                  }

                  // Get initial stats
                  const initialStats = await globalConnection!.invoke("GetStats");
                  currentStats = initialStats;
                  subscribers.forEach(callback => callback(initialStats));

                  console.log("SignalR connected (singleton)");
            } catch (err) {
                  console.error("SignalR connection error:", err);
            }
      })();

      return connectionPromise;
}

export function useRealtimeStats() {
      const [stats, setStats] = useState<RealtimeStats>(currentStats);
      const [isConnected, setIsConnected] = useState(false);
      const hasSubscribed = useRef(false);

      useEffect(() => {
            if (typeof window === "undefined") return;
            if (hasSubscribed.current) return;
            hasSubscribed.current = true;

            // Subscribe to stats updates
            const callback = (newStats: RealtimeStats) => {
                  setStats(newStats);
            };
            subscribers.add(callback);

            // Initialize connection if not already done
            initConnection().then(() => {
                  setIsConnected(globalConnection?.state === signalR.HubConnectionState.Connected);
                  setStats(currentStats);
            });

            // Update connection state
            const checkConnection = () => {
                  setIsConnected(globalConnection?.state === signalR.HubConnectionState.Connected);
            };

            const interval = setInterval(checkConnection, 5000);

            return () => {
                  subscribers.delete(callback);
                  clearInterval(interval);
                  hasSubscribed.current = false;
            };
      }, []);

      return {
            stats,
            isConnected,
      };
}

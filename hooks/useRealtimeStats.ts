"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";

interface RealtimeStats {
      activeUsers: number;
      totalVisits: number;
}

const HUB_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/hubs/stats`.replace(/\/+/g, '/').replace(':/', '://');

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
      // Already connected
      if (globalConnection?.state === signalR.HubConnectionState.Connected) {
            return;
      }

      // Connection attempt in progress - wait for it
      if (connectionPromise) {
            return connectionPromise;
      }

      const sessionId = getSessionId();
      if (!sessionId) return;

      // Create new connection if none exists or previous one failed
      if (!globalConnection || globalConnection.state === signalR.HubConnectionState.Disconnected) {
            globalConnection = new signalR.HubConnectionBuilder()
                  .withUrl(HUB_URL, {
                        withCredentials: true,
                  })
                  .withAutomaticReconnect({
                        nextRetryDelayInMilliseconds: (retryContext) => {
                              // Exponential backoff: 0, 2s, 5s, 10s, 30s, then every 30s
                              const delays = [0, 2000, 5000, 10000, 30000];
                              if (retryContext.previousRetryCount < delays.length) {
                                    return delays[retryContext.previousRetryCount];
                              }
                              return 30000; // Keep retrying every 30s
                        },
                  })
                  .configureLogging(signalR.LogLevel.Warning)
                  .build();

            // Handle stats updates - notify all subscribers immediately (REAL-TIME!)
            globalConnection.on("StatsUpdated", (data: RealtimeStats) => {
                  currentStats = data;
                  subscribers.forEach((callback) => callback(data));
            });

            // Re-register session after reconnect (doesn't create new visit)
            globalConnection.onreconnected(async () => {
                  console.log("SignalR reconnected, re-registering session...");
                  if (globalConnection && sessionId) {
                        try {
                              await globalConnection.invoke("RegisterSession", sessionId);
                              // Fetch latest stats after reconnect
                              const latestStats = await globalConnection.invoke("GetStats");
                              currentStats = latestStats;
                              subscribers.forEach((callback) => callback(latestStats));
                        } catch (err) {
                              console.error("Error re-registering session:", err);
                        }
                  }
            });

            globalConnection.onclose((error) => {
                  console.log("SignalR connection closed", error);
                  // Reset promise so next call can retry
                  connectionPromise = null;
            });
      }

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
                  subscribers.forEach((callback) => callback(initialStats));

                  console.log("SignalR connected (singleton)");
            } catch (err) {
                  console.error("SignalR connection error:", err);
                  // CRITICAL FIX: Reset connectionPromise on failure so retries can happen
                  connectionPromise = null;
                  globalConnection = null;
                  throw err;
            }
      })();

      return connectionPromise;
}

export function useRealtimeStats() {
      const [stats, setStats] = useState<RealtimeStats>(currentStats);
      const [isConnected, setIsConnected] = useState(false);
      const hasSubscribed = useRef(false);
      const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

      const attemptConnection = useCallback(async () => {
            try {
                  await initConnection();
                  setIsConnected(globalConnection?.state === signalR.HubConnectionState.Connected);
                  setStats(currentStats);
            } catch (err) {
                  // Connection failed, schedule retry
                  console.log("Connection attempt failed, will retry in 5s...");
                  retryTimeoutRef.current = setTimeout(attemptConnection, 5000);
            }
      }, []);

      useEffect(() => {
            if (typeof window === "undefined") return;
            if (hasSubscribed.current) return;
            hasSubscribed.current = true;

            // Subscribe to stats updates - this is what makes updates REAL-TIME
            const callback = (newStats: RealtimeStats) => {
                  setStats(newStats);
            };
            subscribers.add(callback);

            // Initialize connection
            attemptConnection();

            // Periodically check connection state and retry if disconnected
            const interval = setInterval(() => {
                  const connected = globalConnection?.state === signalR.HubConnectionState.Connected;
                  setIsConnected(connected);

                  // If disconnected and not already retrying, attempt reconnection
                  if (!connected && !connectionPromise && !retryTimeoutRef.current) {
                        attemptConnection();
                  }
            }, 5000);

            return () => {
                  subscribers.delete(callback);
                  clearInterval(interval);
                  if (retryTimeoutRef.current) {
                        clearTimeout(retryTimeoutRef.current);
                  }
                  hasSubscribed.current = false;
            };
      }, [attemptConnection]);

      return {
            stats,
            isConnected,
      };
}

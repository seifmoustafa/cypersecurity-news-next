"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/components/language-provider";
import Image from "next/image";
import { FileText, Home, X, Maximize2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StaticSitemapPage() {
  const { language, t } = useLanguage();
  const isRtl = language === "ar";
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset zoom when full screen is closed
  useEffect(() => {
    if (!isFullScreen) {
      setZoomLevel(1);
      setIsZoomed(false);
      setImagePosition({ x: 0, y: 0 });
      setIsPanning(false);
    }
  }, [isFullScreen]);

  // Zoom functions
  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setIsZoomed(false);
    setImagePosition({ x: 0, y: 0 });
    setIsPanning(false);
  }, []);

  const zoomAtPosition = useCallback((newZoomLevel: number, clientX?: number, clientY?: number) => {
    if (!containerRef.current || !imageRef.current) return;
    
    const container = containerRef.current;
    const image = imageRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Use center if no position provided
    const centerX = clientX ?? containerRect.left + containerRect.width / 2;
    const centerY = clientY ?? containerRect.top + containerRect.height / 2;
    
    // Calculate position relative to container center
    const clickX = centerX - (containerRect.left + containerRect.width / 2);
    const clickY = centerY - (containerRect.top + containerRect.height / 2);
    
    // Calculate new position to keep click position stable
    const scaleChange = newZoomLevel / zoomLevel;
    const newPositionX = imagePosition.x * scaleChange - clickX * (scaleChange - 1);
    const newPositionY = imagePosition.y * scaleChange - clickY * (scaleChange - 1);
    
    // Get natural image dimensions
    const imageNaturalWidth = image.naturalWidth;
    const imageNaturalHeight = image.naturalHeight;
    
    // Calculate scaled dimensions
    const scaledWidth = imageNaturalWidth * newZoomLevel;
    const scaledHeight = imageNaturalHeight * newZoomLevel;
    
    // Calculate boundaries
    const maxX = Math.max(0, (scaledWidth - containerRect.width) / 2);
    const maxY = Math.max(0, (scaledHeight - containerRect.height) / 2);
    
    // Constrain position
    const constrainedX = Math.max(-maxX, Math.min(maxX, newPositionX));
    const constrainedY = Math.max(-maxY, Math.min(maxY, newPositionY));
    
    setZoomLevel(newZoomLevel);
    setImagePosition({ x: constrainedX, y: constrainedY });
    setIsZoomed(newZoomLevel > 1);
  }, [zoomLevel, imagePosition]);

  const zoomIn = useCallback(() => {
    const zoomLevels = [1, 2, 3, 4, 5];
    const currentIndex = zoomLevels.indexOf(zoomLevel);
    if (currentIndex < zoomLevels.length - 1) {
      const newZoomLevel = zoomLevels[currentIndex + 1];
      zoomAtPosition(newZoomLevel);
    }
  }, [zoomLevel, zoomAtPosition]);

  const zoomOut = useCallback(() => {
    const zoomLevels = [1, 2, 3, 4, 5];
    const currentIndex = zoomLevels.indexOf(zoomLevel);
    if (currentIndex > 0) {
      const newZoomLevel = zoomLevels[currentIndex - 1];
      zoomAtPosition(newZoomLevel);
    } else {
      resetZoom();
    }
  }, [zoomLevel, zoomAtPosition, resetZoom]);

  // Handle Escape key to close full screen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) {
        if (isZoomed) {
          resetZoom();
        } else {
          setIsFullScreen(false);
        }
      }
    };

    if (isFullScreen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when full screen is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isFullScreen, isZoomed, resetZoom]);

  // Handle mouse wheel zoom
  useEffect(() => {
    if (!isFullScreen || !containerRef.current) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.max(1, Math.min(5, zoomLevel + delta));
        
        const containerRect = containerRef.current!.getBoundingClientRect();
        zoomAtPosition(newZoom, e.clientX, e.clientY);
      }
    };

    containerRef.current.addEventListener("wheel", handleWheel, { passive: false });
    
    return () => {
      containerRef.current?.removeEventListener("wheel", handleWheel);
    };
  }, [isFullScreen, zoomLevel, zoomAtPosition]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {language === "ar" ? "خريطة الموقع الثابتة" : "Static Sitemap"}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {language === "ar" 
              ? "عرض ثابت لخريطة الموقع" 
              : "Static view of the website sitemap"}
          </p>
        </div>

        {/* Image Container */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div 
              className="relative w-full max-w-4xl aspect-square cursor-pointer group"
              onClick={() => setIsFullScreen(true)}
            >
              <Image
                src="/app-icon.png"
                alt={language === "ar" ? "خريطة الموقع" : "Sitemap"}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
              {/* Fullscreen button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFullScreen(true);
                    }}
                  >
                    <Maximize2 className="h-5 w-5" />
                    {language === "ar" ? "عرض كامل الشاشة" : "View Full Screen"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Screen Image Dialog */}
        {isFullScreen && (
          <div 
            ref={containerRef}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center overflow-hidden"
            onClick={() => {
              if (!isZoomed) {
                setIsFullScreen(false);
              }
            }}
            onMouseDown={(e) => {
              if (isZoomed) {
                setIsPanning(true);
                setPanStart({ x: e.clientX, y: e.clientY });
                e.preventDefault();
              }
            }}
            onMouseMove={(e) => {
              if (isPanning && isZoomed && containerRef.current && imageRef.current) {
                const deltaX = e.clientX - panStart.x;
                const deltaY = e.clientY - panStart.y;
                
                const container = containerRef.current;
                const image = imageRef.current;
                const containerRect = container.getBoundingClientRect();
                
                // Calculate scaled image dimensions
                const scaledWidth = image.naturalWidth * zoomLevel;
                const scaledHeight = image.naturalHeight * zoomLevel;
                
                // Calculate boundaries
                const canPanX = scaledWidth > containerRect.width;
                const canPanY = scaledHeight > containerRect.height;
                
                const maxPanX = canPanX ? (scaledWidth - containerRect.width) / 2 : 0;
                const maxPanY = canPanY ? (scaledHeight - containerRect.height) / 2 : 0;
                
                // Calculate new position with constraints
                let newX = imagePosition.x + deltaX;
                let newY = imagePosition.y + deltaY;
                
                // Constrain to boundaries
                newX = Math.max(-maxPanX, Math.min(maxPanX, newX));
                newY = Math.max(-maxPanY, Math.min(maxPanY, newY));
                
                setImagePosition({ x: newX, y: newY });
                setPanStart({ x: e.clientX, y: e.clientY });
              }
            }}
            onMouseUp={() => {
              setIsPanning(false);
            }}
            onMouseLeave={() => {
              setIsPanning(false);
            }}
          >
            {/* Control Buttons */}
            <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullScreen(false);
                }}
              >
                <X className="h-6 w-6" />
              </Button>
              
              {/* Zoom Controls */}
              <div className="flex flex-col gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-transparent hover:bg-white/20 text-white rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    zoomIn();
                  }}
                  disabled={zoomLevel >= 5}
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-transparent hover:bg-white/20 text-white rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    zoomOut();
                  }}
                  disabled={zoomLevel <= 1}
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>
                {isZoomed && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-transparent hover:bg-white/20 text-white rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetZoom();
                    }}
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Image Container - Full Screen */}
            <div 
              className="relative w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (isZoomed) {
                  resetZoom();
                } else {
                  const containerRect = containerRef.current?.getBoundingClientRect();
                  if (containerRect) {
                    zoomAtPosition(2, e.clientX, e.clientY);
                  }
                }
              }}
            >
              <img
                ref={imageRef}
                src="/app-icon.png"
                alt={language === "ar" ? "خريطة الموقع" : "Sitemap"}
                className="max-w-full max-h-[95vh] w-auto h-auto select-none"
                style={{
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  transition: isZoomed && !isPanning ? "transform 0.3s ease" : "none",
                  cursor: isZoomed ? (isPanning ? "grabbing" : "grab") : "zoom-in",
                }}
                draggable={false}
                onLoad={(e) => {
                  // Reset zoom when image loads
                  resetZoom();
                }}
              />
            </div>
            
            {/* Zoom Level Indicator */}
            {isZoomed && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm z-50">
                {Math.round(zoomLevel * 100)}%
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            asChild
            variant="outline"
            className="flex items-center gap-2"
          >
            <Link href="/simple">
              <Home className="h-4 w-4" />
              {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </Link>
          </Button>
          <Button
            asChild
            variant="default"
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Link href="/simple/sitemap">
              <FileText className="h-4 w-4" />
              {language === "ar" ? "خريطة تفاعلية" : "Interactive Sitemap"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}


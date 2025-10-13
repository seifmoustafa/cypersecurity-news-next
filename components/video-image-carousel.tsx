"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Image as ImageIcon,
  Video,
  SkipBack,
  SkipForward,
  RotateCcw,
  X
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface MediaItem {
  id: string
  name: string | null
  nameEn: string | null
  summary: string | null
  summaryEn: string | null
  content: string | null
  contentEn: string | null
  imageUrl: string | null
  videoUrl: string | null
  order: number
  createdAt: string
}

interface VideoImageCarouselProps {
  items: MediaItem[]
  initialIndex?: number
  onItemChange?: (item: MediaItem, index: number) => void
  className?: string
}

// Tooltip component with smart positioning to prevent clipping
interface TooltipProps {
  children: React.ReactNode
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

function Tooltip({ children, text, position = 'top', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [actualPosition, setActualPosition] = useState(position)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Smart positioning to prevent clipping
  useEffect(() => {
    if (isVisible && tooltipRef.current && containerRef.current) {
      const tooltip = tooltipRef.current
      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()
      
      let newPosition = position
      
      // Check if tooltip would be clipped and adjust position
      if (position === 'top' && rect.top - tooltipRect.height < 0) {
        newPosition = 'bottom'
      } else if (position === 'bottom' && rect.bottom + tooltipRect.height > window.innerHeight) {
        newPosition = 'top'
      } else if (position === 'left' && rect.left - tooltipRect.width < 0) {
        newPosition = 'right'
      } else if (position === 'right' && rect.right + tooltipRect.width > window.innerWidth) {
        newPosition = 'left'
      }
      
      setActualPosition(newPosition)
    }
  }, [isVisible, position])
  
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }
  
  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-black/90',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-black/90',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-black/90',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-black/90'
  }

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 px-3 py-2 text-sm text-white bg-black/90 backdrop-blur-sm rounded-lg whitespace-nowrap max-w-xs ${positionClasses[actualPosition]}`}
            style={{ 
              maxWidth: '200px',
              wordWrap: 'break-word',
              whiteSpace: 'normal'
            }}
          >
            {text}
            <div className={`absolute w-0 h-0 border-4 ${arrowClasses[actualPosition]}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function VideoImageCarousel({ 
  items, 
  initialIndex = 0, 
  onItemChange,
  className = ""
}: VideoImageCarouselProps) {
  const { language } = useLanguage()
  const isRtl = language === "ar"
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()
  const progressIntervalRef = useRef<NodeJS.Timeout>()

  const currentItem = items[currentIndex]
  const hasVideo = currentItem?.videoUrl
  const hasImage = currentItem?.imageUrl

  // Update current item when index changes
  useEffect(() => {
    if (onItemChange && currentItem) {
      onItemChange(currentItem, currentIndex)
    }
  }, [currentIndex, currentItem, onItemChange])

  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  // Handle video events
  const handleVideoLoad = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      setIsLoading(false)
      setIsVideoLoaded(true)
      // Auto-play video when loaded
      if (hasVideo) {
        videoRef.current.play().catch(() => {
          // Autoplay failed, user needs to interact first
          setIsPlaying(false)
        })
      }
    }
  }, [hasVideo])

  const handleVideoTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime)
    }
  }, [])

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false)
    goToNext()
  }, [])

  const handleVideoPlay = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const handleVideoPause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : items.length - 1)
    setIsPlaying(false)
    setIsVideoLoaded(false)
  }, [items.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => prev < items.length - 1 ? prev + 1 : 0)
    setIsPlaying(false)
    setIsVideoLoaded(false)
  }, [items.length])

  const goToItem = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsPlaying(false)
    setIsVideoLoaded(false)
  }, [])

  // Video controls
  const togglePlayPause = useCallback(() => {
    if (!hasVideo || !videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch(() => {
        setIsPlaying(false)
      })
    }
  }, [hasVideo, isPlaying])

  // Handle video click for play/pause
  const handleVideoClick = useCallback(() => {
    if (hasVideo) {
      togglePlayPause()
    }
  }, [hasVideo, togglePlayPause])

  const toggleMute = useCallback(() => {
    if (!hasVideo || !videoRef.current) return
    
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }, [hasVideo, isMuted])

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (!hasVideo || !videoRef.current) return
    
    setVolume(newVolume)
    videoRef.current.volume = newVolume
    videoRef.current.muted = newVolume === 0
    setIsMuted(newVolume === 0)
  }, [hasVideo])

  const handleVolumeMouseEnter = useCallback(() => {
    setShowVolumeControl(true)
  }, [])

  const handleVolumeMouseLeave = useCallback(() => {
    setShowVolumeControl(false)
  }, [])

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasVideo || !videoRef.current) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    videoRef.current.currentTime = newTime
  }, [hasVideo, duration])

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }, [isFullscreen])

  // Handle double-click for fullscreen
  const handleDoubleClick = useCallback(() => {
    toggleFullscreen()
  }, [toggleFullscreen])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          goToPrevious()
          break
        case 'ArrowRight':
          e.preventDefault()
          goToNext()
          break
        case ' ':
          e.preventDefault()
          togglePlayPause()
          break
        case 'm':
        case 'M':
          e.preventDefault()
          toggleMute()
          break
        case 'f':
        case 'F':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext, togglePlayPause, toggleMute, toggleFullscreen, isFullscreen])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    setShowControls(true)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && hasVideo) {
        setShowControls(false)
      }
    }, 3000)
  }, [isPlaying, hasVideo])

  useEffect(() => {
    resetControlsTimeout()
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [resetControlsTimeout])

  // Progress tracking
  useEffect(() => {
    if (isPlaying && hasVideo) {
      progressIntervalRef.current = setInterval(() => {
        if (videoRef.current) {
          setProgress(videoRef.current.currentTime)
        }
      }, 100)
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying, hasVideo])

  // Format time helper
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!items.length || !currentItem) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl ${className}`}>
        <div className="text-center p-8">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {language === "ar" ? "لا توجد وسائط متاحة" : "No media available"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {/* Custom styles for volume slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-webkit-slider-track {
          height: 4px;
          border-radius: 2px;
          background: transparent;
        }
        
        .slider::-moz-range-track {
          height: 4px;
          border-radius: 2px;
          background: transparent;
        }
      `}</style>
      
      {/* Main Container */}
      <div 
        ref={containerRef}
        className={`relative bg-black rounded-xl overflow-hidden group ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
        onMouseMove={resetControlsTimeout}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Main Media Display */}
        <div 
          className="relative aspect-video bg-gradient-to-br from-gray-900 to-black"
          onDoubleClick={handleDoubleClick}
          onClick={handleVideoClick}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {hasVideo ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain cursor-pointer"
                  poster={hasImage ? currentItem.imageUrl : undefined}
                  onLoadedData={handleVideoLoad}
                  onTimeUpdate={handleVideoTimeUpdate}
                  onEnded={handleVideoEnded}
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                  onLoadStart={() => setIsLoading(true)}
                  onCanPlay={() => setIsLoading(false)}
                  muted={isMuted}
                  preload="metadata"
                  autoPlay
                  playsInline
                >
                  <source src={currentItem.videoUrl} type="video/mp4" />
                  {language === "ar" ? "متصفحك لا يدعم تشغيل الفيديو" : "Your browser does not support the video tag"}
                </video>
              ) : hasImage ? (
                <img
                  src={currentItem.imageUrl}
                  alt={language === "ar" ? currentItem.name : currentItem.nameEn || currentItem.name}
                  className="w-full h-full object-contain cursor-pointer"
                  loading="eager"
                  onLoad={() => setIsLoading(false)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="text-center">
                    <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                      {language === "ar" ? "لا توجد وسائط متاحة" : "No media available"}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Loading Overlay - Only for videos */}
          {isLoading && hasVideo && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                <p className="text-white text-sm">
                  {language === "ar" ? "جاري التحميل..." : "Loading..."}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Arrows */}
          {items.length > 1 && (
            <>
              <button
                onClick={isRtl ? goToNext : goToPrevious}
                onDoubleClick={(e) => e.stopPropagation()}
                className={`absolute top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-4 transition-all duration-300 hover:scale-110 group ${
                  isRtl ? 'right-6' : 'left-6'
                } opacity-100`}
              >
                {isRtl ? (
                  <ChevronRight className="h-6 w-6 text-white group-hover:text-blue-400" />
                ) : (
                  <ChevronLeft className="h-6 w-6 text-white group-hover:text-blue-400" />
                )}
              </button>
              <button
                onClick={isRtl ? goToPrevious : goToNext}
                onDoubleClick={(e) => e.stopPropagation()}
                className={`absolute top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-4 transition-all duration-300 hover:scale-110 group ${
                  isRtl ? 'left-6' : 'right-6'
                } opacity-100`}
              >
                {isRtl ? (
                  <ChevronLeft className="h-6 w-6 text-white group-hover:text-blue-400" />
                ) : (
                  <ChevronRight className="h-6 w-6 text-white group-hover:text-blue-400" />
                )}
              </button>
            </>
          )}

          {/* Play/Pause Overlay - Only for videos */}
          {hasVideo && !isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Tooltip 
                text={language === "ar" ? "تشغيل الفيديو" : "Play video"} 
                position="top"
              >
                <button
                  onClick={togglePlayPause}
                  className="bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-8 transition-all duration-300 hover:scale-110 group"
                >
                  <Play className="h-16 w-16 text-white group-hover:text-blue-400 ml-2" />
                </button>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Controls Overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6"
            >
              {/* Progress Bar - Only for videos */}
              {hasVideo && duration > 0 && (
                <div className="mb-4">
                  <div
                    className="w-full h-1 bg-white/30 rounded-full cursor-pointer hover:h-2 transition-all duration-200"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-200"
                      style={{ width: `${(progress / duration) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Play/Pause - Only for videos */}
                  {hasVideo && (
                    <Tooltip 
                      text={isPlaying ? (language === "ar" ? "إيقاف مؤقت" : "Pause") : (language === "ar" ? "تشغيل" : "Play")} 
                      position="top"
                    >
                      <button
                        onClick={togglePlayPause}
                        className="text-white hover:text-blue-400 transition-colors duration-200"
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </button>
                    </Tooltip>
                  )}

                  {/* Previous/Next */}
                  {items.length > 1 && (
                    <>
                      <Tooltip 
                        text={language === "ar" ? "الفيديو السابق" : "Previous video"} 
                        position="top"
                      >
                        <button
                          onClick={goToPrevious}
                          className="text-white hover:text-blue-400 transition-colors duration-200"
                        >
                          {isRtl ? <SkipForward className="h-5 w-5" /> : <SkipBack className="h-5 w-5" />}
                        </button>
                      </Tooltip>
                      <Tooltip 
                        text={language === "ar" ? "الفيديو التالي" : "Next video"} 
                        position="top"
                      >
                        <button
                          onClick={goToNext}
                          className="text-white hover:text-blue-400 transition-colors duration-200"
                        >
                          {isRtl ? <SkipBack className="h-5 w-5" /> : <SkipForward className="h-5 w-5" />}
                        </button>
                      </Tooltip>
                    </>
                  )}

                  {/* Volume - Only for videos */}
                  {hasVideo && (
                    <div 
                      className="relative"
                      onMouseEnter={handleVolumeMouseEnter}
                      onMouseLeave={handleVolumeMouseLeave}
                    >
                      {/* Only show tooltip when volume control is not visible */}
                      {!showVolumeControl && (
                        <Tooltip 
                          text={isMuted ? (language === "ar" ? "إلغاء كتم الصوت" : "Unmute") : (language === "ar" ? "كتم الصوت" : "Mute")} 
                          position="top"
                        >
                          <button
                            onClick={toggleMute}
                            className="text-white hover:text-blue-400 transition-colors duration-200"
                          >
                            {isMuted ? (
                              <VolumeX className="h-5 w-5" />
                            ) : (
                              <Volume2 className="h-5 w-5" />
                            )}
                          </button>
                        </Tooltip>
                      )}
                      
                      {/* Show button without tooltip when volume control is visible */}
                      {showVolumeControl && (
                        <button
                          onClick={toggleMute}
                          className="text-white hover:text-blue-400 transition-colors duration-200"
                        >
                          {isMuted ? (
                            <VolumeX className="h-5 w-5" />
                          ) : (
                            <Volume2 className="h-5 w-5" />
                          )}
                        </button>
                      )}
                      
                      {/* Volume Control Bar */}
                      <AnimatePresence>
                        {showVolumeControl && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: -10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-black/90 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2"
                            onMouseEnter={handleVolumeMouseEnter}
                            onMouseLeave={handleVolumeMouseLeave}
                          >
                            <Volume2 className="h-4 w-4 text-white" />
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={volume}
                              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                              className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                              style={{
                                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #4b5563 ${volume * 100}%, #4b5563 100%)`
                              }}
                            />
                            <span className="text-white text-xs font-mono min-w-[2rem] text-center">
                              {Math.round(volume * 100)}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Time Display - Only for videos */}
                  {hasVideo && duration > 0 && (
                    <span className="text-white text-sm font-mono">
                      {formatTime(progress)} / {formatTime(duration)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Media Type Indicator */}
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    {hasVideo ? (
                      <>
                        <Video className="h-4 w-4" />
                        <span>{language === "ar" ? "فيديو" : "Video"}</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4" />
                        <span>{language === "ar" ? "صورة" : "Image"}</span>
                      </>
                    )}
                  </div>

                  {/* Item Counter */}
                  <span className="text-white/80 text-sm">
                    {currentIndex + 1} / {items.length}
                  </span>

                  {/* Fullscreen */}
                  <Tooltip 
                    text={isFullscreen ? (language === "ar" ? "الخروج من وضع الشاشة الكاملة" : "Exit fullscreen") : (language === "ar" ? "وضع الشاشة الكاملة" : "Fullscreen")} 
                    position="top"
                  >
                    <button
                      onClick={toggleFullscreen}
                      className="text-white hover:text-blue-400 transition-colors duration-200"
                    >
                      {isFullscreen ? (
                        <Minimize className="h-5 w-5" />
                      ) : (
                        <Maximize className="h-5 w-5" />
                      )}
                    </button>
                  </Tooltip>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media Info Overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-4 left-4 right-4"
            >
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-white font-semibold text-lg mb-1">
                  {language === "ar" ? currentItem.name : currentItem.nameEn || currentItem.name}
                </h3>
                {(currentItem.summary || currentItem.summaryEn) && (
                  <p className="text-white/80 text-sm line-clamp-2">
                    {language === "ar" ? currentItem.summary : currentItem.summaryEn || currentItem.summary}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnail Strip - Outside the main container */}
      {items.length > 1 && (
        <div className="mt-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {items.map((item, index) => (
              <Tooltip 
                key={item.id}
                text={language === "ar" ? item.name : item.nameEn || item.name} 
                position="top"
              >
                <button
                  onClick={() => goToItem(index)}
                  className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? 'border-blue-500 scale-105'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  }`}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={language === "ar" ? item.name : item.nameEn || item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      {item.videoUrl ? (
                        <Video className="h-4 w-4 text-white" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-white" />
                      )}
                    </div>
                  )}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
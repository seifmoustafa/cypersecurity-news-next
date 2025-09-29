"use client"

import { useState } from 'react'
import { Share2, Copy, Check, AlertCircle } from 'lucide-react'
import { useShare } from '@/hooks/use-share'

interface ShareButtonProps {
  title: string
  url: string
  text?: string
  className?: string
  children?: React.ReactNode
  showIcon?: boolean
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function ShareButton({ 
  title, 
  url, 
  text, 
  className = '', 
  children,
  showIcon = true,
  variant = 'default',
  size = 'md'
}: ShareButtonProps) {
  const { share, isSharing, canShare, canCopyToClipboard, isOnline } = useShare()
  const [shareResult, setShareResult] = useState<{ success: boolean; method: string; error?: string } | null>(null)

  const handleShare = async () => {
    const result = await share({ title, url, text })
    setShareResult(result)
    
    // Clear the result after 3 seconds
    setTimeout(() => setShareResult(null), 3000)
  }

  const getButtonText = () => {
    if (isSharing) return 'Sharing...'
    if (shareResult?.success) {
      switch (shareResult.method) {
        case 'native': return 'Shared!'
        case 'clipboard': return 'Copied!'
        case 'fallback': return 'Copied!'
        default: return 'Shared!'
      }
    }
    if (shareResult?.success === false) return 'Failed'
    return children || 'Share'
  }

  const getButtonIcon = () => {
    if (isSharing) return <Share2 className="animate-spin" />
    if (shareResult?.success) {
      switch (shareResult.method) {
        case 'native': return <Check />
        case 'clipboard': return <Check />
        case 'fallback': return <Check />
        default: return <Check />
      }
    }
    if (shareResult?.success === false) return <AlertCircle />
    return showIcon ? <Share2 /> : null
  }

  const getVariantClasses = () => {
    const baseClasses = "flex items-center gap-2 font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
    
    switch (variant) {
      case 'outline':
        return `${baseClasses} border-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900/20`
      case 'ghost':
        return `${baseClasses} text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/20`
      default:
        return `${baseClasses} bg-gradient-to-r from-teal-600 to-blue-700 text-white hover:from-teal-700 hover:to-blue-800`
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm'
      case 'lg':
        return 'px-8 py-4 text-lg'
      default:
        return 'px-6 py-3'
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4'
      case 'lg':
        return 'h-6 w-6'
      default:
        return 'h-5 w-5'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`${getVariantClasses()} ${getSizeClasses()} ${className} ${
          isSharing ? 'opacity-75 cursor-not-allowed' : ''
        }`}
        title={
          !isOnline 
            ? 'Offline - Will copy link to clipboard' 
            : canShare 
              ? 'Share using native share dialog' 
              : 'Copy link to clipboard'
        }
      >
        {getButtonIcon() && (
          <span className={getIconSize()}>
            {getButtonIcon()}
          </span>
        )}
        <span>{getButtonText()}</span>
      </button>

      {/* Status indicator */}
      {shareResult && (
        <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
          shareResult.success 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        }`}>
          {shareResult.success ? (
            shareResult.method === 'native' ? 'Shared successfully!' : 'Copied to clipboard!'
          ) : (
            shareResult.error || 'Share failed'
          )}
        </div>
      )}

      {/* Offline indicator */}
      {!isOnline && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">
          Offline mode
        </div>
      )}
    </div>
  )
}

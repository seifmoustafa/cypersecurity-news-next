"use client"

import { useState, useCallback } from 'react'

interface ShareData {
  title: string
  url: string
  text?: string
}

interface ShareResult {
  success: boolean
  method: 'native' | 'clipboard' | 'fallback'
  error?: string
}

export function useShare() {
  const [isSharing, setIsSharing] = useState(false)

  const share = useCallback(async (data: ShareData): Promise<ShareResult> => {
    setIsSharing(true)
    
    try {
      // Check if Web Share API is available and online
      if (navigator.share && navigator.onLine) {
        try {
          await navigator.share({
            title: data.title,
            text: data.text || data.title,
            url: data.url
          })
          return { success: true, method: 'native' }
        } catch (error) {
          // User cancelled or error occurred, fall back to clipboard
          console.log('Web Share API failed, falling back to clipboard:', error)
        }
      }

      // Fallback 1: Copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          const shareText = data.url
          await navigator.clipboard.writeText(shareText)
          return { success: true, method: 'clipboard' }
        } catch (error) {
          console.log('Clipboard API failed, falling back to manual copy:', error)
        }
      }

      // Fallback 2: Manual copy using textarea
      try {
        const textarea = document.createElement('textarea')
        textarea.value = data.url
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        textarea.setSelectionRange(0, 99999) // For mobile devices
        
        const successful = document.execCommand('copy')
        document.body.removeChild(textarea)
        
        if (successful) {
          return { success: true, method: 'fallback' }
        } else {
          throw new Error('Copy command failed')
        }
      } catch (error) {
        return { 
          success: false, 
          method: 'fallback', 
          error: 'Unable to copy to clipboard. Please copy the URL manually.' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        method: 'fallback', 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    } finally {
      setIsSharing(false)
    }
  }, [])

  const canShare = useCallback(() => {
    return !!(typeof navigator !== 'undefined' && navigator.share! && navigator.onLine)
  }, [])

  const canCopyToClipboard = useCallback(() => {
    return !!(typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText)
  }, [])

  return {
    share,
    isSharing,
    canShare: canShare(),
    canCopyToClipboard: canCopyToClipboard(),
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
  }
}

import { useState } from "react"
import { container } from "@/core/di/container"
import type { ApiVideo } from "@/core/domain/models/media"

interface UseVideoManagementReturn {
  createVideo: (videoData: Partial<ApiVideo> & { imageUploadId?: string }) => Promise<ApiVideo>
  updateVideo: (id: string, videoData: Partial<ApiVideo> & { imageUploadId?: string }) => Promise<ApiVideo>
  loading: boolean
  error: string | null
}

export function useVideoManagement(): UseVideoManagementReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createVideo = async (videoData: Partial<ApiVideo> & { imageUploadId?: string }): Promise<ApiVideo> => {
    try {
      setLoading(true)
      setError(null)
      
      // Ensure imageUploadId is included in the payload
      const payload = {
        ...videoData,
        ...(videoData.imageUploadId && { imageUploadId: videoData.imageUploadId })
      }
      
      const result = await container.services.media.createVideo(payload)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while creating the video"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateVideo = async (id: string, videoData: Partial<ApiVideo> & { imageUploadId?: string }): Promise<ApiVideo> => {
    try {
      setLoading(true)
      setError(null)
      
      // Ensure imageUploadId is included in the payload
      const payload = {
        ...videoData,
        ...(videoData.imageUploadId && { imageUploadId: videoData.imageUploadId })
      }
      
      const result = await container.services.media.updateVideo(id, payload)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while updating the video"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createVideo, updateVideo, loading, error }
}
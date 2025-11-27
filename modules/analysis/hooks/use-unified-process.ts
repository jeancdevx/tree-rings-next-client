'use client'

import { useCallback, useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { io, Socket } from 'socket.io-client'

import { WS_BASE_URL, WS_EVENTS } from '@/modules/analysis/constants'
import { useIsClient } from '@/modules/analysis/hooks/use-is-client'
import {
  generateClientId,
  requestUploadUrls,
  startProcessSingle,
  uploadImageToR2
} from '@/modules/analysis/services/analysis-api'
import { useAnalysisStore } from '@/modules/analysis/store/analysis-store'
import type { ProcessResult } from '@/modules/analysis/types'

export const useUnifiedProcess = () => {
  const router = useRouter()
  const isClient = useIsClient()
  const hasStartedRef = useRef(false)
  const socketRef = useRef<Socket | null>(null)

  const images = useAnalysisStore(state => state.images)
  const results = useAnalysisStore(state => state.results)
  const processStatus = useAnalysisStore(state => state.processStatus)
  const uploadedCount = useAnalysisStore(state => state.uploadedCount)
  const queuedCount = useAnalysisStore(state => state.queuedCount)
  const error = useAnalysisStore(state => state.error)
  const clientId = useAnalysisStore(state => state.clientId)

  const setProcessStatus = useAnalysisStore(state => state.setProcessStatus)
  const setClientId = useAnalysisStore(state => state.setClientId)
  const setUploadProgress = useAnalysisStore(state => state.setUploadProgress)
  const incrementUploadedCount = useAnalysisStore(
    state => state.incrementUploadedCount
  )
  const resetUploadedCount = useAnalysisStore(state => state.resetUploadedCount)
  const incrementQueuedCount = useAnalysisStore(
    state => state.incrementQueuedCount
  )
  const resetQueuedCount = useAnalysisStore(state => state.resetQueuedCount)
  const updateImageUploadKey = useAnalysisStore(
    state => state.updateImageUploadKey
  )
  const setError = useAnalysisStore(state => state.setError)
  const addResult = useAnalysisStore(state => state.addResult)
  const reset = useAnalysisStore(state => state.reset)

  const totalImages = images.length
  const receivedResults = results.length
  const hasResults = receivedResults > 0
  const isComplete = totalImages > 0 && receivedResults >= totalImages
  const hasImages = totalImages > 0
  const hasAllCoordinates = images.every(
    img => img.coordinatesX !== undefined && img.coordinatesY !== undefined
  )

  const currentPhase =
    processStatus === 'idle' || processStatus === 'requesting-urls'
      ? 'preparing'
      : processStatus === 'uploading'
        ? 'uploading'
        : processStatus === 'starting-process'
          ? 'starting'
          : processStatus === 'processing'
            ? 'processing'
            : processStatus === 'completed'
              ? 'completed'
              : processStatus === 'error'
                ? 'error'
                : 'preparing'

  useEffect(() => {
    if (!clientId) return

    const socketUrl = WS_BASE_URL.replace('ws://', 'http://').replace(
      'wss://',
      'https://'
    )

    const socket = io(socketUrl, {
      query: { clientId },
      transports: ['websocket', 'polling']
    })

    socketRef.current = socket

    socket.on(WS_EVENTS.PROCESS_FINISHED, (data: ProcessResult) => {
      if (data.jobId && data.status) {
        addResult(data)
      }
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [clientId, addResult])

  useEffect(() => {
    if (isComplete && socketRef.current) {
      setProcessStatus('completed')
      socketRef.current.disconnect()
      socketRef.current = null
    }
  }, [isComplete, setProcessStatus])

  const startFullProcess = useCallback(async () => {
    if (images.length === 0) {
      setError('No hay imágenes para procesar')
      return
    }

    const imagesWithCoordinates = images.filter(
      img => img.coordinatesX !== undefined && img.coordinatesY !== undefined
    )

    if (imagesWithCoordinates.length !== images.length) {
      setError('Todas las imágenes deben tener coordenadas definidas')
      return
    }

    try {
      setError(null)
      resetUploadedCount()
      resetQueuedCount()
      setProcessStatus('requesting-urls')

      const newClientId = generateClientId()
      setClientId(newClientId)

      const requestBody = {
        images: imagesWithCoordinates.map(img => ({
          filename: img.name,
          contentType: img.type,
          coordinatesX: img.coordinatesX!,
          coordinatesY: img.coordinatesY!
        }))
      }

      const presignedUrls = await requestUploadUrls(requestBody)

      setProcessStatus('uploading')
      setUploadProgress(0)

      const processImage = async (index: number) => {
        const urlData = presignedUrls[index]
        const image = imagesWithCoordinates[index]

        try {
          await uploadImageToR2(
            urlData.putUrl,
            image.file,
            urlData.requiredHeaders['Content-Type']
          )

          updateImageUploadKey(image.id, urlData.key)
          incrementUploadedCount()

          try {
            await startProcessSingle(
              urlData.key,
              image.coordinatesX!,
              image.coordinatesY!,
              newClientId
            )
            incrementQueuedCount()
          } catch {}
        } catch {}
      }

      setProcessStatus('processing')

      await Promise.allSettled(
        presignedUrls.map((_, index) => processImage(index))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en el proceso')
      setProcessStatus('error')
    }
  }, [
    images,
    setError,
    resetUploadedCount,
    resetQueuedCount,
    setProcessStatus,
    setClientId,
    setUploadProgress,
    updateImageUploadKey,
    incrementUploadedCount,
    incrementQueuedCount
  ])

  useEffect(() => {
    if (!isClient) return

    if (!hasImages || !hasAllCoordinates) {
      router.replace('/')
      return
    }

    if (hasStartedRef.current) return
    hasStartedRef.current = true

    startFullProcess()
  }, [isClient, hasImages, hasAllCoordinates, router, startFullProcess])

  const handleStartOver = useCallback(() => {
    reset()
    router.push('/')
  }, [reset, router])

  return {
    isClient,
    currentPhase,
    uploadedCount,
    queuedCount,
    totalImages,
    receivedResults,
    results,
    hasResults,
    isComplete,
    error,
    handleStartOver
  }
}

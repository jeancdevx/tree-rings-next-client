import { useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { useAnalysisStore } from '@/modules/analysis/store/analysis-store'

export const useCoordinatesPage = () => {
  const router = useRouter()

  const images = useAnalysisStore(state => state.images)
  const currentIndex = useAnalysisStore(state => state.currentImageIndex)
  const setCurrentIndex = useAnalysisStore(state => state.setCurrentImageIndex)
  const updateCoordinates = useAnalysisStore(
    state => state.updateImageCoordinates
  )
  const setIsProcessing = useAnalysisStore(state => state.setIsProcessing)

  const currentImage = images[currentIndex]
  const hasImages = images.length > 0

  const completedIndices = images
    .map((img, index) => (img.coordinatesX !== undefined ? index : -1))
    .filter(index => index !== -1)

  const completedCount = completedIndices.length
  const allCompleted = completedCount === images.length && images.length > 0

  const handlePositionChange = useCallback(
    (position: { x: number; y: number }) => {
      if (currentImage) {
        updateCoordinates(currentImage.id, position)
      }
    },
    [currentImage, updateCoordinates]
  )

  const handlePrevious = useCallback(() => {
    setCurrentIndex(Math.max(0, currentIndex - 1))
  }, [currentIndex, setCurrentIndex])

  const handleNext = useCallback(() => {
    setCurrentIndex(Math.min(images.length - 1, currentIndex + 1))
  }, [currentIndex, images.length, setCurrentIndex])

  const handleSelect = useCallback(
    (index: number) => {
      setCurrentIndex(index)
    },
    [setCurrentIndex]
  )

  const handleBack = useCallback(() => {
    router.push('/')
  }, [router])

  const handleContinue = useCallback(() => {
    router.push('/process')
  }, [router])

  const resetProcessing = useCallback(() => {
    setIsProcessing(false)
  }, [setIsProcessing])

  return {
    images,
    currentIndex,
    currentImage,
    hasImages,
    completedIndices,
    completedCount,
    allCompleted,
    handlePositionChange,
    handlePrevious,
    handleNext,
    handleSelect,
    handleBack,
    handleContinue,
    resetProcessing
  }
}

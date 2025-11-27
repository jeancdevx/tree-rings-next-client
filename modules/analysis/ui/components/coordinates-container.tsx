'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'

import { useCoordinatesPage } from '@/modules/analysis/hooks/use-coordinates-page'

import { Button } from '@/components/ui/button'

import { ImageCanvas } from './image-canvas'
import { ImageNavigation } from './image-navigation'

export const CoordinatesContainer = () => {
  const router = useRouter()
  const {
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
  } = useCoordinatesPage()

  useEffect(() => {
    resetProcessing()
  }, [resetProcessing])

  if (!hasImages) {
    if (typeof window !== 'undefined') {
      router.replace('/')
    }
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent' />
      </div>
    )
  }

  if (!currentImage) {
    return null
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Button variant='ghost' onClick={handleBack}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Volver
        </Button>

        <div className='flex items-center gap-2'>
          <CheckCircle2
            className={
              completedCount > 0
                ? 'h-5 w-5 text-green-500'
                : 'text-muted-foreground h-5 w-5'
            }
          />
          <span className='text-sm font-semibold'>
            {completedCount} de {images.length} imágenes marcadas
          </span>
        </div>
      </div>

      <ImageCanvas
        src={currentImage.preview}
        alt={currentImage.name}
        initialPosition={
          currentImage.coordinatesX !== undefined &&
          currentImage.coordinatesY !== undefined
            ? { x: currentImage.coordinatesX, y: currentImage.coordinatesY }
            : undefined
        }
        onPositionChange={handlePositionChange}
      />

      <ImageNavigation
        currentIndex={currentIndex}
        totalImages={images.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSelect={handleSelect}
        completedIndices={completedIndices}
      />

      {allCompleted && (
        <div className='flex justify-center'>
          <Button size='lg' onClick={handleContinue} className='gap-2'>
            Continuar al procesamiento
            <ArrowRight className='h-4 w-4' />
          </Button>
        </div>
      )}
    </div>
  )
}

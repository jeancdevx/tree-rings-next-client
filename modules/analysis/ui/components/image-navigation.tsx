'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'

interface ImageNavigationProps {
  currentIndex: number
  totalImages: number
  onPrevious: () => void
  onNext: () => void
  onSelect: (index: number) => void
  completedIndices: number[]
  className?: string
}

export const ImageNavigation = ({
  currentIndex,
  totalImages,
  onPrevious,
  onNext,
  onSelect,
  completedIndices,
  className
}: ImageNavigationProps) => {
  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < totalImages - 1

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className='flex items-center justify-between'>
        <Button
          variant='outline'
          size='sm'
          onClick={onPrevious}
          disabled={!canGoPrevious}
        >
          <ChevronLeft className='mr-1 h-4 w-4' />
          Anterior
        </Button>

        <span className='text-muted-foreground text-sm'>
          Imagen {currentIndex + 1} de {totalImages}
        </span>

        <Button
          variant='outline'
          size='sm'
          onClick={onNext}
          disabled={!canGoNext}
        >
          Siguiente
          <ChevronRight className='ml-1 h-4 w-4' />
        </Button>
      </div>

      <div className='flex flex-wrap justify-center gap-2'>
        {Array.from({ length: totalImages }, (_, index) => {
          const isCompleted = completedIndices.includes(index)
          const isCurrent = index === currentIndex

          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all',
                'hover:ring-primary hover:ring-2 hover:ring-offset-2',
                isCurrent && 'bg-primary text-primary-foreground',
                !isCurrent && isCompleted && 'bg-green-500 text-white',
                !isCurrent && !isCompleted && 'bg-muted text-muted-foreground'
              )}
            >
              {index + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}

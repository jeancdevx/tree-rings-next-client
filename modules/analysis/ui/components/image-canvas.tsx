'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Minus, MoveIcon, Plus, RotateCcw } from 'lucide-react'

import { cn } from '@/lib/utils'

import { useImageMarker } from '@/modules/analysis/hooks/use-image-marker'
import { useImageZoom } from '@/modules/analysis/hooks/use-image-zoom'

import { Button } from '@/components/ui/button'

interface ImageCanvasProps {
  src: string
  alt: string
  initialPosition?: { x: number; y: number }
  onPositionChange: (position: { x: number; y: number }) => void
  className?: string
}

export const ImageCanvas = ({
  src,
  alt,
  initialPosition,
  onPositionChange,
  className
}: ImageCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [imageSize, setImageSize] = useState<{
    width: number
    height: number
  } | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [containerSize, setContainerSize] = useState<{
    width: number
    height: number
  } | null>(null)

  const {
    zoom,
    offset,
    isPanning,
    zoomIn,
    zoomOut,
    resetZoom,
    handlers: zoomHandlers
  } = useImageZoom({ containerRef })

  const {
    position,
    isDragging,
    setPosition,
    handleMouseDown: markerMouseDown,
    handleMouseMove: markerMouseMove,
    handleMouseUp: markerMouseUp
  } = useImageMarker({
    containerRef,
    imageSize,
    zoom,
    offset,
    onPositionChange
  })

  useEffect(() => {
    if (initialPosition && imageSize) {
      setPosition(initialPosition)
    }
  }, [initialPosition, imageSize, setPosition])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      setContainerSize({ width: rect.width, height: rect.height })
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  const handleImageLoad = useCallback(() => {
    const img = imageRef.current
    if (img) {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight })
      setImageLoaded(true)
    }
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 2) {
        zoomHandlers.onMouseDown(e)
      } else if (e.button === 0) {
        markerMouseDown(e)
      }
    },
    [zoomHandlers, markerMouseDown]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        zoomHandlers.onMouseMove(e)
      } else if (isDragging) {
        markerMouseMove(e)
      }
    },
    [isPanning, isDragging, zoomHandlers, markerMouseMove]
  )

  const handleMouseUp = useCallback(() => {
    zoomHandlers.onMouseUp()
    markerMouseUp()
  }, [zoomHandlers, markerMouseUp])

  const displayPosition = position || initialPosition

  const getMarkerScreenPosition = () => {
    if (!displayPosition || !imageSize || !containerSize) return null

    const scale =
      Math.min(
        containerSize.width / imageSize.width,
        containerSize.height / imageSize.height
      ) * zoom

    const imageDisplayWidth = imageSize.width * scale
    const imageDisplayHeight = imageSize.height * scale

    const imageLeft = containerSize.width / 2 - imageDisplayWidth / 2 + offset.x
    const imageTop =
      containerSize.height / 2 - imageDisplayHeight / 2 + offset.y

    const screenX = imageLeft + displayPosition.x * scale
    const screenY = imageTop + displayPosition.y * scale

    return { x: screenX, y: screenY }
  }

  const markerScreenPos = getMarkerScreenPosition()

  return (
    <div className={cn('relative flex flex-col gap-4', className)}>
      <div className='flex items-center justify-between'>
        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
          <MoveIcon className='h-4 w-4' />
          <span>Clic izq: marcar/arrastrar centro</span>
          <span className='text-border'>•</span>
          <span>Clic der: mover imagen</span>
          <span className='text-border'>•</span>
          <span>Scroll: zoom</span>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='icon-sm'
            onClick={zoomOut}
            disabled={zoom <= 1}
          >
            <Minus className='h-4 w-4' />
          </Button>
          <span className='min-w-[60px] text-center text-sm font-medium'>
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant='outline'
            size='icon-sm'
            onClick={zoomIn}
            disabled={zoom >= 5}
          >
            <Plus className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon-sm'
            onClick={resetZoom}
            disabled={zoom === 1}
          >
            <RotateCcw className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className={cn(
          'relative h-[500px] w-full overflow-hidden rounded-xl border-2 bg-neutral-900',
          isDragging && 'cursor-crosshair',
          isPanning && 'cursor-grabbing',
          !isDragging && !isPanning && 'cursor-crosshair'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={zoomHandlers.onContextMenu}
      >
        <div
          className='absolute inset-0 flex items-center justify-center'
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            onLoad={handleImageLoad}
            className='max-h-full max-w-full object-contain select-none'
            draggable={false}
          />
        </div>

        {imageLoaded && markerScreenPos && (
          <div
            className='pointer-events-none absolute z-10'
            style={{
              left: markerScreenPos.x,
              top: markerScreenPos.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className='relative'>
              <div className='absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-500 bg-red-500/20' />
              <div className='absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500' />
              <div
                className='absolute left-1/2 w-0.5 -translate-x-1/2 bg-red-500/60'
                style={{ height: '200vh', top: '-100vh' }}
              />
              <div
                className='absolute top-1/2 h-0.5 -translate-y-1/2 bg-red-500/60'
                style={{ width: '200vw', left: '-100vw' }}
              />
            </div>
          </div>
        )}
      </div>

      <div className='flex items-center justify-between text-sm'>
        <div className='text-muted-foreground'>
          {imageSize && (
            <span>
              Imagen: {imageSize.width} × {imageSize.height} px
            </span>
          )}
        </div>
        {displayPosition && (
          <div className='text-primary font-mono'>
            Centro: X={displayPosition.x}, Y={displayPosition.y}
          </div>
        )}
      </div>
    </div>
  )
}

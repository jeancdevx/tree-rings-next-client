'use client'

import { useCallback, useState, type RefObject } from 'react'

interface PixelPosition {
  x: number
  y: number
}

interface UseImageMarkerProps {
  containerRef: RefObject<HTMLDivElement | null>
  imageSize: { width: number; height: number } | null
  zoom: number
  offset: { x: number; y: number }
  onPositionChange?: (position: PixelPosition) => void
}

interface UseImageMarkerReturn {
  position: PixelPosition | null
  isDragging: boolean
  setPosition: (position: PixelPosition | null) => void
  clearPosition: () => void
  handleMouseDown: (e: React.MouseEvent) => void
  handleMouseMove: (e: React.MouseEvent) => void
  handleMouseUp: () => void
}

export const useImageMarker = ({
  containerRef,
  imageSize,
  zoom,
  offset,
  onPositionChange
}: UseImageMarkerProps): UseImageMarkerReturn => {
  const [position, setPositionState] = useState<PixelPosition | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const getPixelPosition = useCallback(
    (clientX: number, clientY: number): PixelPosition | null => {
      const container = containerRef.current
      if (!container || !imageSize) return null

      const rect = container.getBoundingClientRect()

      const containerCenterX = rect.width / 2
      const containerCenterY = rect.height / 2

      const scale =
        Math.min(rect.width / imageSize.width, rect.height / imageSize.height) *
        zoom

      const imageDisplayWidth = imageSize.width * scale
      const imageDisplayHeight = imageSize.height * scale

      const imageLeft = containerCenterX - imageDisplayWidth / 2 + offset.x
      const imageTop = containerCenterY - imageDisplayHeight / 2 + offset.y

      const mouseX = clientX - rect.left
      const mouseY = clientY - rect.top

      const relativeX = mouseX - imageLeft
      const relativeY = mouseY - imageTop

      const pixelX = Math.round(relativeX / scale)
      const pixelY = Math.round(relativeY / scale)

      const clampedX = Math.max(0, Math.min(imageSize.width, pixelX))
      const clampedY = Math.max(0, Math.min(imageSize.height, pixelY))

      return { x: clampedX, y: clampedY }
    },
    [containerRef, imageSize, zoom, offset]
  )

  const setPosition = useCallback((newPosition: PixelPosition | null) => {
    setPositionState(newPosition)
  }, [])

  const clearPosition = useCallback(() => {
    setPositionState(null)
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 2) return

      e.preventDefault()
      setIsDragging(true)

      const newPosition = getPixelPosition(e.clientX, e.clientY)
      if (newPosition) {
        setPositionState(newPosition)
        onPositionChange?.(newPosition)
      }
    },
    [getPixelPosition, onPositionChange]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return

      const newPosition = getPixelPosition(e.clientX, e.clientY)
      if (newPosition) {
        setPositionState(newPosition)
      }
    },
    [isDragging, getPixelPosition]
  )

  const handleMouseUp = useCallback(() => {
    if (isDragging && position) {
      onPositionChange?.(position)
    }
    setIsDragging(false)
  }, [isDragging, position, onPositionChange])

  return {
    position,
    isDragging,
    setPosition,
    clearPosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  }
}

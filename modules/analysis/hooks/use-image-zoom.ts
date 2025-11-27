'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

interface UseImageZoomProps {
  containerRef: RefObject<HTMLDivElement | null>
  minZoom?: number
  maxZoom?: number
  zoomStep?: number
}

interface UseImageZoomReturn {
  zoom: number
  offset: { x: number; y: number }
  isPanning: boolean
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  setZoom: (zoom: number) => void
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void
    onMouseMove: (e: React.MouseEvent) => void
    onMouseUp: () => void
    onMouseLeave: () => void
    onContextMenu: (e: React.MouseEvent) => void
  }
}

export const useImageZoom = ({
  containerRef,
  minZoom = 1,
  maxZoom = 5,
  zoomStep = 0.25
}: UseImageZoomProps): UseImageZoomReturn => {
  const [zoom, setZoomState] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  const zoomRef = useRef(zoom)
  const offsetRef = useRef(offset)

  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  useEffect(() => {
    offsetRef.current = offset
  }, [offset])

  const clampZoom = useCallback(
    (value: number) => Math.min(maxZoom, Math.max(minZoom, value)),
    [minZoom, maxZoom]
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const delta = e.deltaY > 0 ? -zoomStep : zoomStep
      const currentZoom = zoomRef.current
      const newZoom = Math.min(maxZoom, Math.max(minZoom, currentZoom + delta))

      if (newZoom !== currentZoom) {
        const rect = container.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const zoomRatio = newZoom / currentZoom
        const currentOffset = offsetRef.current

        setOffset({
          x: mouseX - (mouseX - currentOffset.x) * zoomRatio,
          y: mouseY - (mouseY - currentOffset.y) * zoomRatio
        })
        setZoomState(newZoom)
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [containerRef, zoomStep, minZoom, maxZoom])

  const zoomIn = useCallback(() => {
    setZoomState(prev => clampZoom(prev + zoomStep))
  }, [clampZoom, zoomStep])

  const zoomOut = useCallback(() => {
    setZoomState(prev => clampZoom(prev - zoomStep))
  }, [clampZoom, zoomStep])

  const resetZoom = useCallback(() => {
    setZoomState(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  const setZoom = useCallback(
    (value: number) => {
      setZoomState(clampZoom(value))
    },
    [clampZoom]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 2) {
        e.preventDefault()
        setIsPanning(true)
        setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
      }
    },
    [offset]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y
        })
      }
    },
    [isPanning, panStart]
  )

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsPanning(false)
  }, [])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
  }, [])

  return {
    zoom,
    offset,
    isPanning,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onContextMenu: handleContextMenu
    }
  }
}

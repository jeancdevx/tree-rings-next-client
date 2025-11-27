import { create } from 'zustand'

import type {
  AnalysisImage,
  ProcessResult,
  ProcessStatus
} from '@/modules/analysis/types'

export type { AnalysisImage }

interface AnalysisState {
  images: AnalysisImage[]
  currentImageIndex: number
  isProcessing: boolean
  processStatus: ProcessStatus
  clientId: string | null
  jobId: string | null
  uploadProgress: number
  uploadedCount: number
  queuedCount: number
  results: ProcessResult[]
  error: string | null
}

interface AnalysisActions {
  addImages: (files: File[]) => void
  removeImage: (id: string) => void
  clearImages: () => void
  updateImageCoordinates: (
    id: string,
    coordinates: { x: number; y: number }
  ) => void
  updateImageUploadKey: (id: string, key: string) => void
  setCurrentImageIndex: (index: number) => void
  setIsProcessing: (value: boolean) => void
  setProcessStatus: (status: ProcessStatus) => void
  setClientId: (clientId: string) => void
  setJobId: (jobId: string) => void
  setUploadProgress: (progress: number) => void
  incrementUploadedCount: () => void
  resetUploadedCount: () => void
  incrementQueuedCount: () => void
  resetQueuedCount: () => void
  addResult: (result: ProcessResult) => void
  setError: (error: string | null) => void
  reset: () => void
}

const generateId = () => Math.random().toString(36).substring(2, 15)

const initialState: AnalysisState = {
  images: [],
  currentImageIndex: 0,
  isProcessing: false,
  processStatus: 'idle',
  clientId: null,
  jobId: null,
  uploadProgress: 0,
  uploadedCount: 0,
  queuedCount: 0,
  results: [],
  error: null
}

export const useAnalysisStore = create<AnalysisState & AnalysisActions>(
  set => ({
    ...initialState,

    addImages: files => {
      const newImages: AnalysisImage[] = files.map(file => ({
        id: generateId(),
        name: file.name,
        type: file.type,
        size: file.size,
        file,
        preview: URL.createObjectURL(file),
        status: 'pending' as const
      }))

      set(state => ({
        images: [...state.images, ...newImages]
      }))
    },

    removeImage: id => {
      set(state => {
        const imageToRemove = state.images.find(img => img.id === id)
        if (imageToRemove) {
          URL.revokeObjectURL(imageToRemove.preview)
        }

        const newImages = state.images.filter(img => img.id !== id)
        const newIndex = Math.min(
          state.currentImageIndex,
          Math.max(0, newImages.length - 1)
        )

        return {
          images: newImages,
          currentImageIndex: newIndex
        }
      })
    },

    clearImages: () => {
      set(state => {
        state.images.forEach(img => URL.revokeObjectURL(img.preview))
        return { images: [], currentImageIndex: 0 }
      })
    },

    updateImageCoordinates: (id, coordinates) => {
      set(state => ({
        images: state.images.map(img =>
          img.id === id
            ? {
                ...img,
                coordinatesX: coordinates.x,
                coordinatesY: coordinates.y,
                status: 'coordinates-set' as const
              }
            : img
        )
      }))
    },

    updateImageUploadKey: (id, key) => {
      set(state => ({
        images: state.images.map(img =>
          img.id === id
            ? {
                ...img,
                uploadKey: key,
                status: 'uploaded' as const
              }
            : img
        )
      }))
    },

    setCurrentImageIndex: index => {
      set({ currentImageIndex: index })
    },

    setIsProcessing: value => {
      set({ isProcessing: value })
    },

    setProcessStatus: status => {
      set({ processStatus: status })
    },

    setClientId: clientId => {
      set({ clientId })
    },

    setJobId: jobId => {
      set({ jobId })
    },

    setUploadProgress: progress => {
      set({ uploadProgress: progress })
    },

    incrementUploadedCount: () => {
      set(state => ({ uploadedCount: state.uploadedCount + 1 }))
    },

    resetUploadedCount: () => {
      set({ uploadedCount: 0 })
    },

    incrementQueuedCount: () => {
      set(state => ({ queuedCount: state.queuedCount + 1 }))
    },

    resetQueuedCount: () => {
      set({ queuedCount: 0 })
    },

    addResult: result => {
      set(state => ({
        results: [...state.results, result]
      }))
    },

    setError: error => {
      set({ error, processStatus: error ? 'error' : 'idle' })
    },

    reset: () => {
      set(state => {
        state.images.forEach(img => URL.revokeObjectURL(img.preview))
        return initialState
      })
    }
  })
)

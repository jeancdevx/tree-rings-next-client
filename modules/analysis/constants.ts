export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  REQUEST_UPLOAD: '/analysis/request-upload',
  START_PROCESS: '/analysis/start-process'
} as const

export const WS_EVENTS = {
  PROCESS_FINISHED: 'process_finished'
} as const

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
] as const

export const ALLOWED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp'
] as const

export const MAX_FILE_SIZE = 20 * 1024 * 1024

export const MAX_FILES = 64

export const IMAGE_STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    variant: 'secondary' as const
  },
  'coordinates-set': {
    label: 'Centro marcado',
    variant: 'default' as const
  },
  uploading: {
    label: 'Subiendo...',
    variant: 'secondary' as const
  },
  uploaded: {
    label: 'Subido',
    variant: 'default' as const
  },
  error: {
    label: 'Error',
    variant: 'destructive' as const
  }
} as const

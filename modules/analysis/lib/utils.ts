import {
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE
} from '@/modules/analysis/constants'

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export const isValidImageType = (file: File): boolean =>
  ALLOWED_IMAGE_TYPES.includes(
    file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
  )

export const isValidFileSize = (file: File): boolean =>
  file.size <= MAX_FILE_SIZE

export const getFileExtension = (filename: string): string =>
  filename.slice(filename.lastIndexOf('.')).toLowerCase()

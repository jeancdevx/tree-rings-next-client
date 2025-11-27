import { useCallback, useState } from 'react'

import { useDropzone, type DropzoneOptions } from 'react-dropzone'

import {
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  MAX_FILES
} from '@/modules/analysis/constants'
import { formatFileSize } from '@/modules/analysis/lib/utils'
import { useAnalysisStore } from '@/modules/analysis/store/analysis-store'

export interface DropzoneError {
  filename?: string
  error: string
}

export const useUploadDropzone = () => {
  const images = useAnalysisStore(state => state.images)
  const addImages = useAnalysisStore(state => state.addImages)
  const clearImages = useAnalysisStore(state => state.clearImages)

  const [errors, setErrors] = useState<DropzoneError[]>([])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      const newErrors: DropzoneError[] = []

      const typedRejected = rejectedFiles as Array<{
        file: File
        errors: Array<{ code: string }>
      }>

      typedRejected.forEach(rejection => {
        const errorMessages = rejection.errors.map(err => {
          switch (err.code) {
            case 'file-too-large':
              return `Archivo muy grande (máx. ${formatFileSize(MAX_FILE_SIZE)})`
            case 'file-invalid-type':
              return 'Tipo de archivo no permitido'
            case 'too-many-files':
              return `Máximo ${MAX_FILES} archivos`
            default:
              return 'Error desconocido'
          }
        })

        newErrors.push({
          filename: rejection.file.name,
          error: errorMessages.join(', ')
        })
      })

      const remainingSlots = MAX_FILES - images.length
      const filesToAdd = acceptedFiles.slice(0, remainingSlots)

      if (acceptedFiles.length > remainingSlots) {
        newErrors.push({
          error: `Solo se pueden agregar ${remainingSlots} imagen(es) más`
        })
      }

      if (filesToAdd.length > 0) {
        addImages(filesToAdd)
      }

      if (newErrors.length > 0) {
        setErrors(prev => [...prev, ...newErrors])
      }
    },
    [images.length, addImages]
  )

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: ALLOWED_IMAGE_TYPES.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES,
    disabled: false
  }

  const dropzone = useDropzone(dropzoneOptions)

  return {
    images,
    errors,
    clearErrors,
    clearImages,
    dropzone
  }
}

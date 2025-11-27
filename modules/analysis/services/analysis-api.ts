import { API_BASE_URL, API_ENDPOINTS } from '@/modules/analysis/constants'
import type {
  PresignedUrlResponse,
  RequestUploadBody,
  StartProcessBody,
  StartProcessResponse
} from '@/modules/analysis/types'

export const generateClientId = (): string => crypto.randomUUID()

export const requestUploadUrls = async (
  body: RequestUploadBody
): Promise<PresignedUrlResponse[]> => {
  const url = `${API_BASE_URL}${API_ENDPOINTS.REQUEST_UPLOAD}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Error al solicitar URLs de subida')
  }

  return response.json()
}

export const uploadImageToR2 = async (
  putUrl: string,
  file: File,
  contentType: string
): Promise<void> => {
  const response = await fetch(putUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType
    },
    body: file
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(
      `Error al subir imagen ${file.name}: ${response.status} ${errorText}`
    )
  }
}

export const startProcessSingle = async (
  key: string,
  coordinatesX: number,
  coordinatesY: number,
  clientId: string
): Promise<StartProcessResponse> => {
  const url = `${API_BASE_URL}${API_ENDPOINTS.START_PROCESS}`
  const body: StartProcessBody = {
    images: [{ key, coordinatesX, coordinatesY }],
    clientId
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Error al iniciar el procesamiento')
  }

  return response.json()
}

export type ImageUploadStatus =
  | 'pending'
  | 'coordinates-set'
  | 'uploading'
  | 'uploaded'
  | 'error'

export interface AnalysisImage {
  id: string
  name: string
  type: string
  size: number
  file: File
  preview: string
  status: ImageUploadStatus
  coordinatesX?: number
  coordinatesY?: number
  uploadKey?: string
}

export interface RequestUploadImage {
  filename: string
  contentType: string
  coordinatesX: number
  coordinatesY: number
}

export interface RequestUploadBody {
  images: RequestUploadImage[]
}

export interface StartProcessImage {
  key: string
  coordinatesX: number
  coordinatesY: number
}

export interface StartProcessBody {
  images: StartProcessImage[]
  clientId: string
}

export interface PresignedUrlResponse {
  key: string
  putUrl: string
  expiresAt: string
  requiredHeaders: {
    'Content-Type': string
  }
}

export interface StartProcessResponse {
  jobId: string
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'ERROR'
  message: string
}

export interface RingDetectionResult {
  count: number
  details: {
    confidence: number
    method: string
    processing_time_ms: number
  }
  imageUrl: string
}

export interface UnsharpMaskingResult {
  status: string
  parameters: {
    kernel_size: [number, number]
    sigma: number
    amount: number
  }
  imageUrl: string
}

export interface PolarRingDetectionResult {
  ring_count: number
  radii: number[]
  metrics: {
    total_sector_detections: number
    confirmed_rings: number
    average_votes_per_ring: number
  }
  imageUrl: string
}

export interface SobelRingDetectionResult {
  ring_count: number
  radii: number[]
  method: string
  metrics: {
    max_radius: number
  }
  imageUrl: string
}

export interface AutocorrelationPeriodicityResult {
  ring_count: number
  radii: number[]
  metrics: {
    estimated_rings: number
    estimated_spacing: number
    method_used: string
    min_radius: number
    radius_max: number
    profile_length: number
    effective_range: number
    raw_rings: number
    scaled_rings: number
    ring_scale: number
    autocorr_used: boolean
    fft_used: boolean
    lag_window: [number, number]
    autocorr_length: number
    fft_best_k: number
    fft_spacing_raw: number
  }
  imageUrl: string
}

export interface SecondDerivativeRingDetectionResult {
  ring_count: number
  radii: number[]
  method: string
  metrics: {
    max_radius: number
    profile_length: number
  }
  imageUrl: string
}

export interface AnalysisResults {
  ring_detection: RingDetectionResult
  unsharp_masking: UnsharpMaskingResult
  polar_ring_detection: PolarRingDetectionResult
  sobel_ring_detection: SobelRingDetectionResult
  autocorrelation_periodicity: AutocorrelationPeriodicityResult
  second_derivative_ring_detection: SecondDerivativeRingDetectionResult
}

export interface ProcessResultData {
  originalUrl: string
  metadata: [number, number]
  results: AnalysisResults
}

export interface ProcessResult {
  jobId: string
  clientId: string
  status: 'COMPLETED' | 'ERROR'
  timestamp: string
  data: ProcessResultData
  error: string | null
}

export type ProcessStatus =
  | 'idle'
  | 'requesting-urls'
  | 'uploading'
  | 'starting-process'
  | 'processing'
  | 'completed'
  | 'error'

export type AnalysisPhase = 'upload' | 'coordinates' | 'processing' | 'results'

export interface AlgorithmConfig {
  key: keyof AnalysisResults
  name: string
  description: string
}

export const ALGORITHM_CONFIGS: AlgorithmConfig[] = [
  {
    key: 'ring_detection',
    name: 'Detección CNN',
    description: 'Red neuronal convolucional para detección de anillos'
  },
  {
    key: 'polar_ring_detection',
    name: 'Detección Polar',
    description: 'Análisis en coordenadas polares con votación por sectores'
  },
  {
    key: 'sobel_ring_detection',
    name: 'Filtro Sobel',
    description: 'Detección de bordes usando operador Sobel'
  },
  {
    key: 'autocorrelation_periodicity',
    name: 'Autocorrelación FFT',
    description: 'Análisis de periodicidad mediante transformada de Fourier'
  },
  {
    key: 'second_derivative_ring_detection',
    name: 'Segunda Derivada',
    description: 'Detección mediante análisis de segunda derivada del perfil'
  },
  {
    key: 'unsharp_masking',
    name: 'Mejora de Imagen',
    description: 'Preprocesamiento con máscara de enfoque'
  }
]

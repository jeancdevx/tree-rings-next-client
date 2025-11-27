'use client'

import {
  ALGORITHM_CONFIGS,
  type AnalysisResults
} from '@/modules/analysis/types'

interface AlgorithmResultProps {
  algorithmKey: keyof AnalysisResults
  data: Record<string, unknown>
}

export const AlgorithmResult = ({
  algorithmKey,
  data
}: AlgorithmResultProps) => {
  if (!data) return null

  const config = ALGORITHM_CONFIGS.find(c => c.key === algorithmKey)
  if (!config) return null

  const getRingCount = () => {
    if ('count' in data) return data.count as number
    if ('ring_count' in data) return data.ring_count as number
    return null
  }

  const ringCount = getRingCount()
  const details = data.details as Record<string, unknown> | undefined
  const metrics = data.metrics as Record<string, unknown> | undefined
  const parameters = data.parameters as Record<string, unknown> | undefined
  const radii = data.radii as number[] | undefined

  return (
    <div className='space-y-4'>
      {ringCount !== null && (
        <div className='bg-muted rounded-lg p-4 text-center'>
          <p className='text-4xl font-bold'>{ringCount}</p>
          <p className='text-muted-foreground text-sm'>anillos detectados</p>
        </div>
      )}

      <div className='text-muted-foreground space-y-1 text-sm'>
        {algorithmKey === 'ring_detection' && details && (
          <>
            <p>
              <span className='font-medium'>Confianza:</span>{' '}
              {((details.confidence as number) * 100).toFixed(1)}%
            </p>
            <p>
              <span className='font-medium'>Método:</span>{' '}
              {details.method as string}
            </p>
            <p>
              <span className='font-medium'>Tiempo:</span>{' '}
              {details.processing_time_ms as number}ms
            </p>
          </>
        )}

        {algorithmKey === 'polar_ring_detection' && metrics && (
          <>
            <p>
              <span className='font-medium'>Detecciones por sector:</span>{' '}
              {metrics.total_sector_detections as number}
            </p>
            <p>
              <span className='font-medium'>Anillos confirmados:</span>{' '}
              {metrics.confirmed_rings as number}
            </p>
            <p>
              <span className='font-medium'>Votos promedio:</span>{' '}
              {(metrics.average_votes_per_ring as number).toFixed(2)}
            </p>
          </>
        )}

        {algorithmKey === 'sobel_ring_detection' && metrics && (
          <>
            <p>
              <span className='font-medium'>Método:</span>{' '}
              {data.method as string}
            </p>
            <p>
              <span className='font-medium'>Radio máximo:</span>{' '}
              {metrics.max_radius as number}px
            </p>
          </>
        )}

        {algorithmKey === 'autocorrelation_periodicity' && metrics && (
          <>
            <p>
              <span className='font-medium'>Método:</span>{' '}
              {(metrics.method_used as string).toUpperCase()}
            </p>
            <p>
              <span className='font-medium'>Espaciado estimado:</span>{' '}
              {metrics.estimated_spacing as number}px
            </p>
            <p>
              <span className='font-medium'>Rango efectivo:</span>{' '}
              {metrics.effective_range as number}px
            </p>
          </>
        )}

        {algorithmKey === 'second_derivative_ring_detection' && metrics && (
          <>
            <p>
              <span className='font-medium'>Método:</span>{' '}
              {data.method as string}
            </p>
            <p>
              <span className='font-medium'>Radio máximo:</span>{' '}
              {metrics.max_radius as number}px
            </p>
            <p>
              <span className='font-medium'>Longitud perfil:</span>{' '}
              {metrics.profile_length as number}px
            </p>
          </>
        )}

        {algorithmKey === 'unsharp_masking' && parameters && (
          <>
            <p>
              <span className='font-medium'>Estado:</span>{' '}
              {data.status as string}
            </p>
            <p>
              <span className='font-medium'>Kernel:</span>{' '}
              {(parameters.kernel_size as number[]).join('x')}
            </p>
            <p>
              <span className='font-medium'>Sigma:</span>{' '}
              {parameters.sigma as number}
            </p>
            <p>
              <span className='font-medium'>Intensidad:</span>{' '}
              {parameters.amount as number}
            </p>
          </>
        )}

        {radii && radii.length > 0 && (
          <details className='mt-2'>
            <summary className='cursor-pointer font-medium'>
              Ver radios ({radii.length})
            </summary>
            <p className='mt-1 text-xs'>{radii.join(', ')}px</p>
          </details>
        )}
      </div>
    </div>
  )
}

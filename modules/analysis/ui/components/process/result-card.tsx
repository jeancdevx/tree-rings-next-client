'use client'

import { useState } from 'react'

import Image from 'next/image'

import { ALGORITHM_CONFIGS, type ProcessResult } from '@/modules/analysis/types'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { AlgorithmResult } from './algorithm-result'

interface ResultCardProps {
  result: ProcessResult
  index: number
  isOpen: boolean
}

export const ResultCard = ({ result, index, isOpen }: ResultCardProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { data, status, error } = result

  if (status === 'ERROR' || error) {
    return (
      <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
        <p className='font-semibold text-red-800'>
          Error en imagen {index + 1}
        </p>
        <p className='text-sm text-red-600'>{error || 'Error desconocido'}</p>
      </div>
    )
  }

  const algorithms = ALGORITHM_CONFIGS.filter(
    config => data.results[config.key]
  )

  const availableImages = algorithms
    .filter(config => data.results[config.key]?.imageUrl)
    .map(config => ({
      key: config.key,
      name: config.name,
      url: data.results[config.key].imageUrl
    }))

  const currentImage = selectedImage || availableImages[0]?.url

  if (!isOpen) return null

  return (
    <div className='space-y-4 pt-4'>
      <div className='grid gap-4 lg:grid-cols-2'>
        <div className='space-y-3'>
          <div className='bg-muted relative aspect-square overflow-hidden rounded-lg'>
            {currentImage ? (
              <Image
                src={currentImage}
                alt='Resultado del análisis'
                fill
                className='object-contain'
              />
            ) : (
              <div className='flex h-full items-center justify-center'>
                <p className='text-muted-foreground text-sm'>
                  Sin imagen disponible
                </p>
              </div>
            )}
          </div>

          <div className='flex gap-2 overflow-x-auto pb-2'>
            {availableImages.map(img => (
              <button
                key={img.key}
                onClick={() => setSelectedImage(img.url)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                  currentImage === img.url
                    ? 'border-primary ring-primary/20 ring-2'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.name}
                  fill
                  className='object-cover'
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Tabs defaultValue={algorithms[0]?.key} className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              {algorithms.slice(0, 3).map(config => (
                <TabsTrigger
                  key={config.key}
                  value={config.key}
                  className='text-xs'
                >
                  {config.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>
            {algorithms.length > 3 && (
              <TabsList className='mt-1 grid w-full grid-cols-3'>
                {algorithms.slice(3).map(config => (
                  <TabsTrigger
                    key={config.key}
                    value={config.key}
                    className='text-xs'
                  >
                    {config.name.split(' ')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}

            {algorithms.map(config => (
              <TabsContent key={config.key} value={config.key} className='mt-4'>
                <div className='space-y-2'>
                  <div>
                    <h4 className='font-medium'>{config.name}</h4>
                    <p className='text-muted-foreground text-xs'>
                      {config.description}
                    </p>
                  </div>
                  <AlgorithmResult
                    algorithmKey={config.key}
                    data={
                      data.results[config.key] as unknown as Record<
                        string,
                        unknown
                      >
                    }
                  />
                  {data.results[config.key]?.imageUrl && (
                    <Button
                      variant='outline'
                      size='sm'
                      className='mt-2 w-full'
                      onClick={() =>
                        setSelectedImage(data.results[config.key].imageUrl)
                      }
                    >
                      Ver imagen de este algoritmo
                    </Button>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      <div className='text-muted-foreground flex items-center gap-4 text-xs'>
        <span>
          Centro: ({data.metadata[0]}, {data.metadata[1]})
        </span>
        <a
          href={data.originalUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='text-primary hover:underline'
        >
          Ver imagen original
        </a>
      </div>
    </div>
  )
}

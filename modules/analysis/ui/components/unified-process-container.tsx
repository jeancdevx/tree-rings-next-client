'use client'

import { useState } from 'react'

import { useUnifiedProcess } from '@/modules/analysis/hooks/use-unified-process'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

import {
  CompletedStatus,
  ErrorStatus,
  PreparingStatus,
  ProcessProgressBar,
  ResultCard
} from './process'

export const UnifiedProcessContainer = () => {
  const {
    isClient,
    currentPhase,
    uploadedCount,
    queuedCount,
    totalImages,
    receivedResults,
    results,
    hasResults,
    isComplete,
    error,
    handleStartOver
  } = useUnifiedProcess()

  const [openItems, setOpenItems] = useState<string[]>([])

  if (!isClient) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <Spinner className='h-8 w-8' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='bg-card rounded-lg border p-6 shadow-sm'>
        <div className='mb-4'>
          <h2 className='text-lg font-semibold'>Estado del Análisis</h2>
          <p className='text-muted-foreground text-sm'>
            {totalImages} imágenes en proceso
          </p>
        </div>

        <div className='space-y-4'>
          {currentPhase === 'preparing' && <PreparingStatus />}

          {(currentPhase === 'uploading' ||
            currentPhase === 'starting' ||
            currentPhase === 'processing' ||
            currentPhase === 'completed') && (
            <ProcessProgressBar
              label='Subida a R2'
              current={uploadedCount}
              total={totalImages}
              isComplete={uploadedCount >= totalImages}
            />
          )}

          {(currentPhase === 'processing' || currentPhase === 'completed') &&
            queuedCount > 0 && (
              <ProcessProgressBar
                label='En cola de procesamiento'
                current={queuedCount}
                total={totalImages}
                isComplete={queuedCount >= totalImages}
              />
            )}

          {(currentPhase === 'processing' || currentPhase === 'completed') && (
            <ProcessProgressBar
              label='Resultados recibidos'
              current={receivedResults}
              total={totalImages}
              isComplete={receivedResults >= totalImages}
            />
          )}

          {error && <ErrorStatus error={error} />}

          {isComplete && <CompletedStatus totalResults={totalImages} />}
        </div>
      </div>

      {hasResults && (
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>
              Resultados{' '}
              {!isComplete && (
                <Badge variant='secondary' className='ml-2'>
                  {receivedResults} de {totalImages}
                </Badge>
              )}
            </h2>
            {results.length > 1 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  setOpenItems(
                    openItems.length === results.length
                      ? []
                      : results.map(r => r.jobId)
                  )
                }
              >
                {openItems.length === results.length
                  ? 'Colapsar todos'
                  : 'Expandir todos'}
              </Button>
            )}
          </div>

          <Accordion
            type='multiple'
            value={openItems}
            onValueChange={setOpenItems}
            className='space-y-2'
          >
            {results.map((result, index) => {
              const mainAlgorithm = result.data?.results?.ring_detection
              const ringCount = mainAlgorithm?.count ?? '?'

              return (
                <AccordionItem
                  key={result.jobId}
                  value={result.jobId}
                  className='animate-in fade-in slide-in-from-bottom-2 bg-card px-4 duration-300'
                >
                  <AccordionTrigger className='hover:no-underline'>
                    <div className='flex items-center gap-4'>
                      <Badge variant='outline'>#{index + 1}</Badge>
                      <span className='font-medium'>
                        {ringCount} anillos detectados
                      </span>
                      <Badge
                        variant={
                          result.status === 'COMPLETED'
                            ? 'default'
                            : 'destructive'
                        }
                        className='ml-auto'
                      >
                        {result.status}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ResultCard
                      result={result}
                      index={index}
                      isOpen={openItems.includes(result.jobId)}
                    />
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      )}

      {currentPhase === 'processing' && !hasResults && (
        <div className='flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8'>
          <Spinner className='h-8 w-8' />
          <p className='text-muted-foreground'>
            Esperando primeros resultados del servidor...
          </p>
        </div>
      )}

      <div className='flex justify-center pt-4'>
        <Button
          onClick={handleStartOver}
          size='lg'
          disabled={!isComplete && !error}
        >
          {isComplete || error ? 'Analizar Nuevas Imágenes' : 'Procesando...'}
        </Button>
      </div>
    </div>
  )
}

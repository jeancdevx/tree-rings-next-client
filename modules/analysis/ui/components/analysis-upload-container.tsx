'use client'

import { ArrowRightIcon, Loader2 } from 'lucide-react'

import { useUploadPage } from '@/modules/analysis/hooks/use-upload-page'

import { Button } from '@/components/ui/button'

import { UploadDropzoneStore } from './dropzone-store'

export const AnalysisUploadContainer = () => {
  const { isProcessing, canProceedToCoordinates, handleContinue } =
    useUploadPage()

  return (
    <div className='space-y-6'>
      <UploadDropzoneStore />

      {canProceedToCoordinates && (
        <div className='flex justify-center'>
          <Button
            size='lg'
            onClick={handleContinue}
            disabled={isProcessing}
            className='gap-2 bg-emerald-600 font-semibold hover:bg-emerald-700'
          >
            {isProcessing ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Procesando...
              </>
            ) : (
              <>
                Seleccionar coordenadas
                <ArrowRightIcon className='h-4 w-4' />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ErrorStatusProps {
  error: string
}

export const ErrorStatus = ({ error }: ErrorStatusProps) => (
  <Alert variant='destructive'>
    <AlertCircle className='h-4 w-4' />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)

export const PreparingStatus = () => (
  <div className='flex items-center justify-center py-12'>
    <div className='flex flex-col items-center gap-4'>
      <Loader2 className='text-primary h-8 w-8 animate-spin' />
      <p className='text-muted-foreground'>Preparando imágenes...</p>
    </div>
  </div>
)

interface CompletedStatusProps {
  totalResults: number
}

export const CompletedStatus = ({ totalResults }: CompletedStatusProps) => (
  <Alert className='border-green-500 bg-green-50 dark:bg-green-950'>
    <CheckCircle className='h-4 w-4 text-green-500' />
    <AlertTitle className='text-green-700 dark:text-green-300'>
      Procesamiento completado
    </AlertTitle>
    <AlertDescription className='text-green-600 dark:text-green-400'>
      Se han procesado {totalResults} imágenes exitosamente.
    </AlertDescription>
  </Alert>
)

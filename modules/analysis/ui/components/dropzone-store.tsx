'use client'

import {
  DotIcon,
  ImagePlus,
  OctagonAlertIcon,
  Upload,
  XCircleIcon
} from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  ALLOWED_IMAGE_EXTENSIONS,
  MAX_FILE_SIZE,
  MAX_FILES
} from '@/modules/analysis/constants'
import { useUploadDropzone } from '@/modules/analysis/hooks/use-upload-dropzone'
import { formatFileSize } from '@/modules/analysis/lib/utils'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { ImagePreviewCardStore } from './image-preview-card-store'

export const UploadDropzoneStore = () => {
  const { images, errors, clearErrors, clearImages, dropzone } =
    useUploadDropzone()

  const { getRootProps, getInputProps, isDragActive } = dropzone

  return (
    <div className='flex flex-col gap-6'>
      <div
        {...getRootProps()}
        className={cn(
          'group relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 transition-all',
          'hover:border-primary/50 hover:bg-accent/50',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          isDragActive && 'border-primary bg-accent/70'
        )}
      >
        <input {...getInputProps()} />

        <div
          className={cn(
            'bg-primary/5 flex size-16 items-center justify-center rounded-full transition-colors',
            'group-hover:bg-primary/10',
            isDragActive && 'bg-primary/15'
          )}
        >
          {isDragActive ? (
            <ImagePlus className='size-8 text-emerald-700' />
          ) : (
            <Upload className='text-muted-foreground group-hover:text-primary size-8' />
          )}
        </div>

        <div className='text-center'>
          <p className='text-lg font-semibold'>
            {isDragActive
              ? 'Suelta las imágenes aquí'
              : 'Arrastra y suelta imágenes aquí'}
          </p>
          <p className='text-muted-foreground mt-1 text-sm'>
            o{' '}
            <span className='font-semibold text-emerald-700 underline-offset-4 group-hover:underline'>
              haz clic para seleccionar
            </span>
          </p>
        </div>

        <div className='text-muted-foreground flex flex-wrap items-center justify-center gap-0.5 text-xs'>
          <span>Formatos: {ALLOWED_IMAGE_EXTENSIONS.join(', ')}</span>
          <span className='text-border'>
            <DotIcon />
          </span>
          <span>Máximo: {formatFileSize(MAX_FILE_SIZE)}</span>
          <span className='text-border'>
            <DotIcon />
          </span>
          <span>Hasta {MAX_FILES} archivos</span>
        </div>
      </div>

      {errors.length > 0 && (
        <Alert
          variant='destructive'
          className='border-destructive bg-destructive/5 flex items-center gap-x-4 border-2'
        >
          <div className='flex shrink-0 items-center'>
            <OctagonAlertIcon className='size-6' />
          </div>

          <div className='flex-1'>
            <div className='flex w-full items-center justify-between'>
              <AlertTitle className='text-base font-semibold'>
                Errores al procesar archivos
              </AlertTitle>

              <Button
                variant='ghost'
                size='icon-sm'
                onClick={clearErrors}
                className='hover:bg-destructive/5 hover:text-destructive size-6'
              >
                <XCircleIcon className='size-6' />
              </Button>
            </div>

            <AlertDescription>
              <ul className='text-destructive space-y-1 text-sm'>
                {errors.map((err, index) => (
                  <li key={index}>
                    {err.filename && <span>{err.filename}: </span>}
                    {err.error}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {images.length > 0 && (
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <p className='text-lg font-semibold'>
              Imágenes seleccionadas ({images.length})
            </p>
            <Button
              variant='destructive'
              size='sm'
              onClick={clearImages}
              className='font-semibold text-white hover:text-red-50'
            >
              Limpiar todo
            </Button>
          </div>

          <ScrollArea className='h-[300px] rounded-lg border-2'>
            <div className='grid gap-3 p-4 sm:grid-cols-2'>
              {images.map(image => (
                <ImagePreviewCardStore key={image.id} image={image} />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

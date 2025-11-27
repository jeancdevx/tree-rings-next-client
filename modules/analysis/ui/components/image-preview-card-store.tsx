'use client'

import Image from 'next/image'

import {
  AlertCircle,
  CheckCircle2,
  DotIcon,
  FileImage,
  Trash2
} from 'lucide-react'

import { cn } from '@/lib/utils'

import { IMAGE_STATUS_CONFIG } from '@/modules/analysis/constants'
import { formatFileSize } from '@/modules/analysis/lib/utils'
import {
  useAnalysisStore,
  type AnalysisImage
} from '@/modules/analysis/store/analysis-store'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ImagePreviewCardStoreProps {
  image: AnalysisImage
  className?: string
}

const STATUS_ICONS = {
  pending: FileImage,
  'coordinates-set': CheckCircle2,
  uploading: FileImage,
  uploaded: CheckCircle2,
  error: AlertCircle
} as const

export const ImagePreviewCardStore = ({
  image,
  className
}: ImagePreviewCardStoreProps) => {
  const removeImage = useAnalysisStore(state => state.removeImage)
  const config = IMAGE_STATUS_CONFIG[image.status]
  const StatusIcon = STATUS_ICONS[image.status]

  return (
    <Card
      className={cn(
        'group relative cursor-pointer overflow-hidden transition-all',
        className
      )}
    >
      <CardContent className='px-0'>
        <div className='flex gap-3'>
          <div className='bg-muted relative h-32 w-32 shrink-0 overflow-hidden rounded-tl-md rounded-bl-md'>
            {image.preview ? (
              <Image
                src={image.preview}
                alt={image.name}
                fill
                className='object-cover'
                sizes='80px'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center'>
                <FileImage className='text-muted-foreground h-8 w-8' />
              </div>
            )}
          </div>

          <div className='flex min-w-0 flex-1 flex-col justify-between py-4 pr-4 pl-2'>
            <div className='space-y-1'>
              <p className='truncate text-sm font-semibold' title={image.name}>
                {image.name}
              </p>
              <div className='text-muted-foreground flex flex-wrap items-center text-xs'>
                <span>{formatFileSize(image.size)}</span>
                <span className='text-border'>
                  <DotIcon />
                </span>
                <span className='uppercase'>
                  {image.type.split('/')[1] || 'desconocido'}
                </span>
              </div>
            </div>

            <div className='flex items-center justify-between gap-2'>
              <Badge variant={config.variant} className='gap-1'>
                <StatusIcon className='h-3 w-3' />
                {config.label}
              </Badge>

              {image.coordinatesX !== undefined &&
                image.coordinatesY !== undefined && (
                  <span className='text-muted-foreground text-xs'>
                    Centro: ({image.coordinatesX}, {image.coordinatesY})
                  </span>
                )}
            </div>
          </div>

          <Button
            variant='destructive'
            size='icon-sm'
            className='absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100'
            onClick={() => removeImage(image.id)}
            aria-label={`Eliminar ${image.name}`}
          >
            <Trash2 className='h-4 w-4 text-white' />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

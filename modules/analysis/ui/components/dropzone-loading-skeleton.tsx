import { Spinner } from '@/components/ui/spinner'

export const DropzoneLoadingSkeleton = () => (
  <div className='flex min-h-[200px] items-center justify-center rounded-xl border-2 border-dashed'>
    <div className='flex flex-col items-center gap-2'>
      <Spinner className='h-8 w-8' />
      <p className='text-muted-foreground text-sm'>Cargando...</p>
    </div>
  </div>
)

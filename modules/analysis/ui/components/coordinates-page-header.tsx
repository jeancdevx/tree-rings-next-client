import { Crosshair } from 'lucide-react'

export const CoordinatesPageHeader = () => (
  <div className='text-center'>
    <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10'>
      <Crosshair className='h-8 w-8 text-blue-500' />
    </div>
    <h1 className='text-4xl font-bold tracking-tight'>
      Marcar Centro del Tronco
    </h1>
    <p className='text-muted-foreground mt-2 text-sm'>
      Haz clic en el centro de cada imagen de tronco. Puedes arrastrar el
      marcador para ajustar la posición.
    </p>
  </div>
)

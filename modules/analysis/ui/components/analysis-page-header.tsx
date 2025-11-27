import { TreeDeciduous } from 'lucide-react'

export const AnalysisPageHeader = () => (
  <div className='text-center'>
    <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10'>
      <TreeDeciduous className='h-8 w-8 text-emerald-700' />
    </div>
    <h1 className='text-6xl font-bold tracking-tight'>
      Análisis de Anillos de Árbol
    </h1>
    <p className='text-muted-foreground mt-2 text-sm'>
      Sube imágenes de secciones transversales de troncos de árboles para contar
      sus anillos de crecimiento.
    </p>
  </div>
)

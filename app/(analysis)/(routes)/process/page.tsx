import { AnalysisStepIndicator } from '@/modules/analysis/ui/components/analysis-step-indicator'
import { UnifiedProcessContainer } from '@/modules/analysis/ui/components/unified-process-container'

export default function ProcessPage() {
  return (
    <div className='mx-auto max-w-4xl space-y-8'>
      <div className='space-y-2 text-center'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Análisis de Imágenes
        </h1>
        <p className='text-muted-foreground'>
          Subiendo y analizando los anillos de crecimiento
        </p>
      </div>

      <AnalysisStepIndicator currentStep={2} />

      <UnifiedProcessContainer />
    </div>
  )
}

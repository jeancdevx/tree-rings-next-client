import { Badge } from '@/components/ui/badge'

interface Step {
  label: string
  isActive: boolean
}

interface AnalysisStepIndicatorProps {
  steps?: Step[]
  currentStep?: number
}

const defaultSteps: Step[] = [
  { label: 'Subir imágenes', isActive: true },
  { label: 'Marcar centro', isActive: false },
  { label: 'Procesar y Resultados', isActive: false }
]

export const AnalysisStepIndicator = ({
  steps = defaultSteps,
  currentStep = 0
}: AnalysisStepIndicatorProps) => {
  const stepsWithActive = steps.map((step, index) => ({
    ...step,
    isActive: index === currentStep,
    isCompleted: index < currentStep
  }))

  return (
    <div className='flex items-center justify-center gap-2'>
      {stepsWithActive.map((step, index) => (
        <div key={step.label} className='flex items-center gap-2'>
          {index > 0 && <div className='bg-border h-px w-8' />}
          <Badge
            className='gap-2 px-4 py-1.5 font-semibold'
            variant={step.isActive || step.isCompleted ? 'default' : 'outline'}
            {...((step.isActive || step.isCompleted) && {
              style: {
                backgroundColor: step.isActive
                  ? 'rgb(21 128 61)'
                  : 'rgb(34 197 94)'
              }
            })}
            {...(!step.isActive &&
              !step.isCompleted && {
                style: { color: 'hsl(var(--muted-foreground))' }
              })}
          >
            {step.label}
          </Badge>
        </div>
      ))}
    </div>
  )
}

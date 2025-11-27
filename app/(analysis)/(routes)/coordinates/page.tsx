import { Suspense } from 'react'

import { AnalysisStepIndicator } from '@/modules/analysis/ui/components/analysis-step-indicator'
import { CoordinatesContainer } from '@/modules/analysis/ui/components/coordinates-container'
import { CoordinatesPageHeader } from '@/modules/analysis/ui/components/coordinates-page-header'

import { Spinner } from '@/components/ui/spinner'

const CoordinatesLoading = () => (
  <div className='flex min-h-[400px] items-center justify-center'>
    <Spinner className='h-8 w-8' />
  </div>
)

export default function CoordinatesPage() {
  return (
    <div className='mx-auto max-w-4xl space-y-8'>
      <CoordinatesPageHeader />
      <AnalysisStepIndicator currentStep={1} />

      <Suspense fallback={<CoordinatesLoading />}>
        <CoordinatesContainer />
      </Suspense>
    </div>
  )
}

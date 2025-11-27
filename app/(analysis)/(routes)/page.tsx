import { Suspense } from 'react'

import { AnalysisPageHeader } from '@/modules/analysis/ui/components/analysis-page-header'
import { AnalysisStepIndicator } from '@/modules/analysis/ui/components/analysis-step-indicator'
import { AnalysisUploadContainer } from '@/modules/analysis/ui/components/analysis-upload-container'
import { DropzoneLoadingSkeleton } from '@/modules/analysis/ui/components/dropzone-loading-skeleton'

export default function AnalysisPage() {
  return (
    <div className='mx-auto max-w-4xl space-y-8'>
      <AnalysisPageHeader />
      <AnalysisStepIndicator currentStep={0} />

      <Suspense fallback={<DropzoneLoadingSkeleton />}>
        <AnalysisUploadContainer />
      </Suspense>
    </div>
  )
}

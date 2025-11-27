import { useRouter } from 'next/navigation'

import { useAnalysisStore } from '@/modules/analysis/store/analysis-store'

export const useUploadPage = () => {
  const router = useRouter()

  const images = useAnalysisStore(state => state.images)
  const isProcessing = useAnalysisStore(state => state.isProcessing)
  const setIsProcessing = useAnalysisStore(state => state.setIsProcessing)

  const canProceedToCoordinates = images.length > 0

  const handleContinue = () => {
    if (!canProceedToCoordinates || isProcessing) return
    setIsProcessing(true)
    router.push('/coordinates')
  }

  return {
    images,
    isProcessing,
    canProceedToCoordinates,
    handleContinue
  }
}

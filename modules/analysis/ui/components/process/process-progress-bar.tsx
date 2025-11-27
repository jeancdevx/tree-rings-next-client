import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'

interface ProcessProgressBarProps {
  label: string
  current: number
  total: number
  isComplete: boolean
}

export const ProcessProgressBar = ({
  label,
  current,
  total,
  isComplete
}: ProcessProgressBarProps) => (
  <div className='space-y-2'>
    <div className='flex items-center justify-between text-sm'>
      <div className='flex items-center gap-2'>
        {!isComplete ? (
          <Spinner className='h-4 w-4' />
        ) : (
          <div className='flex h-4 w-4 items-center justify-center rounded-full bg-green-500'>
            <svg
              className='h-2.5 w-2.5 text-white'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={3}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
        )}
        <span className='font-medium'>{label}</span>
      </div>
      <span className='text-muted-foreground'>
        {current} / {total}
      </span>
    </div>
    <Progress value={total > 0 ? (current / total) * 100 : 0} className='h-2' />
  </div>
)

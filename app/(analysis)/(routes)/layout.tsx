interface AnalysisLayoutProps {
  children: React.ReactNode
}

export default function AnalysisLayout({ children }: AnalysisLayoutProps) {
  return (
    <main className='container mx-auto min-h-svh px-4 py-8'>{children}</main>
  )
}

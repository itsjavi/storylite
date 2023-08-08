import { useSearchParams } from 'react-router-dom'

export default function SandboxLayout({ children }: any) {
  const [searchParams] = useSearchParams()
  const isStandalone = searchParams.has('standalone')

  return (
    <>
      <div className={`SandboxLayout ${isStandalone ? 'StandaloneSandboxLayout' : ''}`}>
        {children}
      </div>
    </>
  )
}

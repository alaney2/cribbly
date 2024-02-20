import { SignInUp } from '@/components/auth/SignInUp'
import '@/styles/auth.css'

export default function GetStarted() {
  return (
    <SignInUp 
      signIn={false} 
      splineLink='https://prod.spline.design/zRVkT5sl31cwbtW2/scene.splinecode'
    />
  )
}

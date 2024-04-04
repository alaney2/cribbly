// import '@/styles/auth.css'
import { SignInUp } from '@/components/auth/SignInUp'

export default function GetStarted() {
  return (
    <SignInUp 
      signIn={false} 
      // splineLink='https://prod.spline.design/A6UvbhlrrAGFFMv3/scene.splinecode'
    />
  )
}

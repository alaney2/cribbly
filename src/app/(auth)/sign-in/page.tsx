import { SignInUp } from '@/components/auth/SignInUp'
import '@/styles/auth.css'

export default function SignIn() {

  return (
    <SignInUp 
      signIn={true} 
      splineLink='https://prod.spline.design/A6UvbhlrrAGFFMv3/scene.splinecode'
    />
  )
}

// import '@/styles/no-overscroll.css'
import { SignInUp } from '@/components/auth/SignInUp'

export default function GetStarted() {
  return (
    <SignInUp 
      signIn={false} 
    />
  )
}

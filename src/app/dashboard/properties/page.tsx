import '@/styles/auth.css'
import { MapBox } from "@/components/MapBox";

export default async function Home() {
  return (
    <>
      <div className="" style={{ height: 'calc(100vh - 48px)' }}>
        <MapBox />
      </div>
    </>
  )
}
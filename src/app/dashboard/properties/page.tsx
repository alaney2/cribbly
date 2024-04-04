import '@/styles/auth.css'
import { MapBox } from "@/components/MapBox";

export default async function Home() {
  return (
    <>
      <div className="">
        <MapBox />
      </div>
    </>
  )
}
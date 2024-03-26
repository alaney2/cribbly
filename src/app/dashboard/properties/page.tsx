import { MapBox } from "@/components/MapBox";

export default async function Home() {
  return (
    <>
      <div className="" style={{ height: 'calc(100vh - 32)' }}>
        <MapBox />
      </div>
    </>
  )
}
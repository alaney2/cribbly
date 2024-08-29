"use client"
// import '@/styles/no-overscroll.css'
import GoogleMap from "@/components/welcome/GoogleMap";

export default function AddProperty() {
  return (
    <>
      <div className="flex justify-center mt-32">
        {/* <MapBox /> */}
        <GoogleMap />
      </div>
    </>
  )
}
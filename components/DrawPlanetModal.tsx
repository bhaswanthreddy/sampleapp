"use client"

import { useRef, useState } from "react"
import { supabase } from "../lib/supabase"

export default function DrawPlanetModal({ close }: any) {

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [drawing, setDrawing] = useState(false)
  const [color, setColor] = useState("#C1440E")
  const [size, setSize] = useState(12)
  const [planetName, setPlanetName] = useState("")

  const colors = [
    "#C1440E",
    "#E8B923",
    "#4267B2",
    "#1CA3EC",
    "#5DD39E",
    "#8A4FFF",
    "#FF7AA2",
    "#E6F0FF"
  ]

  const start = (e: any) => {

    setDrawing(true)

    const canvas = canvasRef.current
    const ctx = canvas!.getContext("2d")!

    ctx.beginPath()
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)

  }

  const stop = () => {

    setDrawing(false)

    const canvas = canvasRef.current
    const ctx = canvas!.getContext("2d")!

    ctx.beginPath()

  }

  const draw = (e: any) => {

    if (!drawing) return

    const canvas = canvasRef.current
    const ctx = canvas!.getContext("2d")!

    ctx.lineWidth = size
    ctx.lineCap = "round"
    ctx.strokeStyle = color

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    ctx.stroke()

  }

  const clearCanvas = () => {

    const canvas = canvasRef.current
    const ctx = canvas!.getContext("2d")!

    ctx.clearRect(0, 0, canvas!.width, canvas!.height)

  }

  const launchPlanet = async () => {

  const canvas = canvasRef.current
  if (!canvas) return

  const imageData = canvas.toDataURL("image/png")

  const blob = await (await fetch(imageData)).blob()

  const fileName = `planet-${Date.now()}.png`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("planets")
    .upload(fileName, blob)

  if (uploadError) {
    console.error("Upload error:", uploadError)
    return
  }

  // Get public URL
  const { data } = supabase.storage
    .from("planets")
    .getPublicUrl(fileName)

  const imageUrl = data.publicUrl

  // Insert into database
  const { error: dbError } = await supabase
    .from("planets")
    .insert({
      name: planetName,
      image_url: imageUrl
    })

  if (dbError) {
    console.error("DB error:", JSON.stringify(dbError, null, 2))
    return
  }

  window.location.reload()

  close()

}

  return (

    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-[#1b2a49] p-8 rounded-xl w-[460px]">

        <h2 className="text-xl mb-4">Draw your planet</h2>

        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="border mb-4 bg-black cursor-crosshair"
          onMouseDown={start}
          onMouseUp={stop}
          onMouseLeave={stop}
          onMouseMove={draw}
        />

        {/* Color palette */}

        <div className="flex gap-2 mb-4 flex-wrap">

          {colors.map((c) => (

            <button
              key={c}
              onClick={() => setColor(c)}
              style={{ background: c }}
              className="w-7 h-7 rounded-full border border-white/20"
            />

          ))}

        </div>

        {/* Brush size */}

        <div className="flex gap-4 mb-4">

          <button
            onClick={() => setSize(12)}
            className="border px-3 py-1 rounded"
          >
            Small
          </button>

          <button
            onClick={() => setSize(22)}
            className="border px-3 py-1 rounded"
          >
            Medium
          </button>

        </div>

        {/* Planet name */}

        <input
          value={planetName}
          onChange={(e) => setPlanetName(e.target.value)}
          placeholder="Planet name (optional)"
          className="w-full mb-4 p-2 rounded text-black"
        />

        {/* Buttons */}

        <div className="flex justify-between">

          <button
            onClick={clearCanvas}
            className="border px-4 py-2 rounded"
          >
            Clear
          </button>

          <button
            onClick={launchPlanet}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            Launch Planet
          </button>

        </div>

        <button
          onClick={close}
          className="mt-4 text-sm text-gray-300"
        >
          Cancel
        </button>

      </div>

    </div>

  )
}
"use client"

import { useRef, useState } from "react"
import { supabase } from "../lib/supabase"

const planetNames = [
"Zorath","Aether","Nova","Lyra","Orion","Velora","Xenon","Solara","Nebulon","Astra",
"Draconis","Virex","Talora","Eldara","Zenith","Quorra","Mythra","Arcadia","Cyrene","Altair",
"Zentra","Lumora","Kryos","Elaris","Vortex","Astryx","Seraphis","Celestia","Thalos","Arion",
"Velaris","Obsidia","Kallisto","Nythera","Valkor","Zenthia","Aurion","Pyros","Virelia","Helion",
"Dravon","Eclipse","Astrion","Tyralis","Orvion","Zephra","Krylia","Neraxis","Solstice","Vireon"
]

function generatePlanetName() {
  const name = planetNames[Math.floor(Math.random() * planetNames.length)]
  const number = Math.floor(Math.random() * 900) + 100
  return `${name}-${number}`
}

export default function DrawPlanetModal({ close }: any) {

const canvasRef = useRef<HTMLCanvasElement>(null)

const [drawing,setDrawing] = useState(false)
const [color,setColor] = useState("#C1440E")
const [size,setSize] = useState(12)
const [planetName,setPlanetName] = useState(generatePlanetName())
const [lineStyle,setLineStyle] = useState("normal")

const colors = [
"#C1440E","#E8B923","#4267B2","#1CA3EC","#5DD39E","#FF4D6D",
"#8A2BE2","#7B3F00","#FFFFFF","#00FFFF","#FF4500","#9400D3",
"#B1A79B","#D4A373","#2E8B57","#D9B38C","#C2B280","#66D9FF",
"#4169E1","#8B6F47"
]

const getXY = (e:any, canvas:HTMLCanvasElement) => {

const rect = canvas.getBoundingClientRect()

if(e.touches){
return{
x:e.touches[0].clientX - rect.left,
y:e.touches[0].clientY - rect.top
}
}

return{
x:e.nativeEvent.offsetX,
y:e.nativeEvent.offsetY
}

}

const start = (e:any) => {

setDrawing(true)

const canvas = canvasRef.current
const ctx = canvas!.getContext("2d")!

const {x,y} = getXY(e,canvas!)

ctx.beginPath()
ctx.moveTo(x,y)

}

const stop = () => {

setDrawing(false)

const canvas = canvasRef.current
const ctx = canvas!.getContext("2d")!

ctx.beginPath()

}

const draw = (e:any) => {

if(!drawing) return

const canvas = canvasRef.current
const ctx = canvas!.getContext("2d")!

const {x,y} = getXY(e,canvas!)

ctx.lineWidth = size
ctx.lineCap = "round"
ctx.strokeStyle = color
ctx.setLineDash(lineStyle==="dotted" ? [6,10] : [])

ctx.lineTo(x,y)
ctx.stroke()

}

const clearCanvas = () => {

const canvas = canvasRef.current
const ctx = canvas!.getContext("2d")!

ctx.clearRect(0,0,canvas!.width,canvas!.height)

}

const launchPlanet = async () => {

const canvas = canvasRef.current
if(!canvas) return

const imageData = canvas.toDataURL("image/png")
const blob = await (await fetch(imageData)).blob()

const fileName = `planet-${Date.now()}.png`

const {error:uploadError} = await supabase.storage
.from("planets")
.upload(fileName,blob)

if(uploadError){
console.error(uploadError)
return
}

const {data} = supabase.storage
.from("planets")
.getPublicUrl(fileName)

const imageUrl = data.publicUrl

const {error:dbError} = await supabase
.from("planets")
.insert({
name:planetName,
image_url:imageUrl
})

if(dbError){
console.error(dbError)
return
}

window.location.reload()
close()

}

return(

<div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 overflow-y-auto p-4">

<div className="bg-[#1b2a49] p-8 rounded-xl w-[460px] max-h-[90vh] overflow-y-auto">

<h2 className="text-xl mb-4 text-white">Draw your planet</h2>

<canvas
ref={canvasRef}
width={280}
height={280}
className="border mb-4 bg-black cursor-crosshair mx-auto"
onMouseDown={start}
onMouseUp={stop}
onMouseLeave={stop}
onMouseMove={draw}
onTouchStart={start}
onTouchEnd={stop}
onTouchMove={draw}
/>

{/* COLOR */}

<label className="text-sm font-semibold mb-2 block text-white">
Planet Color
</label>

<div className="flex gap-2 mb-2 flex-wrap">

{colors.map((c)=>(
<button
key={c}
onClick={()=>setColor(c)}
style={{background:c}}
className="w-7 h-7 rounded-full border-2 border-white/40"
/>
))}

</div>

<label className="text-xs text-gray-300 mb-1 block">
Custom Color Picker
</label>

<input
type="color"
value={color}
onChange={(e)=>setColor(e.target.value)}
className="mb-4 w-12 h-8 rounded"
/>

{/* BRUSH SIZE */}

<label className="text-sm font-semibold block mb-1 text-white">
Brush Size
</label>

<input
type="range"
min="2"
max="30"
value={size}
onChange={(e)=>setSize(Number(e.target.value))}
className="w-full mb-4"
/>

{/* LINE STYLE */}

<label className="text-sm font-semibold block mb-1 text-white">
Line Style
</label>

<select
value={lineStyle}
onChange={(e)=>setLineStyle(e.target.value)}
className="w-full mb-4 bg-[#0f1b33] text-white border border-gray-500 p-2 rounded"
>
<option value="normal" className="text-white">Normal Line</option>
<option value="dotted" className="text-white">Dotted Line</option>
</select>

{/* PLANET NAME */}

<label className="text-sm font-semibold block mb-1 text-white">
Planet Name (Editable)
</label>

<div className="flex gap-2 mb-4">

<input
value={planetName}
onChange={(e)=>setPlanetName(e.target.value)}
className="flex-1 p-2 rounded bg-[#0f1b33] text-white border border-gray-500"
/>

<button
onClick={()=>setPlanetName(generatePlanetName())}
className="px-3 py-2 bg-gray-600 rounded text-sm"
>
🎲
</button>

</div>

<div className="flex justify-between">

<button
onClick={clearCanvas}
className="border px-4 py-2 rounded text-white"
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
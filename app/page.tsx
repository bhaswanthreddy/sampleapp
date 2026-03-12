"use client"

import { useState,useEffect } from "react"
import DrawPlanetModal from "../components/DrawPlanetModal"
import { supabase } from "../lib/supabase"
import Link from "next/link"

const randomBetween=(min:number,max:number)=>{
return Math.floor(Math.random()*(max-min+1))+min
}

export default function Home(){

const [open,setOpen]=useState(false)
const [planets,setPlanets]=useState<any[]>([])

const [shootingStar,setShootingStar]=useState<any>(null)
const [moon,setMoon]=useState<any>(null)
const [swirl,setSwirl]=useState(false)

const [satPos,setSatPos]=useState({x:200,y:200})
const [ufoPos,setUfoPos]=useState({x:400,y:200})

const [showSatellite,setShowSatellite]=useState(false)
const [showUfo,setShowUfo]=useState(false)

/* FETCH PLANETS */

useEffect(()=>{
fetchPlanets()
},[])

const fetchPlanets=async()=>{

const {data}=await supabase
.from("planets")
.select("*")
.order("created_at",{ascending:false})
.limit(11)

setPlanets(data||[])

}

/* SHOOTING STAR */

useEffect(()=>{

let timer:any

const spawn=()=>{

setShootingStar({
top:Math.random()*80,
left:Math.random()*20,
angle:Math.random()*20+15,
id:Date.now()
})

setTimeout(()=>setShootingStar(null),2000)

timer=setTimeout(spawn,30000)

}

spawn()

return()=>clearTimeout(timer)

},[])

/* MOON */

useEffect(()=>{

let timer:any

const spawnMoon=()=>{

const rings=[220,340,460,580]

setMoon({
ring:rings[Math.floor(Math.random()*4)],
id:Date.now()
})

setTimeout(()=>setMoon(null),10000)

timer=setTimeout(spawnMoon,randomBetween(25000,30000))

}

spawnMoon()

return()=>clearTimeout(timer)

},[])

/* SATELLITE SPAWN */

useEffect(()=>{

let timer:any

const spawnSatellite=()=>{

setShowSatellite(true)

setSatPos({
x:Math.random()*600,
y:Math.random()*600
})

setTimeout(()=>setShowSatellite(false),15000)

timer=setTimeout(spawnSatellite,randomBetween(30000,45000))

}

spawnSatellite()

return()=>clearTimeout(timer)

},[])

/* SATELLITE MOVEMENT */

useEffect(()=>{

const interval=setInterval(()=>{

setSatPos({
x:Math.random()*600,
y:Math.random()*600
})

},4000)

return()=>clearInterval(interval)

},[])

/* UFO EVENT */

useEffect(()=>{

const spawnUfo=()=>{

setShowUfo(true)

setTimeout(()=>setShowUfo(false),15000)

}

spawnUfo()

const interval=setInterval(spawnUfo,180000)

return()=>clearInterval(interval)

},[])

/* UFO MOVEMENT */

useEffect(()=>{

const interval=setInterval(()=>{

setUfoPos({
x:Math.random()*600,
y:Math.random()*600
})

},4000)

return()=>clearInterval(interval)

},[])

/* SWIRL EVENT */

useEffect(()=>{

const interval=setInterval(()=>{

setSwirl(true)

setTimeout(()=>setSwirl(false),15000)

},120000)

return()=>clearInterval(interval)

},[])

return(

<div className="min-h-screen text-white flex flex-col
bg-[radial-gradient(circle_at_center,#1b2a49,#0b132b)]
relative overflow-hidden">

<style>{`

@keyframes orbit{
from{transform:rotate(0deg)}
to{transform:rotate(360deg)}
}

@keyframes spin{
from{transform:rotate(0deg)}
to{transform:rotate(360deg)}
}

.shooting-star{
position:absolute;
width:200px;
height:3px;
background:linear-gradient(90deg,transparent,white);
animation:shoot 2s linear forwards;
}

@keyframes shoot{
from{transform:translateX(0)}
to{transform:translateX(120vw)}
}

.moon{
width:45px;
height:45px;
border-radius:50%;
background:radial-gradient(circle at 30% 30%,#fff,#bcd4ff);
box-shadow:
0 0 40px rgba(180,210,255,0.9),
0 0 120px rgba(120,180,255,0.5);
}

.swirl{
position:absolute;
width:650px;
height:650px;
border-radius:50%;
background:
conic-gradient(
transparent,
rgba(255,255,255,0.08),
transparent,
rgba(255,255,255,0.08),
transparent
);
filter:blur(4px);
animation:spin 60s linear infinite;
}

.notice{
position:absolute;
top:20px;
left:50%;
transform:translateX(-50%);
font-size:14px;
opacity:0.9;
background:rgba(0,0,0,0.45);
padding:10px 20px;
border-radius:25px;
}

.satellite-body{
width:6px;
height:6px;
background:white;
border-radius:2px;
box-shadow:0 0 8px white;
}

.solar{
width:12px;
height:2px;
background:#7dd3fc;
}

`}</style>

{/* NOTICE */}

<div className="notice">
👀 Watch the sky… satellites, UFOs & shooting stars appear randomly! Make a wish if you find a shooting star ⭐
</div>

{/* STARS */}

<div className="absolute inset-0 pointer-events-none">

{Array.from({length:80}).map((_,i)=>(

<div
key={i}
className="absolute bg-white rounded-full opacity-70 animate-pulse"
style={{
width:"2px",
height:"2px",
top:`${Math.random()*100}%`,
left:`${Math.random()*100}%`
}}
/>

))}

</div>

{/* TITLE */}

<div className="text-center pt-20 text-4xl font-semibold">
The Secret Galaxy
</div>

{/* GALAXY */}

<div className="flex flex-1 items-center justify-center">

<div className="relative flex items-center justify-center w-[700px] h-[700px]">

{swirl && <div className="absolute swirl"/>}

{/* ORBITS */}

<div className="absolute w-[220px] h-[220px] border border-white/15 rounded-full scale-x-150"/>
<div className="absolute w-[340px] h-[340px] border border-white/10 rounded-full scale-x-150"/>
<div className="absolute w-[460px] h-[460px] border border-white/7 rounded-full scale-x-150"/>
<div className="absolute w-[580px] h-[580px] border border-white/5 rounded-full scale-x-150"/>

{/* SUN */}

<div className="w-24 h-24 rounded-full bg-yellow-400
shadow-[0_0_60px_20px_rgba(255,200,0,0.6)]"/>

{/* SHOOTING STAR */}

{shootingStar && (

<div
className="shooting-star"
style={{
top:`${shootingStar.top}%`,
left:`${shootingStar.left}%`,
transform:`rotate(${shootingStar.angle}deg)`
}}
/>

)}

{/* MOON */}

{moon && (

<div
className="absolute flex items-center justify-center"
style={{
width:moon.ring,
height:moon.ring,
animation:"orbit 90s linear infinite"
}}
>

<div className="absolute moon" style={{top:"-22px"}}/>

</div>

)}

{/* PLANETS */}

{planets.map((planet,i)=>{

const rings=[220,340,460,580]
const ring=rings[i%rings.length]
const speed=30+(i*10)

return(

<div
key={planet.id}
className="absolute flex items-center justify-center"
style={{
width:ring,
height:ring,
animation:`orbit ${speed}s linear infinite`
}}
>

<img
src={planet.image_url}
className="absolute w-24 h-24 object-contain
drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
style={{top:"-48px"}}
/>

</div>

)

})}

{/* SATELLITE */}

{showSatellite && (

<div
className="absolute flex items-center"
style={{
left:satPos.x,
top:satPos.y,
transition:"all 4s linear"
}}
>

<div className="solar"/>
<div className="satellite-body"/>
<div className="solar"/>

</div>

)}

{/* UFO */}

{showUfo && (

<div
className="absolute text-xl"
style={{
left:ufoPos.x,
top:ufoPos.y,
transition:"all 4s linear"
}}
>
🛸
</div>

)}

</div>

</div>

{/* BUTTONS */}

<div className="flex justify-center gap-6 pb-10">

<button
onClick={()=>setOpen(true)}
className="border px-6 py-2 rounded-lg hover:bg-white hover:text-black transition"
>
+ Add Planet
</button>

<Link
href="/gallery"
className="border px-6 py-2 rounded-lg hover:bg-white hover:text-black transition"
>
See Planet Gallery
</Link>

</div>

{open && <DrawPlanetModal close={()=>setOpen(false)}/>}

</div>

)

}
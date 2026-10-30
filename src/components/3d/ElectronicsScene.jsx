import {useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {RoundedBox,Line} from '@react-three/drei';
import {Vector3} from 'three';
import {Bolt} from './models/Primitives.jsx';

export default function ElectronicsScene({animate,accent}){
  const traces=useMemo(()=>Array.from({length:20},(_,i)=>{const side=Math.floor(i/5),lane=i%5,offset=(lane-2)*.22;const rotate=([x,z])=>{const a=side*Math.PI/2;return new Vector3(x*Math.cos(a)-z*Math.sin(a),.1,x*Math.sin(a)+z*Math.cos(a));};return [[.72,offset],[1+lane*.03,offset],[1.25+lane*.025,offset+.2],[1.72,offset+.2]].map(rotate);}),[]);
  const pulses=useRef([]),chip=useRef();
  useFrame(({clock})=>{
    if(!animate)return;
    if(chip.current)chip.current.position.y=.35+Math.sin(clock.elapsedTime*.8)*.045;
    pulses.current.forEach((mesh,i)=>{if(mesh){const p=(clock.elapsedTime*.32+i*.13)%1;const segment=Math.min(2,Math.floor(p*3));mesh.position.copy(traces[i][segment]).lerp(traces[i][segment+1],p*3-segment);mesh.position.y+=.013;mesh.scale.setScalar(.7+Math.sin(p*Math.PI)*.4);}});
  });
  return <group rotation={[.42,-.35,.05]} position={[0,-.25,0]}>
    <RoundedBox args={[3.55,.13,2.8]} radius={.035} smoothness={3}><meshStandardMaterial color="#0b2631" metalness={.12} roughness={.65} envMapIntensity={.35}/></RoundedBox>
    {traces.map((points,i)=><group key={i}><Line points={points} color={i%3===0?accent.primary:accent.secondary} lineWidth={1} transparent opacity={.6}/><mesh ref={el=>{pulses.current[i]=el;}} position={points[0]}><sphereGeometry args={[.025,10,8]}/><meshBasicMaterial color={i%3===0?accent.primary:accent.secondary}/></mesh><mesh position={points.at(-1)} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.042,.009,6,12]}/><meshStandardMaterial color="#b2a477" metalness={.8} roughness={.3}/></mesh></group>)}
    <group ref={chip} position={[0,.35,0]}>
      <RoundedBox args={[1.4,.22,1.4]} radius={.055} smoothness={3}><meshStandardMaterial color="#191e2c" metalness={.55} roughness={.27}/></RoundedBox>
      <RoundedBox args={[.9,.055,.9]} position={[0,.14,0]} radius={.04} smoothness={2}><meshStandardMaterial color="#8796ac" metalness={.95} roughness={.2}/></RoundedBox>
      <mesh position={[0,.172,0]}><boxGeometry args={[.56,.008,.56]}/><meshStandardMaterial color="#292941" metalness={.7} roughness={.2} emissive={accent.primary} emissiveIntensity={.17}/></mesh>
      {Array.from({length:4},(_,side)=><group rotation={[0,side*Math.PI/2,0]} key={side}>{Array.from({length:12},(_,i)=><mesh position={[.78,-.06,(i-5.5)*.1]} key={i}><boxGeometry args={[.25,.025,.035]}/><meshStandardMaterial color="#b6ac85" metalness={.9} roughness={.22}/></mesh>)}</group>)}
      {[-.18,0,.18].map(x=><mesh key={x} position={[x,.181,0]}><boxGeometry args={[.014,.008,.42]}/><meshBasicMaterial color={accent.secondary}/></mesh>)}
    </group>
    {[-1,1].flatMap(x=>[-1,1].map(z=><Bolt key={`${x}:${z}`} position={[x*1.55,.09,z*1.2]}/>))}
    {Array.from({length:10},(_,i)=><group key={i} position={[(i%5-2)*.28,.13,i<5?-1.05:1.05]}><mesh><boxGeometry args={[.16,.11,.08]}/><meshStandardMaterial color="#252a34" metalness={.4} roughness={.4}/></mesh>{[-.08,.08].map(x=><mesh position={[x,0,0]} key={x}><boxGeometry args={[.025,.115,.085]}/><meshStandardMaterial color="#b0bac6" metalness={.8} roughness={.25}/></mesh>)}</group>)}
    <mesh position={[0,-.09,0]}><boxGeometry args={[3.1,.008,2.4]}/><meshBasicMaterial color={accent.primary} transparent opacity={.13}/></mesh>
  </group>;
}

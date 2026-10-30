import {useMemo,useRef} from 'react';
import {PlaneGeometry} from 'three';
import {useFrame} from '@react-three/fiber';
import {RoundedBox} from '@react-three/drei';
import NetworkTower from './models/NeonTelecomTower.jsx';
import TelecomAtmosphere from './models/TelecomAtmosphere.jsx';
import {Beam} from './models/Primitives.jsx';

export default function TelecommunicationsScene({animate}){
  const beacon=useRef();
  const terrain=useMemo(()=>{const geometry=new PlaneGeometry(12,8,35,25);geometry.rotateX(-Math.PI/2);const positions=geometry.attributes.position;for(let i=0;i<positions.count;i++){const x=positions.getX(i),z=positions.getZ(i);positions.setY(i,.24*Math.exp(-(x*x+z*z)*.3)+Math.sin(x*3.2)*Math.cos(z*2.7)*.025);}geometry.computeVertexNormals();return geometry;},[]);
  useFrame(({clock})=>{if(animate&&beacon.current)beacon.current.material.emissiveIntensity=.5+Math.pow(Math.max(0,Math.sin(clock.elapsedTime*2)),8)*3;});
  return <group>
    <TelecomAtmosphere animate={animate}/>
    <group position={[0,-.15,.2]} rotation={[0,-.4,0]} scale={1.02}>
      <NetworkTower cyan="#dd4542"/>
      <RoundedBox position={[0,-1.11,0]} args={[1.7,.15,1.35]} radius={.015} smoothness={2}><meshStandardMaterial color="#303b42" metalness={.08} roughness={.95}/></RoundedBox>
      <RoundedBox position={[-.57,-.91,.26]} args={[.32,.29,.45]} radius={.007} smoothness={2}><meshStandardMaterial color="#626d70" metalness={.18} roughness={.75}/></RoundedBox>
      <RoundedBox position={[.57,-.85,-.25]} args={[.31,.42,.4]} radius={.008} smoothness={2}><meshStandardMaterial color="#424f55" metalness={.2} roughness={.7}/></RoundedBox>
      {Array.from({length:6},(_,i)=><mesh key={i} position={[-.57,-.98+i*.025,.49]}><boxGeometry args={[.23,.009,.004]}/><meshStandardMaterial color="#172126" roughness={.8}/></mesh>)}
      {[-1,1].map(side=><group key={side}><Beam from={[side*.78,-1.03,.6]} to={[side*.78,-.77,.6]} radius={.007} color="#5f7079"/><Beam from={[side*.78,-1.03,-.6]} to={[side*.78,-.77,-.6]} radius={.007} color="#5f7079"/><Beam from={[side*.78,-.8,-.6]} to={[side*.78,-.8,.6]} radius={.005} color="#6c7c84"/></group>)}
      <mesh ref={beacon} position={[0,1.67,.1]}><sphereGeometry args={[.014,10,8]}/><meshStandardMaterial color="#ff4438" emissive="#ff3020" emissiveIntensity={1}/></mesh>
      <mesh position={[0,-1.43,0]} geometry={terrain}><meshStandardMaterial color="#121b22" roughness={1}/></mesh>
    </group>
  </group>;
}

import {useMemo} from 'react';
import {Quaternion,Vector3} from 'three';

export function Beam({from,to,radius=.015,color='#77899f',emissive=false}){
  const transform=useMemo(()=>{const a=new Vector3(...from),b=new Vector3(...to);return {position:a.clone().add(b).multiplyScalar(.5),length:a.distanceTo(b),quaternion:new Quaternion().setFromUnitVectors(new Vector3(0,1,0),b.clone().sub(a).normalize())};},[from,to]);
  return <mesh position={transform.position} quaternion={transform.quaternion}><cylinderGeometry args={[radius,radius,transform.length,6]}/>{emissive?<meshBasicMaterial color={color}/>:<meshStandardMaterial color={color} metalness={.8} roughness={.33}/>}</mesh>;
}

export function Bolt({position}){return <mesh position={position} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.023,.023,.025,6]}/><meshStandardMaterial color="#adbacb" metalness={.85} roughness={.25}/></mesh>;}
export function Stage({color}){return <group position={[0,-1.62,0]}><mesh><cylinderGeometry args={[1.28,1.38,.1,64]}/><meshStandardMaterial color="#111827" metalness={.7} roughness={.4}/></mesh><mesh rotation={[Math.PI/2,0,0]} position={[0,.06,0]}><torusGeometry args={[1.27,.008,6,80]}/><meshBasicMaterial color={color} transparent opacity={.5}/></mesh></group>;}

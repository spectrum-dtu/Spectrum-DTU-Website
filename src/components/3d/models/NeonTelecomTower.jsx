import {useMemo} from 'react';
import {RoundedBox} from '@react-three/drei';
import {CylinderGeometry,Matrix4,Quaternion,Vector3,Vector2,LatheGeometry} from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {Beam} from './Primitives.jsx';

function Dish({position,rotation=0}){
  const geometry=useMemo(()=>new LatheGeometry(Array.from({length:20},(_,i)=>{const r=i/19*.145;return new Vector2(r,.23*r*r);}),32),[]);
  return <group position={position} rotation={[Math.PI/2,0,rotation]}>
    <mesh geometry={geometry}><meshStandardMaterial color="#9eabb7" metalness={.65} roughness={.4} side={2}/></mesh>
    <mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[.145,.006,8,32]}/><meshStandardMaterial color="#c1c9ce" metalness={.8} roughness={.3}/></mesh>
    <Beam from={[0,0,0]} to={[0,.13,0]} radius={.006}/>
    <mesh position={[0,.13,0]}><cylinderGeometry args={[.016,.016,.028,12]}/><meshStandardMaterial color="#42515e" metalness={.5} roughness={.4}/></mesh>
  </group>;
}

export default function NetworkTower({cyan}){
  const frame=useMemo(()=>{
    const parts=[];
    const width=y=>.43-(y+1.02)/2.6*.29;
    const corner=(i,y)=>{const s=[[-1,-1],[1,-1],[1,1],[-1,1]][i];return new Vector3(s[0]*width(y),y,s[1]*width(y));};
    const add=(a,b,radius)=>{const direction=b.clone().sub(a),geometry=new CylinderGeometry(radius,radius,direction.length(),6);const matrix=new Matrix4().compose(a.clone().add(b).multiplyScalar(.5),new Quaternion().setFromUnitVectors(new Vector3(0,1,0),direction.normalize()),new Vector3(1,1,1));geometry.applyMatrix4(matrix);parts.push(geometry);};
    for(let i=0;i<4;i++)add(corner(i,-1.02),corner(i,1.54),.018);
    for(let level=0;level<8;level++){
      const bottom=-1.02+level*.32,top=bottom+.32;
      for(let side=0;side<4;side++){
        const next=(side+1)%4;
        add(corner(side,bottom),corner(next,top),.0065);
        add(corner(next,bottom),corner(side,top),.0065);
        add(corner(side,bottom),corner(next,bottom),.008);
      }
    }
    const merged=mergeGeometries(parts);parts.forEach(part=>part.dispose());return merged;
  },[]);
  return <group>
    <mesh geometry={frame}><meshStandardMaterial color="#4b5861" metalness={.78} roughness={.42}/></mesh>
    {[-1,1].flatMap(x=>[-1,1].map(z=><group key={`${x}:${z}`} position={[x*.43,-1.005,z*.43]}>
      <mesh><boxGeometry args={[.11,.018,.11]}/><meshStandardMaterial color="#73818e" metalness={.7} roughness={.5}/></mesh>
      {[-1,1].map(side=><mesh key={side} position={[side*.032,.018,.031]}><cylinderGeometry args={[.01,.01,.025,6]}/><meshStandardMaterial color="#bac4ca" metalness={.8} roughness={.3}/></mesh>)}
    </group>))}
    {[1.12,.3,-.45].map((y,level)=><group key={y} position={[0,y,0]}>
      {[0,Math.PI*2/3,Math.PI*4/3].map((angle,i)=><group key={i} rotation={[0,angle,0]}>
        <Beam from={[0,0,0]} to={[.31,0,0]} radius={.01} color="#677783"/>
        <RoundedBox position={[.31,0,0]} args={[.085,level===0?.55:.29,.115]} radius={.012} smoothness={3}><meshStandardMaterial color="#7b858a" metalness={.05} roughness={.68}/></RoundedBox>
        <mesh position={[.312,-(level===0?.27:.14),0]}><boxGeometry args={[.07,.018,.09]}/><meshStandardMaterial color="#586775" roughness={.6}/></mesh>
        <Beam from={[.28,-.15,-.03]} to={[.2,-.35,-.03]} radius={.005} color="#202c35"/>
      </group>)}
    </group>)}
    <Dish position={[.39,-.2,.12]} rotation={-.4}/><Dish position={[-.32,.55,.12]} rotation={.5}/>
    <Beam from={[0,1.5,0]} to={[0,1.76,0]} radius={.009} color="#4e5f6a"/>
    <Beam from={[0,1.74,0]} to={[0,2.1,0]} radius={.004} color="#99adb8"/>
    <mesh position={[0,2.1,0]}><sphereGeometry args={[.009,10,8]}/><meshBasicMaterial color={cyan}/></mesh>
    {[-1,1].map(x=><Beam key={x} from={[x*.055,-.95,-.09]} to={[x*.055,1.46,-.09]} radius={.006} color="#6d7e89"/>)}
    {Array.from({length:24},(_,i)=><Beam key={i} from={[-.055,-.9+i*.095,-.09]} to={[.055,-.9+i*.095,-.09]} radius={.004} color="#83929b"/>)}
    <Beam from={[.09,-.98,.07]} to={[.09,1.42,.07]} radius={.006} color="#17252b"/>
  </group>;
}

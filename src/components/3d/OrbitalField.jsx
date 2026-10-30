import {useMemo} from 'react';
import * as THREE from 'three';
import config from '../../data/scene.json';

export default function OrbitalField(){
  const geometry=useMemo(()=>{
    let seed=config.orbitalField.seed;
    const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    const positions=[],colors=[];
    for(let i=0;i<config.orbitalField.pointCount;i++){
      const longitude=random()*Math.PI*2,y=random()*2-1,radius=2.3+random()*.6;
      const r=Math.sqrt(1-y*y);
      positions.push(radius*r*Math.cos(longitude),radius*y,radius*r*Math.sin(longitude));
      const color=new THREE.Color(i%4===0?'#9cf8ff':'#ee77ef');colors.push(color.r,color.g,color.b);
    }
    return new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(positions,3)).setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  },[]);
  const ring=useMemo(()=>new THREE.BufferGeometry().setFromPoints(Array.from({length:240},(_,i)=>{const a=i/240*Math.PI*2;return new THREE.Vector3(Math.cos(a),Math.sin(a),0);})),[]);
  return <group><points geometry={geometry}><pointsMaterial size={.014} vertexColors transparent opacity={.65} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending}/></points>{config.orbitalField.rings.map((setting,i)=><group rotation={setting.tilt} scale={setting.radius} key={i}><lineLoop geometry={ring}><lineBasicMaterial color={i===0?'#89dcff':'#bd69ef'} transparent opacity={setting.opacity} depthWrite={false}/></lineLoop><points geometry={ring}><pointsMaterial size={.008} color="#c59eff" transparent opacity={.5} depthWrite={false}/></points></group>)}</group>;
}

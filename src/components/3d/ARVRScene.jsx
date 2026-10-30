import {useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {Line} from '@react-three/drei';
import MixedRealityHeadset from './models/MixedRealityHeadset.jsx';
import data from '../../data/departments.json';
const settings=data.departments.find(d=>d.id==='arvr').sceneSettings;

// A small architectural study, secondary to the physical headset.
function CampusPreview({accent}){
  return <group position={[1.65,-.75,-1.25]} scale={.42}>
    {[[0,0,0],[.5,0,0],[-.5,0,0],[.5,0,-.5],[-.5,0,-.5]].map(([x,y,z],i)=><mesh key={i} position={[x,y+(i%2?.3:.2),z]}><boxGeometry args={[.34,i%2?.6:.4,.28]}/><meshBasicMaterial color={accent.primary} wireframe transparent opacity={.18}/></mesh>)}
    <Line points={[[-.85,0,.4],[.85,0,.4],[.85,0,-.85],[-.85,0,-.85],[-.85,0,.4]]} color={accent.secondary} transparent opacity={.2} lineWidth={.5}/>
  </group>;
}

export default function ARVRScene({animate,accent}){
  const headset=useRef(),time=useRef(0),interfaces=useRef([]);
  useFrame((_,delta)=>{
    if(!animate)return;
    time.current+=Math.min(delta,.04);
    if(headset.current){headset.current.rotation.y=settings.initialRotation+time.current*settings.rotationSpeed;headset.current.position.y=Math.sin(time.current*.7)*settings.floatAmplitude;}
    interfaces.current.forEach((object,i)=>{if(object)object.position.y=.35+i*.35+Math.sin(time.current*.6+i)*.025;});
  });
  return <group>
    <group ref={headset} scale={1.15} rotation={[.08,settings.initialRotation,0]}><MixedRealityHeadset/></group>
    <pointLight position={[-2,1,1]} color="#70e5fa" intensity={7}/>
    <pointLight position={[1.5,2,-1]} color="#e643bc" intensity={9}/>
    <gridHelper args={[5,20,accent.primary,accent.secondary]} position={[0,-1.15,-.7]} material-transparent material-opacity={.055} material-depthWrite={false}/>
    <CampusPreview accent={accent}/>
    {[[-1.65,.35,-1],[1.65,.7,-1.6]].map((point,i)=><group position={point} key={i} ref={el=>{interfaces.current[i]=el;}}><Line points={[[-.18,-.1,0],[.18,-.1,0],[.18,.1,0],[-.18,.1,0],[-.18,-.1,0]]} color={i?accent.secondary:accent.primary} lineWidth={.5} transparent opacity={.25}/><Line points={[[-.12,.035,.001],[.06,.035,.001],[-.12,.035,.001],[-.12,-.035,.001],[.12,-.035,.001]]} color={accent.primary} lineWidth={.5} transparent opacity={.2}/></group>)}
  </group>;
}

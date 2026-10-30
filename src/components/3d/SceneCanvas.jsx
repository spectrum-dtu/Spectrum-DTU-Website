import {useEffect,useRef,useState} from 'react';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {Environment,Lightformer} from '@react-three/drei';
import {MathUtils} from 'three';
import data from '../../data/departments.json';
import ARVRFallback from '../domains/ARVRFallback.jsx';

const scenes={
  telecommunications:()=>import('./TelecommunicationsScene.jsx'),
  electronics:()=>import('./ElectronicsScene.jsx'),
  aiml:()=>import('./AIMLScene.jsx'),
  arvr:()=>import('./ARVRScene.jsx')
};
function supportsWebGL(){try{const gl=document.createElement('canvas').getContext('webgl2');if(!gl)return false;gl.getExtension('WEBGL_lose_context')?.loseContext();return true;}catch{return false;}}

function SceneRig({children,animate,reducedMotion}){
  const group=useRef(),target=useRef({x:0,y:0});
  const {gl,invalidate}=useThree();
  const time=useRef(0);
  useEffect(()=>{
    const canvas=gl.domElement;
    const move=event=>{if(event.pointerType==='touch'||reducedMotion)return;const r=canvas.getBoundingClientRect();target.current={x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5};invalidate();};
    const leave=()=>{target.current={x:0,y:0};invalidate();};
    canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerleave',leave);
    if(animate)invalidate();
    return()=>{canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave);};
  },[gl,invalidate,animate,reducedMotion]);
  useFrame((_,delta)=>{
    if(!group.current||!animate)return;
    const step=Math.min(delta,.04);time.current+=step;
    group.current.rotation.y=MathUtils.damp(group.current.rotation.y,Math.sin(time.current*.18)*.13+target.current.x*.2,5,step);
    group.current.rotation.x=MathUtils.damp(group.current.rotation.x,target.current.y*.1,5,step);
    group.current.position.y=Math.sin(time.current*.65)*.045;
    invalidate();
  });
  return <group ref={group}>{children}</group>;
}

export default function SceneCanvas({scene,accent,reducedMotion}){
  const [supported]=useState(supportsWebGL);
  const [pageVisible,setPageVisible]=useState(()=>!document.hidden);
  useEffect(()=>{const change=()=>setPageVisible(!document.hidden);document.addEventListener('visibilitychange',change);return()=>document.removeEventListener('visibilitychange',change);},[]);
  const [Scene,setScene]=useState(null);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    if(!supported)return;
    let cancelled=false;
    scenes[scene]().then(module=>{if(!cancelled)setScene(()=>module.default);}).catch(()=>{if(!cancelled)setFailed(true);});
    return()=>{cancelled=true;};
  },[scene,supported]);
  if((!supported||failed)&&scene==='arvr')return <ARVRFallback/>;
  if(!supported||failed)return <div className="domain-preview-state"><span className="preview-orbit" aria-hidden="true"/><p>{data.fallback}</p></div>;
  if(!Scene)return <div className="domain-preview-state" role="status"><span className="preview-orbit" aria-hidden="true"/><p>{data.loading}</p></div>;
  const animate=pageVisible&&!reducedMotion;
  const telecom=scene==='telecommunications';
  const arvr=scene==='arvr';
  return <Canvas frameloop="demand" dpr={[1,1.4]} camera={{position:[0,.45,6.5],fov:42}} style={{touchAction:'pan-y'}} gl={{antialias:true,alpha:true,powerPreference:'low-power'}}>
    <ambientLight intensity={telecom?.2:.9}/><hemisphereLight args={['#c9dafa','#131326',telecom?.25:1]}/>
    <directionalLight position={[-3,5,5]} intensity={telecom?.8:3} color="#e5f4ff"/>
    <pointLight position={[3,1,3]} intensity={telecom?1.4:20} color={accent.primary}/>
    <pointLight position={[-3,0,-2]} intensity={telecom?.7:16} color={accent.secondary}/>
    <Environment resolution={64} frames={1} environmentIntensity={telecom?.25:1}>
      <color attach="background" args={[arvr?'#050a12':'#182032']}/>
      <Lightformer intensity={arvr?1.8:3} color={arvr?'#df71b6':'#ffffff'} position={[0,4,0]} rotation={[Math.PI/2,0,0]} scale={arvr?[6,.6,1]:[8,8,1]}/>
      <Lightformer intensity={arvr?1.2:2} color={arvr?'#78cadd':'#ffffff'} position={[-3,1,4]} scale={arvr?[.65,5,1]:[4,5,1]}/>
      <Lightformer intensity={1.5} color={accent.primary} position={[3,1,-3]} rotation={[0,Math.PI,0]} scale={[3,4,1]}/>
    </Environment>
    <SceneRig animate={animate} reducedMotion={reducedMotion}><Scene animate={animate} accent={accent}/></SceneRig>

  </Canvas>;
}

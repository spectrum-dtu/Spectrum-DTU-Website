import {useEffect,useId,useState} from 'react';
import telecomPhoto from '../../assets/telecommunication.png';
import telecomSides from '../../assets/telecommunication-sides.png';
import electronicsPhoto from '../../assets/electronics.jpeg';
import aimlPhoto from '../../assets/aiml.png';
import vrPhoto from '../../assets/vr.png';
import data from '../../data/departments.json';
import './DepartmentSignalImage.css';
const photos={telecommunications:telecomPhoto,telecommunicationsExtended:telecomSides,electronics:electronicsPhoto,aiml:aimlPhoto,arvr:vrPhoto};

export default function DepartmentSignalImage({media,active,reducedMotion}){
  const maskId=`tower-mask-${useId().replaceAll(':','')}`;
  const [pageVisible,setPageVisible]=useState(()=>!document.hidden);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{const change=()=>setPageVisible(!document.hidden);document.addEventListener('visibilitychange',change);return()=>document.removeEventListener('visibilitychange',change);},[]);
  if(failed)return <div className="domain-preview-state"><p>{data.fallback}</p></div>;
  const moving=active&&pageVisible&&!reducedMotion;
  return <div className={`telecom-photo${moving?' is-flowing':''}${media.animation==='dots'?' has-data-dots':''}`}>
    <img className="department-original-photo" src={photos[media.image]} style={{objectFit:media.fit??'contain'}} alt="" width={media.width} height={media.height} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>
    <svg className="telecom-photo-signals" viewBox={`0 0 ${media.width} ${media.height}`} preserveAspectRatio={media.fit==='cover'?'xMidYMid slice':'xMidYMid meet'} aria-hidden="true">
      <defs>{media.maskPath&&<mask id={maskId}><rect width={media.width} height={media.height} fill="white"/><path d={media.maskPath} fill="black"/></mask>}</defs>
      {media.animation==='visor'&&<path className="visor-edge-light visor-edge-halo" d={media.signalPaths[0]} pathLength="100" style={{animationDuration:`${media.signalDuration}s`}}/>}
      <g mask={media.maskPath?`url(#${maskId})`:undefined}>
        {media.signalPaths.map((path,i)=><path className={media.animation==='visor'?'visor-edge-light':'telecom-flow-path'} pathLength={media.animation==='visor'?100:undefined} key={path} d={path} style={{'--signal-color':media.signalColors?.[i%media.signalColors.length]??'#b9ffff',animationDuration:`${media.signalDuration+(media.animation==='dots'?(i%5)*.35:i*.8)}s`,animationDelay:`${-i*1.7}s`}}/>)}
      </g>
    </svg>
  </div>;
}

import {Component,lazy,Suspense,useEffect,useRef,useState} from 'react';
import data from '../../data/departments.json';
import './DepartmentSection.css';
import ARVRFallback from './ARVRFallback.jsx';
const SceneCanvas=lazy(()=>import('../3d/SceneCanvas.jsx'));
const DepartmentSignalImage=lazy(()=>import('./DepartmentSignalImage.jsx'));

class PreviewBoundary extends Component{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?this.props.fallback:this.props.children;}
}

export default function DepartmentSection({department,reducedMotion}){
  const viewport=useRef();
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'80px',threshold:0});
    observer.observe(viewport.current);
    return()=>observer.disconnect();
  },[]);
  const fallback=department.scene==='arvr'?<ARVRFallback/>:<div className="domain-preview-state"><span className="preview-orbit" aria-hidden="true"/><p>{data.fallback}</p></div>;
  const loading=<div className="domain-preview-state" role="status"><span className="preview-orbit" aria-hidden="true"/><p>{data.loading}</p></div>;
  return <article id={`domain-${department.id}`} className="department" style={{'--domain-accent':department.accent.primary,'--domain-secondary':department.accent.secondary,'--domain-rgb':department.accent.rgb}} aria-labelledby={`title-${department.id}`}>

    <div className="department-visual" ref={viewport} role="img" aria-label={department.media?.alt??`${department.name}: ${data.sceneLabel}`}>
      <div className="department-aura" aria-hidden="true"/>
      {visible?<PreviewBoundary fallback={fallback}><Suspense fallback={loading}>{department.media?.type==='image'?<DepartmentSignalImage media={department.media} active={visible} reducedMotion={reducedMotion}/>:<SceneCanvas scene={department.scene} accent={department.accent} reducedMotion={reducedMotion}/>}</Suspense></PreviewBoundary>:<div className="domain-preview-idle" aria-hidden="true"/>}
      <div className="department-scene-label" aria-hidden="true"><span/>{department.name}<small>{department.number} / 04</small></div>
    </div>
    <div className="department-copy">
      <h3 id={`title-${department.id}`}>{department.name}</h3>
      <p className="department-introduction">{department.introduction}</p>
      <ul className="department-tags">
        {department.technicalAreas.map(area=><li key={area}>{area}</li>)}
      </ul>
    </div>
  </article>;
}

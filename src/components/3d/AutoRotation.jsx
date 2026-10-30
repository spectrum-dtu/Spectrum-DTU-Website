import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {MathUtils,Vector3} from 'three';
import config from '../../data/scene.json';

export default function AutoRotation({children,reducedMotion,interactingRef}) {
  const group=useRef();
  const activeTime=useRef(0);
  const visible=useRef(true);
  const {gl,invalidate}=useThree();
  const axis=useMemo(()=>{
    const tilt=MathUtils.degToRad(config.autoRotation.axisTiltDegrees);
    return new Vector3(Math.sin(tilt),Math.cos(tilt),0).normalize();
  },[]);

  useEffect(()=>{
    const canvas=gl.domElement;
    const observer=new IntersectionObserver(([entry])=>{
      visible.current=entry.isIntersecting;
      if(visible.current)invalidate();
    });
    const resume=()=>{if(!document.hidden)invalidate();};
    observer.observe(canvas);
    document.addEventListener('visibilitychange',resume);
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',resume);};
  },[gl,invalidate]);

  useFrame((_,delta)=>{
    if(reducedMotion || !visible.current || document.hidden)return;
    if(!interactingRef.current && group.current){
      // Incremental rotation avoids jumps after dragging or returning to the tab.
      const step=Math.min(delta,1/60);
      activeTime.current+=step;
      const easeIn=MathUtils.smoothstep(activeTime.current,0,config.autoRotation.easeInDuration);
      group.current.rotateOnWorldAxis(axis,config.autoRotation.radiansPerSecond*easeIn*step);
    }
    if(!interactingRef.current)invalidate();
  });

  return <group ref={group}>{children}</group>;
}

import {useEffect,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {MathUtils} from 'three';
import config from '../../data/scene.json';

// Rotate the globe itself so dragging never competes with the intro camera.
export default function DragRotation({children,reducedMotion,interactingRef}) {
  const group=useRef();
  const target=useRef({x:0,y:0});
  const {gl,invalidate}=useThree();

  useEffect(()=>{
    const canvas=gl.domElement;
    let pointer=null;
    let previousX=0,previousY=0;
    const down=event=>{
      if(pointer!==null || (event.pointerType==='mouse' && event.button!==0))return;
      pointer=event.pointerId;
      interactingRef.current=true;
      previousX=event.clientX;previousY=event.clientY;
      canvas.setPointerCapture(pointer);
      canvas.classList.add('is-dragging');
    };
    const move=event=>{
      if(event.pointerId!==pointer)return;
      const dx=event.clientX-previousX,dy=event.clientY-previousY;
      previousX=event.clientX;previousY=event.clientY;
      // Clamp large pointer jumps and pitch to keep interaction gentle.
      target.current.y+=MathUtils.clamp(dx,-60,60)*config.drag.radiansPerPixel;
      target.current.x=MathUtils.clamp(target.current.x+MathUtils.clamp(dy,-60,60)*config.drag.radiansPerPixel,-config.drag.maxTilt,config.drag.maxTilt);
      invalidate();
    };
    const end=event=>{
      if(event.pointerId!==pointer)return;
      if(canvas.hasPointerCapture(pointer))canvas.releasePointerCapture(pointer);
      pointer=null;
      interactingRef.current=false;
      invalidate();
      canvas.classList.remove('is-dragging');
    };
    canvas.addEventListener('pointerdown',down);
    canvas.addEventListener('pointermove',move);
    canvas.addEventListener('pointerup',end);
    canvas.addEventListener('pointercancel',end);
    canvas.addEventListener('lostpointercapture',end);
    return()=>{
      canvas.removeEventListener('pointerdown',down);
      canvas.removeEventListener('pointermove',move);
      canvas.removeEventListener('pointerup',end);
      canvas.removeEventListener('pointercancel',end);
      canvas.removeEventListener('lostpointercapture',end);
      if(pointer!==null && canvas.hasPointerCapture(pointer))canvas.releasePointerCapture(pointer);
      canvas.classList.remove('is-dragging');
      interactingRef.current=false;
    };
  },[gl,invalidate,interactingRef]);

  useFrame((_,delta)=>{
    if(!group.current)return;
    const rotation=group.current.rotation;
    rotation.x=reducedMotion?target.current.x:MathUtils.damp(rotation.x,target.current.x,config.drag.smoothing,Math.min(delta,.05));
    rotation.y=reducedMotion?target.current.y:MathUtils.damp(rotation.y,target.current.y,config.drag.smoothing,Math.min(delta,.05));
    const settling=Math.abs(rotation.x-target.current.x)+Math.abs(rotation.y-target.current.y)>.0001;
    if(settling)invalidate();
    else {rotation.x=target.current.x;rotation.y=target.current.y;}
  });

  return <group ref={group}>{children}</group>;
}

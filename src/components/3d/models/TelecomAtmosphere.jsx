import {useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {BufferGeometry,Float32BufferAttribute,AdditiveBlending} from 'three';

const waveVertex=`uniform float time; uniform float phase; varying float brightness; void main(){vec3 p=position;p.y+=sin(p.x*1.65-time*.5+phase)*.24+p.x*.12;brightness=.45+.55*sin(p.x*2.0-time+phase)*sin(p.x*2.0-time+phase);vec4 view=modelViewMatrix*vec4(p,1.0);gl_Position=projectionMatrix*view;gl_PointSize=2.1;}`;

export default function TelecomAtmosphere({animate}){
  const sky=useRef(),waves=useRef([]),dust=useRef();
  const strands=useMemo(()=>Array.from({length:7},(_,j)=>new BufferGeometry().setAttribute('position',new Float32BufferAttribute(Array.from({length:160},(_,i)=>[-4+i/159*8,.12+(j-3)*.07,-1.4-j*.035]).flat(),3))),[]);
  const particles=useMemo(()=>{const points=[];for(let i=0;i<700;i++){const x=((i*73)%701)/700*8-4,j=i%11;points.push(x,.12+(j-5)*.06,-1.5+(i%7)*.025);}return new BufferGeometry().setAttribute('position',new Float32BufferAttribute(points,3));},[]);
  const city=useMemo(()=>{const points=[],colors=[];for(let i=0;i<550;i++){const r=(Math.sin(i*92.13)*43758.5453)%1;const s=Math.abs(r);points.push(Math.sin(i*7.1)*5,-1.25-s*.65,-2.3-Math.abs(Math.cos(i*3.7))*1.7);colors.push(.65+s*.35,.38+s*.44,.17+s*.48);}return new BufferGeometry().setAttribute('position',new Float32BufferAttribute(points,3)).setAttribute('color',new Float32BufferAttribute(colors,3));},[]);
  useFrame(({clock})=>{if(!animate)return;if(sky.current)sky.current.uniforms.time.value=clock.elapsedTime;waves.current.forEach(m=>{if(m)m.uniforms.time.value=clock.elapsedTime;});if(dust.current)dust.current.uniforms.time.value=clock.elapsedTime;});
  return <group>
    <mesh position={[0,.3,-5]}><planeGeometry args={[22,14]}/><shaderMaterial ref={sky} depthWrite={false} uniforms={{time:{value:0}}} vertexShader={'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}'} fragmentShader={`
      uniform float time;varying vec2 vUv;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.04+vec2(3.1,7.3);a*=.5;}return v;}
      void main(){float horizon=exp(-pow((vUv.y-.35)*22.,2.));vec3 color=mix(vec3(.012,.024,.046),vec3(.025,.1,.18),smoothstep(.2,.7,vUv.y));color+=vec3(.26,.1,.035)*horizon;float cloud=fbm(vec2(vUv.x*8.+time*.002,vUv.y*15.));float layer=smoothstep(.42,.72,cloud);color=mix(color,vec3(.018,.031,.054),layer*.8);color+=vec3(.015,.035,.055)*(1.-layer)*smoothstep(.35,.8,vUv.y);gl_FragColor=vec4(color,1.);}
    `}/></mesh>
    <points geometry={city}><pointsMaterial size={.014} vertexColors transparent opacity={.8} sizeAttenuation depthWrite={false}/></points>
    {strands.map((geometry,i)=><line key={i} geometry={geometry}><shaderMaterial ref={el=>{waves.current[i]=el;}} transparent depthWrite={false} blending={AdditiveBlending} uniforms={{time:{value:0},phase:{value:i*.32}}} vertexShader={waveVertex} fragmentShader={'varying float brightness;void main(){gl_FragColor=vec4(.35,.9,1.,brightness*.22);}'}/></line>)}
    <points geometry={particles}><shaderMaterial ref={dust} transparent depthWrite={false} blending={AdditiveBlending} uniforms={{time:{value:0},phase:{value:.3}}} vertexShader={waveVertex} fragmentShader={'varying float brightness;void main(){float r=length(gl_PointCoord-.5);float glow=1.-smoothstep(.05,.5,r);gl_FragColor=vec4(.45,.95,1.,glow*brightness*.65);}'}/></points>
  </group>;
}

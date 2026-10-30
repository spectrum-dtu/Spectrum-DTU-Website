import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {AdditiveBlending,BufferGeometry,Float32BufferAttribute,Color,Vector3,Object3D} from 'three';
import data from '../../data/departments.json';

const config=data.departments.find(d=>d.id==='aiml').sceneSettings;
function nodeColor(layer,index){
  const t=layer/(config.layers.length-1)*(config.palette.length-1),step=Math.floor(t);
  const color=new Color(config.palette[step]).lerp(new Color(config.palette[Math.min(step+1,config.palette.length-1)]),t-step);
  if(index%4===1)color.lerp(new Color(config.palette[(layer+index)%config.palette.length]),.42);
  return color;
}

export default function AIMLScene({animate}){
  const neurons=useRef([]),packets=useRef();
  const {viewport}=useThree();
  const model=useMemo(()=>{
    const layers=config.layers.map((count,layer)=>Array.from({length:count},(_,i)=>({position:new Vector3((layer-(config.layers.length-1)/2)*config.layerSpacing,(i-(count-1)/2)*config.nodeSpacing,Math.sin(i*1.3+layer*.8)*.13),color:nodeColor(layer,i),layer})));
    const edges=layers.slice(0,-1).flatMap((nodes,layer)=>nodes.flatMap(a=>layers[layer+1].map(b=>({a,b}))));
    const positions=[],colors=[];
    for(const {a,b} of edges){positions.push(...a.position.toArray(),...b.position.toArray());colors.push(...a.color.toArray(),...b.color.toArray());}
    const geometry=new BufferGeometry().setAttribute('position',new Float32BufferAttribute(positions,3)).setAttribute('color',new Float32BufferAttribute(colors,3));
    return {layers,nodes:layers.flat(),edges,geometry,dummy:new Object3D()};
  },[]);
  useEffect(()=>{
    if(!packets.current)return;
    for(let i=0;i<config.pulseCount;i++){
      const edge=model.edges[(i*23)%model.edges.length];model.dummy.position.copy(edge.a.position).lerp(edge.b.position,(i*.137)%1);model.dummy.updateMatrix();packets.current.setMatrixAt(i,model.dummy.matrix);packets.current.setColorAt(i,edge.a.color.clone().lerp(new Color('#efffff'),.65));
    }
    packets.current.instanceMatrix.needsUpdate=true;packets.current.instanceColor.needsUpdate=true;
  },[model]);
  useFrame(({clock})=>{
    if(!animate)return;
    const time=clock.elapsedTime*config.flowSpeed;
    for(let i=0;i<config.pulseCount;i++){
      const phase=time+i*.137,edge=model.edges[(i*23+Math.floor(phase)*31)%model.edges.length];
      model.dummy.position.copy(edge.a.position).lerp(edge.b.position,phase%1);model.dummy.updateMatrix();packets.current?.setMatrixAt(i,model.dummy.matrix);
    }
    if(packets.current)packets.current.instanceMatrix.needsUpdate=true;
    neurons.current.forEach((neuron,i)=>{if(neuron){const layer=model.nodes[i].layer;const activation=Math.pow(Math.max(0,Math.sin(time*3-layer*.85)),6);neuron.material.emissiveIntensity=.08+activation*.24;}});
  });
  const scale=Math.min(1.2,(viewport.width-.4)/4.4);
  return <group rotation={[.02,-.1,0]} scale={scale}>
    <lineSegments geometry={model.geometry}><lineBasicMaterial vertexColors transparent opacity={.3} depthWrite={false}/></lineSegments>
    {model.nodes.map((node,i)=><group position={node.position} key={i}>
      <mesh ref={el=>{neurons.current[i]=el;}}><sphereGeometry args={[config.nodeRadius,28,20]}/><meshPhysicalMaterial color={node.color} metalness={.2} roughness={.12} clearcoat={1} clearcoatRoughness={.065} emissive={node.color} emissiveIntensity={.1} envMapIntensity={1.2} iridescence={.25} iridescenceIOR={1.3}/></mesh>
      <mesh scale={1.28}><sphereGeometry args={[config.nodeRadius,16,12]}/><shaderMaterial transparent depthWrite={false} blending={AdditiveBlending} uniforms={{color:{value:node.color}}} vertexShader={'varying vec3 n;varying vec3 v;void main(){n=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.0);v=-p.xyz;gl_Position=projectionMatrix*p;}'} fragmentShader={'uniform vec3 color;varying vec3 n;varying vec3 v;void main(){float edge=pow(1.0-max(dot(normalize(n),normalize(v)),0.0),3.0);gl_FragColor=vec4(color,edge*.2);}'}/></mesh>
    </group>)}
    <instancedMesh ref={packets} args={[null,null,config.pulseCount]} frustumCulled={false}><sphereGeometry args={[.014,8,6]}/><meshBasicMaterial toneMapped={false}/></instancedMesh>
    {model.layers.map((layer,i)=><mesh key={i} rotation={[-Math.PI/2,0,0]} position={[(i-(config.layers.length-1)/2)*config.layerSpacing,-1.45,0]}><planeGeometry args={[.7,1.5]}/><shaderMaterial transparent depthWrite={false} blending={AdditiveBlending} uniforms={{color:{value:layer[0].color}}} vertexShader={'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}'} fragmentShader={'uniform vec3 color;varying vec2 vUv;void main(){float radius=length((vUv-.5)*2.0);float glow=pow(max(0.0,1.0-radius),2.0);gl_FragColor=vec4(color,glow*.18);}'}/></mesh>)}
    <mesh position={[0,-1.47,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[6,4]}/><meshStandardMaterial color="#080d19" metalness={.45} roughness={.38} transparent opacity={.45}/></mesh>
    <pointLight position={[-2,.7,1]} color={config.palette[0]} intensity={3}/><pointLight position={[2,.5,1]} color={config.palette[3]} intensity={3}/>
  </group>;
}

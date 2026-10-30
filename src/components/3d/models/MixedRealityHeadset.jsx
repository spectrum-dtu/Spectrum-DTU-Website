import {useMemo} from 'react';
import {RoundedBox} from '@react-three/drei';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {Shape,Path,ExtrudeGeometry,CatmullRomCurve3,Vector3,BufferGeometry,Float32BufferAttribute,DataTexture,RGBAFormat,RepeatWrapping} from 'three';

function outline(scale=1){
  const shape=new Shape();
  shape.moveTo(-1.1*scale,.29*scale);
  shape.bezierCurveTo(-1.04*scale,.63*scale,-.35*scale,.67*scale,.18*scale,.58*scale);
  shape.bezierCurveTo(.68*scale,.55*scale,1.17*scale,.45*scale,1.19*scale,.16*scale);
  shape.bezierCurveTo(1.23*scale,-.17*scale,1.1*scale,-.57*scale,.85*scale,-.55*scale);
  shape.bezierCurveTo(.46*scale,-.54*scale,.39*scale,-.19*scale,.12*scale,-.2*scale);
  shape.bezierCurveTo(-.22*scale,-.19*scale,-.28*scale,-.49*scale,-.77*scale,-.43*scale);
  shape.bezierCurveTo(-1.1*scale,-.4*scale,-1.16*scale,-.01*scale,-1.1*scale,.29*scale);
  return shape;
}
function shellGeometry(depth,bevel){
  const geometry=new ExtrudeGeometry(outline(),{depth,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel,bevelSegments:6,curveSegments:28,steps:1});
  const input=geometry.attributes.position,normals=geometry.attributes.normal,vertices=[];
  const triangle=(a,b,c,depth)=>{
    if(depth>0){const ab=a.clone().add(b).multiplyScalar(.5),bc=b.clone().add(c).multiplyScalar(.5),ca=c.clone().add(a).multiplyScalar(.5);triangle(a,ab,ca,depth-1);triangle(ab,b,bc,depth-1);triangle(ca,bc,c,depth-1);triangle(ab,bc,ca,depth-1);return;}
    for(const v of [a,b,c]){const z=v.z+.16*(1-Math.min(1,v.x*v.x/1.6));vertices.push(v.x,v.y,z);}
  };
  for(let i=0;i<input.count;i+=3){triangle(new Vector3().fromBufferAttribute(input,i),new Vector3().fromBufferAttribute(input,i+1),new Vector3().fromBufferAttribute(input,i+2),Math.abs(normals.getZ(i))>.99?3:0);}
  const smooth=mergeVertices(new BufferGeometry().setAttribute('position',new Float32BufferAttribute(vertices,3)),.00001);smooth.computeVertexNormals();geometry.dispose();return smooth;
}
function ribbon(points,width,axis){
  const curve=new CatmullRomCurve3(points.map(p=>new Vector3(...p))),across=new Vector3(...axis),positions=[],indices=[];
  for(let i=0;i<=64;i++){
    const p=curve.getPointAt(i/64),normal=new Vector3().crossVectors(curve.getTangentAt(i/64),across).normalize();
    for(const [a,b] of [[-1,-1],[1,-1],[1,1],[-1,1]]){const v=p.clone().addScaledVector(across,a*width/2).addScaledVector(normal,b*.018);positions.push(v.x,v.y,v.z);}
    if(i<64)for(let j=0;j<4;j++){const a=i*4+j,b=i*4+(j+1)%4;indices.push(a,b,a+4,b,b+4,a+4);}
  }
  const geometry=new BufferGeometry().setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}

export default function MixedRealityHeadset(){
  const parts=useMemo(()=>{
    const cushionShape=outline(1.03),hole=new Path();
    outline(.82).getPoints(80).reverse().forEach((p,i)=>{if(i===0)hole.moveTo(p.x,p.y*.85);else hole.lineTo(p.x,p.y*.85);});cushionShape.holes.push(hole);
    const grain=new Uint8Array(64*64*4);for(let i=0;i<64*64;i++){const x=i%64,y=Math.floor(i/64),v=90+((x+y)%2)*45+((i*17)%19);grain.set([v,v,v,255],i*4);}
    const fabric=new DataTexture(grain,64,64,RGBAFormat);fabric.wrapS=fabric.wrapT=RepeatWrapping;fabric.repeat.set(8,8);fabric.needsUpdate=true;
    return {housing:shellGeometry(.28,.06),trim:shellGeometry(.035,.035),visor:shellGeometry(.045,.035),cushion:new ExtrudeGeometry(cushionShape,{depth:.16,bevelEnabled:true,bevelThickness:.055,bevelSize:.045,bevelSegments:5,curveSegments:24}),topStrap:ribbon([[0,.48,-.25],[0,1.1,-.62],[0,1.2,-1.15],[0,.76,-1.65],[0,.17,-1.68]],.28,[1,0,0]),headStrap:ribbon([[-1.08,.1,-.1],[-1.22,.17,-.85],[-.88,.19,-1.5],[0,.19,-1.74],[.88,.19,-1.5],[1.22,.17,-.85],[1.08,.1,-.1]],.24,[0,1,0]),fabric};
  },[]);
  return <group position={[0,-.1,.43]}>
    <mesh geometry={parts.housing} position={[0,0,-.27]}><meshStandardMaterial color="#283039" metalness={.65} roughness={.35}/></mesh>
    <mesh geometry={parts.trim} scale={[1.024,1.024,1]} position={[0,0,.015]}><meshStandardMaterial color="#59616b" metalness={.9} roughness={.24}/></mesh>
    <mesh geometry={parts.visor} position={[0,0,.063]}><meshPhysicalMaterial color="#081322" metalness={.18} roughness={.12} clearcoat={.9} clearcoatRoughness={.1} ior={1.52} reflectivity={1} envMapIntensity={.65}/></mesh>
    <mesh geometry={parts.cushion} position={[0,0,-.43]}><meshStandardMaterial color="#171b20" roughness={.98} bumpMap={parts.fabric} bumpScale={.009}/></mesh>
    {[parts.topStrap,parts.headStrap].map((geometry,i)=><mesh geometry={geometry} key={i}><meshStandardMaterial color="#25262e" roughness={.95} bumpMap={parts.fabric} bumpScale={.012} side={2}/></mesh>)}
    {[-1,1].map(side=><group key={side}>
      <RoundedBox position={[side*1.12,.03,-.22]} args={[.16,.34,.46]} radius={.045} smoothness={4}><meshStandardMaterial color="#3a4651" metalness={.65} roughness={.3}/></RoundedBox>
      <RoundedBox position={[side*1.22,-.05,-.57]} args={[.09,.19,.62]} radius={.035} smoothness={3}><meshStandardMaterial color="#27323c" metalness={.5} roughness={.4}/></RoundedBox>
      <group position={[side*1.25,-.25,-.93]} rotation={[0,0,Math.PI/2]}>
        <mesh><cylinderGeometry args={[.29,.27,.13,40]}/><meshStandardMaterial color="#222c35" metalness={.5} roughness={.35}/></mesh>
        <mesh position={[0,-side*.1,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.22,.073,16,48]}/><meshStandardMaterial color="#12171c" roughness={1} bumpMap={parts.fabric} bumpScale={.008}/></mesh>
      </group>
      <group position={[side*.52,.025,-.45]} rotation={[0,Math.PI,0]}>
        <mesh><torusGeometry args={[.255,.037,12,48]}/><meshStandardMaterial color="#292f35" metalness={.3} roughness={.5}/></mesh>
        <mesh scale={[1,1,.12]}><sphereGeometry args={[.24,32,24]}/><meshPhysicalMaterial color="#081825" metalness={.55} roughness={.06} clearcoat={1} envMapIntensity={1.4}/></mesh>
        {[.12,.17,.21].map(radius=><mesh key={radius} position={[0,0,.027]}><torusGeometry args={[radius,.0015,4,48]}/><meshBasicMaterial color="#43839b" transparent opacity={.15}/></mesh>)}
      </group>
      {[-.12,.12].map(y=><mesh position={[side*1.18,y,-.08]} rotation={[0,Math.PI/2,0]} key={y}><cylinderGeometry args={[.019,.019,.014,12]}/><meshStandardMaterial color="#79838d" metalness={.9} roughness={.25}/></mesh>)}
      <mesh position={[side*.82,-.14,.2]}><sphereGeometry args={[.035,20,12]}/><meshPhysicalMaterial color="#07101a" metalness={.5} roughness={.08} clearcoat={1}/></mesh>
    </group>)}
    <RoundedBox position={[0,.23,-1.77]} args={[.5,.31,.16]} radius={.075} smoothness={4}><meshStandardMaterial color="#28313b" metalness={.4} roughness={.45}/></RoundedBox>
    <mesh position={[0,.23,-1.87]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.1,.1,.055,32]}/><meshStandardMaterial color="#323c46" metalness={.6} roughness={.4}/></mesh>
    {Array.from({length:14},(_,i)=><mesh key={i} position={[(i-6.5)*.08,.49,-.05]} rotation={[0,0,-.08]}><boxGeometry args={[.035,.008,.03]}/><meshStandardMaterial color="#0a0d11" roughness={.9}/></mesh>)}
  </group>;
}

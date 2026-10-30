import * as THREE from 'three';

const vertexShader=`
  varying vec3 surfaceNormal;
  varying vec3 viewDirection;
  void main(){
    surfaceNormal=normalize(normalMatrix*normal);
    vec4 p=modelViewMatrix*vec4(position,1.0);
    viewDirection=-p.xyz;
    gl_Position=projectionMatrix*p;
  }
`;
const palette=`vec3 color=mix(vec3(0.52,0.035,0.92),vec3(0.22,0.95,1.0),smoothstep(-0.5,0.45,normalize(surfaceNormal).y));`;

export default function Atmosphere({radius}){
  return <group>
    <mesh scale={1.012}><sphereGeometry args={[radius,64,48]}/><shaderMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} vertexShader={vertexShader} fragmentShader={`
      varying vec3 surfaceNormal; varying vec3 viewDirection;
      void main(){
        float facing=max(dot(normalize(surfaceNormal),normalize(viewDirection)),0.0);
        float rim=pow(1.0-facing,3.8);
        ${palette}
        gl_FragColor=vec4(color,rim*0.95);
      }
    `}/></mesh>
    <mesh scale={1.055}><sphereGeometry args={[radius,64,48]}/><shaderMaterial transparent depthWrite={false} side={THREE.BackSide} blending={THREE.AdditiveBlending} vertexShader={vertexShader} fragmentShader={`
      varying vec3 surfaceNormal; varying vec3 viewDirection;
      void main(){
        float facing=abs(dot(normalize(surfaceNormal),normalize(viewDirection)));
        float halo=pow(1.0-facing,3.0);
        ${palette}
        gl_FragColor=vec4(color,halo*0.25);
      }
    `}/></mesh>
  </group>;
}

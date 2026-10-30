import photo from '../../assets/vr.png';
import data from '../../data/departments.json';

export default function ARVRFallback(){
  return <img src={photo} alt={data.departments.find(d=>d.id==='arvr').sceneSettings.fallbackAlt} loading="lazy" style={{display:'block',width:'100%',height:'100%',objectFit:'contain'}}/>;
}

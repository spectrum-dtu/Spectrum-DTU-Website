import config from '../../data/scene.json';
import './SpaceBackdrop.css';

function createStars(){
  let seed=config.background.seed;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  return Array.from({length:config.background.starCount},(_,i)=>({
    left:random()*100,top:random()*100,size:i%13===0?4:random()*1.8+1,
    opacity:random()*.5+.15,duration:config.background.twinkle.minDuration+random()*config.background.twinkle.durationRange,delay:-random()*12
  }));
 }
const stars=createStars();

export default function SpaceBackdrop({fixed=false}){
  return <div className={`space-backdrop${fixed?' space-backdrop-fixed':''}`} aria-hidden="true"><div className="nebula"/>{stars.map((star,i)=><i key={i} className={i%13===0?'space-star is-beacon':'space-star'} style={{left:`${star.left}%`,top:`${star.top}%`,width:star.size,height:star.size,'--star-opacity':star.opacity,animationDuration:`${star.duration}s`,animationDelay:`${star.delay}s`}}/>)}</div>;
}

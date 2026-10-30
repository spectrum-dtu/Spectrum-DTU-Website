import {useEffect,useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import DepartmentSection from './DepartmentSection.jsx';
import data from '../../data/departments.json';
import './TechnicalDomains.css';

gsap.registerPlugin(ScrollTrigger);

export default function TechnicalDomains({reducedMotion}){
  const section=useRef();
  useEffect(()=>{
    if(reducedMotion)return;
    const context=gsap.context(()=>{
      gsap.fromTo('.domains-intro > *',{opacity:0,y:24},{opacity:1,y:0,duration:.8,stagger:.12,scrollTrigger:{trigger:'.domains-intro',start:'top 90%',once:true}});
      section.current.querySelectorAll('.department').forEach(department=>{
        gsap.fromTo(department.querySelector('.department-copy'),{opacity:0,y:36},{opacity:1,y:0,duration:.9,ease:'power2.out',scrollTrigger:{trigger:department,start:'top 80%',once:true}});
        gsap.fromTo(department.querySelector('.department-visual'),{opacity:0,y:32,scale:.94},{opacity:1,y:0,scale:1,duration:1.2,ease:'power2.out',scrollTrigger:{trigger:department,start:'top 80%',once:true}});
      });
    },section);
    return()=>context.revert();
  },[reducedMotion]);
  return <section id="technical-domains" className="technical-domains" ref={section} aria-labelledby="domains-heading">
    <header className="domains-intro"><p className="domains-eyebrow">{data.eyebrow}</p><h2 id="domains-heading">{data.heading}</h2><p className="domains-description">{data.description}</p></header>
    <div className="departments-grid">{data.departments.map(department=><DepartmentSection key={department.id} department={department} reducedMotion={reducedMotion}/>)}</div>
  </section>;
}

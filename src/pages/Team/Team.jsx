import {useEffect,useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Navbar from '../../components/layout/Navbar.jsx';
import TeamHero from '../../components/team/TeamHero.jsx';
import TeamSection from '../../components/team/TeamSection.jsx';
import facultyAdvisors from '../../data/team/facultyAdvisors.json';
import coreCouncil from '../../data/team/coreCouncil.json';
import seniorCouncil from '../../data/team/seniorCouncil.json';
import members from '../../data/team/members.json';
import copy from '../../data/team/page.json';
import './Team.css';

gsap.registerPlugin(ScrollTrigger);
const profiles={facultyAdvisors,coreCouncil,seniorCouncil,members};

export default function Team(){
  const page=useRef();
  useEffect(()=>{
    const previousTitle=document.title;document.title=copy.pageTitle;
    const motion=gsap.matchMedia();
    motion.add('(prefers-reduced-motion: no-preference)',()=>{
      const context=gsap.context(()=>{
        gsap.from('.team-hero > *',{opacity:0,y:20,duration:.75,stagger:.1,ease:'power2.out'});
        page.current.querySelectorAll('.team-section').forEach(section=>gsap.fromTo(section,{opacity:0,y:28},{opacity:1,y:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:section,start:'top 93%',once:true}}));
      },page);
      return()=>context.revert();
    });
    return()=>{motion.revert();document.title=previousTitle;};
  },[]);
  return <><a className="team-skip" href="#faculty-advisors">{copy.skipLabel}</a><Navbar/><main className="team-page" ref={page}><TeamHero/>{copy.sections.map(section=><TeamSection key={section.id} section={section} members={profiles[section.dataKey]} initialVisibleCount={section.variant==='members'?copy.membersInitialVisibleCount:undefined}/>)}</main></>;
}

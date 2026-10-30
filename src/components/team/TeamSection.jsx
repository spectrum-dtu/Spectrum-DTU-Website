import {useMemo,useRef,useState} from 'react';
import TeamMemberCard from './TeamMemberCard.jsx';
import copy from '../../data/team/page.json';

export default function TeamSection({section,members,initialVisibleCount}){
  const root=useRef();
  const [expanded,setExpanded]=useState(false);
  const sorted=useMemo(()=>[...members].sort((a,b)=>(Number.isFinite(a.order)?a.order:Number.MAX_SAFE_INTEGER)-(Number.isFinite(b.order)?b.order:Number.MAX_SAFE_INTEGER)),[members]);
  const limit=Math.max(1,Math.floor(initialVisibleCount??sorted.length)||1);
  const visible=expanded?sorted:sorted.slice(0,limit);
  const canExpand=sorted.length>limit;
  const gridId=`${section.id}-profiles`;
  const toggle=()=>{
    if(expanded&&root.current.getBoundingClientRect().top<90)root.current.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    setExpanded(value=>!value);
  };
  return <section className={`team-section team-section-${section.variant}`} id={section.id} ref={root} aria-labelledby={`${section.id}-heading`}>
    <header className="team-section-heading"><div><h2 id={`${section.id}-heading`}>{section.title}</h2></div><p>{section.description}</p></header>
    {sorted.length?<div className={`team-grid team-grid-${section.variant}`} id={gridId}>{visible.map(member=><TeamMemberCard key={member.id} member={member} variant={section.variant}/>)}</div>:<div className="team-empty" id={gridId}><span className="team-empty-orbit" aria-hidden="true"/><div><h3>{copy.emptyTitle}</h3><p>{copy.emptyDescription}</p></div></div>}
    {canExpand&&<div className="team-expand"><button type="button" aria-expanded={expanded} aria-controls={gridId} onClick={toggle}>{expanded?copy.showLess:copy.viewMore}<span aria-hidden="true">{expanded?'−':'+'}</span></button><p role="status">{visible.length} / {sorted.length} {copy.visibleLabel}</p></div>}
  </section>;
}

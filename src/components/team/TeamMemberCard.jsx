import {useState} from 'react';
import copy from '../../data/team/page.json';

function localImage(path){
  if(typeof path!=='string'||!path.trim())return null;
  return `${import.meta.env.BASE_URL}${path.trim().replace(/^\/+/, '')}`;
}
function linkedinUrl(value){
  try{const url=new URL(value);return url.protocol==='https:'&&(url.hostname==='linkedin.com'||url.hostname.endsWith('.linkedin.com'))?url.href:null;}catch{return null;}
}

export default function TeamMemberCard({member,variant}){
  const name=member.name?.trim()||copy.defaultName;
  const source=localImage(member.image);
  const [failedSource,setFailedSource]=useState(null);
  const words=name.split(/\s+/).filter(Boolean);
  const initials=member.name?`${words[0]?.[0]??''}${words.length>1?words.at(-1)[0]:''}`.toUpperCase():copy.fallbackInitials;
  const linkedin=linkedinUrl(member.linkedin);
  const leadership=variant==='core'&&/president|chair|captain|secretary|treasurer/i.test(member.position??'');
  return <article className={`team-card team-card-${variant}${leadership?' team-card-leadership':''}`} data-member-id={member.id}>
    <div className="team-card-portrait">
      {source&&failedSource!==source?<img src={source} alt={name} loading="lazy" decoding="async" width="480" height="600" onError={()=>setFailedSource(source)}/>:<div className="team-card-initials" role="img" aria-label={`${copy.imageFallbackLabel} ${name}`}><span aria-hidden="true">{initials}</span></div>}
    </div>
    <div className="team-card-information">
      <div className="team-card-heading"><h3>{name}</h3>{linkedin&&<a className="team-linkedin" href={linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${copy.linkedinLabel} ${name}`}><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3.4 9H6.6V21H3.4ZM9 9H12.1V10.6C12.6 9.6 13.7 8.7 15.6 8.7 19.1 8.7 20.6 10.8 20.6 14.3V21H17.4V14.8C17.4 12.8 16.8 11.8 15.2 11.8 13.3 11.8 12.2 13 12.2 15V21H9Z"/></svg></a>}</div>
      {member.position&&<p className="team-card-position">{member.position}</p>}
      {member.department&&<p className="team-card-department">{member.department}</p>}
    </div>
  </article>;
}

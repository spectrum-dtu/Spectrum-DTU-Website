import {useEffect,useRef,useState} from 'react';
import {Link,useLocation} from 'react-router-dom';
import copy from '../../data/hero.json';
import navigation from '../../data/navigation.json';
import logo from '../../assets/logo-symbol.png';
import './Navbar.css';

export default function Navbar(){
  const location=useLocation();
  const [openFor,setOpenFor]=useState(null);
  const toggle=useRef(null);
  const ribbon=useRef(null);
  const [compact,setCompact]=useState(()=>window.matchMedia('(max-width: 1200px)').matches);
  const open=compact && openFor===location.key;

  useEffect(()=>{
    const query=window.matchMedia('(max-width: 1200px)');
    const change=()=>{setCompact(query.matches);setOpenFor(null);};
    query.addEventListener('change',change);
    return()=>query.removeEventListener('change',change);
  },[]);

  useEffect(()=>{
    if(!open)return;
    const keydown=event=>{
      if(event.key==='Escape'){setOpenFor(null);toggle.current?.focus();}
    };
    const outside=event=>{
      if(!ribbon.current?.contains(event.target) && !toggle.current?.contains(event.target))setOpenFor(null);
    };
    document.addEventListener('keydown',keydown);
    document.addEventListener('pointerdown',outside);
    return()=>{document.removeEventListener('keydown',keydown);document.removeEventListener('pointerdown',outside);};
  },[open]);

  return <header className="navbar ribbon-header">
    <Link className="brand" to="/" aria-label="Spectrum DTU home" onClick={()=>setOpenFor(null)}>
      <span className="brand-logo"><img src={logo} alt={`${copy.brand} DTU`} width="1735" height="906"/></span>
    </Link>
    <button ref={toggle} className={`ribbon-toggle${open?' is-open':''}`} type="button"
      aria-label={open?navigation.closeLabel:navigation.openLabel} aria-expanded={open}
      aria-controls="spectrum-navigation" onClick={()=>setOpenFor(open?null:location.key)}>
      <span/><span/><span/>
    </button>
    <nav ref={ribbon} id="spectrum-navigation" aria-label={navigation.label}
      className={`navigation-ribbon${open?' is-open':''}`} inert={compact&&!open}
      onBlur={event=>{if(open && !event.currentTarget.contains(event.relatedTarget) && event.relatedTarget!==toggle.current)setOpenFor(null);}}>
      <ul>{navigation.items.map(item=><li key={item.path+(item.hash??'')}>
        <Link to={item.path+(item.hash??'')} aria-current={location.pathname===item.path && location.hash===(item.hash??'')?'page':undefined} className={`ribbon-link${location.pathname===item.path && location.hash===(item.hash??'')?' is-active':''}`}
          onClick={()=>setOpenFor(null)}>{item.label}</Link>
      </li>)}</ul>
    </nav>
  </header>;
}

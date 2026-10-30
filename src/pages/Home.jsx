import {useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Navbar from '../components/layout/Navbar.jsx';
import GlobeViewport from '../components/hero/GlobeViewport.jsx';
import copy from '../data/hero.json';
import AboutSection from '../components/home/AboutSection.jsx';
import TechnicalDomains from '../components/domains/TechnicalDomains.jsx';
import '../components/hero/hero.css';
gsap.registerPlugin(ScrollTrigger);
function useReducedMotion(){const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);useEffect(()=>{const q=window.matchMedia('(prefers-reduced-motion: reduce)'),change=()=>setReduced(q.matches);q.addEventListener('change',change);return()=>q.removeEventListener('change',change);},[]);return reduced;}
export default function Home(){const page=useRef(),reduced=useReducedMotion();useEffect(()=>{const context=gsap.context(()=>{if(reduced)return;gsap.from('.hero-copy > *',{opacity:0,y:22,duration:1.1,stagger:.14,delay:1.1,ease:'power2.out'});gsap.fromTo('.connection-inner',{opacity:0,y:75,scale:.97},{opacity:1,y:0,scale:1,ease:'none',scrollTrigger:{trigger:'.connection-section',start:'top 92%',end:'top 45%',scrub:.6}});},page);return()=>context.revert();},[reduced]);return <div ref={page}><a className="skip-link" href="#connection">{copy.skipLabel}</a><Navbar/><main><section id="home" className="hero"><GlobeViewport reducedMotion={reduced}/><div className="hero-copy"><p className="hero-eyebrow">{copy.eyebrow}</p><h1>{copy.title.split(' ')[0]}<span>{copy.title.split(' ')[1]}<b className="title-period">.</b></span></h1><p className="tagline">{copy.tagline}</p><p className="hero-description">{copy.description}</p><a className="hero-action" href="#connection">{copy.action}<span aria-hidden="true">↗</span></a></div><div className="globe-coordinate" aria-hidden="true"><span className="coordinate-cross">+</span>{copy.coordinates}<br/><span>{copy.location}</span></div><div className="hero-bottom"><a href="#connection" className="scroll-cue"><span aria-hidden="true">↓</span>{copy.scrollLabel}</a><span className="transmission"><i/> {copy.transmission}</span></div></section><AboutSection/><TechnicalDomains reducedMotion={reduced}/></main></div>;}

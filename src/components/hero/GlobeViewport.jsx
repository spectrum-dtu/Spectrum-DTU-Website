import { Component, lazy, Suspense, useState } from 'react';
import './scene.css';
import copy from '../../data/hero.json';
const Globe=lazy(()=>import('../3d/Globe.jsx'));
function canRender(){try{const c=document.createElement('canvas');return !!(c.getContext('webgl2')||c.getContext('webgl'));}catch{return false;}}
function Fallback(){return <div className="scene-fallback"><div className="fallback-orbit"/><span>{copy.fallback}</span></div>;}
class SceneBoundary extends Component{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<Fallback/>:this.props.children;}}
export default function GlobeViewport({reducedMotion}){const [supported]=useState(canRender);return <div className="globe-viewport" role="img" aria-label={copy.sceneLabel}><SceneBoundary>{supported?<Suspense fallback={<div className="scene-loading">{copy.loading}</div>}><Globe reducedMotion={reducedMotion}/></Suspense>:<Fallback/>}</SceneBoundary></div>;}

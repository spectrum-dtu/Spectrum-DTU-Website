import {useEffect} from 'react';
import {BrowserRouter,Route,Routes,useLocation} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Team from './pages/Team/Team.jsx';
import RoutePlaceholder from './pages/RoutePlaceholder.jsx';
import navigation from './data/navigation.json';
import SpaceBackdrop from './components/hero/SpaceBackdrop.jsx';
import Footer from './components/layout/Footer.jsx';
import './App.css';

function RouteScroll(){
  const {pathname,hash,key}=useLocation();
  useEffect(()=>{
    const frame=requestAnimationFrame(()=>{
      if(hash){document.getElementById(hash.slice(1))?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
      else window.scrollTo({top:0,left:0,behavior:'instant'});
    });
    return()=>cancelAnimationFrame(frame);
  },[pathname,hash,key]);
  return null;
}

export default function App(){
  return <BrowserRouter><div className="site-shell"><SpaceBackdrop fixed/><RouteScroll/><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/team" element={<Team/>}/>
    {navigation.items.filter(item=>item.path!=='/'&&item.path!=='/team').map(item=><Route key={item.path} path={item.path} element={<RoutePlaceholder item={item}/>}/>)}
    <Route path="*" element={<RoutePlaceholder/>}/>
  </Routes><Footer/></div></BrowserRouter>;
}

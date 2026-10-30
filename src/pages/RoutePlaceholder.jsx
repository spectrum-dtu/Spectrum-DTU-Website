import {Link} from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import navigation from '../data/navigation.json';
import './RoutePlaceholder.css';

export default function RoutePlaceholder({item}){
  return <><Navbar/><main className="route-placeholder">
    <h1>{item?.label??navigation.notFoundTitle}</h1>
    {item&&<p>{navigation.placeholder}</p>}
    <Link to="/">{navigation.returnLabel} <span aria-hidden="true">↗</span></Link>
  </main></>;
}

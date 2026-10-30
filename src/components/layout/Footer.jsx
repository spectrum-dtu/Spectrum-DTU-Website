import {Link} from 'react-router-dom';
import copy from '../../data/footer.json';
import logo from '../../assets/logo-symbol.png';
import './Footer.css';

export default function Footer(){
  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-identity">
        <Link className="footer-brand" to="/" aria-label={`${copy.brand} home`}>
          <span className="footer-logo"><img src={logo} alt="" width="1735" height="906" loading="lazy"/></span>
          <span>{copy.brand}</span>
        </Link>
        <p>{copy.description}</p>
      </div>
      {copy.columns.map(column=><nav className="footer-column" aria-label={column.heading} key={column.heading}>
        <h3>{column.heading}</h3>
        <ul>{column.links.map(link=><li key={link.label}><Link to={link.path}>{link.label}</Link></li>)}</ul>
      </nav>)}
    </div>
    <div className="footer-bottom">
      <p className="footer-tagline">{copy.tagline}</p>
      <div className="footer-meta">
        <p>© {new Date().getFullYear()} {copy.copyright}</p>
      </div>
    </div>
    <p className="footer-credit">{copy.creditPrefix} <a href={copy.creator.url} target="_blank" rel="noopener noreferrer">{copy.creator.name}</a></p>
  </footer>;
}

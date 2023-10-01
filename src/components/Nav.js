import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Nav.css';

import { fetchData } from '../utils/apiServices';
import { getHomePageUrl } from './Common';

const toHtmlElement = (itemIcon, url) => {
  if (itemIcon.type == "fa") {
    if (itemIcon.style != "")
      return <FontAwesomeIcon icon={itemIcon.cssClass} style={itemIcon.style} />;
    else
      return <FontAwesomeIcon icon={itemIcon.cssClass} />;
  }
  else if (url && itemIcon.type == "img") {
    return <img src={`${url}/${itemIcon.src}`} />;
  }
  else {
    return <></>;
  }
}
export const NavItem = ({ navItem, url }) => (
  <Link
    className="px-md-3 px-2 text-dark text-decoration-none text-center"
    data-bs-toggle="tooltip"
    title={navItem.text}
    to={navItem.link.replace(".aspx", "")}//***temp*** remove .aspx
    target={navItem.isLinkNewTab ? '_blank' : '_self'}
  >
    <h5 className="d-inline">
      {toHtmlElement(navItem.itemIcon, url)}
      {navItem.name && (<span className="mx-1 text-decoration-underline">{navItem.name}</span>)}
    </h5>
  </Link>
);
export default function Nav() {
  const [url, setUrl] = useState(null);
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    (async () => {
      const fetchedData = await fetchData('/api/NavItems');
      setNavItems(fetchedData);

      const fetchedUrl = await getHomePageUrl();
      setUrl(fetchedUrl);
    })();
  }, []);

  return (
    <div className="d-flex flex-wrap btn-group justify-content-center">
      {navItems.map((navItem, index) => (
        <NavItem navItem={navItem} url={url} key={index} />
      ))}
    </div>
  );
}
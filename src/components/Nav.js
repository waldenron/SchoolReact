import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Nav.css';

import { fetchData } from '../utils/apiServices';

const toHtmlElement = (itemIcon) => {
  if (itemIcon.type == "fa") {
    if (itemIcon.style != "")
      return <FontAwesomeIcon icon={itemIcon.cssClass} style={itemIcon.style} />;
    else
      return <FontAwesomeIcon icon={itemIcon.cssClass} />;
  }
  else if (itemIcon.type == "img") {
    //**** temp - the images are on the server */
    const url = "https://art-yeshiva.org.il/";
    return <img src={`${url}/${itemIcon.src}`} />;
  }
  else {
    return <></>;
  }
}
export const NavItem = ({ navItem }) => (
  <Link
    className="px-md-3 px-2 text-dark text-decoration-none text-center"
    data-bs-toggle="tooltip"
    title={navItem.text}
    to={navItem.link.replace(".aspx", "")}//***temp*** remove .aspx
    target={navItem.isLinkNewTab ? '_blank' : '_self'}
  >
    <h5 className="d-inline">
      {toHtmlElement(navItem.itemIcon)}
      {navItem.name && (<span className="mx-1 text-decoration-underline">{navItem.name}</span>)}
    </h5>
  </Link>
);
export default function Nav() {
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    (async () => {
      const fetchedData = await fetchData('/api/NavItems');
      setNavItems(fetchedData);
    })();
  }, []);

  return (
    <div className="d-flex flex-wrap btn-group justify-content-center">
      {navItems.map((navItem, index) => (
        <NavItem navItem={navItem} key={index} />
      ))}
    </div>
  );
}



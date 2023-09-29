import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Nav.css';

const instCode = "1";

const fetchNavItems = async () => {
  const API_URL = '/api/NavItems';
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'InstCode': instCode
    }
  });

  const data = await response.json();
  return data.sort((a, b) => a.priority - b.priority);
}

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
export const NavItem = ({ navItem, index }) => (
  <Link
    key={index}
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
      const fetchedData = await fetchNavItems();
      setNavItems(fetchedData);
    })();
  }, []);

  return (
    <div className="d-flex flex-wrap btn-group justify-content-center">
      {navItems.map((navItem, index) => (
        <NavItem navItem={navItem} index={index} />
      ))}
    </div>
  );
}



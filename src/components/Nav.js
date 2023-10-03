import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Nav.css';

import { fetchData } from '../utils/apiServices';
import { ItemIcon, getHomePageUrl } from './Common';

export const NavItem = ({ navItem, homePageUrl }) => {
  let link = navItem.link;
  if (link.includes(".aspx")) link = link.replace(".aspx", "");//***temp*** remove .aspx
  if (link.includes("?iic=")) link = link.replace("?iic=", "/");//***temp*** 
  if (link.includes(".htm")) link = `${homePageUrl}/${link}`;//***temp*** 
  return (<Link
    className="px-md-3 px-2 text-dark text-decoration-none text-center"
    data-bs-toggle="tooltip"
    title={navItem.text}
    to={link}
    target={navItem.isLinkNewTab ? '_blank' : '_self'}
  >
    <h5 className="d-inline">
    {<ItemIcon itemIcon={navItem.itemIcon} homePageUrl={homePageUrl} />}
      {navItem.name && (<span className="mx-1 text-decoration-underline">{navItem.name}</span>)}
    </h5>
  </Link>)
};
export default function Nav() {
  const [homePageUrl, setHomePageUrl] = useState(null);
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    (async () => {
      const fetchedData = await fetchData('/api/NavItems');
      setNavItems(fetchedData);

      const fetchedUrl = await getHomePageUrl();
      setHomePageUrl(fetchedUrl);
    })();
  }, []);

  return (
    <div className="d-flex flex-wrap btn-group justify-content-center">
      {navItems.map((navItem, index) => (
        <NavItem navItem={navItem} homePageUrl={homePageUrl} key={index} />
      ))}
    </div>
  );
}
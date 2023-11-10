import React, { useState, useEffect } from 'react';

import { fetchData, getHomePageUrl, getInstUtils } from '../utils/apiServices';
import { ItemIcon, LoadingSpinner, ToLink } from './Common';

import './Nav.module.css';

export const NavItem = ({ navType, navItem, homePageUrl }) => {
  const link = navItem.link;
  if (navType === "Line")
    return (
      <ToLink to={link} className="nav-link" data-bs-toggle="tooltip" title={navItem.text} target={navItem.isLinkNewTab ? '_blank' : '_self'}      >
        <ItemIcon itemIcon={navItem.itemIcon} homePageUrl={homePageUrl} />
        {navItem.name && <span className="mx-1">{navItem.name}</span>}
      </ToLink>
    )
  else //if (navType === "Buttons")
    return (
      <ToLink to={link} className="px-md-3 px-2 text-dark text-decoration-none text-center text-responsive" data-bs-toggle="tooltip" title={navItem.text} target={navItem.isLinkNewTab ? '_blank' : '_self'}>
          {<ItemIcon itemIcon={navItem.itemIcon} homePageUrl={homePageUrl} />}
          {navItem.name && (<span className="mx-1 text-decoration-underline">{navItem.name}</span>)}
      </ToLink>
    )
};

export default function Nav() {
  const [loading, setLoading] = useState(true);

  const [homePageUrl, setHomePageUrl] = useState(null);
  const [navType, setNavType] = useState(null);
  const [navItems, setNavItems] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => { setIsOpen(!isOpen); };

  useEffect(() => {
    (async () => {
      const { data: fetchedData, error } = await fetchData('/api/NavItems');
      setNavItems(fetchedData);

      const fetchedUrl = await getHomePageUrl();
      setHomePageUrl(fetchedUrl);

      const fetchedNavType = await getInstUtils();
      setNavType(fetchedNavType.navType);
    })();

    setLoading(false);
  }, []);

  //if (loading) { return <LoadingSpinner />; }
  return (
    <>
      {navType === "Buttons" &&
        <div className="d-flex flex-wrap justify-content-center">
          {navItems.map((navItem, index) => (
            <NavItem navType={navType} navItem={navItem} homePageUrl={homePageUrl} key={index} />
          ))}
        </div>}
      {navType === "Line" &&
        <nav className="navbar navbar-expand-lg navbar-dark py-1 mb-2">
          <button className="navbar-toggler" type="button" onClick={toggle}
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} onClick={toggle}>
            <ul className="list-group rounded-0 border-secondary navbar-nav">
              {navItems.map((navItem, index) => (
                <NavItem navType={navType} navItem={navItem} homePageUrl={homePageUrl} key={index} />
              ))}
            </ul>
          </div>
        </nav>}
    </>
  );
}
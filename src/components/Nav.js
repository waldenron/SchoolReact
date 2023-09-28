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

const parseStyle = (styleString) => {
  const styleObj = {};
  styleString.split(';').forEach(part => {
    const [key, value] = part.split(':').map(str => str.trim());
    if (key && value) {
      styleObj[key] = value;
    }
  });
  return styleObj;
};

const getDisplayElement = (pic) => {
  if (pic.includes('<i ')) {
    const classMatch = pic.match(/class="([^"]+)"/);
    const classes = classMatch[1].split(' ');
    const iconClass = classes.find(c => c.startsWith('fa-'));
    const style = pic.match(/style="([^"]+)"/) ? parseStyle(pic.match(/style="([^"]+)"/)[1]) : {};

    return <FontAwesomeIcon icon={iconClass} style={style} />;
  } else {
    //**** temp - the inages are on the server */
    const url = "https://art-yeshiva.org.il/";

    const srcMatch = pic.match(/src="([^"]+)"/);
    return <img src={`${url}/${srcMatch[1]}`} />;
  }
};

export default function Nav() {
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    (async () => {
      const fetchedData = await fetchNavItems();
      setNavItems(fetchedData);
    })();
  }, []);

  return (
    <div className="navMenu">
      {navItems.map((navItem, index) => (
        <Link
          key={index}
          className="px-md-3 px-2 text-dark text-decoration-none text-center"
          data-bs-toggle="tooltip"
          title={navItem.text}
          to={navItem.link.replace(".aspx", "")}//***temp*** remove .aspx
          target={navItem.isLinkNewTab ? '_blank' : '_self'}
        >
          <h5 className="d-inline">
            {getDisplayElement(navItem.pic)}
            {navItem.name && (<span className="ms-1 me-0text-decoration-underline">{navItem.name}</span>)}
          </h5>
        </Link>
      ))}
    </div>
  );
}



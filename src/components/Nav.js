import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Nav.css';


export default function Nav() {
  const url = "https://art-yeshiva.org.il/";

  const links = [
    {
      title: "מידע שוטף לתלמידי בית הספר",
      href: "/InfoItems",
      icon: { class: "fas fa-user-graduate" },
      text: "מידע לתלמידים"
    },
    {
      title: "מידע ורישום למועמדים",
      href: "RegAY.html",
      icon: { class: "fas fa-user-edit" },
      text: "מידע למועמדים"
    },
    {
      title: "יצירת קשר עם בית הספר והצוות",
      href: "/Contacts",
      icon: { class: "fas fa-at" },
      text: "צור קשר"
    },
    {
      title: "מידע לבוגרים",
      href: "/InfoItems.aspx?iic=11",
      icon: { class: "fas fa-male" },
      text: "מידע לבוגרים"
    },
    {
      title: "מידע המיועד רק למורים (דרושה סיסמה)",
      href: "/Login.aspx",
      icon: { class: "fas fa-chalkboard-teacher" },
      text: "אזור מורים"
    },
    {
      title: "גלריית תמונות",
      href: "/PicGallery.aspx",
      icon: { class: "fas fa-solid fa-images", style: { color: "#e47792" } },
      text: "גלרייה"
    },
    {
      title: "עמוד הפייסבוק של הישיבה",
      href: "https://facebook.com/artyeshiva/",
      icon: { src: `${url}/Images/facebook.png` },
      text: ""
    },
    {
      title: "ערוץ היוטיוב של הישיבה",
      href: "https://www.youtube.com/channel/UChR-RJQKzEVuzJ2ApEKhGEA/videos/",
      icon: { src: `${url}/Images/youtube.png` },
      text: ""
    }
  ];

  return (
    <div className="navMenu">
      {links.map((link, index) => (
        <Link
          key={index}
          className="px-md-3 px-2 text-dark text-decoration-none text-center"
          data-bs-toggle="tooltip"
          title={link.title}
          to={link.href}
          target={link.href.startsWith('http') ? '_blank' : '_self'}
        >
          <h5 className="d-inline">
            {link.icon.class ?
              (<FontAwesomeIcon icon={link.icon.class} style={link.icon.style} />)
              : (<img src={link.icon.src} />)}
            &nbsp;
            <span className="text-decoration-underline">{link.text}</span>
          </h5>
        </Link>
      ))}
    </div>
  );
}



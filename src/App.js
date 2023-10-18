import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './css/StyleSheet.css';


import { fetchData } from './utils/apiServices';

import { LoadingSpinner, Logo, getHomePageUrl, getInstParams, getInstUtils } from './components/Common';
import Nav from "./components/Nav";
import IndexPageItems, { Row } from "./components/IndexPageItems";
import InfoItems from './components/InfoItems';
import ContactPage, { InstContactInfoFooter } from './components/Contacts';
import NotFound from "./components/NotFound";

import { fas } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { toPageTitle } from './utils/utilityFunctions';
import CoursePage from './components/Courses';
import Calendar from './components/Calendars';
import Schedule from './components/Schedule';
import PicGallery, { PicGalleryForDir } from './components/PicGallery';
import Login from './components/Login';
library.add(fas)


const InstFiles = ({ homePageUrl }) => {

  useEffect(() => {
    async function loadInstFiles() {
      const { data: fetchedData, error } = await fetchData('/api/InstUtils');

      // Update the favicon
      const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = `${homePageUrl}/${fetchedData.favicon}`;

      document.getElementsByTagName("head")[0].appendChild(link);

      // Dynamically load the CSS file
      const cssLink = document.createElement("link");
      cssLink.type = "text/css";
      cssLink.rel = "stylesheet";
      cssLink.href = `${homePageUrl}/${fetchedData.cssFile}`;
      document.getElementsByTagName("head")[0].appendChild(cssLink);
    }

    loadInstFiles();
  }, [homePageUrl]);

  return null; // this component doesn't render anything visually
};

function NonHomePageHeader() {
  const location = useLocation();
  const [isShowNav, setIsShowNav] = useState(null);
  const [navLocation, setNavLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const fetchedNavType = await getInstParams();
      setIsShowNav(fetchedNavType.isShowNavOtherPages);
      setNavLocation(fetchedNavType.navLocationOtherPages.toLowerCase());
    })();
  }, []);

  if (location.pathname !== "/") {
    return <>
      {isShowNav && navLocation === "top" && <div><Nav /></div>}
      <div><Logo /></div>
      {isShowNav && navLocation === "middle" && <div className="py-3 w-md-75 mx-auto"><Nav /></div>}
    </>;
  }

  return null;
}

function NonHomePageFooter() {
  const location = useLocation();

  if (location.pathname !== "/") {
    return <><InstContactInfoFooter /></>;
  }

  return null;
}
function Home({ instDescription }) {
  const [indexHeaderTextItems, setIndexHeaderTextItems] = useState([]);
  const [navLocation, setNavLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { data: fetchedData, error } = await fetchData('/api/IndexHeaderTextItems');
      setIndexHeaderTextItems(fetchedData);

      const fetchedNavType = await getInstParams();
      setNavLocation(fetchedNavType.navLocationIndex.toLowerCase());
    })();
  }, []);

  document.title = toPageTitle(instDescription);
  return (
    indexHeaderTextItems &&
    <>
      {navLocation === "top" && <div className=""><Nav /></div>}
      <div className="container">
        <div className="hideOnLargeScreen">
          <div className="d-flex justify-content-between pt-1">
            {indexHeaderTextItems.map((item, index) => (
              <span key={index}>{item.shortText}</span>
            ))}
          </div>
        </div>
        <Logo />
        <div className="hideOnSmallScreen">
          <div className="d-flex justify-content-between pt-1">
            {indexHeaderTextItems.map((item, index) => (
              <span key={index} className="fw-bolder h6">{item.text}</span>
            ))}
          </div>
        </div>
        {navLocation === "middle" && <div className="mt-3"><Nav /></div>}
      </div>
      <Routes>
        <Route path="/" element={<IndexPageItems />} />
      </Routes>
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  const [instDetails, setInstDetails] = useState(null);
  useEffect(() => {
    (async () => {
      const { data: fetchedData, error } = await fetchData('/api/InstDetails');
      setInstDetails(fetchedData);

      setLoading(false);
    })();
  }, []);

  if (loading) { return <LoadingSpinner />; }
  return (
    <div className="container-fluid rounded mx-auto">
      {instDetails && <InstFiles homePageUrl={instDetails.homePageUrl} />}
      {instDetails &&
        <>
          <NonHomePageHeader />

          <Routes>
            <Route path="/" element={<Home instDescription={instDetails.description} />} />

            <Route path="/Row/:id" element={<Row />} />

            <Route path="/Courses" element={<CoursePage />} />
            <Route path="/Courses/:id" element={<CoursePage />} />
            <Route path="/Calendars" element={<Calendar />} />
            <Route path="/Calendars/:id" element={<Calendar />} />
            <Route path="/InfoItems" element={<InfoItems />} />
            <Route path="/InfoItems/:id" element={<InfoItems />} />
            <Route path="/Contacts" element={<ContactPage />} />
            <Route path="/Schedule" element={<Schedule />} />
            <Route path="/PicGallery" element={<PicGallery />} />
            <Route path="/PicGallery/:name" element={<PicGalleryForDir />} />
            <Route path="/Login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <NonHomePageFooter />
        </>
      }
    </div>
  );
}
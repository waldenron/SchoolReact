import React, { useEffect, useState } from 'react';
import { Route, Routes, Outlet } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


import Nav from "./components/Nav";
import Row from "./components/Row";
import InfoItems from './components/InfoItems';
import ContactPage from './components/Contacts';
import NotFound from "./components/NotFound";
import { Logo, getHomePageUrl } from './components/Common';
import { fetchData } from './utils/apiServices';


import { fas } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { toPageTitle } from './utils/utilityFunctions';
import Course from './components/Courses';
import Calendar from './components/Calendars';
import Schedule from './components/Schedule';
library.add(fas)

export const RowContext = React.createContext([]);

const InstFiles = ({ homePageUrl }) => {

  useEffect(() => {
    async function loadInstFiles() {
      const instUtilFiles = await fetchData('/api/InstUtilFiles');

      // Update the favicon
      const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = `${homePageUrl}/${instUtilFiles.favicon}`;

      document.getElementsByTagName("head")[0].appendChild(link);

      // Dynamically load the CSS file
      const cssLink = document.createElement("link");
      cssLink.type = "text/css";
      cssLink.rel = "stylesheet";
      cssLink.href = `${homePageUrl}/${instUtilFiles.cssFile}`;
      document.getElementsByTagName("head")[0].appendChild(cssLink);
    }

    loadInstFiles();
  }, [homePageUrl]);

  return null; // this component doesn't render anything visually
};

function Home({ instDescription }) {
  const [indexHeaderTextItems, setIndexHeaderTextItems] = useState([]);
  useEffect(() => {
    (async () => {
      const fetchedData = await fetchData('/api/IndexHeaderTextItems');
      setIndexHeaderTextItems(fetchedData);
    })();
  }, []);
  //console.log(indexHeaderTextItems);
  document.title = toPageTitle(instDescription);
  return (
    indexHeaderTextItems && indexHeaderTextItems.length > 0 &&
    <>
      <div className="container">
        <div className="hideOnLargeScreen">
          <div className="d-flex justify-content-between pt-1">
            {indexHeaderTextItems.map((item, index) => (
              <span key={index}>{item.shortText}</span>
            ))}          </div>
        </div>
        <Logo />
        <div className="hideOnSmallScreen">
          <div className="d-flex justify-content-between pt-1">
            {indexHeaderTextItems.map((item, index) => (
              <span key={index} className="fw-bolder h6">{item.text}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3"><Nav /></div>
      <Routes>
        <Route path="/" element={<Row />} />
      </Routes>
    </>
  );
}
function App() {
  const [instDetails, setInstDetails] = useState(null);
  useEffect(() => {
    (async () => {
      const fetchedData = await fetchData('/api/InstDetails');
      setInstDetails(fetchedData);
    })();
  }, []);

  return (
    <div className="container-fluid rounded mt-3 mx-auto">
      {instDetails && <InstFiles homePageUrl={instDetails.homePageUrl} />}
      {instDetails &&
        <Routes>
          <Route path="/" element={<Home instDescription={instDetails.description} />} />

          <Route path="/Row/:id" element={<Row />} />

          <Route path="/Courses" element={<Course />} />
          <Route path="/Courses/:id" element={<Course />} />
          <Route path="/Calendars" element={<Calendar />} />
          <Route path="/Calendars/:id" element={<Calendar />} />
          <Route path="/InfoItems" element={<InfoItems />} />
          <Route path="/InfoItems/:id" element={<InfoItems />} />
          <Route path="/Contacts" element={<ContactPage />} />
          <Route path="/Schedule" element={<Schedule />} />
          <Route path="*" element={<NotFound />} />
        </Routes>}
    </div>
  );
}

export default App;
import React, { useEffect, useState } from 'react';
import { Route, Routes, Outlet } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Nav from "./components/Nav";
import Row, { RowDetails } from "./components/Row";
import InfoItems from './components/InfoItems';
import ContactPage from './components/Contact';
import NotFound from "./components/NotFound";
import { Logo, getHomePageUrl } from './components/Common';
import { fetchData } from './utils/apiServices';


import { fas } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { toPageTitle } from './utils/utilityFunctions';
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
  document.title = toPageTitle(instDescription);
  return (
    <>
      <div className="container"><Logo /></div>
      <div className="mt-3"><Nav /></div>
      <Outlet />
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
      {instDetails && <Routes>
        <Route path="/" element={<Home instDescription={instDetails.description} />}>
          <Route index element={<Row />} />
          <Route path="rowDetails/:id" element={<RowDetails />} />
        </Route>

        <Route path="/InfoItems" element={<InfoItems />} />
        <Route path="/Contacts" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>}
    </div>
  );
}

export default App;
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Route, Routes } from "react-router-dom";

import Nav from "./components/Nav";
import Row from "./components/Row";
import InfoItems from './components/InfoItems';
import ContactPage from './components/Contact';
import NotFound from "./components/NotFound";


import { fas } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { Logo, getHomePageUrl } from './components/Common';
import { useEffect, useState } from 'react';
import { fetchData } from './utils/apiServices';
library.add(fas)

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

function Home() {
  return (
    <>
      <div className="container"><Logo /></div>
      <div className="mt-3"><Nav /></div>
      <Row />
    </>
  );
}
function App() {
  const [homePageUrl, setHomePageUrl] = useState(null);
  useEffect(() => {
      (async () => {
          const fetchedUrl = await getHomePageUrl();
          setHomePageUrl(fetchedUrl);
      })();
  }, []);

  return (
    <div className="container-fluid rounded mt-3 mx-auto">
      {homePageUrl && <InstFiles homePageUrl={homePageUrl} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/InfoItems" element={<InfoItems />} />
        <Route path="/Contacts" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
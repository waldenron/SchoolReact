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
library.add(fas)



function App() {

  return (
    <div className="container rounded mt-3 mx-auto">
      <Nav />
      <Routes>
        <Route path="/" element={<Row />} />
        <Route path="/InfoItems" element={<InfoItems />} />
        <Route path="/Contacts" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
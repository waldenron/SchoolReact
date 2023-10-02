import React, { useState, useEffect } from 'react';
import { Link, useParams, Outlet } from 'react-router-dom';


import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { fetchData } from '../utils/apiServices';
import { toPageTitle, whatsappStrToHtmlTags } from '../utils/utilityFunctions';
import { getHomePageUrl } from './Common';
import { RowContext } from '../App';


export function RowDetails(props) {
  const { id } = useParams();
  const contextRows = React.useContext(RowContext);
  const [row, setRow] = useState(null);
  const [homePageUrl, setHomePageUrl] = useState(null);

  useEffect(() => {
    (async () => {
      if (contextRows && contextRows.length > 0) {
        //always false ):
        const foundRow = contextRows.find(r => r.id === parseInt(id));
        setRow(foundRow);
      } else {
        // fetch the row details if not available in context
        const fetchedData = await fetchData('/api/IndexRowsItems');
        const foundRow = fetchedData.find(r => r.id === parseInt(id));
        setRow(foundRow);
      }

      const fetchedUrl = await getHomePageUrl();
      setHomePageUrl(fetchedUrl);
    })();
  }, [id, contextRows]);

  if (!row) return null; // handle loading state or row not found

  const text = whatsappStrToHtmlTags(row.text);
  const header = `מידע נוסף - ${whatsappStrToHtmlTags(row.header)}`;
  document.title = toPageTitle(header);

  return (
    <div className="container py-3">
      <h3 dangerouslySetInnerHTML={{ __html: header }} />

      <img className="img-fluid w-md-75" src={`${homePageUrl}/${row.pic}`} alt={`תמונה בנושא ${row.name}`} />
      <div className="pt-3">
        <p dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </div>
  );
};

//rows
const rowsSortFunction = (a, b) => a.priority - b.priority;

const toHtmlElements = (row, homePageUrl, index) => {

  const shortText = whatsappStrToHtmlTags(row.shortText);
  const header = whatsappStrToHtmlTags(row.header);
  return (
    <div key={index} className="row pt-5 mt-3">
      <div className={`col-md-9 ${index % 2 === 0 ? "order-md-1" : "order-md-2"}`}>
        <img className="img-fluid" src={`${homePageUrl}/${row.pic}`} alt={`תמונה בנושא ${row.name}`} />
      </div>
      <div className={`col-md-3 ${index % 2 === 1 ? "order-md-1" : "order-md-2"}`}>
        <h3 dangerouslySetInnerHTML={{ __html: header }} />
        <p dangerouslySetInnerHTML={{ __html: shortText }} />
        <Link to={`/rowDetails/${row.id}`} target="_blank"><small className="text-muted">מידע נוסף</small></Link>
      </div>
    </div>
  )
};
export default function Row() {
  const [homePageUrl, setHomePageUrl] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      const fetchedData = await fetchData('/api/IndexRowsItems', null, rowsSortFunction);
      setRows(fetchedData);

      const fetchedUrl = await getHomePageUrl();
      setHomePageUrl(fetchedUrl);
    })();
  }, []);

  return (

    rows && homePageUrl &&
    <RowContext.Provider value={rows}>
      <div className="container" dir="rtl">
        {rows.map((row, index) => toHtmlElements(row, homePageUrl, index))}
        <Outlet />
      </div>
    </RowContext.Provider>
  );
}
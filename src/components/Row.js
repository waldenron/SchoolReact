import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { fetchData } from '../utils/apiServices';
import { whatsappStrToHtmlTags } from '../utils/utilityFunctions';
import { getHomePageUrl } from './Common';



//rows
const rowsSortFunction = (a, b) => a.priority - b.priority;
const toHtmlElements = (row, homePageUrl, index) => {

  const shortText = whatsappStrToHtmlTags(row.shortText);
  const header = whatsappStrToHtmlTags(row.header);
  return (
    <div key={index} className="row pt-5 mt-3">
      <div className={`col-md-9 ${index % 2 === 0 ? "order-md-1" : "order-md-2"}`}>
        <img className="img-fluid" src={`${homePageUrl}/Images/${row.pic}`} alt={`תמונה בנושא ${row.name}`} />
      </div>
      <div className={`col-md-3 ${index % 2 === 1 ? "order-md-1" : "order-md-2"}`}>
        <h3 dangerouslySetInnerHTML={{ __html: header }} />
        <p dangerouslySetInnerHTML={{ __html: shortText }} />

        <a href={row.link}><small className="text-muted">מידע נוסף</small></a>
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
    rows && <div className="container" dir="rtl">
      {rows.map((row, index) => toHtmlElements(row, homePageUrl, index))}
    </div>
  );
}



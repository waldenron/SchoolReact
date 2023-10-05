import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'


import { fetchData } from '../utils/apiServices';
import { toPageTitle, whatsappStrToHtmlTags } from '../utils/utilityFunctions';
import { LoadingSpinner, getHomePageUrl } from './Common';


const RowDetails = ({ id, rowItems, homePageUrl }) => {
  const rowItem = rowItems.find(rowItem => rowItem.id == id);

  const header = `מידע נוסף - ${whatsappStrToHtmlTags(rowItem.header)}`;
  document.title = toPageTitle(header);

  const text = whatsappStrToHtmlTags(rowItem.text);

  return (
    rowItem && homePageUrl &&
    <div className="container py-3">
      <h3 dangerouslySetInnerHTML={{ __html: header }} />

      <img className="img-fluid w-md-75" src={`${homePageUrl}/${rowItem.pic}`} alt={`תמונה בנושא ${rowItems.name}`} />
      <div className="pt-3">
        <p dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </div>)
};

const RowItem = ({ rowItem, homePageUrl, rowIndex }) => {
  const shortText = whatsappStrToHtmlTags(rowItem.shortText);
  const header = whatsappStrToHtmlTags(rowItem.header);

  return (
    rowItem && homePageUrl &&
    <div className="row pt-5 mt-3">
      <div className={`col-md-9 ${rowIndex % 2 === 0 ? "order-md-1" : "order-md-2"}`}>
        <img className="img-fluid" src={`${homePageUrl}/${rowItem.pic}`} alt={`תמונה בנושא ${rowItem.name}`} />
      </div>
      <div className={`col-md-3 ${rowIndex % 2 === 1 ? "order-md-1" : "order-md-2"}`}>
        <h3 className="mt-3 mt-sm-0" dangerouslySetInnerHTML={{ __html: header }} />
        <p dangerouslySetInnerHTML={{ __html: shortText }} />
        <Link to={`/Row/${rowItem.id}`} target="_blank"><small className="text-muted">מידע נוסף</small></Link>
      </div>
    </div>
  )
};
const RowItems = ({ rowItems, homePageUrl }) => {
  return (
    <div className="container py-3">
      {rowItems.map((rowItem, index) => (
        <RowItem rowItem={rowItem} homePageUrl={homePageUrl} rowIndex={index} key={index} />
      ))}
    </div>
  )
};

export default function Row() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [homePageUrl, setHomePageUrl] = useState(null);
  const [rowItems, setRowItems] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: fetchedData, error } = await fetchData('/api/IndexRowsItems');
      setRowItems(fetchedData);

      const fetchedUrl = await getHomePageUrl();
      setHomePageUrl(fetchedUrl);
    })();

    setLoading(false);
  }, []);

  if (loading) { return <LoadingSpinner />; }
  return (
    <div className="py-3 w-md-75 mx-auto">
      {!id && rowItems.length > 0 && <RowItems rowItems={rowItems} homePageUrl={homePageUrl} />}
      {id && rowItems.length > 0 &&
        <>
          <RowDetails id={id} rowItems={rowItems} homePageUrl={homePageUrl} />
        </>
      }
    </div>
  );
}
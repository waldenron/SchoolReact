import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'


import { fetchData } from '../utils/apiServices';
import { toPageTitle, whatsappStrToHtmlTags } from '../utils/utilityFunctions';
import { LoadingSpinner, ToLink, getHomePageUrl } from './Common';


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
        <ToLink to={`/Row/${rowItem.id}`} target="_blank"><small className="text-muted">מידע נוסף</small></ToLink>
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

export function Row() {
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

export function PictureSlider() {
  const [loading, setLoading] = useState(true);

  const [homePageUrl, setHomePageUrl] = useState(null);
  const [indexPics, setIndexPics] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSmIndex, setCurrentSmIndex] = useState(0);
  const [currentIndex1, setCurrentIndex1] = useState(-1);
  const [currentIndex2, setCurrentIndex2] = useState(-1);
  const [currentIndex3, setCurrentIndex3] = useState(-1);
  const [fadeInSm, setFadeInSm] = useState(false);
  const [fadeInArr, setFadeInArr] = useState([false, false, false]);

  useEffect(() => {
    (async () => {
      const { data: fetchedData, error } = await fetchData('/api/IndexPics');

      setIndexPics(fetchedData);
      setCurrentIndex1(0);
      setCurrentIndex2(Math.floor(fetchedData.length / 3));
      setCurrentIndex3(Math.floor(fetchedData.length * 2 / 3));

      const fetchedUrl = await getHomePageUrl();
      setHomePageUrl(fetchedUrl);
    })();

    setLoading(false);
  }, []);



  // Change currentIndex every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        return (prevIndex + 1) >= 3 ? 0 : prevIndex + 1;
      });
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [indexPics]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSmIndex((prevIndex) => { return (prevIndex + 1) >= indexPics.length ? 0 : prevIndex + 1; });
    }, 2000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [indexPics]);

  useEffect(() => {
    let fadeInArrCopy = [...fadeInArr];
    switch (currentIndex % 3) {
      case 0:
        setCurrentIndex1((prevIndex) => { return (prevIndex + 1) >= (Math.floor(indexPics.length / 3)) ? 0 : prevIndex + 1; });
        fadeInArrCopy[0] = true;
        break;
      case 1:
        setCurrentIndex2((prevIndex) => { return (prevIndex + 1) >= (Math.floor(indexPics.length * 2 / 3)) ? (Math.floor(indexPics.length / 3)) : prevIndex + 1; });
        fadeInArrCopy[1] = true;
        break;
      case 2:
        setCurrentIndex3((prevIndex) => { return (prevIndex + 1) >= indexPics.length ? (Math.floor(indexPics.length * 2 / 3)) : prevIndex + 1; });
        fadeInArrCopy[2] = true;
        break;
    }

    setFadeInArr(fadeInArrCopy);

    const fadeTimeout = setTimeout(() => {
      let updatedFadeIn = [...fadeInArrCopy];
      updatedFadeIn[currentIndex % 3] = !updatedFadeIn[currentIndex % 3];
      setFadeInArr(updatedFadeIn);
    }, 50);
    return () => clearTimeout(fadeTimeout);

  }, [currentIndex]);

  useEffect(() => {
    setFadeInSm(false);
    const fadeTimeout = setTimeout(() => {
      setFadeInSm(true);
    }, 50);
    return () => clearTimeout(fadeTimeout);
  }, [currentSmIndex]);


  if (loading) { return <LoadingSpinner />; }
  return (
    <>
      {indexPics && indexPics.length > 0 &&
        <>
          <div className="hideOnSmallScreen">
            <div className="d-flex w-md-75 mx-auto">
              <div className="width-third">
                <img key={currentSmIndex}
                  className="img-fluid mb-0"
                  //className={`img-fluid mb-0 fade-img ${fadeInArr[0] ? 'showing' : ''}`}
                  src={indexPics[currentIndex1]?.src} alt={indexPics[currentIndex1]?.alt} />
              </div>
              <div className="width-third mx-2">
                <img
                  key={currentSmIndex}
                  className="img-fluid mb-0"
                  //className={`img-fluid mb-0 fade-img ${fadeInArr[1] ? 'showing' : ''}`}
                  src={indexPics[currentIndex2]?.src} alt={indexPics[currentIndex2]?.alt} />
              </div>
              <div className="width-third">
                <img key={currentSmIndex}
                  className="img-fluid mb-0"
                  //className={`img-fluid mb-0 fade-img ${fadeInArr[2] ? 'showing' : ''}`}
                  src={indexPics[currentIndex3]?.src} alt={indexPics[currentIndex3]?.alt} />
              </div>
            </div>
          </div>
          <div className="hideOnLargeScreen">
            <div className="d-flex mx-auto">
              <img
                key={currentSmIndex}
                className={`img-fluid mb-0 fade-img ${fadeInSm ? 'showing' : ''}`}
                src={indexPics[currentSmIndex]?.src}
                alt={indexPics[currentSmIndex]?.alt}
              />
            </div>
          </div>
        </>
      }
    </>
  );
}
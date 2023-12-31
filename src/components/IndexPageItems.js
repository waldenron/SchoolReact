import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

import { fetchData, getHomePageUrl } from '../utils/apiServices';
import { getWithExpiry, setWithExpiry, toPageTitle, whatsappStrToHtmlTags } from '../utils/utilityFunctions';
import { LoadingSpinner, ToLink } from './Common';


const RowDetails = ({ id, rowItems, homePageUrl }) => {
  const rowItem = rowItems.find(rowItem => rowItem.id == id);

  const header = `מידע נוסף - ${whatsappStrToHtmlTags(rowItem.header)}`;
  document.title = toPageTitle(header);

  const text = whatsappStrToHtmlTags(rowItem.text);

  return (
    rowItem && homePageUrl &&
    <div className="container py-md-3">
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
    <div className="row pb-5 mt-3">
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

      setLoading(false);
    })();
  }, []);

  //if (loading) { return <LoadingSpinner />; }
  return (
    <div className="w-md-75 mx-auto">
      {!id && rowItems.length > 0 && <RowItems rowItems={rowItems} homePageUrl={homePageUrl} />}
      {id && rowItems.length > 0 &&
        <>
          <RowDetails id={id} rowItems={rowItems} homePageUrl={homePageUrl} />
        </>
      }
    </div>
  );
}


export const SpecialMsgModal = () => {
  const [show, setShow] = useState(false);

  const [homePageUrl, setHomePageUrl] = useState(null);
  const [pic, setPic] = useState(null);
  const [link, setLink] = useState(null);
  const [linkText, setLinkText] = useState(null);
  const [isLinkNewTab, setIsLinkNewTab] = useState(true);

  useEffect(() => {
    (async () => {
      const fetchedUrl = await getHomePageUrl();
      setHomePageUrl(fetchedUrl);

      const { data: fetchedData, error } = await fetchData('/api/IndexSpecialMsg');
      setPic(fetchedData.pic);
      setLink(fetchedData.link);
      setLinkText(fetchedData.linkText);
      setIsLinkNewTab(fetchedData.isLinkNewTab);
    })();
  }, []);

  useEffect(() => {
    const hasShown = getWithExpiry("hasShownSpecialMsgModal");
    if (!hasShown) {
      setShow(true); 
      setWithExpiry("hasShownSpecialMsgModal", true, 1);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    //if (onClose) onClose();
  };

  if (!show) return null;
  const picLink = pic ? pic.replace("../../", homePageUrl) : "";
  return (
    <div className="modal fade show" id="SpecialMsg" style={{ display: 'block', paddingLeft: 0 }} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-lg">
        <div className="modal-content border-3 border-dark">
          <div className="modal-header p-0 border-0">
            <button type="button" className="close border-0 fs-4 fw-bold py-0" onClick={() => setShow(false)}>×</button>
          </div>
          <div className="modal-body p-2">
            <img src={picLink} className="img-fluid my-0" alt="Special Message" />
          </div>
          <div className="modal-footer p-0 border-0">
            {link && (
              <a href={link} className="btn btn-light" target={isLinkNewTab ? "_blank" : "_self"} rel="noopener noreferrer">
                {linkText}
              </a>
            )}
            <button className="btn btn-dark" type="button" onClick={handleClose}>סגירה</button>
          </div>
        </div>
      </div>
    </div>
  );
};


export function PictureSlider() {
  const [loading, setLoading] = useState(true);

  const [indexPics, setIndexPics] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSmIndex, setCurrentSmIndex] = useState(0);
  const [currentIndex1, setCurrentIndex1] = useState(-1);
  const [currentIndex2, setCurrentIndex2] = useState(-1);
  const [currentIndex3, setCurrentIndex3] = useState(-1);
  const [fadeIn1, setFadeIn1] = useState(false);
  const [fadeIn2, setFadeIn2] = useState(false);
  const [fadeIn3, setFadeIn3] = useState(false);
  const [fadeInSm, setFadeInSm] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: fetchedData, error } = await fetchData('/api/IndexPics');

      setIndexPics(fetchedData);
      setCurrentIndex1(0);
      setCurrentIndex2(Math.floor(fetchedData.length / 3));
      setCurrentIndex3(Math.floor(fetchedData.length * 2 / 3));

      setLoading(false);
    })();
  }, []);


  const loopCircle = 5;//5 - so in each loop it'll wait for 2 seconds after showing the first 3 pics
  // Change currentIndex every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        return (prevIndex + 1) >= loopCircle ? 0 : prevIndex + 1;
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
    switch (currentIndex % loopCircle) {
      case 0:
        setCurrentIndex1((prevIndex) => { return (prevIndex + 1) >= (Math.floor(indexPics.length / 3)) ? 0 : prevIndex + 1; });
        break;
      case 1:
        setCurrentIndex2((prevIndex) => { return (prevIndex + 1) >= (Math.floor(indexPics.length * 2 / 3)) ? (Math.floor(indexPics.length / 3)) : prevIndex + 1; });
        break;
      case 2:
        setCurrentIndex3((prevIndex) => { return (prevIndex + 1) >= indexPics.length ? (Math.floor(indexPics.length * 2 / 3)) : prevIndex + 1; });
        break;
    }
  }, [currentIndex]);

  useEffect(() => {
    setFadeInSm(false);
    const fadeTimeout = setTimeout(() => { setFadeInSm(true); }, 50);
    return () => clearTimeout(fadeTimeout);
  }, [currentSmIndex]);
  useEffect(() => {
    setFadeIn1(false);
    const fadeTimeout = setTimeout(() => { setFadeIn1(true); }, 50);
    return () => clearTimeout(fadeTimeout);
  }, [currentIndex1]);
  useEffect(() => {
    setFadeIn2(false);
    const fadeTimeout = setTimeout(() => { setFadeIn2(true); }, 50);
    return () => clearTimeout(fadeTimeout);
  }, [currentIndex2]);
  useEffect(() => {
    setFadeIn3(false);
    const fadeTimeout = setTimeout(() => { setFadeIn3(true); }, 50);
    return () => clearTimeout(fadeTimeout);
  }, [currentIndex3]);


  //if (loading) { return <LoadingSpinner />; }
  return (
    <>
      {indexPics && indexPics.length > 0 &&
        <>
          <div className="hideOnSmallScreen">
            <div className="d-flex w-md-75 mx-auto">
              <div className="width-third">
                <img key={currentIndex1}
                  className={`img-fluid slide-img ${fadeIn1 ? 'showing' : ''}`}
                  src={indexPics[currentIndex1]?.src} alt={indexPics[currentIndex1]?.alt} />
              </div>
              <div className="width-third mx-2">
                <img
                  key={currentIndex2}
                  className={`img-fluid slide-img ${fadeIn2 ? 'showing' : ''}`}
                  src={indexPics[currentIndex2]?.src} alt={indexPics[currentIndex2]?.alt} />
              </div>
              <div className="width-third">
                <img key={currentIndex3}
                  className={`img-fluid slide-img ${fadeIn3 ? 'showing' : ''}`}
                  src={indexPics[currentIndex3]?.src} alt={indexPics[currentIndex3]?.alt} />
              </div>
            </div>
          </div>
          <div className="hideOnLargeScreen">
            <div className="d-flex mx-auto">
              <img
                key={currentSmIndex}
                className={`img-fluid fade-img ${fadeInSm ? 'showing' : ''}`}
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

export function NavPics() {
  const [loading, setLoading] = useState(true);

  const [indexNavPics, setIndexNavPics] = useState([]);

  const IndexNavPic = (item) => {
    return (
      <ToLink to={item.link} target={item.isLinkNewTab ? '_blank' : '_self'}>
        <img src={item.src} className="img-fluid" alt={item.alt} width="50%" />
      </ToLink>)
  };

  useEffect(() => {
    (async () => {
      const { data: fetchedData, error } = await fetchData('/api/IndexNavPics');

      setIndexNavPics(fetchedData);

      setLoading(false);
    })();
  }, []);

  //if (loading) { return <LoadingSpinner />; }
  return (
    <>
      {indexNavPics && indexNavPics.length > 0 &&
        <div className="row w-md-75 mx-auto">
          <div className="col-md-4 text-center">
            {IndexNavPic(indexNavPics[0])}
          </div>
          <div className="col-md-4 text-center">
            {IndexNavPic(indexNavPics[1])}
          </div>
          <div className="col-md-4 text-center">
            {IndexNavPic(indexNavPics[2])}
          </div>
        </div>
      }
    </>
  );
}

export default function IndexPageItems() {
  const [hasRows, setHasRows] = useState(false);
  const [hasSpecialMsg, setHasSpecialMsg] = useState(false);
  const [hasPics, setHasPics] = useState(false);
  const [hasNavPics, setHasNavPics] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: fetchedData, error } = await fetchData('/api/InstIndexItemsHas');

      setHasRows(fetchedData.hasRows);
      setHasSpecialMsg(fetchedData.hasSpecialMsg);
      setHasPics(fetchedData.hasPics);
      setHasNavPics(fetchedData.hasNavPics);
    })();
  }, []);


  return (
    <>
      {hasSpecialMsg && <SpecialMsgModal />}
      {hasRows && <Row />}
      {hasPics && <PictureSlider />}
      {hasPics && hasNavPics && <hr className="hrIndex w-md-75 mx-auto" />}
      {hasNavPics && <NavPics />}
    </>
  )
}
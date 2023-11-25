import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { fetchData } from '../utils/apiServices';
import { cssStringToObject, toDate, toPageTitle } from '../utils/utilityFunctions';
import { Link } from 'react-router-dom';

export const getCssClass = (type) => {
    switch (type) {
        case "ok": return "alert alert-success";
        case "error": return "alert alert-danger";
        case "warning": return "alert alert-warning";
        case "info": return "alert alert-info";
        default: return "";
    }
};

export const useMessage = () => {
    const [message, setMessage] = useState({ text: "", css: "" });
    const showMessage = ({ text, type }) => { setMessage({ text, css: getCssClass(type) }); };

    return { message, showMessage };
};

export const ItemIcon = ({ itemIcon, homePageUrl }) => {
    if (itemIcon.type === "fa") {
        if (itemIcon.style != "")
            return (<FontAwesomeIcon icon={itemIcon.cssClass} style={cssStringToObject(itemIcon.style)} />);
        else
            return (<FontAwesomeIcon icon={itemIcon.cssClass} />);
    }
    else if (homePageUrl && itemIcon.type === "img") {
        return (<img src={`${homePageUrl}/${itemIcon.src}`} />);
    }
    else {
        return (<></>);
    }
}
export const Logo = () => {
    const [instDetails, setInstDetails] = useState();
    useEffect(() => {
        (async () => {
            const { data: fetchedData, error } = await fetchData('/api/InstDetails');
            setInstDetails(fetchedData);
        })();
    }, []);
    if (!instDetails) return null;  // This will prevent rendering until the data is loaded
    return (
        <a href={instDetails.homePageUrl} className="text-decoration-none no-print">
            <img src={`${instDetails.homePageUrl}/images/${instDetails.logoFileName}`} className="img-fluid d-block mx-auto pt-1" alt="Logo" />
        </a>
    );
};

export const Header = ({ header, msg, divCss }) => {
    if (header) document.title = toPageTitle(header);
    return (
        <div className={divCss ? divCss : ""}>
            {header && <h3 className="d-inline" dangerouslySetInnerHTML={{ __html: header }} />}
            {msg && <h5 className="d-flex-inline mx-auto">{msg}</h5>}
        </div>
    )
};

export function SelectItems({ filterBy, preText, items, defaultText, selectedValue, onSelect, moreCss, isChoosableDefault = false, isBbColorSelectedValue = false }) {
    return (
        <>
            <b className="my-auto">{preText}</b>
            <select className={`form-select max-w-select${moreCss ? " " + moreCss : ""}`} value={selectedValue} onChange={e => onSelect(filterBy, Number(e.target.value))}>
                <option value="-1" disabled={!isChoosableDefault}>{defaultText}</option>
                {items.map(item => (
                    <option key={item.id} value={item.id} className={selectedValue && selectedValue === item.id && isBbColorSelectedValue ? "bgToday" : ""}>
                        {item.name}
                    </option>
                ))}
            </select >
        </>
    );
}

export function CheckboxControls({ controlDefinitions, controls, setControls }) {

    const toggleControl = (key) => {
        const updatedControls = { ...controls };
        updatedControls[key] = !controls[key];
        setControls(updatedControls);
    }

    return (
        <div className="d-flex justify-content-center flex-wrap mb-3">
            {controlDefinitions.map(({ key, label }) => (
                <div key={key} className="form-check form-check-inline rtl-form-check-inline mx-0">
                    <label htmlFor={`Checkbox${key}`} className="form-check-label mx-1">{label}</label>
                    <input
                        type="checkbox"
                        id={`Checkbox${key}`}
                        className="form-check-input"
                        checked={controls[key]}
                        onChange={() => toggleControl(key)}
                    />
                </div>
            ))}
        </div>
    );
}

export function IconButton({ show, icon, text, isChose, onClick }) {
    return (
        <span className="my-auto mx-2 text-primary" role="button" onClick={() => onClick(show)}>
            <FontAwesomeIcon icon={icon} className="mx-1" />
            <span className={`${isChose ? " primarySelected" : ""}`}>{text}</span>
        </span>
    );
}
export function PrintButton({ moreCss }) {
    return (
        <FontAwesomeIcon icon="fas fa-print" role="button" onClick={() => window.print()}
            className={`text-secondary fs-5 my-auto${moreCss ? " " + moreCss : ""}`}
        />
    );
}

export function ToLink({ to, ...props }) {
    if (typeof to !== 'string') {
        console.error("The 'to' prop should be a string. Received:", typeof to);
        return null;
    }
    const isExternalLink = to.startsWith("http") || to.startsWith("www");
    if (isExternalLink) {
        const targetProp = props.target ? {} : { target: "_blank" };
        const relProp = props.rel ? {} : { rel: "noopener noreferrer" };
        return <a href={to} {...props} {...targetProp} {...relProp} />;
    } else {
        return <Link to={to} {...props} />;
    }
}

export function LoadingSpinner() {
    return (
        <div className="spinner-container">
            <div className="spinner mx-2"></div>
            Loading...
        </div>
    );
}

export const MobileRotateAdvice = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isPortrait, setIsPortrait] = useState(false);
    const [showMessage, setShowMessage] = useState(true); 

    const checkOrientation = () => {
        setIsPortrait(window.innerWidth <= window.innerHeight);
    };

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/;
        setIsMobile(mobileRegex.test(userAgent));

        window.addEventListener('resize', checkOrientation);
        checkOrientation();

        return () => window.removeEventListener('resize', checkOrientation);
    }, []);


    if (isMobile && isPortrait && showMessage) {
        return (
            <div className="d-flex justify-content-between align-items-center p-2 bg-warning">
                <FontAwesomeIcon icon="fas fa-mobile-alt" rotation={90} size="2x" className="me-2" />
                <span>הצפייה בסלולרי מומלצת במצב אופקי.</span>
                <button onClick={() => setShowMessage(false)} className="btn btn-close" aria-label="סגור"></button>
            </div>
        );
    }

    return null; // Render nothing if not mobile or not in portrait mode
};


export function NotFound({ homePageUrl }) {
    return (
        <div>
            <h1 className="text-center"><FontAwesomeIcon icon="fa-face-sad-cry" /> העמוד לא נמצא <FontAwesomeIcon icon="fa-face-sad-cry" /></h1>
            <h3 className="text-center"><a href={homePageUrl}>מעבר לעמוד הבית <FontAwesomeIcon icon="fa-solid fa-house" /></a></h3>
        </div>
    )
}
export function NotAllowed() {
    return (
        <div className="container mx-auto bg-warning">
            <h2 className="display-4 text-center">עמוד זה אינו פתוח לבית הספר</h2>
        </div>
    );
}


export const AddToCalendarIcon = () => (<FontAwesomeIcon icon="fa-calendar-plus" className="text-primary no-print" title="Add to Google Calendar" />);
export const AddToCalendarLink = ({ title, startTime, endTime, description = '', location = '' }) => {
    //Temp? fix problem with the google calendar time + 5 minutes
    const fixGoogleTimeProblem = (dateTime) => new Date(dateTime.getTime() - 5 * 60000);
    startTime = fixGoogleTimeProblem(startTime);
    endTime = fixGoogleTimeProblem(endTime);

    const start = toDate(startTime, "yyyyMMddTHHmmz"); // Added 'Z' to indicate UTC time
    const end = toDate(endTime, "yyyyMMddTHHmmz");     // Added 'Z' to indicate UTC time

    // Construct the Google Calendar link with only the necessary parameters
    let eventLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title.trim())}&dates=${start}/${end}&ctz=Asia/Jerusalem`;

    // Append description and location if they are provided
    if (description) eventLink += `&details=${encodeURIComponent(description.trim())}`;
    if (location) eventLink += `&location=${encodeURIComponent(location)}`;

    return <a href={eventLink} target="_blank" rel="noopener noreferrer" ><AddToCalendarIcon /></a>;
};

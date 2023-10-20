import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { fetchData } from '../utils/apiServices';
import { cssStringToObject, toPageTitle } from '../utils/utilityFunctions';
import { Link } from 'react-router-dom';


export const getHomePageUrl = async () => {
    const { data: fetchedData, error } = await fetchData('/api/InstDetails');
    return fetchedData.homePageUrl;
};
export const getPageHeader = async ({ pageName }) => {
    const additionalHeaders = pageName ? [{ name: 'PageName', value: pageName }] : [];
    const { data: fetchedData, error } = await fetchData('/api/PageHeader', null, null, additionalHeaders);

    return fetchedData.pageHeader;
};
export const getInstUtils = async () => {
    const { data: fetchedData, error } = await fetchData('/api/InstUtils');
    return fetchedData;
};
export const getInstParams = async () => {
    const { data: fetchedData, error } = await fetchData('/api/InstParams');
    return fetchedData;
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
        <a href={instDetails.homePageUrl} className="text-decoration-none">
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

export function ToLink({ to, ...props }) {
    //console.log("ToLink: to=", to);
    if (typeof to !== 'string') {
        console.error("The 'to' prop should be a string. Received:", typeof to);
        return null; // or return a default link or handle it some other way
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

export function NotAllowed() {
    return (
        <div className="container mx-auto bg-warning">
            <h2 className="display-4 text-center">עמוד זה אינו פתוח לבית הספר</h2>
        </div>
    );
}

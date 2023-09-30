import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ItemsList, Logo, Header } from "./Common"
import '../css/StyleSheet.css';
import '../css/StyleSheet_AY.css';
import { NavItem } from './Nav';

import { toArchiveText, whatsappStrToHtmlTags } from '../utils/utilityFunctions';
import { fetchData } from '../utils/apiServices';

const instCode = "2";

const url = "https://art-yeshiva.org.il/";

//InfoNav
const infoNavSortFunction = (a, b) => a.priority - b.priority;

function InfoNav() {
    const [navItems, setNavItems] = useState([]);

    useEffect(() => {
        (async () => {
            const fetchedData = await fetchData('/api/InfoLinksItems', null, infoNavSortFunction);
            setNavItems(fetchedData);
        })();
    }, []);

    return (
        <div className="d-flex flex-wrap btn-group justify-content-center">
            {navItems.map((navItem, index) => (
                <NavItem navItem={navItem} key={index} />
            ))}
        </div>
    );
}

//infoItems
const infoItemsTransformFunction = (infoItem) => ({
    ...infoItem,
    textSearch: `${infoItem.text}`
});

function InfoItemToHtml(item) {
    const displayText = item.isArchive ? toArchiveText(whatsappStrToHtmlTags(item.text)) : whatsappStrToHtmlTags(item.text);
    const link = item.link ? item.link.replace("../../", url) : "";
    switch (item.type) {
        case 'WithText':
            return (
                <div className="d-flex flex-wrap justify-content-between align-items-center w-100">
                    <dl className="mb-0">
                        <dt className="mb-1"> {displayText}</dt>
                        <dd className="ms-1 me-0" dangerouslySetInnerHTML={{ __html: item.moreText.replace(/\r\n/g, '<br>') }}></dd>
                        {item.link &&
                            <dd className="ms-1 me-0">
                                <a href={link} target="_blank" rel="noopener noreferrer">
                                    {item.linkText}
                                </a>
                            </dd>
                        }
                    </dl>
                    {item.lastUpdateText &&
                        <span className="badge rounded-pill bg-secondary ml-auto align-self-end">
                            <small>{item.lastUpdateText}</small>
                        </span>
                    }
                </div>
            );
        case 'OnlyLink':
            return (
                <div className="d-flex flex-wrap justify-content-between align-items-center w-100">
                    <a href={link} target="_blank" rel="noopener noreferrer">{displayText}</a>
                    {item.lastUpdateText &&
                        <span className="badge rounded-pill bg-secondary ml-auto align-self-end">
                            <small>{item.lastUpdateText}</small>
                        </span>
                    }
                </div>
            );
        default:
            return null;
    }
}


const toHtmlElements = (data) => {
    return data.map((item, index) => (
        <InfoItemToHtml key={index} {...item} />
    ));
};

const InfoItemsPage = () => {
    const [infoItems, setInfoItems] = useState([]);

    useEffect(() => {
        (async () => {
            const fetchedData = await fetchData('/api/InfoItems', infoItemsTransformFunction);
            setInfoItems(fetchedData);
        })();
    }, []);

    const msg = (
        <div className="d-flex flex-wrap btn-group justify-content-end">
            <InfoNav />
        </div>
    );
    return (
        <div className="py-3 w-md-75 mx-auto">
            <Logo />
            <Header
                header="מידע לתלמידים"
                msg={msg}
            />
            <ItemsList items={infoItems} toHtml={toHtmlElements} />
        </div>
    )
};

export default InfoItemsPage;

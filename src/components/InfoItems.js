import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ItemsList, Logo, Header, getHomePageUrl } from "./Common"
import '../css/StyleSheet.css';
import '../css/StyleSheet_AY.css';
import { NavItem } from './Nav';

import { toArchiveText, whatsappStrToHtmlTags } from '../utils/utilityFunctions';
import { fetchData } from '../utils/apiServices';


//InfoNav
const infoNavSortFunction = (a, b) => a.priority - b.priority;

function InfoNav({ homePageUrl }) {
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
                <NavItem navItem={navItem} homePageUrl={homePageUrl} key={index} />
            ))}
        </div>
    );
}


//infoItems
const infoItemsTransformFunction = (infoItem) => ({
    ...infoItem,
    textSearch: `${infoItem.text}`
});

function InfoItemToHtml(props) {
    const { homePageUrl, ...item } = props;

    const displayText = item.isArchive ? toArchiveText(whatsappStrToHtmlTags(item.text)) : whatsappStrToHtmlTags(item.text);
    const displayMoreText = whatsappStrToHtmlTags(item.moreText).replace(/\r\n/g, '<br>');
    const link = item.link ? item.link.replace("../../", homePageUrl) : "";
    switch (item.type) {
        case 'WithText':
            return (
                <div className="d-flex flex-wrap justify-content-between align-items-center w-100">
                    <dl className="mb-0">
                        <dt className="mb-1"> {displayText}</dt>
                        <dd className="ms-1 me-0" dangerouslySetInnerHTML={{ __html: displayMoreText }}></dd>
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


const toHtmlElements = (data, homePageUrl) => {
    return data.map((item, index) => (
        <InfoItemToHtml key={index} {...item} homePageUrl={homePageUrl} />
    ));
};

const InfoItemsPage = () => {
    const [homePageUrl, setHomePageUrl] = useState(null);
    const [infoItems, setInfoItems] = useState([]);

    useEffect(() => {
        (async () => {
            const fetchedData = await fetchData('/api/InfoItems', infoItemsTransformFunction);
            setInfoItems(fetchedData);

            const fetchedUrl = await getHomePageUrl();
            setHomePageUrl(fetchedUrl);
        })();
    }, []);

    const msg = (
        <div className="d-flex flex-wrap btn-group justify-content-end">
            <InfoNav homePageUrl={homePageUrl} />
        </div>
    );
    const header = "מידע לתלמידים";
    return (
        homePageUrl && <ItemsList header={header} msg={msg} items={infoItems} toHtml={(data) => toHtmlElements(data, homePageUrl)} />
    )
};

export default InfoItemsPage;

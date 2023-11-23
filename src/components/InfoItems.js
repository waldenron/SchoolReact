import React, { useState, useEffect } from 'react';

import { LoadingSpinner, NotAllowed, SelectItems } from "./Common"
import { ItemsList } from './ItemsList';
import { NavItem } from './Nav';

import { getWithExpiry, toArchiveText, whatsappStrToHtmlTags } from '../utils/utilityFunctions';
import { fetchData, getHomePageUrl, getPageHeader } from '../utils/apiServices';
import { useParams } from 'react-router-dom';


//InfoNav
const infoNavSortFunction = (a, b) => a.priority - b.priority;

function InfoNav({ homePageUrl }) {
    const token = getWithExpiry("token");

    const [navItems, setNavItems] = useState([]);

    useEffect(() => {
        (async () => {
            const additionalHeaders = token ? [{ name: 'token', value: token }] : [];

            const { data: fetchedData, error } = await fetchData('/api/InfoLinksItems', null, infoNavSortFunction, additionalHeaders);
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

export default function InfoItems() {
    const { id } = useParams();
    const token = getWithExpiry("token");

    const [loading, setLoading] = useState(true);
    const [notAlowed, setNotAlowed] = useState(false);

    const [homePageUrl, setHomePageUrl] = useState(null);
    const [pageHeader, setPageHeader] = useState(null);
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(-1);
    const [infoItemCategories, setInfoItemCategories] = useState([]);
    const [infoItems, setInfoItems] = useState([]);

    useEffect(() => {
        (async () => {
            const additionalHeaders = token ? [{ name: 'token', value: token }] : [];

            const { data: fetchedData, error } = await fetchData('/api/InfoItems', infoItemsTransformFunction, null, additionalHeaders);
            if (error && error.message === "Resource not found") setNotAlowed(true);
            else setInfoItems(fetchedData);

            const { data: fetchedDataCategories } = await fetchData('/api/InfoItemCategories', null, null, additionalHeaders);
            setInfoItemCategories(fetchedDataCategories);

            const { data: fetchedDataGrades } = await fetchData('/api/Grades');
            setGrades(fetchedDataGrades);

            const fetchedUrl = await getHomePageUrl();
            setHomePageUrl(fetchedUrl);

            const fetchedPageHeader = await getPageHeader({ pageName: "InfoItems" });
            setPageHeader(fetchedPageHeader);

            setLoading(false);
        })();
    }, []);

    if (notAlowed) { return <NotAllowed />; }
    if (loading) { return <LoadingSpinner />; }

    //Show InfoNav only on a not filtered page
    const msg =
        !id &&
        <>
            <div className="d-flex flex-wrap btn-group justify-content-end">
                <InfoNav homePageUrl={homePageUrl} />
            </div>
            {grades && <div className="d-flex w-md-50 pt-3">
                <SelectItems filterBy="grade" preText="הצגת מידע הנוגע לשכבה - " items={grades} defaultText="כל השכבות" selectedValue={selectedGrade} onSelect={(_, value) => setSelectedGrade(value)} isChoosableDefault="true" />
            </div>
            }
        </>
    const infoItemCategoryName = infoItemCategories && infoItemCategories.length > 0 ? infoItemCategories.find(item => item.id == id)?.name : "";
    const header = token ? "אזור מורים" : pageHeader && (pageHeader + (id && infoItemCategoryName ? " - <span class='fw-bolder'>" + infoItemCategoryName + "</span>" : ""));
    const filterCategories = infoItemCategories.filter(item => item.isShowOnInfoItemsPage === true);
    let infoItemsToShow = !id ?
        infoItems.filter(item => item.isShowOnInfoItemsPage == true)
        : infoItems.filter(item => item.category == id);
    if (selectedGrade != -1) infoItemsToShow = infoItemsToShow.filter(item => item.grades === "" || item.grades.includes(selectedGrade));
    return (
        <ItemsList header={header} msg={msg} items={infoItemsToShow} toHtml={(data) => toHtmlElements(data, homePageUrl)}
            filterCategories={!id ? filterCategories : null}
            noItemShow={id ? "true" : null}
        />
    )
};
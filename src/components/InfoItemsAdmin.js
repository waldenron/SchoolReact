import React, { useState, useEffect } from 'react';

import { ClassesCheckboxComponent, LoadingSpinner, NotAllowed, NotAllowedUser, SelectItems } from "./Common"
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
                <NavItem navItem={navItem} homePageUrl={homePageUrl} isTextResponsive={false} key={index} />
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
                        {item.note && <dd className="ms-1 me-0"> {item.note} </dd>}
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
                <div>
                    <div className="d-flex flex-wrap justify-content-between align-items-center w-100">
                        <a href={link} target="_blank" rel="noopener noreferrer">{displayText}</a>
                        {item.lastUpdateText &&
                            <span className="badge rounded-pill bg-secondary ml-auto align-self-end">
                                <small>{item.lastUpdateText}</small>
                            </span>
                        }
                    </div>
                    {item.note && <div className="ms-0 me-2"> {item.note} </div>}
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

export default function InfoItemsAdmin() {
    const { id } = useParams();
    const token = getWithExpiry("token");
    const [loading, setLoading] = useState(true);
    const [notAlowed, setNotAlowed] = useState(false);

    const [homePageUrl, setHomePageUrl] = useState(null);
    const [pageHeader, setPageHeader] = useState(null);

    const [classes, setClasses] = useState([]);
    const [grades, setGrades] = useState([]);
    const [sections, setSections] = useState([]);

    const [selectedClasses, setSelectedClasses] = useState(-1);
    const [infoItemCategories, setInfoItemCategories] = useState([]);
    const [infoItems, setInfoItems] = useState([]);

    useEffect(() => {
        if (token) {
            (async () => {
                const additionalHeaders = [{ name: 'token', value: token }];

                const { data: fetchedData, error } = await fetchData('/api/InfoItems', infoItemsTransformFunction, null, additionalHeaders);
                if (error && error.message === "Resource not found") setNotAlowed(true);
                else setInfoItems(fetchedData);
                if (!notAlowed) {
                    const { data: fetchedDataCategories } = await fetchData('/api/InfoItemCategories', null, null, additionalHeaders);
                    setInfoItemCategories(fetchedDataCategories);

                    const { data: fetchedDataClasses } = await fetchData('/api/Classes');
                    setClasses(fetchedDataClasses);

                    const { data: fetchedDataGrades } = await fetchData('/api/Grades');
                    setGrades(fetchedDataGrades);

                    const { data: fetchedDataSections } = await fetchData('/api/Sections');
                    //setSections(fetchedDataSections);
                    setSections(fetchedDataSections.filter(section => section.id < 99));
                    
                    const fetchedUrl = await getHomePageUrl();
                    setHomePageUrl(fetchedUrl);

                    // const fetchedPageHeader = await getPageHeader({ pageName: "InfoItems" });
                    // setPageHeader(fetchedPageHeader);

                    setLoading(false);
                }
            })();
        }
    }, []);

    if (!token || notAlowed) { return <NotAllowedUser />; }
    if (loading) { return <LoadingSpinner />; }
    console.log(selectedClasses);
    return (
        <ClassesCheckboxComponent sections={sections} grades={grades} classes={classes} onSelectedClassesChange={setSelectedClasses}/>
    )
};
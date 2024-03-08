import React, { useState, useEffect } from 'react';

import { ClassesCheckboxComponent, LoadingSpinner, NotAllowed, NotAllowedUser, SelectItems } from "./Common"
import { FilterCategories, ItemsList } from './ItemsList';
import { NavItem } from './Nav';

import { addDays, getWithExpiry, toArchiveText, toDate, whatsappStrToHtmlTags } from '../utils/utilityFunctions';
import { fetchData, getHomePageUrl, getPageHeader } from '../utils/apiServices';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


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


export const DescriptionInput = ({ id, label, value, onChange, inputType = "text", isRequiredField = false, inputMoreCss = "", placeholder = "", moreProps = {} }) => {
    return (
        <div className="d-flex flex-column align-items-start align-items-sm-center flex-sm-row text-sm-center mb-3">
            <div className="pe-sm-2 mb-2 mb-sm-0">
                <label htmlFor={id} className={`fw-bold${isRequiredField ? " requiredField" : ""}`}>{label}</label>
            </div>
            <div className="w-sm-90 flex-grow-1">
                <input
                    id={id}
                    name={id}
                    type={inputType}
                    className={`form-control${inputMoreCss ? ' ' + inputMoreCss : ""}`}
                    onChange={onChange}
                    value={value}
                    placeholder={placeholder}
                    {...moreProps}
                />
            </div>
        </div>
    );
};

export function LinkComponent({ defaultlinkType, hasLinkText = true }) {
    const [linkType, setLinkType] = useState(defaultlinkType);
    const [linkText, setLinkText] = useState('לחצו כאן');
    const [link, setLink] = useState('');
    const [fileLabel, setFileLabel] = useState('עיון');

    const [linkTypes, setLinkTypes] = useState([]);

    const handleChangeLinkType = (e) => {
        const selectedLinkType = linkTypes.find(item => item.id === parseInt(e.target.dataset.value));
        setLinkType(selectedLinkType);
    };

    const handleFileChange = (e) => {
        const fileName = e.target.files[0]?.name || 'עיון';
        setFileLabel(fileName);
    };

    useEffect(() => {
        (async () => {

            const { data: fetchedDataLinkTypes } = await fetchData('/api/LinkTypes');
            setLinkTypes(fetchedDataLinkTypes);

            //setLinkType to 1 (none)
            const selectedLinkType = defaultlinkType || fetchedDataLinkTypes.find(item => item.id === 1);
            setLinkType(selectedLinkType);

            //setLoading(false);
        }
        )();
    }, []);

    const LinkFileHeader = () => {
        return (
            <div className="fw-bold">
                <FontAwesomeIcon icon="fas fa-paperclip" className="ps-1" />
                <span className={`d-inline${link ? " btn btn-link" : ""}`}>קובץ</span>
                <span className=""> / </span>
                <FontAwesomeIcon icon="fas fa-link" className="ps-1" />
                <span className={`d-inline${link ? " btn btn-link" : ""}`}>קישור</span>
            </div>
        );
    };
    return (
        <div className="my-3">
            <div className="d-flex flex-column align-items-start flex-sm-row mb-3">
                <div className="pe-sm-2 mb-2 mb-sm-0">
                    {link ? (<span><a target="_blank" href="#"><LinkFileHeader /></a></span>) : (<LinkFileHeader />)}
                </div>
                <div className="flex-grow-1">
                    {linkTypes.map((item) => (
                        <div key={item.id} className="form-check form-check-inline ms-1 me-0">
                            <label className="form-check-label" htmlFor={`Radio${item.id}`}>
                                {item.itemIcon && item.itemIcon.type === 'fa' && <FontAwesomeIcon icon={item.itemIcon.cssClass} className="mx-1" />}
                                {item.description}
                            </label>
                            <input type="radio" className="form-check-input" id={`Radio${item.id}`} name="linkType"
                                data-value={item.id} checked={linkType && linkType.id === item.id} onChange={handleChangeLinkType} />
                        </div>
                    ))}
                </div>
            </div>
            {linkType && linkType.isLink && hasLinkText && (
                <DescriptionInput id="linkText" label="תיאור הקישור" value={linkText} onChange={(e) => setLinkText(e.target.value)} />
            )}
            {linkType && linkType.isLink && (
                <DescriptionInput id="link" label="הקישור" value={link} onChange={(e) => setLink(e.target.value)} inputType="url" className="form-control" placeholder="Enter URL" />
            )}
            {linkType && linkType.isFile && (
                <div className="input-group d-flex justify-content-between">
                    <input type="file" id="File1" className="form-control d-none" onChange={handleFileChange} />
                    <label htmlFor="File1" className="form-label-lg flex-fill bg-dark text-white py-1 mx-0">{fileLabel}</label>
                </div>
            )}
        </div>
    );
}


const InfoItemCategoriesComponent = ({ infoItemCategories, onSelectCategory }) => {
    const [isRestricted, setIsRestricted] = useState(false); // Default to לתלמידים

    // Filter categories based on isRestricted state
    const filteredCategories = infoItemCategories.filter(category => category.isRestricted === isRestricted);

    const handleOnIsRestrictedClick = (isRestricted) => {
        setIsRestricted(isRestricted);
        onSelectCategory(null);
    }

    return (
        <div className="w-md-50">
            <div className="d-flex align-items-center">
                <b className="ms-3 me-0">מיועד ל- </b>
                <button className={`btn btn-sm btn-link${!isRestricted ? " bgLightGray" : ""}`} onClick={() => handleOnIsRestrictedClick(false)}>לתלמידים</button>
                <button className={`btn btn-sm btn-link${isRestricted ? " bgLightGray" : ""}`} onClick={() => handleOnIsRestrictedClick(true)}>למורים</button>
            </div>
            <div className="d-flex align-items-center">
                <b className="align-self-baseline mt-1 ms-3 me-0">קטגוריה</b>
                <FilterCategories filterCategories={filteredCategories} onFilterChange={onSelectCategory} />
            </div>
        </div>
    );
};
export default function InfoItemsAdmin() {
    const { id } = useParams();
    const token = getWithExpiry("token");
    const [loading, setLoading] = useState(true);
    const [notAlowed, setNotAlowed] = useState(false);

    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const handleShowMoreOptions = () => { setShowMoreOptions(!showMoreOptions); };

    const [homePageUrl, setHomePageUrl] = useState(null);
    const [pageHeader, setPageHeader] = useState(null);

    const [classes, setClasses] = useState([]);
    const [grades, setGrades] = useState([]);
    const [sections, setSections] = useState([]);

    const [infoItemCategories, setInfoItemCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [infoItems, setInfoItems] = useState([]);

    const today = new Date();

    const initialItemState = {
        infoItemCategory: '',
        name: '',
        text: '',
        linkType: '',
        linkText: '',
        link: '',
        start: toDate(today, "yyyy-MM-dd"),
        end: toDate(addDays(today, 7), "yyyy-MM-dd"),
        priority: '3',
        note: '',
        classes: ''
    };
    const [item, setItem] = useState(initialItemState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const onSelectCategory = (categoryId) => {
        setItem(prevState => ({
            ...prevState,
            infoItemCategory: categoryId
        }));

        //find the infoItemCategory obj from infoItemCategories by id from categoryId
        setSelectedCategory(infoItemCategories.find(category => category.id === categoryId));
        //console.log(infoItemCategories.find(category => category.id === categoryId));
    };

    const onSelectedClassesChange = (curClasses) => {
        setItem(prevState => ({
            ...prevState,
            classes: curClasses // Assuming infoItemCategory is the state property to update
        }));
    };

    const handleSetStartDate = (preset, event) => {
        let newDate = new Date();
        switch (preset) {
            case 'today':

                break;
            case 'tomorrow':
                newDate.setDate(newDate.getDate() + 1);
                break;
            // Add more cases as needed
            default:
                break;
        }

        setItem(prevState => ({
            ...prevState, ['start']: toDate(newDate, "yyyy-MM-dd")
        }));

        // Remove focus from the button
        event.target.blur();
    };

    const handleSetEndDate = (preset, event) => {
        let newDate = new Date(item.start);
        switch (preset) {
            case 'dayAfter':
                newDate.setDate(newDate.getDate() + 1);
                break;
            case 'weekAfter':
                newDate.setDate(newDate.getDate() + 7);
                break;
            case 'monthAfter':
                newDate.setMonth(newDate.getMonth() + 1);
                break;
            case 'lastDayOfStudyYear':
                //sep-dec last day of aug next year, Otherwise, current year
                if (newDate.getMonth() >= 8) {
                    newDate = new Date(newDate.getFullYear() + 1, 7, 31);
                } else {
                    newDate = new Date(newDate.getFullYear(), 7, 31);
                }
                break;
            default:
                break;
        }
        setItem(prevState => ({
            ...prevState, ['end']: toDate(newDate, "yyyy-MM-dd")
        }));

        // Remove focus from the button
        event.target.blur();
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(item);
        // Here, you would typically send the item to your server or handle it as needed
    };

    useEffect(() => {
        if (token) {
            (async () => {
                const additionalHeaders = [{ name: 'token', value: token }];
                const { data: fetchedDataIsAdmin, error } = await fetchData('/api/IsAdminUser', null, null, additionalHeaders);
                if (error && error.message === "Resource not found") setNotAlowed(fetchedDataIsAdmin);

                const { data: fetchedData, errorData } = await fetchData('/api/InfoItems', infoItemsTransformFunction, null, additionalHeaders);
                if (errorData && errorData.message === "Resource not found") setNotAlowed(true);
                else setInfoItems(fetchedData);

                if (!notAlowed) {
                    const isOnlyShowOnInfoItemsPage = false;
                    const { data: fetchedDataCategories } = await fetchData('/api/InfoItemCategories/' + isOnlyShowOnInfoItemsPage, null, null, additionalHeaders);
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

    //console.log(selectedCategory);
    return (
        <div>
            <form onSubmit={handleSubmit} className="container-fluid">
                <InfoItemCategoriesComponent infoItemCategories={infoItemCategories} onSelectCategory={onSelectCategory} />
                {selectedCategory && (<div className="mt-3 w-md-75">
                    {selectedCategory.hasClasses && (<ClassesCheckboxComponent sections={sections} grades={grades} classes={classes} onSelectedClassesChange={onSelectedClassesChange} />)}
                    {selectedCategory.hasName && (<div className="mb-3">
                        <DescriptionInput id="name" label="כותרת/טקסט" isRequiredField={true} value={item.name} onChange={handleChange} />
                    </div>)}
                    {selectedCategory.hasText && (<div className="mb-3">
                        <label htmlFor="text" className="form-label my-auto requiredField">תוכן ההודעה</label>
                        <textarea className="form-control" id="text" name="text" value={item.text} onChange={handleChange} />
                    </div>)}
                    <div className="d-flex align-items-center my-1 ms-md-2">
                        <label className="form-label my-auto requiredField">פרסום</label>
                        <b className="me-3 ms-1 my-auto">התחלה</b>
                        <button className="btn btn-link btn-sm" onClick={(e) => handleSetStartDate('today', e)}>היום</button>
                        <span className="my-auto">|</span>
                        <button className="btn btn-link btn-sm" onClick={(e) => handleSetStartDate('tomorrow', e)}>מחר</button>
                        <input type="date" className="form-control-inline border-0 border-bottom text-center"
                            value={item.start} onChange={handleChange} />

                        <b className="d-flex align-items-center me-3 ms-1">סיום</b>
                        <span className="me-4 ms-1">אחרי:</span>
                        <button type="button" className="btn btn-link btn-sm" onClick={(e) => handleSetEndDate('dayAfter', e)}>יום</button>
                        <span className="my-auto">|</span>
                        <button type="button" className="btn btn-link btn-sm" onClick={(e) => handleSetEndDate('weekAfter', e)}>שבוע</button>
                        <span className="my-auto">|</span>
                        <button type="button" className="btn btn-link btn-sm" onClick={(e) => handleSetEndDate('monthAfter', e)}>חודש</button>
                        <span className="my-auto">|</span>
                        <button type="button" className="btn btn-link btn-sm" onClick={(e) => handleSetEndDate('lastDayOfStudyYear', e)}>סוף שנה</button>
                        <input type="date" id="DateEnd" className="form-control-inline border-0 border-bottom text-center"
                            value={item.end} onChange={handleChange} />
                    </div>
                    <LinkComponent hasLinkText={selectedCategory.hasLinkText} />
                    <div className="my-3">
                        <b>אפשרויות נוספות</b>
                        <FontAwesomeIcon className="my-auto ms-2" icon={showMoreOptions ? "fas fa-circle-chevron-up" : "fas fa-circle-chevron-down"} role="button" onClick={() => handleShowMoreOptions()} />
                    </div>
                    {showMoreOptions && (
                        <div className="">
                            <DescriptionInput id="priority" label="קדימות" value={item.priority} onChange={handleChange} inputType="number" inputMoreCss="w-md-10" moreProps={{
                                min: 1, max: 10
                            }} />

                            {/* <div className="mb-3">
                                <label htmlFor="priority" className="form-label fw-bold">קדימות</label>
                                <input type="number" className="form-control w-md-10" id="priority" name="priority" value={item.priority}
                                    onChange={handleChange} min="1" max="10" />
                            </div> */}
                            <DescriptionInput id="note" label="הערה" value={item.note} onChange={handleChange} />
                            {/* 
                            <div className="mb-3">
                                <label htmlFor="note" className="form-label fw-bold">הערה</label>
                                <input type="text" className="form-control w-md-50" id="note" name="note" value={item.note} onChange={handleChange} />
                            </div> */}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary">הוספה</button>
                    <button type="button" className="btn btn-link" onClick={() => setItem(initialItemState)}>איפוס</button>
                </div>)}
            </form>
        </div>

    )
};
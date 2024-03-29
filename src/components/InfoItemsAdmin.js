import React, { useState, useEffect } from 'react';

import { ClassesCheckboxComponent, LoadingSpinner, NotAllowed, NotAllowedUser, SelectItems } from "./Common"
import { FilterCategories, ItemsList } from './ItemsList';

import { addDays, getWithExpiry, lastDayOfStudyYear, toArchiveText, toDate, whatsappStrToHtmlTags } from '../utils/utilityFunctions';
import { fetchData, getHomePageUrl, getPageHeader } from '../utils/apiServices';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export const DescriptionInput = ({ id, label, value, onChange, inputType = "text", isRequiredField = false, inputMoreCss = "", placeholder = "", moreProps = {} }) => {
    const allProps = {
        id,
        name: id,
        className: `form-control${inputMoreCss ? ' ' + inputMoreCss : ""}`,
        onChange,
        value,
        placeholder,
        ...moreProps
    };
    return (
        <div className="d-flex flex-column align-items-start align-items-sm-center flex-sm-row text-sm-center mb-3">
            <div className="width-twelve-percent text-end pe-sm-2 mb-2 mb-sm-0">
                <label htmlFor={id} className={`fw-bold${isRequiredField ? " requiredField" : ""}`}>{label}</label>
            </div>
            <div className="w-100 w-md-50 flex-grow-1">
                {inputType !== "textarea" ? (
                    <input {...allProps} type={inputType} />
                ) : (
                    <textarea {...allProps} />
                )}
            </div>
        </div>
    );
};

export const DateSelector = ({ label, buttons, startValue, endValue, onChange, isRequiredField = false, isShowStart = true, isShowEnd = true, inputMoreCss = "", moreProps = {} }) => {
    const handleSetDate = (preset, name, event) => {
        let newStartDate = new Date(startValue) || new Date();
        let newEndDate = new Date(startValue) || new Date();

        switch (preset) {
            case 'today': newStartDate = new Date(); break;
            case 'tomorrow': newStartDate.setDate(newStartDate.getDate() + 1); break;

            case 'dayAfter': newEndDate.setDate(newEndDate.getDate() + 1); break;
            case 'weekAfter': newEndDate.setDate(newEndDate.getDate() + 7); break;
            case 'monthAfter': newEndDate.setMonth(newEndDate.getMonth() + 1); break;
            case 'lastDayOfStudyYear': newEndDate = lastDayOfStudyYear(); break;

            default: break;
        }
        onChange(name, toDate(name == "start" ? newStartDate : newEndDate, "yyyy-MM-dd"));

        // Remove focus from the button
        event.target.blur();
    };
    function btnText(btn) {
        switch (btn) {
            case 'today': return "היום";
            case 'tomorrow': return "מחר";
            case 'dayAfter': return "יום";
            case 'weekAfter': return "שבוע";
            case 'monthAfter': return "חודש";
            case 'lastDayOfStudyYear': return "סוף שנה";
            default: return "";
        }
    }
    const btnCss = "btn btn-link btn-sm mb-1";
    const btnsStart = buttons.filter(button => button === "today" || button === "tomorrow");
    const btnsEnd = buttons.filter(button => button === "dayAfter" || button === "weekAfter" || button === "monthAfter");
    return (
        <div className="d-flex flex-column align-items-start align-items-sm-center flex-sm-row text-sm-end mb-3">
            {(label && <div className="width-twelve-percent pe-sm-2 mb-2 mb-sm-0">
                <label className={`fw-bold${isRequiredField ? " requiredField" : ""}`}>{label}</label>
            </div>)}
            {isShowStart && (<div className="w-sm-90">
                <b className="me-1 ms-1 my-auto">התחלה</b>
                {btnsStart.reduce((acc, button, index, array) => {
                    acc.push(<button key={button} className={btnCss} onClick={(e) => handleSetDate(button, "start", e)}>{btnText(button)}</button>);
                    // Add separator if not the last item
                    if (index < btnsStart.length - 1) acc.push(<span key={`sep-${button}`} className="my-auto">|</span>);

                    return acc;
                }, [])}
                <input type="date" name="start" className="form-control-inline border-0 border-bottom text-center"
                    value={startValue} onChange={onChange} />
            </div>)}
            {isShowEnd && (<div className="w-sm-90">
                <b className="me-1 ms-1 me-sm-5 my-auto">סיום</b>
                <span className="me-4 ms-1">אחרי:</span>
                {btnsEnd.reduce((acc, button, index, array) => {
                    acc.push(<button key={button} className={btnCss} onClick={(e) => handleSetDate(button, "start", e)}>{btnText(button)}</button>);
                    // Add separator if not the last item
                    if (index < btnsEnd.length - 1) acc.push(<span key={`sep-${button}`} className="my-auto">|</span>);

                    return acc;
                }, [])}
                <input type="date" name="end" className="form-control-inline border-0 border-bottom text-center" value={endValue} onChange={onChange} />
                {buttons && buttons.includes("lastDayOfStudyYear") && (<button className={btnCss} onClick={(e) => handleSetDate("lastDayOfStudyYear", "end", e)}>סוף שנה</button>)}
            </div>)}
        </div>
    );
};

export function LinkComponent({ defaultLinkType, isMustLink = false, hasLinkText = true }) {
    console.log("defaultLinkType", defaultLinkType);

    const [linkType, setLinkType] = useState(defaultLinkType);
    const [linkText, setLinkText] = useState('לחצו כאן');
    const [link, setLink] = useState('');
    const [fileLabel, setFileLabel] = useState('עיון');

    const [linkTypes, setLinkTypes] = useState([]);

    const handleChangeLinkType = (e) => {
        const selectedLinkType = linkTypes?.find(item => item.id === parseInt(e.target.dataset.value));
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
            const selectedLinkType = defaultLinkType || fetchedDataLinkTypes.find(item => item.id === 1);
            setLinkType(selectedLinkType);


            console.log("isMustLink " + defaultLinkType || linkTypes.find(item => item.isMustLink === isMustLink));
            // const defaultlinkType = ;
            // console.log("defaultlinkType", defaultlinkType);
            // setLinkType(defaultlinkType);

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
                    {link ? (<span><a target="_blank" href={link}><LinkFileHeader /></a></span>) : (<LinkFileHeader />)}
                </div>
                <div className="flex-grow-1">
                    {linkTypes?.map((item) => (
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
                    <label htmlFor="File1" className="form-label-lg flex-fill bg-dark text-white py-1 mx-0">{fileLabel}</label>
                    <input type="file" id="File1" className="form-control d-none" onChange={handleFileChange} />
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
                <b className="ms-3 me-0">מיועד ל - </b>
                <button className={`btn btn-sm btn-link${!isRestricted ? " bgLightGray" : ""}`} onClick={() => handleOnIsRestrictedClick(false)}>לתלמידים</button>
                <button className={`btn btn-sm btn-link${isRestricted ? " bgLightGray" : ""}`} onClick={() => handleOnIsRestrictedClick(true)}>למורים</button>
            </div>
            <div className="d-flex">
                <b className="mt-1 ms-3 me-0">מסוג - </b>
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

    const handleChangeByName = (name, value) => { setItem(prevState => ({ ...prevState, [name]: value })); };
    const handleChange = (e) => { const { name, value } = e.target; handleChangeByName(name, value); };

    const onSelectCategory = (categoryId) => {
        handleChangeByName("infoItemCategory", categoryId);
        setSelectedCategory(infoItemCategories.find(category => category.id === categoryId));
    };

    const onSelectedClassesChange = (curClasses) => { handleChangeByName("classes", curClasses); };


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

                const { data: fetchedData, errorData = null } = await fetchData('/api/InfoItemsAdmin', null, null, additionalHeaders);
                console.log("errorData: " + errorData && true);
                if (errorData && (errorData.message === "Resource not found" || errorData.message === "User Not Allowed")) setNotAlowed(true);
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
    const rows = window.innerWidth < 768 ? 5 : 10;

    if (infoItems) console.log(infoItems);
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
                        <DescriptionInput id="text" label="תוכן ההודעה" isRequiredField={true} value={item.text} onChange={handleChange} inputType="textarea" moreProps={{ rows }} />

                        {/* <label htmlFor="text" className="form-label my-auto requiredField">תוכן ההודעה</label>
                        <textarea className="form-control" id="text" name="text" value={item.text} onChange={handleChange} rows={rows} /> */}
                    </div>)}
                    <div>
                        <DateSelector label={"פרסום"} buttons={["today", "tomorrow", "dayAfter", "weekAfter", "monthAfter", "lastDayOfStudyYear"]} startValue={item.start} endValue={item.end} onChange={handleChangeByName} isRequiredField={true} />
                    </div>
                    <LinkComponent defaultLinkType={item.linkType} isMustLink={selectedCategory.isMustLink} hasLinkText={selectedCategory.hasLinkText} />

                    <div className="my-3">
                        <b>אפשרויות נוספות</b>
                        <FontAwesomeIcon className="my-auto ms-2" icon={showMoreOptions ? "fas fa-circle-chevron-up" : "fas fa-circle-chevron-down"} role="button" onClick={() => handleShowMoreOptions()} />
                    </div>
                    {showMoreOptions && (
                        <div className="">
                            <DescriptionInput id="priority" label="קדימות" value={item.priority} onChange={handleChange} inputType="number" inputMoreCss="w-md-10" moreProps={{ min: 1, max: 10 }} />
                            <DescriptionInput id="note" label="הערה" value={item.note} onChange={handleChange} />
                        </div>
                    )}
                    <button type="button" className="btn btn-link" onClick={() => setItem(initialItemState)}>איפוס</button>
                    <button type="submit" className="btn btn-primary">הוספה</button>
                </div>)}
            </form>
        </div>

    )
};
import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { fetchData } from '../utils/apiServices';
import { cleanText, cssStringToObject, toPageTitle } from '../utils/utilityFunctions';
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


export const SearchBar = ({ onSearch }) => {
    const clearInput = () => {
        const input = document.getElementById("SearchInput");
        if (input) {
            input.value = "";
        }
        onSearch('');
    };
    return (
        <div className="mt-2">
            <div className="input-group mb-2">
                <input
                    id="SearchInput" type="text"
                    className="form-control rounded-0" placeholder="חיפוש.."
                    onChange={(e) => onSearch(e.target.value)}
                />
                <span className="input-group-text rounded-0" onClick={clearInput}>
                    <FontAwesomeIcon icon="fas fa-trash-alt" className="mx-auto" />
                </span>
            </div>
        </div>
    );
};
export const FilterButton = ({ item, isActive, onFilter }) => {
    return (
        <span
            className={`btn btn-${isActive ? 'primary active' : 'secondary'} btn-sm m-1`}
            onClick={() => onFilter(item.id)}
        >
            {item.itemIcon && item.itemIcon.type === 'fa' && <FontAwesomeIcon icon={item.itemIcon.cssClass} className="mx-1" />}
            {item.name}
        </span>
    );
}
export const ItemsList = ({ header, msg, items, toHtml, filterCategories, noItemShow }) => {
    const [searchInput, setSearchInput] = useState('');
    const [activeFilter, setActiveFilter] = useState(null);

    const filteredItems = useMemo(() => {
        const results = items.filter(item => {
            if (!activeFilter) {
                return cleanText(item.textSearch).includes(cleanText(searchInput));
            }
            return cleanText(item.textSearch).includes(cleanText(searchInput)) &&
                item.category === activeFilter;
        });
        return toHtml(results);
    }, [searchInput, activeFilter, items, toHtml]);

    const hasItems = filteredItems.length > 0;
    const showNoItem = items.length === 0 && noItemShow;
    return (
        <div className="py-3 w-md-75 mx-auto">
            <Header header={header} msg={msg} />
            {!showNoItem && <SearchBar onSearch={setSearchInput} />}
            {filterCategories && <FilterCategories filterCategories={filterCategories} onFilterChange={setActiveFilter} />}

            <div id="ListDiv">
                <ul className="list-group rounded-0 border-secondary p-0">
                    {filteredItems.map((item, index) => (
                        <li key={index} className="list-group-item d-flex flex-wrap justify-content-between align-items-center">
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="container">
                {hasItems && <p className="text-center">סה"כ: {filteredItems.length} פריטים בחתך</p>}
                {!hasItems && !showNoItem && <p className="text-center my-3 fw-bold">אין פריטים העונים לחתך</p>}
                {showNoItem && <p className="text-center h3 my-5">
                    <FontAwesomeIcon icon="fas fa-times-circle" className="text-danger me-2" />
                    אין פריטים מתאימים
                </p>}
            </div>
        </div>
    );
};


export function FilterCategories({ filterCategories, onFilterChange, homePageUrl }) {
    const [activeCategoryId, setActiveCategoryId] = useState(null);

    const handleFilter = (categoryId) => {
        if (activeCategoryId === categoryId) {
            // If the category is already active, deactivate it
            setActiveCategoryId(null);
            if (onFilterChange) {
                onFilterChange(null);
            }
        } else {
            setActiveCategoryId(categoryId);
            if (onFilterChange) {
                onFilterChange(categoryId);
            }
        }
    };

    return (
        <div className="d-flex flex-wrap btn-group justify-content-center my-1">
            {filterCategories.map((item, index) => (
                <FilterButton item={item} isActive={activeCategoryId === item.id} onFilter={handleFilter} key={index} />))}
        </div>
    );
}
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

export function SelectItem({ filterBy, preText, items, defaultText, selectedValue, onSelect, moreCss }) {
    return (
        <>
            <b className="my-auto">{preText}</b>
            <select className={`form-select max-w-select ${moreCss ? moreCss : ""}`} value={selectedValue} onChange={e => onSelect(filterBy, Number(e.target.value))}>
                <option value="-1" disabled>{defaultText}</option>
                {items.map(item => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select >
        </>
    );
}

export function IconButton({ show, icon, text, isChose, onClick }) {
    return (
        <span className="my-auto ms-0 me-2 text-primary" role="button" onClick={() => onClick(show)}>
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

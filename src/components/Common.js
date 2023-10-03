import React, { useState, useEffect, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { fetchData } from '../utils/apiServices';
import { cleanText, cssStringToObject, toPageTitle } from '../utils/utilityFunctions';


export const getHomePageUrl = async () => {
    const fetchedData = await fetchData('/api/InstDetails');
    return fetchedData.homePageUrl;
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
            {item.itemIcon.type === 'fa' && <FontAwesomeIcon icon={item.itemIcon.cssClass} className="mx-1" />}
            {item.name}
        </span>
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
        <div className="d-flex flex-wrap btn-group justify-content-center">
            {filterCategories.map((item, index) => (
                <FilterButton item={item} isActive={activeCategoryId === item.id} onFilter={handleFilter} key={index} />))}
        </div>
    );
}

export const ItemsList = ({ header, msg, items, toHtml, filterCategories }) => {
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

    return (
        <div className="py-3 w-md-75 mx-auto">
            <Logo />
            <Header header={header} msg={msg} />
            <SearchBar onSearch={setSearchInput} />
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
                <p className="text-center">סה"כ: <span>{filteredItems.length}</span> פריטים בחתך</p>
            </div>
        </div>
    );
};


export const Logo = () => {
    const [instDetails, setInstDetails] = useState();
    useEffect(() => {
        (async () => {
            const fetchedData = await fetchData('/api/InstDetails');
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

export const Header = ({ header, msg }) => {
    if (header) document.title = toPageTitle(header);
    return (
        <div>
            {header && <h3 className="d-inline">{header}</h3>}
            {msg && <h5 className="d-flex-inline mx-auto">{msg}</h5>}
        </div>
    )
};


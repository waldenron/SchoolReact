import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { cleanText } from '../utils/utilityFunctions';
import { Header } from './Common';


const SearchBar = ({ onSearch }) => {
    const clearInput = () => {
        const input = document.getElementById("SearchInput");
        if (input) input.value = "";
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

const FilterButton = ({ item, isActive, handleOnClick }) => {
    return (
        <span
            className={`btn btn-${isActive ? 'primary active' : 'secondary'} btn-sm m-1`}
            onClick={() => handleOnClick(item.id)}
        >
            {item.itemIcon && item.itemIcon.type === 'fa' && <FontAwesomeIcon icon={item.itemIcon.cssClass} className="mx-1" />}
            {item.name}
        </span>
    );
}

export function FilterSelect({ optionsItems, onFilterChange }) {
    const [activeItem, setActiveItem] = useState(null);

    const handleOnClick = (categoryId) => {
        if (activeItem === categoryId) {
            // If the category is already active, deactivate it
            setActiveItem(null);
            if (onFilterChange) { onFilterChange(null); }
        } else {
            setActiveItem(categoryId);
            if (onFilterChange) { onFilterChange(categoryId); }
        }
    };

    return (
        <div className="d-flex flex-wrap btn-group justify-content-center my-1">
            {optionsItems.map((item, index) => (
                <FilterButton item={item} isActive={activeItem === item.id} handleOnClick={handleOnClick} key={index} />))}
        </div>
    );
}

export function FilterCategories({ filterCategories, onFilterChange }) {
    const [activeCategoryId, setActiveCategoryId] = useState(null);

    const handleOnClick = (categoryId) => {
        if (activeCategoryId === categoryId) {
            // If the category is already active, deactivate it
            setActiveCategoryId(null);
            if (onFilterChange) { onFilterChange(null); }
        } else {
            setActiveCategoryId(categoryId);
            if (onFilterChange) { onFilterChange(categoryId); }
        }
    };

    return (
        <div className="d-flex flex-wrap btn-group justify-content-center my-1">
            {filterCategories.map((item, index) => (
                <FilterButton item={item} isActive={activeCategoryId === item.id} handleOnClick={handleOnClick} key={index} />))}
        </div>
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
import React, { useState, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { cleanText } from '../utils/utilityFunctions';

const url = "https://art-yeshiva.org.il/";
const logo = url + "images/LogoArtYeshiva.gif";


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
                    <FontAwesomeIcon icon={faTrashAlt} className="mx-auto" />
                </span>
            </div>
        </div>
    );
};


export const ItemsList = ({ items, toHtml }) => {
    const [searchInput, setSearchInput] = useState('');

    const filteredItems = useMemo(() => {
        const results = items.filter(item =>
            cleanText(item.textSearch).includes(cleanText(searchInput))
        );
        return toHtml(results);
    }, [searchInput, items]); // include items in the dependency list

    return (
        <>
            <SearchBar onSearch={setSearchInput} />

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
        </>
    );
};


export const Logo = () => {
    return (
        <a href={url} className="text-decoration-none">
            <img src={logo} className="img-fluid d-block mx-auto pt-1" alt="Logo" />
        </a>
    );
};

export const Header = ({ header, msg }) => (
    <div>
        <div className="d-inline"></div>
        <h3 className="d-inline">{header}</h3>
        <h5 className="d-flex-inline mx-auto">{msg}</h5>
    </div>
);




import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { fetchData } from '../utils/apiServices';
import { ItemsList, LoadingSpinner, NotAllowed } from "./Common"

//InstContactInfo
const InstContactInfo = () => {
    const [instContactInfo, setInstContactInfo] = useState();

    useEffect(() => {
        (async () => {
            const { data: fetchedData, error } = await fetchData('/api/InstContactInfo');
            setInstContactInfo(fetchedData);
        })();
    }, []);

    if (!instContactInfo) return null;  // This will prevent rendering until the data is loaded
    return (
        <div className="text-center">
            <h4>
                <span className="text-nowrap">
                    <FontAwesomeIcon icon="fas fa-location-dot" />
                    &nbsp;
                    <a href={instContactInfo.googleMap} target="_blank" rel="noopener noreferrer">
                        {instContactInfo.address}
                    </a>
                </span>
                <span className="mx-1">|</span>
                <span className="text-nowrap">
                    <FontAwesomeIcon icon="fas fa-phone-square" />
                    &nbsp;
                    <a href={`tel:${instContactInfo.phones}`}>
                        {instContactInfo.phones}
                    </a>
                </span>
                <span className="mx-1">|</span>
                <span className="text-nowrap">
                    <FontAwesomeIcon icon="fas fa-envelope" />
                    &nbsp;
                    <a href={`mailto:${instContactInfo.email}`}>
                        {instContactInfo.email}
                    </a>
                </span>
            </h4>
        </div>
    )
};

//Contacts
const contactsTransformFunction = (contact) => ({
    ...contact,
    textSearch: `${contact.jobTitle} ${contact.fullName}`
});
const contactsSortFunction = (a, b) => a.priority - b.priority;
const toHtmlElements = (contacts) => {
    return contacts.map((contact) => (
        <>
            <span>{contact.jobTitle} - {contact.fullName}</span>
            <a href={`mailto:${contact.email}`} target="_blank" rel="noopener noreferrer">{contact.email}</a>
        </>
    ));
};



export default function ContactPage() {
    const [loading, setLoading] = useState(true);
    const [notAlowed, setNotAlowed] = useState(false);

    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        (async () => {
            const { data: fetchedData, error } = await fetchData('/api/Contacts', contactsTransformFunction, contactsSortFunction);
            if (error && error.message === "Resource not found") setNotAlowed(true);
            else setContacts(fetchedData);
        })();

        setLoading(false);
    }, []);

    const msg = <InstContactInfo />;
    const header = "יצירת קשר";

    if (loading) { return <LoadingSpinner />; }
    if (notAlowed) { return <NotAllowed />; }
    return (
        <ItemsList header={header} msg={msg} items={contacts} toHtml={toHtmlElements} />
    )
};

export function InstContactInfoFooter() {
    const [instDetails, setInstDetails] = useState();
    const [instContactInfo, setInstContactInfo] = useState();

    useEffect(() => {
        (async () => {
            const { data: fetchedDataDetails } = await fetchData('/api/InstDetails');
            setInstDetails(fetchedDataDetails);

            const { data: fetchedData, error } = await fetchData('/api/InstContactInfo');
            setInstContactInfo(fetchedData);
        })();
    }, []);

    if (!instContactInfo) return null;
    return (
        <div className="text-center pb-3">
            <hr className="hrFooter mb-2" />
            <p className="h3">{instDetails.description}</p>
            <h6>
                <span className="text-nowrap">
                    <FontAwesomeIcon icon="fas fa-location-dot" />&nbsp;
                    <a href={instContactInfo.googleMap} target="_blank" rel="noopener noreferrer">{instContactInfo.address}</a>
                </span>
                <span className="mx-1">|</span>
                <span className="text-nowrap">
                    <FontAwesomeIcon icon="fas fa-phone-square" />&nbsp;
                    <a href={`tel:${instContactInfo.phones}`}>{instContactInfo.phones}</a>
                </span>
                <span className="mx-1">|</span>
                <span className="text-nowrap">
                    <FontAwesomeIcon icon="fas fa-envelope" />&nbsp;
                    <a href={`mailto:${instContactInfo.email}`}>{instContactInfo.email}</a>
                </span>
            </h6>
        </div>
    )
};
import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { fetchData, getPageHeader } from '../utils/apiServices';
import { LoadingSpinner, NotAllowed } from "./Common"
import { ItemsList } from './ItemsList';

export function InstContactInfoFooter({ instDetails }) {

    return (
        <div className="text-center pb-3 no-print">
            <hr className="hrFooter mb-2" />
            <p className="h3">{instDetails.description}</p>
            <h6>
                <span className="text-nowrap">
                    <FontAwesomeIcon icon="fas fa-location-dot" />&nbsp;
                    <a href={instDetails.googleMap} target="_blank" rel="noopener noreferrer">{instDetails.address}</a>
                </span>
                <span className="mx-1">|</span>
                <span className="text-nowrap">
                    <FontAwesomeIcon icon="fas fa-phone-square" />&nbsp;
                    <a href={`tel:${instDetails.phones}`}>{instDetails.phones}</a>
                </span>
                <span className="mx-1">|</span>
                <span className="text-nowrap">
                    <FontAwesomeIcon icon="fas fa-envelope" />&nbsp;
                    <a href={`mailto:${instDetails.email}`}>{instDetails.email}</a>
                </span>
            </h6>
        </div>
    )
};

//InstContactInfo
const InstContactInfo = ({ instDetails }) => {

    return (
        <div className="text-center">
            <h4>
                <span className="text-nowrap">
                    <FontAwesomeIcon icon="fas fa-location-dot" />
                    &nbsp;
                    <a href={instDetails.googleMap} target="_blank" rel="noopener noreferrer">
                        {instDetails.address}
                    </a>
                </span>
                <span className="mx-1">|</span>
                <span className="text-nowrap">
                    <FontAwesomeIcon icon="fas fa-phone-square" />
                    &nbsp;
                    <a href={`tel:${instDetails.phones}`}>
                        {instDetails.phones}
                    </a>
                </span>
                <span className="mx-1">|</span>
                <span className="text-nowrap">
                    <FontAwesomeIcon icon="fas fa-envelope" />
                    &nbsp;
                    <a href={`mailto:${instDetails.email}`}>
                        {instDetails.email}
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



export default function ContactPage({ instDetails }) {
    const [loading, setLoading] = useState(true);
    const [notAlowed, setNotAlowed] = useState(false);

    const [pageHeader, setPageHeader] = useState(null);

    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        (async () => {
            const { data: fetchedData, error } = await fetchData('/api/Contacts', contactsTransformFunction, contactsSortFunction);
            if (error && error.message === "Resource not found") setNotAlowed(true);
            else setContacts(fetchedData);

            const fetchedPageHeader = await getPageHeader({ pageName: "Contacts" });
            setPageHeader(fetchedPageHeader);

            setLoading(false);
        })();
    }, []);

    const msg = <InstContactInfo instDetails={instDetails} />;
    const header = pageHeader;

    if (loading) { return <LoadingSpinner />; }
    if (notAlowed) { return <NotAllowed />; }
    return (
        <ItemsList header={header} msg={msg} items={contacts} toHtml={toHtmlElements} />
    )
};


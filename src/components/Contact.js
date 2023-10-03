import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { fetchData } from '../utils/apiServices';

import { ItemsList, Logo, Header } from "./Common"

//InstContactInfo
const InstContactInfo = () => {
    const [instContactInfo, setInstContactInfo] = useState();

    useEffect(() => {
        (async () => {
            const fetchedData = await fetchData('/api/InstContactInfo');
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



const ContactPage = () => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        (async () => {
            const fetchedData = await fetchData('/api/Contacts', contactsTransformFunction, contactsSortFunction);
            setContacts(fetchedData);
        })();
    }, []);

    const msg = <InstContactInfo />;
    const header = "יצירת קשר";
    return (
        <ItemsList header={header} msg={msg} items={contacts} toHtml={toHtmlElements} />
    )
};

export default ContactPage;
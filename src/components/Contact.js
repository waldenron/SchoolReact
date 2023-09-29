import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ItemsList, Logo, Header } from "./Common"

const instCode = "1";

//InstContactInfo
const fetchInstContactInfo = async () => {
    const API_URL = '/api/InstContactInfo';
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'InstCode': instCode
        }
    });
    const data = await response.json();
    return data;
};
const InstContactInfo = () => {
    const [instContactInfo, setInstContactInfo] = useState();
 
    useEffect(() => {
        (async () => {
            const fetchedData = await fetchInstContactInfo();
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
const fetchContacts = async () => {
    const API_URL = '/api/Contacts';
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'InstCode': instCode
        }
    });
    const data = await response.json();
    return data.map(contact => ({
        ...contact,
        textSearch: `${contact.jobTitle} ${contact.fullName}`
    })).sort((a, b) => a.priority - b.priority);
};
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
            const fetchedData = await fetchContacts();
            setContacts(fetchedData);
        })();
    }, []);

    return (
        <div className="py-3 w-md-75 mx-auto">
            <Logo />
            <Header
                header="יצירת קשר"
                msg={<InstContactInfo/>}
            />
            <ItemsList items={contacts} toHtml={toHtmlElements} />
        </div>
    )
};

export default ContactPage;
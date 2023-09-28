import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ItemsList, Logo, Header } from "./Common"

const instCode = "1";


const instContactInfo = [
    {
        icon: "fas fa-location-dot",
        text: "שדרות רוטשילד 124, תל אביב 6527124",
        link: "https://goo.gl/maps/xFn7x3kdSctzHLJW8",
    },
    {
        icon: "fas fa-phone-square",
        text: "073-3845000",
        link: "tel:073-3845000",
    },
    {
        icon: "fas fa-envelope",
        text: "yesh@art-yeshiva.org.il",
        link: "mailto:yesh@art-yeshiva.org.il",
    }
];
// const contacts = [
//     {
//         jobTitle: "ראש הישיבה",
//         email: "perel@art-yeshiva.org.il",
//         priority: 10,
//         fullName: "הרב בני פרל",
//         textSearch: "ראש הישיבה הרב בני פרל"
//     },
//     {
//         jobTitle: "מנהל התיכון",
//         email: "rabinak@art-yeshiva.org.il",
//         priority: 20,
//         fullName: "הרב איתמר רבינק",
//         textSearch: "מנהל התיכון הרב איתמר רבינק"
//     },
//     {
//         jobTitle: "מנהל חטיבת הביניים ור\"מ ז´-2",
//         email: "lev@art-yeshiva.org.il",
//         priority: 30,
//         fullName: "הרב ישי לב",
//         textSearch: "מנהל חטיבת הביניים ור\"מ ז´-2 הרב ישי לב"
//     },
//     {
//         jobTitle: "מנהלנית אדמיניסטרטיבית",
//         email: "yfat@art-yeshiva.org.il",
//         priority: 40,
//         fullName: "יפעת כץ-אלוני",
//         textSearch: "מנהלנית אדמיניסטרטיבית יפעת כץ-אלוני"
//     },
//     {
//         jobTitle: "יועצת חינוכית - חט\"ב",
//         email: "shayo@art-yeshiva.org.il",
//         priority: 50,
//         fullName: "שעיו בוקובזה מיטל",
//         textSearch: "יועצת חינוכית - חט\"ב שעיו בוקובזה מיטל"
//     },
//     {
//        jobTitle: "יועץ חינוכי - חט\"ע",
//         email: "dolev@art-yeshiva.org.il",
//         priority: 60,
//         fullName: "רועי דולב",
//         textSearch: "יועץ חינוכי - חט\"ע רועי דולב"
//     }

//     // ... Rest of the contacts follow the same structure
// ];

const toHtmlInstContactInfo = () => (
    <div id="PageHeaderMsg" className="d-flex-inline mx-auto">
        <div className="text-center">
            <h4>
                {instContactInfo.map((component, index) => (
                    <span key={index} className="text-nowrap">
                        <FontAwesomeIcon icon={component.icon} />
                        &nbsp;
                        <a href={component.link} target="_blank" rel="noopener noreferrer">
                            {component.text}
                        </a>
                        {index !== instContactInfo.length - 1 && <span className="mx-1">|</span>}
                    </span>
                ))}
            </h4>
        </div>
    </div>
);

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
        const url = '/api/Contacts';
        //const url = 'https://api.f2a.info/api/Contacts';
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'InstCode': instCode   // Set your custom header here
            }
        }).then(response => response.json())
            .then(data => {
                const updatedData = data.map(contact => ({
                    ...contact,
                    textSearch: `${contact.jobTitle} ${contact.fullName}`
                }));
                updatedData.sort((a, b) => a.fullName - b.fullName);
                setContacts(updatedData);
            });
    }, []);

    return (
        <div className="py-3 w-md-75 mx-auto">
            <Logo />
            <Header
                header="יצירת קשר"
                msg={toHtmlInstContactInfo()}
            />
            <ItemsList items={contacts} toHtml={toHtmlElements} />
        </div>
    )
};

export default ContactPage;
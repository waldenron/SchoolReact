import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ItemsList, Logo, Header } from "./Common"


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
const contacts = [
    {
        id: 6,
        note: "",
        lastUpdate: "2022-10-09",
        firstName: "בני",
        lastName: "פרל",
        title: "הרב",
        jobTitle: "ראש הישיבה",
        email: "perel@art-yeshiva.org.il",
        priority: 10,
        fullName: "הרב בני פרל",
        textSearch: "ראש הישיבה הרב בני פרל"
    },
    {
        id: 7,
        note: "",
        lastUpdate: "2023-08-18",
        firstName: "איתמר",
        lastName: "רבינק",
        title: "הרב",
        jobTitle: "מנהל התיכון",
        email: "rabinak@art-yeshiva.org.il",
        priority: 20,
        fullName: "הרב איתמר רבינק",
        textSearch: "מנהל התיכון הרב איתמר רבינק"
    },
    {
        id: 9,
        note: "",
        lastUpdate: "2023-08-18",
        firstName: "ישי",
        lastName: "לב",
        title: "הרב",
        jobTitle: "מנהל חטיבת הביניים ור\"מ ז´-2",
        email: "lev@art-yeshiva.org.il",
        priority: 30,
        fullName: "הרב ישי לב",
        textSearch: "מנהל חטיבת הביניים ור\"מ ז´-2 הרב ישי לב"
    },
    {
        id: 8,
        note: "",
        lastUpdate: "2021-08-11",
        firstName: "יפעת",
        lastName: "כץ-אלוני",
        title: "",
        jobTitle: "מנהלנית אדמיניסטרטיבית",
        email: "yfat@art-yeshiva.org.il",
        priority: 40,
        fullName: "יפעת כץ-אלוני",
        textSearch: "מנהלנית אדמיניסטרטיבית יפעת כץ-אלוני"
    },
    {
        id: 11,
        note: "",
        lastUpdate: "2023-08-18",
        firstName: "שעיו בוקובזה",
        lastName: "מיטל",
        title: "",
        jobTitle: "יועצת חינוכית - חט\"ב",
        email: "shayo@art-yeshiva.org.il",
        priority: 50,
        fullName: "שעיו בוקובזה מיטל",
        textSearch: "יועצת חינוכית - חט\"ב שעיו בוקובזה מיטל"
    },
    {
        id: 10,
        note: "",
        lastUpdate: "2021-08-11",
        firstName: "רועי",
        lastName: "דולב",
        title: "",
        jobTitle: "יועץ חינוכי - חט\"ע",
        email: "dolev@art-yeshiva.org.il",
        priority: 60,
        fullName: "רועי דולב",
        textSearch: "יועץ חינוכי - חט\"ע רועי דולב"
    }

    // ... Rest of the contacts follow the same structure
];

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
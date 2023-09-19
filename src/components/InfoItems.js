import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ItemsList, Logo, Header } from "./Common"
import '../css/StyleSheet.css';
import '../css/StyleSheet_AY.css';

const url = "https://art-yeshiva.org.il/";

const infoLinks = [
    {
        icon: 'fas fa-calendar-alt',
        text: 'יומנים',
        href: '/Calendars.aspx',
        tooltip: 'יומני גוגל לשכבות',
    },
    {
        icon: 'fas fa-school',
        text: 'מערכת',
        href: 'Schedule.aspx',
        tooltip: 'מערכת השעות',
    },
    {
        icon: 'image',
        imgSrc: '/images/mashuv.jpg',
        text: 'משוב',
        href: 'https://web.mashov.info/students/login',
        tooltip: 'מערכת משוב לתלמידים ולהורים',
    },
];

const infoItemsToJSX = infoLinks.map((link, index) => (
    <a key={index}
        className="text-decoration-none px-md-3 px-2 text-dark text-decoration-none text-center"
        href={link.href}
        data-bs-toggle="tooltip"
        title={link.tooltip}
        target={link.href.startsWith('http') ? "_blank" : "_self"}
        rel="noopener noreferrer"
    >
        <h5 className="d-inline">
            {link.icon === 'image'
                ? <img src={url + link.imgSrc} alt={link.text} />
                : <FontAwesomeIcon icon={link.icon} />

            }
            &nbsp;<span className="text-decoration-underline">{link.text}</span>
        </h5>
    </a>
));

const infoItems = [
    {
        id: 270,
        name: "מידעון תשפ\"ד",
        note: "",
        lastUpdate: "2023-08-18",
        textShort: "",
        infoItemCategory: 3,
        classes: [701, 702, 703, 801, 802, 803, 901, 902, 1001, 1002, 1101, 1102, 1201, 1202],
        classesDescription: "",
        lastUpdateText: "(עודכן 18/08 10:34)",
        linkText: "",
        link: "מידעון_תשפד.pdf",
        fullLink: "../../Doc/InfoItem/מידעון_תשפד.pdf",
        textSearch: "מידעון תשפ\"ד ז´ - 1, ז´ - 2, ז´ - 3, ח´ - 1, ח´ - 2, ח´ - 3, ט´ - 1, ט´ - 2, י´ - 1, י´ - 2, י\"א - 1, י\"א - 2, י\"ב - 1, י\"ב - 2  חוזרים"
    },
    {
        id: 268,
        name: "רשימת ספרי לימוד תשפ\"ד",
        note: "",
        lastUpdate: "2023-08-18",
        textShort: "",
        infoItemCategory: 3,
        classes: [701, 702, 703, 801, 802, 803, 901, 902, 1001, 1002, 1101, 1102, 1201, 1202],
        classesDescription: "",
        lastUpdateText: "(עודכן 18/08 10:34)",
        linkText: "",
        link: "https://docs.google.com/spreadsheets/d/1L2P0iOUOLdiBtMMe-RGbatAEEDzjcvxvHqDXcydbHoM/edit?usp=sharing",
        fullLink: "https://docs.google.com/spreadsheets/d/1L2P0iOUOLdiBtMMe-RGbatAEEDzjcvxvHqDXcydbHoM/edit?usp=sharing",
        textSearch: "רשימת ספרי לימוד תשפ\"ד ז´ - 1, ז´ - 2, ז´ - 3, ח´ - 1, ח´ - 2, ח´ - 3, ט´ - 1, ט´ - 2, י´ - 1, י´ - 2, י\"א - 1, י\"א - 2, י\"ב - 1, י\"ב - 2  חוזרים"
    },
    {
        id: 307,
        name: "ערב התעוררות חט\"ב",
        note: "",
        lastUpdate: "2023-09-14",
        textShort: "",
        infoItemCategory: 3,
        classes: [701, 702, 703, 801, 802, 803, 901, 902],
        classesDescription: "חט\"ב",
        lastUpdateText: "(עודכן 14/09 14:04)",
        linkText: "",
        link: "ערב_התעוררות_חטיבת_ביניים.pdf",
        fullLink: "../../Doc/InfoItem/ערב_התעוררות_חטיבת_ביניים.pdf",
        textSearch: "ערב התעוררות חט\"ב ז´ - 1, ז´ - 2, ז´ - 3, ח´ - 1, ח´ - 2, ח´ - 3, ט´ - 1, ט´ - 2  חוזרים"
    },
    {
        id: 269,
        name: "עבודות קיץ תשפ\"ג",
        note: "",
        lastUpdate: "2023-08-27",
        textShort: "ראו כאן את הנושאים אותם עליכם ללמוד במהלך החופשה.\nבתחילת שנת הלמודים יתקיימו בע\"ה מבחנים על עבודות הקיץ.\nב\"הצלחה´.",
        infoItemCategory: 1,
        classes: [701, 702, 703, 801, 802, 803, 901, 902, 1001, 1002, 1101, 1102, 1201, 1202],
        classesDescription: "",
        lastUpdateText: "(עודכן 27/08 21:18)",
        linkText: "לחצו כאן",
        link: "https://drive.google.com/drive/folders/1JP6l7OerAqK3LI-EBvgF52KBm-tCj8SN?usp=drive_link",
        fullLink: "https://drive.google.com/drive/folders/1JP6l7OerAqK3LI-EBvgF52KBm-tCj8SN?usp=drive_link",
        textSearch: "עבודות קיץ תשפ\"ג ז´ - 1, ז´ - 2, ז´ - 3, ח´ - 1, ח´ - 2, ח´ - 3, ט´ - 1, ט´ - 2, י´ - 1, י´ - 2, י\"א - 1, י\"א - 2, י\"ב - 1, י\"ב - 2 ראו כאן את הנושאים אותם עליכם ללמוד במהלך החופשה.\nבתחילת שנת הלמודים יתקיימו בע\"ה מבחנים על עבודות הקיץ.\nב\"הצלחה´. הודעות"
    },
    {
        id: 267,
        name: "מצגת - מגמת הנדסת תכנה",
        note: "",
        lastUpdate: "2023-08-18",
        textShort: "",
        infoItemCategory: 12,
        classes: [1001, 1002],
        classesDescription: "שכבה י´",
        lastUpdateText: "(עודכן 18/08 10:33)",
        linkText: "",
        link: "https://drive.google.com/file/d/1UVi2P0bX8zb4dEoRsZe1MCa05WeBEhQ7/view?usp=share_link",
        fullLink: "https://drive.google.com/file/d/1UVi2P0bX8zb4dEoRsZe1MCa05WeBEhQ7/view?usp=share_link",
        textSearch: "מצגת - מגמת הנדסת תכנה י´ - 1, י´ - 2  קישורים קבועים"
    },
];

const toHtmlElements = (data) => {
    return data.map((item) => (
        <>
            <a href={item.fullLink} target="_blank">
                {item.name}
            </a>
        </>
    ));
};

const InfoItemsPage = () => {
    const msg = (
        <div className="d-flex flex-wrap btn-group">
            {infoItemsToJSX}
        </div>
    );
    return (
        <div className="py-3 w-md-75 mx-auto">
            <Logo />
            <Header
                header="מידע לתלמידים"
                msg={msg}
            />
            <ItemsList items={infoItems} toHtml={toHtmlElements} />
        </div>
    )
};

export default InfoItemsPage;

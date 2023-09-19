import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/StyleSheet.css';
import '../css/StyleSheet_AY.css';


const data = [
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


export default function InfoItems() {
    return (
        <div id="ListDiv" className="">
            <ul className="list-group rounded-0 border-secondary">
                {data.map((item, index) => (
                    <li
                        key={index}
                        className="list-group-item d-flex flex-wrap justify-content-between align-items-center"
                        
                        data-id={item.id}
                        data-name={item.name}
                        data-note={item.note}
                        data-lastupdate={item.lastUpdate}
                        data-textshort={item.textShort}
                        data-infoitemcategory={item.infoItemCategory}
                        data-classes={item.classes.join(",")}
                        data-classesdescription={item.classesDescription}
                        data-lastupdatetext={item.lastUpdateText}
                        data-linktext={item.linkText}
                        data-link={item.link}
                        data-fulllink={item.fullLink}
                        data-textsearch={item.textSearch}
                    >
                        <a href={item.fullLink} target="_blank">
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

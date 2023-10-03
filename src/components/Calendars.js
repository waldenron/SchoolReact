import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css';


import { fetchData } from '../utils/apiServices';
import { FilterCategories, Header, Logo } from './Common';


export default function Calendar() {
    const { id } = useParams();

    const [calendarItems, setCalendarItems] = useState([]);
    const [activeCalendar, setActiveCalendar] = useState(null);

    useEffect(() => {
        (async () => {
            const fetchedData = await fetchData('/api/Calendars');
            setCalendarItems(fetchedData);
        })();
    }, []);

    const iframeSrc = useMemo(() => {
        if (activeCalendar) {
            const matchedCalendar = calendarItems.find(item => item.id === activeCalendar);
            return matchedCalendar?.src || "";
        }
        return "";
    }, [activeCalendar, calendarItems]);

    return (
        <div className="py-3 w-md-75 mx-auto">
            <Logo />
            <Header header="יומנים" />
            {calendarItems.length > 0 && <FilterCategories filterCategories={calendarItems} onFilterChange={setActiveCalendar} />}
            <iframe src={iframeSrc} style={{ height: '768px' }} className="container-flow border-0 w-100 mx-auto text-center" />
        </div>
    );
}
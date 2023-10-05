import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom'

import { fetchData } from '../utils/apiServices';
import { FilterCategories, Header, LoadingSpinner, NotAllowed } from './Common';


export default function Calendar() {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [notAlowed, setNotAlowed] = useState(false);

    const [calendarItems, setCalendarItems] = useState([]);
    const [activeCalendar, setActiveCalendar] = useState(null);

    useEffect(() => {
        (async () => {
            const { data: fetchedData, error } = await fetchData('/api/Calendars');
            if (error.message === "Resource not found") setNotAlowed(true);
            else setCalendarItems(fetchedData);
        })();

        setLoading(false);
    }, []);

    const iframeSrc = useMemo(() => {
        if (activeCalendar) {
            const matchedCalendar = calendarItems.find(item => item.id === activeCalendar);
            return matchedCalendar?.src || "";
        }
        return "";
    }, [activeCalendar, calendarItems]);

    if (loading) { return <LoadingSpinner />; }
    if (notAlowed) { return <NotAllowed />; }
    return (
        <div className="py-3 w-md-75 mx-auto">
            <Header header="יומנים" />
            {calendarItems.length > 0 && <FilterCategories filterCategories={calendarItems} onFilterChange={setActiveCalendar} />}
            <iframe src={iframeSrc} style={{ height: '768px' }} className="container-flow border-0 w-100 mx-auto text-center" />
        </div>
    );
}
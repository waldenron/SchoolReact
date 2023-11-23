import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom'

import { fetchData } from '../utils/apiServices';
import { Header, LoadingSpinner, NotAllowed } from './Common';
import { FilterCategories } from './ItemsList';
import { getWithExpiry } from '../utils/utilityFunctions';


export default function Calendar() {
    const { id } = useParams();
    const token = getWithExpiry("token");

    const [loading, setLoading] = useState(true);
    const [notAlowed, setNotAlowed] = useState(false);

    const [calendarItems, setCalendarItems] = useState([]);
    const [activeCalendar, setActiveCalendar] = useState(null);

    useEffect(() => {
        (async () => {
            const additionalHeaders = token ? [{ name: 'token', value: token }] : [];

            const { data: fetchedData, error } = await fetchData('/api/Calendars', null, null, additionalHeaders);
            if (error && error.message === "Resource not found") setNotAlowed(true);
            else setCalendarItems(fetchedData);

            setLoading(false);
        })();
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
    //delete calendarItems color if not token
    if (!token) { calendarItems.forEach(item => { item.color = null; }); }
    return (
        <div className="py-3 w-md-75 mx-auto">
            <Header header="יומנים" />
            {calendarItems.length > 0 && <FilterCategories filterCategories={calendarItems} onFilterChange={setActiveCalendar} />}
            <iframe src={iframeSrc} style={{ height: '768px' }} className="container-flow border-0 w-100 mx-auto text-center" />
        </div>
    );
}
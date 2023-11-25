import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { fetchData } from '../utils/apiServices';
import { Header, LoadingSpinner, MobileRotateAdvice, NotAllowed, ToLink } from './Common';
import { FilterCategories } from './ItemsList';
import { getWithExpiry, toDate } from '../utils/utilityFunctions';
import { getHebrewDay, getHebrewGregorianMonth, getHebrewJewishMonth, getHebrewJewishYear, getHebrewMonthsForRange } from '../utils/jewishDates';


import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/he'; // Import Hebrew locale
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/RbcCalendar.css';


const CalendarButton = ({ item, isActive, handleOnClick }) => {
    const buttonStyle = item.color ? { backgroundColor: item.color.includes('#') ? item.color : `#${item.color}` } : {};
    return (
        <div className={`d-flex justify-content-between btn btn-${isActive ? 'primary active' : 'secondary'} btn-sm m-1`} style={buttonStyle}>
            <span onClick={() => handleOnClick(item.id)} className="flex-grow-1 text-end">{item.name}</span>
            {item.registerLink && <ToLink to={item.registerLink} ><FontAwesomeIcon icon="fa-solid fa-plus fa-xs" className="ms-1 text-white" title="רישום ליומן" /></ToLink>}
        </div>
    );
};

export function CalendarButtons({ calendarItems, onClick }) {
    const [activeCalendarId, setActiveCalendarId] = useState(null);

    const handleOnClick = (calendarId) => {
        setActiveCalendarId(calendarId);
        onClick(calendarId);
    };

    return (
        <div className="d-flex flex-wrap btn-group justify-content-center my-1">
            {calendarItems.map((item, index) => (
                <CalendarButton item={item} isActive={activeCalendarId === item.id} handleOnClick={handleOnClick} key={index} />))}
        </div>
    );
}

const CustomToolbar = ({ label, onNavigate, onView }) => {
    const dateParts = label.split(' ');
    const year = dateParts[1];
    const monthName = dateParts[0];
    const month = getHebrewGregorianMonth(monthName);

    const combinedLabel = `${label} / ${getHebrewMonthsForRange(month, year)}`;
    return (
        <div className="rbc-toolbar">
            <span className="rbc-btn-group">
                <button type="button" onClick={() => onNavigate('PREV')}>
                    <FontAwesomeIcon icon="fa-arrow-right" /> הקודם
                </button>
                <button type="button" onClick={() => onNavigate('TODAY')}>
                    <FontAwesomeIcon icon="fa-calendar-day" /> היום
                </button>
                <button type="button" onClick={() => onNavigate('NEXT')}>
                    הבא <FontAwesomeIcon icon="fa-arrow-left" />
                </button>
            </span>
            <span className="rbc-toolbar-label h3 text-end">{combinedLabel}</span>
            <span className="rbc-btn-group">
                <span className="h6">תצוגה: </span>
                <button type="button" onClick={() => onView('month')}>חודש</button>
                <button type="button" onClick={() => onView('week')}>שבוע</button>
                <button type="button" onClick={() => onView('day')}>יום</button>
                <button type="button" onClick={() => onView('agenda')}>לוח זמנים</button>
            </span>
        </div>
    );
};


const CustomDateCell = ({ date }) => {

    const formattedHebrewDate = `${getHebrewDay(date)} ${getHebrewJewishMonth(date)}`;
    return (
        <div className="d-flex justify-content-between bgDate">
            <div className="ms-1">{toDate(date, "dd/MM")}</div> {/* Gregorian Date */}
            <div className="me-1">{formattedHebrewDate}</div> {/* Hebrew Date */}
        </div>
    );
};

const CustomEvent = ({ event }) => {
    let tooltip = `${event.title}`;
    if (event.desc) tooltip += ` - ${event.desc}`;
    return (
        <div data-bs-toggle="tooltip" title={tooltip}>
            <div className="d-flex justify-content-between">
                <strong>{event.title}</strong>
                {event.attachments &&
                    <div>
                        {event.attachments.map((attachment) => (<ToLink to={attachment.link}> <FontAwesomeIcon icon="fa-paperclip" className="text-white ms-1" /></ToLink>))}
                    </div>
                }
            </div>
            {event.desc && <div><small>{event.desc}</small></div>}
        </div>
    );
};


const messages = {
    allDay: 'כל היום', previous: 'הקודם', next: 'הבא', today: 'היום', month: 'חודש', week: 'שבוע', day: 'יום',
    agenda: 'סדר יום', date: 'תאריך', time: 'זמן', event: 'אירוע',    // Any other translations...
};
function transformEventsToCalendarFormat(events) {
    return events.map(event => {
        const startDateTime = event.allDayEvent ? new Date(event.date) : new Date(`${event.date}T${event.time}`);
        const endDateTime = new Date(startDateTime.getTime());
        endDateTime.setHours(endDateTime.getHours() + 1); // Assuming the event duration is 1 hour

        return {
            title: event.subject,
            start: startDateTime,
            end: endDateTime,
            allDay: event.allDayEvent,
            desc: event.description,
            attachments: event.attachments,
        };
    });
}

export const CustomBigCalendar = ({ events }) => {
    const minTime = new Date();
    minTime.setHours(8, 0, 0, 0); // Set to 08:00 AM
    moment.locale('he'); // Set moment to use the Hebrew locale
    const localizer = momentLocalizer(moment);
    const calendarEvents = events && transformEventsToCalendarFormat(events);
    //const calendarEvents = events && events.length > 0 && transformEventsToCalendarFormat(events);
    return (
        <>
            {calendarEvents && <BigCalendar
                localizer={localizer}
                events={calendarEvents}
                messages={messages}
                startAccessor="start"
                endAccessor="end"
                min={minTime} // Set the minimum time
                style={{ height: 500 }}
                components={{
                    toolbar: CustomToolbar,
                    dateCellWrapper: ({ children, value }) => {
                        // Extract the button from children (assuming it's always the first child)
                        const newChildren = React.cloneElement(children, {
                            ...children.props,
                            children: <CustomDateCell date={value} />
                        });
                        return <>{newChildren}</>
                    },
                    event: CustomEvent  // Use the custom event component

                }
                }
            />}
        </>

    );
};

export const MyCalendar = () => {
    const token = getWithExpiry("token");

    const [loading, setLoading] = useState(true);
    const [notAlowed, setNotAlowed] = useState(false);

    const [calendarItems, setCalendarItems] = useState([]);
    const [activeCalendar, setActiveCalendar] = useState(null);

    const [events, setEvents] = useState([]);

    useEffect(() => {
        (async () => {
            const additionalHeaders = token ? [{ name: 'token', value: token }] : [];

            const { data: fetchedData, error } = await fetchData('/api/Calendars', null, null, additionalHeaders);
            if (error && error.message === "Resource not found") setNotAlowed(true);
            else setCalendarItems(fetchedData);

            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (!activeCalendar || !calendarItems || calendarItems.length === 0) return;
        (async () => {
            //setLoading(true);
            const calendarId = calendarItems.find(item => item.id === activeCalendar).link;
            const additionalHeaders = [{ name: 'calendarId', value: calendarId }];
            const { data: fetchedData, error } = await fetchData('/api/Events', null, null, additionalHeaders);
            if (error && error.message === "Resource not found") setNotAlowed(true);
            else setEvents(fetchedData);

            setLoading(false);
        })();
    }, [calendarItems, activeCalendar]);

    if (loading) { return <LoadingSpinner />; }
    if (notAlowed) { return <NotAllowed />; }
    //delete calendarItems color if not token
    if (!token && calendarItems) { calendarItems.forEach(item => { item.color = null; }); }
    return (
        <div className="py-3 w-lg-90 mx-auto">
            <MobileRotateAdvice />
            <Header header="יומנים" />
            {calendarItems.length > 0 && <CalendarButtons calendarItems={calendarItems} onClick={setActiveCalendar} />}
            <br />
            {(activeCalendar && calendarItems && calendarItems.length > 0) && events && <CustomBigCalendar events={events} />}
        </div>
    );
};


export default function Calendar() {
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
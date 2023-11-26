import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { fetchData } from '../utils/apiServices';
import { Header, LoadingSpinner, MobileRotateAdvice, NotAllowed, ToLink } from './Common';
import { FilterCategories } from './ItemsList';
import { getWithExpiry, toDate } from '../utils/utilityFunctions';
import { getHebrewDay, getHebrewGregorianMonth, getHebrewJewishMonth, getHebrewJewishYear, getHebrewLongDayName, getHebrewMonthsForRange } from '../utils/jewishDates';


import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/he'; // Import Hebrew locale
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/RbcCalendar.css';


const CustomDayLabel = ({ label }) => { return (<>{getHebrewLongDayName(label)}</>); };

const CalendarButton = ({ item, isActive, handleOnClick }) => {
    const isSmallScreen = window.innerWidth < 900;
    const text = isSmallScreen ? item.name.replace("יומן ", "") : item.name;
    const buttonStyle = item.color ? { backgroundColor: item.color.includes('#') ? item.color : `#${item.color}` } : {};
    return (
        <div className={`d-flex justify-content-between btn btn-sm btn-${isActive ? 'primary active' : 'secondary'} m-1`} style={buttonStyle}>
            <span onClick={() => handleOnClick(item.id)} className="flex-grow-1 text-end">{text}</span>
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
    const isSmallScreen = window.innerWidth < 900;
    const dateParts = label.split(' ');
    let year = dateParts[1];
    let monthName = dateParts[0];
    let hebMonths = getHebrewMonthsForRange(getHebrewGregorianMonth(monthName), year);
    if (isSmallScreen) { monthName = monthName.substring(0, 3) + "'"; year = year.substring(2, 4); hebMonths = hebMonths.replace(/ /g, "") }
    const combinedLabel = `${monthName} ${year} / ${hebMonths}`;
    return (
        <div className="rbc-toolbar">
            <span className="rbc-btn-group">
                <button type="button" onClick={() => onNavigate('PREV')}>
                    <FontAwesomeIcon icon="fa-arrow-right" />{isSmallScreen ? "" : "הקודם "}
                </button>
                <button type="button" onClick={() => onNavigate('TODAY')}>
                    <FontAwesomeIcon icon="fa-calendar-day" /> היום
                </button>
                <button type="button" onClick={() => onNavigate('NEXT')}>
                    {isSmallScreen ? "" : "הבא "}<FontAwesomeIcon icon="fa-arrow-left" />
                </button>
            </span>
            <span className="rbc-toolbar-label h3 text-end">{combinedLabel}</span>
            <span className="rbc-btn-group">
                <span className={isSmallScreen ? "small" : ""}>תצוגה: </span>
                <button type="button" onClick={() => onView('month')}>חודש</button>
                <button type="button" onClick={() => onView('week')}>שבוע</button>
                <button type="button" onClick={() => onView('day')}>יום</button>
                <button type="button" onClick={() => onView('agenda')}>{isSmallScreen ? 'לו"ז' : 'לוח זמנים'}</button>
            </span>
        </div>
    );
};


const CustomDateCell = ({ date }) => {
    const isSmallScreen = window.innerWidth < 900;
    const formattedHebrewDate = isSmallScreen ?
        `${getHebrewDay(date)}` : `${getHebrewDay(date)} ${getHebrewJewishMonth(date)}`;
    return (
        <div className="d-flex justify-content-between bgDate">
            <div className="ms-1">{toDate(date, "dd/MM")}</div>
            <div className="me-1">{formattedHebrewDate}</div>
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
                        {event.attachments.map((attachment, index) => (<ToLink to={attachment.link} key={index}> <FontAwesomeIcon icon="fa-paperclip" className="text-white ms-1" /></ToLink>))}
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
    return (
        <>
            {calendarEvents && <BigCalendar
                localizer={localizer}
                events={calendarEvents}
                messages={messages}
                startAccessor="start"
                endAccessor="end"
                min={minTime} // Set the minimum time
                style={{ height: 680 }}
                components={{
                    month: {
                        header: CustomDayLabel // Use your custom header component
                    },
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
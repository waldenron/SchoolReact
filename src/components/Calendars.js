import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { fetchData } from '../utils/apiServices';
import { AddToCalendarLink, Header, LoadingSpinner, MobileRotateAdvice, NotAllowed, ToLink } from './Common';
import { FilterCategories } from './ItemsList';
import { getWithExpiry, toDate } from '../utils/utilityFunctions';
import { getHebrewLongDayName, toHebrewDate } from '../utils/jewishDates';


import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/he'; // Import Hebrew locale

import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/RbcCalendar.css';
import { Modal, Button } from 'react-bootstrap';



const CustomDayLabel = ({ label }) => { return (<>{getHebrewLongDayName(label)}</>); };

const CalendarButton = ({ item, isActive, handleOnClick }) => {
    const isSmallScreen = window.innerWidth < 900;
    const text = isSmallScreen ? item.name.replace("יומן ", "") : item.name;
    const buttonStyle = item.color ? { backgroundColor: item.color.includes('#') ? item.color : `#${item.color}` } : {};
    return (
        <div className={`d-flex justify-content-between btn btn-sm btn-${isActive ? 'primary active' : 'secondary'} m-1`}>
            <span onClick={() => handleOnClick(item.id)} className="flex-grow-1 text-end"><span className="py-1" style={buttonStyle}>{text}</span> </span>
            {item.registerLink && <ToLink to={item.registerLink} ><FontAwesomeIcon icon="fa-solid fa-plus fa-xs" className="ms-1 text-white" title="רישום ליומן" /></ToLink>}
        </div>
    );
};
export function CalendarButtons({ calendarItems, onClick }) {
    const [activeCalendarId, setActiveCalendarId] = useState(null);

    const handleOnClick = (calendarId) => { setActiveCalendarId(calendarId); onClick(calendarId); };

    return (
        <div className="d-flex flex-wrap btn-group justify-content-center my-1">
            {calendarItems.map((item, index) => (
                <CalendarButton item={item} isActive={activeCalendarId === item.id} handleOnClick={handleOnClick} key={index} />))}
        </div>
    );
}



const getLabel = (startDate, endDate, view) => {
    const hebMonths = toHebrewDate(startDate, "MMMM", true);
    const monthName = toHebrewDate(startDate, "MMMM", false);
    const year = startDate.getFullYear();

    switch (view) {
        case 'month':
            return `${monthName} ${year} / ${hebMonths}`;
        case 'week':
            return `${toDate(startDate, "dd/MM")}-${toDate(endDate, "dd/MM")}-${year}, ${toHebrewDate(startDate, "dd MM")}-${toHebrewDate(endDate, "dd MM")}`;
        case 'day':
            return `יום ${toHebrewDate(startDate, "dddd")} - ${toDate(startDate, "dd/MM/yyyy")}, ${toHebrewDate(startDate, "dd MM yyyy")}`;
        case 'agenda':
            return `${toDate(startDate, "dd/MM")}-${toDate(endDate, "dd/MM")}, ${toHebrewDate(startDate, "dd MM")}-${toHebrewDate(endDate, "dd MM")}`;
    }

    return "";
};
const CustomToolbar = (toolbar) => {
    const { label, onNavigate, onView, view } = toolbar;
    const isSmallScreen = false;// window.innerWidth < 900;

    const calculateCurrentDateRange = (toolbar, view) => {
        const currentDate = toolbar.date; // This is the current date in focus
        let startDate, endDate;

        switch (view) {
            case 'month':
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                break;
            case 'week':
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 6);
                break;
            case 'day':
                startDate = endDate = new Date(currentDate);
                break;
            case 'agenda':
                startDate = new Date(currentDate);
                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 30);
                break;
        }

        return { startDate, endDate };
    };

    const { startDate, endDate } = calculateCurrentDateRange(toolbar, view);

    const combinedLabel = getLabel(startDate, endDate, view);
    const btnCss = "btn bgBtn ms-1 me-0";
    return (
        <div className="rbc-toolbar">
            <div className="d-flex justify-content-between mt-2 w-100">
                <span className="rbc-btn-group">
                    <div className="btn-group">
                        <span className={btnCss} onClick={() => onNavigate('PREV')}><FontAwesomeIcon icon="fa-arrow-right" />הקודם </span>
                        <span className={btnCss} onClick={() => onNavigate('TODAY')}><FontAwesomeIcon icon="fa-calendar-day" /> היום</span>
                        <span className={btnCss} onClick={() => onNavigate('NEXT')}>הבא <FontAwesomeIcon icon="fa-arrow-left" /></span>
                    </div>
                </span>
                <span className="rbc-btn-group">
                    <b>תצוגה: </b>
                    <div className="btn-group">
                        <span className={btnCss} onClick={() => onView('month')}>חודש</span>
                        <span className={btnCss} onClick={() => onView('week')}>שבוע</span>
                        <span className={btnCss} onClick={() => onView('day')}>יום</span>
                        <span className={btnCss} onClick={() => onView('agenda')}>לוח זמנים</span>
                    </div>
                </span>
            </div>
            <div className="mt-3"><span className="rbc-toolbar-label h3">{combinedLabel}</span></div>
        </div>
    );
};


const CustomDateCell = ({ date }) => {
    const isSmallScreen = window.innerWidth < 900;
    const formattedHebrewDate = toHebrewDate(date, isSmallScreen ? "dd" : "dd MM");
    return (
        <div className="d-flex justify-content-between bgDate">
            <div className="ms-1">{toDate(date, "dd/MM")}</div>
            <div className="me-1">{formattedHebrewDate}</div>
        </div>
    );
};
const CustomDateHeader = ({ date, label }) => {
    // Custom formatting or logic for the date
    // For example, adding custom text or icons
    return (
        <div>
            <span>**{label}</span> {/* label contains the date */}
            {/* Additional custom content */}
        </div>
    );
};

const EventDetailsModal = ({ show, onHide, event }) => {
    const dateText = `יום ${toHebrewDate(event.start, "dddd")} - ${toDate(event.start, "dd/MM/yy")}, ${toHebrewDate(event.start, "dd MM")}`;
    let timeText = "";
    if (event.end.getHours() >= 6) timeText += toDate(event.end, "HH:mm") + " - ";
    if (event.start.getHours() >= 6) timeText += toDate(event.start, "HH:mm"); else timeText = null;

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header className="d-flex justify-content-start text-white">
                <Modal.Title className="">פרטים</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-white">
                <h3>{event.title}</h3>
                {event.grade && <h4>שכבה {event.grade}</h4>}
                <h5>{dateText}</h5>
                {timeText && <h6>{timeText}</h6>}
                {event.desc && <div dangerouslySetInnerHTML={{ __html: event.desc }} />}

                {event.attachments && event.attachments.map((attachment, index) => (
                    <div className="mt-3" key={index}>
                        <FontAwesomeIcon icon="fa-paperclip" className="text-white ms-1" />
                        <ToLink to={attachment.link}>{attachment.title}</ToLink>
                    </div>
                ))}
                <div className="mt-3">
                    <AddToCalendarLink title={event.title} startTime={event.start} endTime={event.end} isAllday={event.allDay} text="הוספה ליומן שלי" description={event.desc} />
                </div>
            </Modal.Body>
            <Modal.Footer className="p-0 border-0">
                <Button className="btn btn-dark" onClick={onHide}>סגירה</Button>
            </Modal.Footer>
        </Modal>
    );
};
const CustomEvent = ({ event }) => {
    const [showModal, setShowModal] = useState(false);

    const handleEventClick = () => { setShowModal(true); };
    return (
        <>
            <div style={event.style} onClick={handleEventClick} className="event-container">
                <div className="d-flex justify-content-between">
                    <strong>{event.title}</strong>
                    {event.attachments && (
                        <div>
                            {event.attachments.map((attachment, index) => (
                                <ToLink to={attachment.link} key={index}>
                                    <FontAwesomeIcon icon="fa-paperclip" className="text-white ms-1" />
                                </ToLink>
                            ))}
                        </div>
                    )}
                </div>
                {event.grade && <div><small>שכבה {event.grade}</small></div>}
                {event.desc && <div className="small" dangerouslySetInnerHTML={{ __html: event.desc }} />}
            </div>

            <EventDetailsModal show={showModal} onHide={() => setShowModal(false)} event={event} />
        </>
    );
};




export const CustomBigCalendar = ({ events }) => {
    const messages = {
        allDay: 'כל היום', previous: 'הקודם', next: 'הבא', today: 'היום', month: 'חודש', week: 'שבוע', day: 'יום',
        agenda: 'סדר יום', date: 'תאריך', time: 'זמן', event: 'אירוע',    // Any other translations...
    };

    function transformEventsToCalendarFormat(events) {
        //console.log(events.length);
        return events.map(event => {
            const startDateTime = new Date(event.start);
            const endDateTime = new Date(event.end);

            // return {
            //     title: event.subject,
            //     start: startDateTime,
            //     end: endDateTime,
            //     allDay: event.allDayEvent,
            //     desc: event.description,
            //     attachments: event.attachments,
            //     style: { backgroundColor: eventsColor } // Different background color
            // };

            let eventObject = {
                title: event.subject,
                start: startDateTime,
                end: endDateTime,
                allDay: event.allDayEvent,
                desc: event.description,
                attachments: event.attachments,
                style: { backgroundColor: event.color ? `#${event.color}` : "#7C96AB", boder: "0" },
                grade: event.grade
            };
            //console.log(event);

            return eventObject;
        });
    }
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
                style={{ height: 900 }}
                components={{
                    month: {
                        header: CustomDayLabel // Use your custom header component
                    },
                    //doesn't work
                    // week: {
                    //     dayHeader: CustomDateHeader, // Custom component for week view
                    // },
                    // dateHeader: CustomDateHeader,
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

export const Calendar = () => {
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
            setLoading(true);
            const calendarId = calendarItems.find(item => item.id === activeCalendar).link;
            const additionalHeaders = [
                { name: 'calendarId', value: calendarId },
                ...(token ? [{ name: 'token', value: token }] : [])
            ];
            const { data: fetchedData, error } = await fetchData('/api/Events', null, null, additionalHeaders);
            if (error && error.message === "Resource not found") setNotAlowed(true);
            else setEvents(fetchedData);

            setLoading(false);
        })();
    }, [calendarItems, activeCalendar]);

    //if (loading) { return <LoadingSpinner />; }
    if (notAlowed) { return <NotAllowed />; }
    //delete calendarItems color if not token
    if (!token && calendarItems) { calendarItems.forEach(item => { item.color = null; }); }
    const eventsColor = activeCalendar && calendarItems && token ? calendarItems.find(item => item.id === activeCalendar).color : null;
    //console.log(calendarItems.find(item => item.id === activeCalendar).color);

    return (
        <div className="py-3 w-lg-90 mx-auto">
            <MobileRotateAdvice />
            <Header header="יומנים" />
            {calendarItems.length > 0 && <CalendarButtons calendarItems={calendarItems} onClick={setActiveCalendar} />}
            <br />
            {loading ? <LoadingSpinner /> : activeCalendar && <CustomBigCalendar events={events} />}
        </div>
    );
};


export function Calendar_Prev() {
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
import React, { useEffect, useState } from 'react'

import { fetchData } from '../utils/apiServices';


const days = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי'];


function LesoonDesc({ time, timeslotIndex }) {
    return (
        <div className="col-1 text-center border border-dark bgLightGray px-0">
            שיעור {timeslotIndex + 1}
            <br />
            <small>{time.start}-{time.end}</small>
        </div>
    )
}
function Lesson({ lessons = [], showSubject, showTeacher, showRoom, showClass }) {
    return (
        <div className="col text-center border border-dark px-0">
            {lessons.map(({ subject, teacher, room, sClass }, index) => (
                <div key={index} className="text-center bg-white" title="">
                    {index > 0 && <hr />}
                    {showSubject && subject}<br />
                    {showTeacher && teacher}<br />
                    {showRoom && room ? `[${room}]` : ''}<br />
                    {showClass && sClass}<br />
                </div>
            ))}
        </div>
    );
}

function CheckboxControls({ controls, setControls }) {

    const toggleControl = (key) => {
        const updatedControls = { ...controls };
        updatedControls[key] = !controls[key];
        setControls(updatedControls);
    }

    const controlDefinitions = [
        { key: 'showSubject', label: 'מקצוע' },
        { key: 'showTeacher', label: 'מורה' },
        { key: 'showRoom', label: 'חדר' },
        { key: 'showClass', label: 'כיתה' }
    ];

    return (
        <div className="d-flex justify-content-center flex-wrap mb-3">
            {controlDefinitions.map(({ key, label }) => (
                <div key={key} className="form-check form-check-inline rtl-form-check-inline mx-0">
                    <label htmlFor={`Checkbox${key}`} className="form-check-label mx-1">{label}</label>
                    <input
                        type="checkbox"
                        id={`Checkbox${key}`}
                        className="form-check-input"
                        checked={controls[key]}
                        onChange={() => toggleControl(key)}
                    />
                </div>
            ))}
        </div>
    );
}




function Timetable({ lessons, scheduleItems }) {
    const [controls, setControls] = useState({
        showSubject: true,
        showTeacher: true,
        showRoom: true,
        showClass: false
    });

    const { showSubject, showTeacher, showRoom, showClass } = controls;
    const currentDayIndex = new Date().getDay();  // Note: Sunday is 0, Monday is 1, ...

    return (
        <div className="container-fluid w-lg-90 pb-5">
            <CheckboxControls controls={controls} setControls={setControls} />
            <div className="row bgLightGray no-gutters sticky-top">
                <div className="col-1 border border-dark text-center"></div>
                {days.map((day, index) => (
                    <div key={index} className={`col border border-dark text-center ${index === currentDayIndex ? 'bgToday' : ''}`}>
                        <b>{day}</b>
                    </div>
                ))}
            </div>
            {lessons.map((time, timeslotIndex) => (
                <div key={timeslotIndex} className="row bg-white">
                    <LesoonDesc time={time} timeslotIndex={timeslotIndex} />
                    {days.map((_, dayIndex) => {
                        const lessonsForSlot = scheduleItems.filter(item => item.weekDay - 1 === dayIndex && item.lessonId - 1 === timeslotIndex);
                        return <Lesson lessons={lessonsForSlot} showSubject={showSubject} showTeacher={showTeacher} showRoom={showRoom} showClass={showClass} key={dayIndex + '-' + timeslotIndex} />;
                    })}
                </div>
            ))}
        </div>
    );
}


export default function Schedule() {
    const [lessons, setLessons] = useState([]);
    const [scheduleItems, setScheduleItems] = useState([]);

    const curClassId = 701;

    useEffect(() => {
        (async () => {
            const fetchedDataLessons = await fetchData('/api/Lessons');
            setLessons(fetchedDataLessons);

            const fetchedData = await fetchData('/api/Schedules');
            const filteredItems = fetchedData.filter(item => item.classId === curClassId);

            setScheduleItems(filteredItems);
        })();
    }, []);

    return (
        <div>
            <Timetable lessons={lessons} scheduleItems={scheduleItems} />
        </div>
    )
}

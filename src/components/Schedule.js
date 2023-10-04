import React, { useEffect, useState } from 'react'

import { fetchData } from '../utils/apiServices';
import { IconButton, Header, Logo, SelectItem } from './Common';
import { getNameById } from '../utils/utilityFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const days = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי'];


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
                    {index > 0 && <hr className="my-1 mx-auto p-0 g-0 w-50" />}
                    {showSubject && subject && <> {subject} <br /> </>}
                    {showTeacher && teacher && <> {teacher} <br /> </>}
                    {showRoom && room && <> {`[${room}]`} <br /> </>}
                    {showClass && sClass}
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




function WeeklyTimetable({ checkboxShowValue, lessons, scheduleItems }) {

    const { showSubject, showTeacher, showRoom, showClass } = checkboxShowValue;
    const currentDayIndex = new Date().getDay();  // Note: Sunday is 0, Monday is 1, ...

    const activeDaysSet = new Set(scheduleItems.map(item => item.weekDay));

    return (
        <div className="container-fluid">
            <div className="row bgLightGray no-gutters sticky-top">
                <div className="col-1 border border-dark text-center"></div>
                {days.map((day, index) => (
                    activeDaysSet.has(index + 1) && (  // Only render if the day is in activeDaysSet
                        <div key={index} className={`col border border-dark text-center ${index === currentDayIndex ? 'bgToday' : ''}`}>
                            <b>{day}</b>
                        </div>)
                ))}
            </div>
            {lessons.map((time, timeslotIndex) => (
                <div key={timeslotIndex} className="row bg-white">
                    <LesoonDesc time={time} timeslotIndex={timeslotIndex} />
                    {days.map((_, dayIndex) => {
                        if (activeDaysSet.has(dayIndex + 1)) {

                            const lessonsForSlot = scheduleItems.filter(item => item.weekDay - 1 === dayIndex && item.lessonId - 1 === timeslotIndex);
                            return <Lesson lessons={lessonsForSlot} showSubject={showSubject} showTeacher={showTeacher} showRoom={showRoom} showClass={showClass} key={dayIndex + '-' + timeslotIndex} />;
                        }
                    })}
                </div>
            ))}
        </div>
    );
}


export default function Schedule() {
    const [lessons, setLessons] = useState([]);
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [showFilertMore, setFilertMore] = useState(false);

    const DEFAULT_Ids = { class: -1, teacher: -1, room: -1 };
    const [selectedIds, setSelectedIds] = useState(DEFAULT_Ids);
    function resetSelectedIds() { setSelectedIds({ ...DEFAULT_Ids }); }


    const DEFAULT_FieldsShow = { showSubject: true, showTeacher: true, showRoom: true, showClass: false };
    const [showSelects, setShowSelects] = useState(DEFAULT_FieldsShow);
    function resetShowSelects() { setShowSelects({ ...DEFAULT_FieldsShow }); }

    const [checkboxShowValue, setCheckboxShowValue] = useState(DEFAULT_FieldsShow);
    function resetCheckboxShowValue() { setCheckboxShowValue({ ...DEFAULT_FieldsShow }); }

    const [scheduleItems, setScheduleItems] = useState([]);

    function handleShowClick(item) {
        resetSelectedIds();
        resetShowSelects();
        resetCheckboxShowValue();

        switch (item) {
            case "teacher":
                setShowSelects(prevState => ({ ...prevState, teacher: true }));
                setCheckboxShowValue(prevControls => ({
                    ...prevControls,
                    showTeacher: false,
                    showClass: true
                }));
                break;
            case "room":
                setShowSelects(prevState => ({ ...prevState, room: true }));
                setCheckboxShowValue(prevControls => ({
                    ...prevControls,
                    showRoom: false,
                    showClass: true
                }));
                break;

        }
    }
    function handleSelect(dropdownItem, selectedId) {
        resetSelectedIds();

        switch (dropdownItem) {
            case "class":
                setSelectedIds(prevState => ({ ...prevState, class: selectedId }));
                resetShowSelects();
                setCheckboxShowValue(prevControls => ({
                    ...prevControls,
                    showTeacher: true,
                    showClass: false
                }));
                break;
            case "teacher":
                setSelectedIds(prevState => ({ ...prevState, teacher: selectedId }));
                break;
            case "room":
                setSelectedIds(prevState => ({ ...prevState, room: selectedId }));
                break;
        }
    }

    useEffect(() => {
        (async () => {
            const fetchedDataLessons = await fetchData('/api/Lessons');
            setLessons(fetchedDataLessons);

            const fetchedDataClasses = await fetchData('/api/Classes');
            setClasses(fetchedDataClasses);

            const fetchedDataTeachers = await fetchData('/api/Teachers');
            setTeachers(fetchedDataTeachers);

            const fetchedDataRooms = await fetchData('/api/Rooms');
            setRooms(fetchedDataRooms);

            const fetchedDataSchedule = await fetchData('/api/Schedules');
            setScheduleItems(fetchedDataSchedule);
        })();
    }, []);

    return (
        <div className="container-fluid w-lg-90 pb-5">
            <Logo />
            <Header header="מערכת השעות" />
            <div className="container-fluid input-group text-center pb-2">
                <div className="input-group mx-auto w-md-25">
                    {classes && <SelectItem filterBy="class" preText="מערכת שבועית לכיתה" items={classes} defaultText="בחירת כיתה" selectedValue={selectedIds.class} onSelect={handleSelect} />}
                    <FontAwesomeIcon icon={showFilertMore ? "fas fa-circle-chevron-up" : "fas fa-circle-chevron-down"} className="my-auto mx-1" onClick={() => setFilertMore(!showFilertMore)} />
                </div>
            </div>
            {showFilertMore &&
                <div className="container-fluid pt-3">
                    <div className="d-flex justify-content-center flex-wrap">
                        <div className="d-flex justify-content-center flex-wrap">
                            <IconButton show="teacher" icon="fas fa-chalkboard-user" text="למורה" isChose={showSelects.teacher} onClick={handleShowClick} />
                            <IconButton show="room" icon="fas fa-house" text="לחדר" isChose={showSelects.room} onClick={handleShowClick} />
                        </div>
                    </div>
                    <div className="">
                        <div className="input-group mx-auto w-md-25 pt-3">
                            {showSelects.teacher && teachers &&
                                <SelectItem filterBy="teacher" preText="מערכת שבועית למורה" items={teachers} defaultText="בחירת מורה" selectedValue={selectedIds.teacher} onSelect={handleSelect} />
                            }
                            {showSelects.room && rooms &&
                                <SelectItem filterBy="room" preText="מערכת שבועית לחדר" items={rooms} defaultText="בחירת חדר" selectedValue={selectedIds.room} onSelect={handleSelect} />
                            }
                        </div>
                    </div>
                    <CheckboxControls controls={checkboxShowValue} setControls={setCheckboxShowValue} />
                </div>}
            {selectedIds.class > 0 && <WeeklyTimetable checkboxShowValue={checkboxShowValue} lessons={lessons} scheduleItems={scheduleItems.filter(item => item.classId == selectedIds.class)} />}
            {selectedIds.teacher > 0 && <WeeklyTimetable checkboxShowValue={checkboxShowValue} lessons={lessons} scheduleItems={scheduleItems.filter(item => item.teacher == getNameById(teachers, selectedIds.teacher))} />}
            {selectedIds.room > 0 && <WeeklyTimetable checkboxShowValue={checkboxShowValue} lessons={lessons} scheduleItems={scheduleItems.filter(item => item.room == getNameById(rooms, selectedIds.room))} />}
        </div>
    )
}

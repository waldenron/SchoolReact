import React, { useEffect, useState } from 'react'

import { fetchData } from '../utils/apiServices';
import { IconButton, Header, SelectItem, LoadingSpinner, NotAllowed } from './Common';
import { getNameById } from '../utils/utilityFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const days = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי'];


function LesonDesc({ time, number }) {
    return (
        <div className="col col-2 text-center border border-dark bgLightGray px-0">
            שיעור {number}
            <br />
            <small>{time.start}-{time.end}</small>
        </div>
    )
}
function Lesson({ lessons = [], showSubject, showTeacher, showRoom, showClass }) {
    return (
        <div className="col text-center border border-dark px-0">
            {lessons.map(({ subject, teacher, room, classesNames }, index) => (
                <div key={index} className="text-center bg-white" title="">
                    {index > 0 && <hr className="my-1 mx-auto p-0 g-0 w-50" />}
                    {showSubject && subject && <> {subject} <br /> </>}
                    {showTeacher && teacher && <> {teacher} <br /> </>}
                    {showClass && classesNames.length > 0 && <> {`{${classesNames}}`} <br /> </>}
                    {showRoom && room && <> {`[${room}]`}  </>}
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
        <div className="container-fluid pt-3">
            <div className="row bgLightGray no-gutters sticky-top">
                <div className="col col-2 border border-dark text-center"></div>
                {days.map((day, index) => (
                    activeDaysSet.has(index + 1) && (  // Only render if the day is in activeDaysSet
                        <div key={index} className={`col border border-dark text-center ${index === currentDayIndex ? 'bgToday' : ''}`}>
                            <b>{day}</b>
                        </div>)
                ))}
            </div>
            {lessons.map((time, lessonIndex) => (
                <div key={lessonIndex} className="row bg-white">
                    <LesonDesc time={time} number={lessonIndex + 1} />
                    {days.map((_, dayIndex) => {
                        if (activeDaysSet.has(dayIndex + 1)) {

                            const lessonsForSlot = scheduleItems.filter(item => item.weekDay - 1 === dayIndex && item.lessonId - 1 === lessonIndex);
                            return <Lesson lessons={lessonsForSlot} showSubject={showSubject} showTeacher={showTeacher} showRoom={showRoom} showClass={showClass} key={dayIndex + '-' + lessonIndex} />;
                        }
                    })}
                </div>
            ))}
        </div>
    );
}

function DailyTimetable({ checkboxShowValue, lessons, scheduleItems, classes }) {
    const { showSubject, showTeacher, showRoom, showClass } = checkboxShowValue;

    return (
        <div className="container-fluid pt-3">
            {/* Header row with class names */}
            <div className="row bgLightGray no-gutters sticky-top">
                <div className="col-2 border border-dark text-center"></div>
                {classes.map(c => (
                    <div key={c.id} className="col border border-dark text-center">
                        <b>{c.name}</b>
                    </div>
                ))}
            </div>

            {/* Rows for each time slot */}
            {lessons.map((time, lessonIndex) => (
                <div key={lessonIndex} className="row bg-white">
                    <LesonDesc time={time} number={lessonIndex + 1} />

                    {/* Cells for each class */}
                    {classes.map(c => {
                        const lessonsForClass = scheduleItems.filter(item =>
                            item.classesIds.includes(c.id.toString()) && item.lessonId - 1 === lessonIndex
                        );
                        return <Lesson lessons={lessonsForClass} showSubject={showSubject} showTeacher={showTeacher} showRoom={showRoom} showClass={showClass} key={c.id + '-' + lessonIndex} />;
                    })}
                </div>
            ))}
        </div>
    );
}

export default function Schedule() {
    const [loading, setLoading] = useState(true);
    const [notAlowed, setNotAlowed] = useState(false);

    const [lessons, setLessons] = useState([]);
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [grades, setGrades] = useState([]);
    const [sections, setSections] = useState([]);
    const [weekDays, setWeekDays] = useState([]);

    const [showWeekly, setShowWeekly] = useState(true);
    const [showFilertMore, setFilertMore] = useState(false);
    const [showShowAllSubjects, setShowAllSubjects] = useState(true);

    const today = new Date().getDay() + 1;  // +1 because your weekDays array starts with 1 for Sunday
    const DEFAULT_Ids = { class: -1, teacher: -1, room: -1, grade: -1, section: -1, weekDay: today };
    const [selectedIds, setSelectedIds] = useState(DEFAULT_Ids);
    function resetSelectedIds(keepWeekDay) {
        if (!keepWeekDay) setSelectedIds({ ...DEFAULT_Ids });
        else setSelectedIds({ ...DEFAULT_Ids, weekDay: selectedIds.weekDay });
    }

    const DEFAULT_FieldsShow = { subject: false, teacher: false, room: false, class: false, grade: false, section: false };
    const [showSelects, setShowSelects] = useState(DEFAULT_FieldsShow);
    function resetShowSelects() { setShowSelects({ ...DEFAULT_FieldsShow }); }

    const DEFAULT_checkboxShowValue = { showSubject: true, showTeacher: true, showRoom: true, showClass: false };
    const [checkboxShowValue, setCheckboxShowValue] = useState(DEFAULT_checkboxShowValue);
    function resetCheckboxShowValue() { setCheckboxShowValue({ ...DEFAULT_checkboxShowValue }); }

    const [scheduleItems, setScheduleItems] = useState([]);

    function handleFilertMoreClick() {
        // handleShowClick(showFilertMore ? "class" : "grade");

        setFilertMore(!showFilertMore);
    }
    function handleShowWeekly() {
        handleShowClick(!showWeekly ? "class" : "grade");

        setShowWeekly(!showWeekly);
    }
    function handleShowClick(item) {
        resetSelectedIds();
        resetShowSelects();
        resetCheckboxShowValue();

        switch (item) {
            case "class":
                setShowSelects(prevState => ({ ...prevState, class: true }));
                break;
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
            case "grade":
                setShowSelects(prevState => ({ ...prevState, grade: true }));
                setCheckboxShowValue(prevControls => ({
                    ...prevControls,
                    showTeacher: true,
                    showClass: false
                }));
                break;
            case "section":
                setShowSelects(prevState => ({ ...prevState, section: true }));
                setCheckboxShowValue(prevControls => ({
                    ...prevControls,
                    showTeacher: true,
                    showClass: false
                }));
                break;
        }
    }
    function handleSelect(dropdownItem, selectedId) {
        // reset SelectedIds only if the selected dropdown is not weekday. if it's grade or section reset all but keep weekday
        if (dropdownItem != "weekDay")
            resetSelectedIds(dropdownItem === "grade" || dropdownItem === "section");

        switch (dropdownItem) {
            case "class":
                setSelectedIds(prevState => ({ ...prevState, class: selectedId }));
                break;
            case "teacher":
                setSelectedIds(prevState => ({ ...prevState, teacher: selectedId }));
                break;
            case "room":
                setSelectedIds(prevState => ({ ...prevState, room: selectedId }));
                break;
            case "grade":
                setSelectedIds(prevState => ({ ...prevState, grade: selectedId }));
                break;
            case "section":
                setSelectedIds(prevState => ({ ...prevState, section: selectedId }));
                break;
            case "weekDay":
                setSelectedIds(prevState => ({ ...prevState, weekDay: selectedId }));
                break;
        }
    }
    function getFilteredScheduleItems(id, type) {
        let filterItems = [];
        switch (type) {
            case "class": filterItems = scheduleItems.filter(item => item.classesIds.includes(id.toString())); break;
            case "teacher": filterItems = scheduleItems.filter(item => item.teacher == getNameById(teachers, id)); break;
            case "room": filterItems = scheduleItems.filter(item => item.room == getNameById(rooms, id)); break;
            case "weekDay": filterItems = scheduleItems.filter(item => item.weekDay == id); break;
            default: filterItems = [];
        }

        if (!showShowAllSubjects) filterItems = filterItems.filter(item => item.isArtSubject === false);

        return filterItems;
    }

    function renderTimetable(id, type, weekDay) {
        if (id <= 0) return null;
        const filteredItems = !weekDay ? getFilteredScheduleItems(id, type) : getFilteredScheduleItems(weekDay, "weekDay");
        if (weekDay) {
            const filterClasses = type === "grade" ?
                classes.filter(c => c.gradeId == id) :
                classes.filter(c => c.sectionId == id);
            return <DailyTimetable checkboxShowValue={checkboxShowValue} lessons={lessons} scheduleItems={filteredItems} classes={filterClasses} />;
        }
        else
            return <WeeklyTimetable checkboxShowValue={checkboxShowValue} lessons={lessons} scheduleItems={filteredItems} />;

    }

    useEffect(() => {
        (async () => {
            setWeekDays(days.map((day, index) => ({ id: index + 1, name: day })));

            const { data: fetchedDataSchedule, error } = await fetchData('/api/Schedules');
            if (error && error.message === "Resource not found") setNotAlowed(true);
            else setScheduleItems(fetchedDataSchedule);

            const { data: fetchedDataLessons } = await fetchData('/api/Lessons');
            setLessons(fetchedDataLessons);

            const { data: fetchedDataClasses } = await fetchData('/api/Classes');
            setClasses(fetchedDataClasses);

            const { data: fetchedDataGrades } = await fetchData('/api/Grades');
            setGrades(fetchedDataGrades);

            const { data: fetchedDataSections } = await fetchData('/api/Sections');
            setSections(fetchedDataSections);

            const { data: fetchedDataTeachers } = await fetchData('/api/Teachers');
            setTeachers(fetchedDataTeachers);

            const { data: fetchedDataRooms } = await fetchData('/api/Rooms');
            setRooms(fetchedDataRooms);


            handleShowClick("class");

            setLoading(false);
        })();
    }, []);

    if (loading) { return <LoadingSpinner />; }
    if (notAlowed) { return <NotAllowed />; }
    return (
        <div className="py-3 w-lg-90 mx-auto">
            <Header header="מערכת השעות" />
            <div className="w-md-75 mx-auto">
                <div className="row">
                    <div className="col col-3"></div>
                    <div className="col">
                        <div className="d-flex justify-content-start flex-wrap">
                            {showWeekly &&
                                <>
                                    <IconButton show="class" icon="fas fa-user-group" text="לכיתה" isChose={showSelects.class} onClick={handleShowClick} />
                                    <IconButton show="teacher" icon="fas fa-chalkboard-user" text="למורה" isChose={showSelects.teacher} onClick={handleShowClick} />
                                    <IconButton show="room" icon="fas fa-house" text="לחדר" isChose={showSelects.room} onClick={handleShowClick} />
                                </>}

                            {!showWeekly &&
                                <>
                                    <IconButton show="grade" icon="fas fa-people-group" text="לשכבה" isChose={showSelects.grade} onClick={handleShowClick} />
                                    <IconButton show="section" icon="fas fa-school" text="לחטיבה" isChose={showSelects.section} onClick={handleShowClick} />
                                </>}
                        </div>
                    </div>
                </div>
                <div className="row pt-3">
                    <div className="col col-3 text-start">
                        <div className="btn-group" role="group">
                            <button type="button" className={`btn ${showWeekly ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => handleShowWeekly(true)}>
                                מערכת שבועית
                            </button>
                            <button type="button" className={`btn ${!showWeekly ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => handleShowWeekly(false)}                    >
                                מערכת יומית
                            </button>
                        </div>
                    </div>
                    <div className="col input-group">
                        {showWeekly &&
                            <>
                                {showSelects.class && classes &&
                                    <SelectItem filterBy="class" preText="" items={classes} defaultText=" בחירת כיתה" selectedValue={selectedIds.class} onSelect={handleSelect} />
                                }
                                {showSelects.teacher && teachers &&
                                    <SelectItem filterBy="teacher" preText="" items={teachers} defaultText="בחירת מורה" selectedValue={selectedIds.teacher} onSelect={handleSelect} />
                                }
                                {showSelects.room && rooms &&
                                    <SelectItem filterBy="room" preText="" items={rooms} defaultText="בחירת חדר" selectedValue={selectedIds.room} onSelect={handleSelect} />
                                }
                            </>}
                        {!showWeekly &&
                            <>
                                {showSelects.grade && grades &&
                                    <SelectItem filterBy="grade" preText="" items={grades} defaultText="בחירת שכבה" selectedValue={selectedIds.grade} onSelect={handleSelect} />
                                }
                                {showSelects.section && sections &&
                                    <SelectItem filterBy="section" preText="" items={sections} defaultText="בחירת חטיבה" selectedValue={selectedIds.section} onSelect={handleSelect} />
                                }
                                {(showSelects.grade || showSelects.section) && weekDays &&
                                    <SelectItem filterBy="weekDay" preText="" items={weekDays} defaultText="בחירת יום בשבוע" selectedValue={selectedIds.weekDay} onSelect={handleSelect} moreCss="ms-2" />
                                }
                            </>}
                        <FontAwesomeIcon className="my-auto ms-1" icon={showFilertMore ? "fas fa-circle-chevron-up" : "fas fa-circle-chevron-down"} onClick={() => handleFilertMoreClick()} />
                    </div>
                </div>
                <div className="row pt-3">
                    <div className="col col-3"></div>
                    <div className="col input-group">
                        {showFilertMore &&
                            <div className="d-flex ps-0">
                                <b className="">הצגת:</b>
                                <CheckboxControls controls={checkboxShowValue} setControls={setCheckboxShowValue} />
                                <div className="form-check form-switch ms-3 me-0">
                                    <input type="checkbox" id="SwitchFilterSubject" className="form-check-input" checked={showShowAllSubjects} onChange={() => setShowAllSubjects(prev => !prev)}
                                    />
                                    <label htmlFor="SwitchFilterSubject" className="form-check-label">כל המקצועות</label>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {renderTimetable(selectedIds.class, "class")}
            {renderTimetable(selectedIds.teacher, "teacher")}
            {renderTimetable(selectedIds.room, "room")}
            {renderTimetable(selectedIds.grade, "grade", selectedIds.weekDay)}
            {renderTimetable(selectedIds.section, "section", selectedIds.weekDay)}
        </div >
    )
}

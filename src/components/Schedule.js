import React, { useEffect, useState, useRef } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DownloadTableExcel } from 'react-export-table-to-excel';

import { fetchData } from '../utils/apiServices';
import { IconButton, Header, SelectItems, CheckboxControls, LoadingSpinner, NotAllowed, getPageHeader } from './Common';
import { getNameById } from '../utils/utilityFunctions';

const days = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי'];


function LessonDesc({ time, number }) {
    return (
        <td colSpan="2" className="text-center border border-dark bgLightGray px-0">
            שיעור {number}
            <br />
            <small>{time.start}-{time.end}</small>
        </td>
    )
}

function Lesson({ lessons = [], showSubject, showTeacher, showRoom, showClass }) {
    return (
        <td className="text-center border border-dark px-0">
            {lessons.map(({ subject, teacher, room, classesNames }, index) => (
                <div key={index} className="text-center bg-white" title="">
                    {index > 0 && <hr className="my-1 mx-auto p-0 g-0 w-50" />}
                    {showSubject && subject && <> {subject} <br /> </>}
                    {showTeacher && teacher && <> {teacher} <br /> </>}
                    {showClass && classesNames.length > 0 && <> {`{${classesNames}}`} <br /> </>}
                    {showRoom && room && <> {`[${room}]`}  </>}
                </div>
            ))}
        </td>
    );
}

function downloadTableExcel(fileName, sheetName, tableRef) {
    return (
        <DownloadTableExcel filename={fileName} sheet={sheetName} currentTableRef={tableRef.current}>
            <button className="btn btn-sm btn-primary mb-1">יצוא לאקסל</button>
        </DownloadTableExcel>
    )
}


function WeeklyTimetable({ checkboxShowValue, lessons, scheduleItems }) {

    const { showSubject, showTeacher, showRoom, showClass } = checkboxShowValue;
    const tableRef = useRef(null);

    const currentDayIndex = new Date().getDay();

    const activeDaysSet = new Set(scheduleItems.map(item => item.weekDay));
    const maxLessonId = Math.max(...scheduleItems.map(item => item.lessonId));

    return (
        <div className="container-fluid pt-3">
            {downloadTableExcel("WeeklyTimetable", "sheetName", tableRef)}
            <table className="w-100" ref={tableRef}>
                <thead>
                    <tr className="bgLightGray no-gutters sticky-top">
                        <th colSpan="2" className="border border-dark border-2 text-center"></th>
                        {days.map((day, index) => (
                            activeDaysSet.has(index + 1) && (  // Only render if the day is in activeDaysSet
                                <th key={index} className={`border border-dark border-2 text-center ${index === currentDayIndex ? 'bgToday' : ''}`}>
                                    <b>{day}</b>
                                </th>)
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {lessons.slice(0, maxLessonId).map((time, lessonIndex) => (
                        <tr key={lessonIndex} className="bg-white">
                            <LessonDesc time={time} number={lessonIndex + 1} />
                            {days.map((_, dayIndex) => {
                                if (activeDaysSet.has(dayIndex + 1)) {
                                    const lessonsForSlot = scheduleItems.filter(item => item.weekDay - 1 === dayIndex && item.lessonId - 1 === lessonIndex);
                                    return <Lesson lessons={lessonsForSlot} showSubject={showSubject} showTeacher={showTeacher} showRoom={showRoom} showClass={showClass} key={dayIndex + '-' + lessonIndex} />;
                                }
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
function DailyTimetable({ checkboxShowValue, lessons, scheduleItems, classes }) {
    const { showSubject, showTeacher, showRoom, showClass } = checkboxShowValue;
    const tableRef = useRef(null);

    const filteredScheduleItems = scheduleItems.filter(item =>
        classes.some(c => item.classesIds.includes(c.id.toString()))
    );
    const maxLessonId = Math.max(...filteredScheduleItems.map(item => item.lessonId));
    return (
        <div className="container-fluid pt-3">
            {downloadTableExcel("DailyTimetable", "sheetName", tableRef)}
            <table className="w-100" ref={tableRef}>
                <thead>
                    <tr className="bgLightGray no-gutters sticky-top">
                        <th colSpan="2" className="border border-dark border-2 text-center"></th>
                        {classes.map(c => (
                            <th key={c.id} className="border border-dark border-2 text-center">
                                <b>{c.name}</b>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {lessons.slice(0, maxLessonId).map((time, lessonIndex) => (
                        <tr key={lessonIndex} className="bg-white">
                            <LessonDesc time={time} number={lessonIndex + 1} />
                            {classes.map(c => {
                                const lessonsForSlot = filteredScheduleItems.filter(item =>
                                    item.classesIds.includes(c.id.toString()) && item.lessonId - 1 === lessonIndex
                                );
                                return <Lesson lessons={lessonsForSlot} showSubject={showSubject} showTeacher={showTeacher} showRoom={showRoom} showClass={showClass} key={c.id + '-' + lessonIndex} />;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default function Schedule() {
    const [loading, setLoading] = useState(true);
    const [notAlowed, setNotAlowed] = useState(false);

    const [pageHeader, setPageHeader] = useState(null);

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
    function changeScheduleType(scheduleType) {
        handleShowClick(scheduleType);

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

            const fetchedPageHeader = await getPageHeader({ pageName: "Schedule" });
            setPageHeader(fetchedPageHeader);

        })();

        setLoading(false);
    }, []);

    const controlDefinitions = [
        { key: 'showSubject', label: 'מקצוע' },
        { key: 'showTeacher', label: 'מורה' },
        { key: 'showRoom', label: 'חדר' },
        { key: 'showClass', label: 'כיתה' }
    ];

    if (loading) { return <LoadingSpinner />; }
    if (notAlowed) { return <NotAllowed />; }

    return (
        <div className="py-3 w-lg-90 mx-auto">
            <Header header={pageHeader} />
            <div className="w-md-75 mx-auto">
                <div className="row">
                    <div className="col 4"></div>
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
                    <div className="col col-4 text-start">
                        <div className="btn-group" role="group">
                            <button type="button" className={`btn ${showWeekly ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => !showWeekly && changeScheduleType("class")}>
                                מערכת שבועית
                            </button>
                            <button type="button" className={`btn ${!showWeekly ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => showWeekly && changeScheduleType("grade")}                    >
                                מערכת יומית
                            </button>
                        </div>
                    </div>
                    <div className="col input-group">
                        {showWeekly &&
                            <>
                                {showSelects.class && classes &&
                                    <SelectItems filterBy="class" preText="" items={classes} defaultText=" בחירת כיתה" selectedValue={selectedIds.class} onSelect={handleSelect} />
                                }
                                {showSelects.teacher && teachers &&
                                    <SelectItems filterBy="teacher" preText="" items={teachers} defaultText="בחירת מורה" selectedValue={selectedIds.teacher} onSelect={handleSelect} />
                                }
                                {showSelects.room && rooms &&
                                    <SelectItems filterBy="room" preText="" items={rooms} defaultText="בחירת חדר" selectedValue={selectedIds.room} onSelect={handleSelect} />
                                }
                            </>}
                        {!showWeekly &&
                            <>
                                {showSelects.grade && grades &&
                                    <SelectItems filterBy="grade" preText="" items={grades} defaultText="בחירת שכבה" selectedValue={selectedIds.grade} onSelect={handleSelect} />
                                }
                                {showSelects.section && sections &&
                                    <SelectItems filterBy="section" preText="" items={sections} defaultText="בחירת חטיבה" selectedValue={selectedIds.section} onSelect={handleSelect} />
                                }
                                {(showSelects.grade || showSelects.section) && weekDays &&
                                    <SelectItems filterBy="weekDay" preText="" items={weekDays} defaultText="בחירת יום בשבוע" selectedValue={selectedIds.weekDay} onSelect={handleSelect} moreCss="ms-2" isBbColorSelectedValue="true" />
                                }
                            </>}
                        <FontAwesomeIcon className="my-auto ms-1" icon={showFilertMore ? "fas fa-circle-chevron-up" : "fas fa-circle-chevron-down"} onClick={() => handleFilertMoreClick()} />
                    </div>
                </div>
                <div className="row pt-3">
                    <div className="col col-4"></div>
                    <div className="col input-group">
                        {showFilertMore &&
                            <div className="d-flex ps-0">
                                <b className="">הצגת:</b>
                                <CheckboxControls controlDefinitions={controlDefinitions} controls={checkboxShowValue} setControls={setCheckboxShowValue} />
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
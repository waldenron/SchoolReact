import React, { useEffect, useState, useRef } from 'react'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DownloadTableExcel } from 'react-export-table-to-excel';

import { fetchData, getPageHeader } from '../utils/apiServices';
import { IconButton, Header, SelectItems, CheckboxControls, LoadingSpinner, NotAllowed, PrintButton, AddToCalendarLink, AddToCalendarIcon, MobileRotateAdvice } from './Common';
import { addTimeToDate, getNameById, getNextDateForWeekDay, toDate } from '../utils/utilityFunctions';

const days = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי'];

function LessonDesc({ time, number }) {
    return (
        <td className="text-center border border-dark bgLightGray px-0">
            שיעור {number}
            <br />
            <small>{time.start}-{time.end}</small>
        </td>
    )
}

const generateAddToCalendarLink = (lesson, dayIndex, time, showSubject, showTeacher, showClass, showRoom) => {
    let addToCalendarText = '';
    if (showSubject && lesson.subject) addToCalendarText += `${lesson.subject}`;
    if (showTeacher && lesson.teacher) addToCalendarText += ` - ${lesson.teacher}`;
    if (showClass && lesson.classesNames.length > 0) addToCalendarText += ` - {${lesson.classesNames}}`;
    if (showRoom && lesson.room) addToCalendarText += ` - [${lesson.room}]`;

    // Calculate start and end times
    const nextStartDate = addTimeToDate(getNextDateForWeekDay(dayIndex), time.start);
    const nextEndDate = addTimeToDate(getNextDateForWeekDay(dayIndex), time.end);

    return <AddToCalendarLink title={addToCalendarText.trim()} startTime={nextStartDate} endTime={nextEndDate} />;
};

function Lesson({ lessons = [], showSubject, showTeacher, showRoom, showClass, showAddToCalendar, dayIndex, time }) {
    return (
        <td className="text-center border border-dark px-0">
            {lessons.map((lesson, index) => (
                <div key={index} className="text-center bg-white">
                    {index > 0 && <hr className="my-1 mx-auto p-0 g-0 w-50" />}
                    {showSubject && lesson.subject && <> {lesson.subject} <br /> </>}
                    {showTeacher && lesson.teacher && <> {lesson.teacher} <br /> </>}
                    {showClass && lesson.classesNames.length > 0 && <> {`{${lesson.classesNames}}`} <br /> </>}
                    {showRoom && lesson.room && <> {`[${lesson.room}]`}  </>}
                    {showAddToCalendar && generateAddToCalendarLink(lesson, dayIndex, time, showSubject, showTeacher, showClass, showRoom)}
                </div>
            ))}
        </td>
    );
}
function downloadTableExcel(fileName, sheetName, tableRef) {
    return (
        <DownloadTableExcel filename={fileName} sheet={sheetName} currentTableRef={tableRef.current}>
            <button className="btn btn-sm btn-primary mb-1 no-print">יצוא לאקסל</button>
        </DownloadTableExcel>
    )
}

function DownloadTableExcel2({ filename, sheet, currentTableRef, children }) {

    const handleDownload = () => {
        const wb = XLSX.utils.table_to_book(currentTableRef.current, { sheet: sheet });
        XLSX.writeFile(wb, filename + ".xlsx");
    };

    return React.cloneElement(children, { onClick: handleDownload });
}
export function ExportToWord({ filename, tableRef }) {
    const handleExport = () => {
        let tableHTML = tableRef.current.outerHTML;

        // Create a blob of our table
        var blob = new Blob([tableHTML], {
            type: "application/msword;charset=utf-8"
        });

        saveAs(blob, filename.endsWith(".docx") ? filename : filename + ".docx");
    };

    return <button onClick={handleExport}>Export to Word</button>;
}
function sliceLessons(lessons, scheduleItems) {
    const minLessonId = Math.min(...scheduleItems.map(item => item.lessonId));
    const maxLessonId = Math.max(...scheduleItems.map(item => item.lessonId));
    return {
        sliced: lessons.slice(minLessonId - 1, maxLessonId),
        min: minLessonId
    };
}
function useTableReference() {
    const tableRef = useRef(null);
    const [isTableRefLoaded, setIsTableRefLoaded] = useState(false);

    useEffect(() => {
        if (tableRef.current) {
            setIsTableRefLoaded(true);
        }
    }, []);

    return [tableRef, isTableRefLoaded];
}

function Timetable({ headerContent, bodyContent, title, timeTableItem }) {
    const [tableRef, isTableRefLoaded] = useTableReference();

    return (
        <div className="container-fluid pt-3">
            <div className="d-flex d-flex justify-content-between">
                <h3 className="text-start">{title} - {timeTableItem}</h3>
                {/* {isTableRefLoaded && downloadTableExcel(title, "sheetName", tableRef)} */}
                {/* {isTableRefLoaded && <ExportToWord filename={title} tableRef={tableRef} />} */}
                {isTableRefLoaded && <DownloadTableExcel2 filename={title} sheet="Sheet1" currentTableRef={tableRef}>
                    <button className="btn btn-sm btn-primary mb-1 no-print">יצוא לאקסל</button>
                </DownloadTableExcel2>}
            </div>
            <table className="w-100" ref={tableRef}>
                <thead>
                    <tr className="bgLightGray no-gutters sticky-top">
                        <th className="border border-dark border-2 text-center"></th>
                        {headerContent}
                    </tr>
                </thead>
                <tbody>
                    {bodyContent}
                </tbody>
            </table>
        </div>
    );
}

const TimetableThCss = "border border-dark border-2 text-center";
function WeeklyTimetable({ checkboxShowValue, lessons, scheduleItems, timeTableItem, showAddToCalendar }) {

    const { showSubject, showTeacher, showRoom, showClass } = checkboxShowValue;

    const currentDayIndex = new Date().getDay();

    const activeDaysSet = new Set(scheduleItems.map(item => item.weekDay));
    const { sliced: slicedLessons, min: minLessonId } = sliceLessons(lessons, scheduleItems);


    const headerContent = days.map((day, index) => (
        activeDaysSet.has(index + 1) && (  // Only render if the day is in activeDaysSet
            <th key={index} className={`${TimetableThCss}${index === currentDayIndex ? " bgToday" : ""}`}>
                {day}
            </th>)
    ));

    const bodyContent = (
        slicedLessons.map((time, index) => {
            const lessonIndex = index + minLessonId - 1;
            return (
                <tr key={lessonIndex} className="bg-white">
                    <LessonDesc time={time} number={lessonIndex + 1} />
                    {days.map((_, dayIndex) => {
                        if (activeDaysSet.has(dayIndex + 1)) {
                            const lessonsForSlot = scheduleItems.filter(item => item.weekDay - 1 === dayIndex && item.lessonId - 1 === lessonIndex);
                            return <Lesson lessons={lessonsForSlot} showSubject={showSubject} showTeacher={showTeacher} showRoom={showRoom} showClass={showClass} showAddToCalendar={showAddToCalendar} dayIndex={dayIndex} time={time} key={dayIndex + '-' + lessonIndex} />;
                        }
                    })}
                </tr>
            );
        })
    );

    return <Timetable headerContent={headerContent} bodyContent={bodyContent} title="מערכת שעות שבועית" timeTableItem={timeTableItem} />;
}
function DailyTimetable({ checkboxShowValue, lessons, scheduleItems, classes, timeTableItem, showAddToCalendar, weekDay }) {
    const { showSubject, showTeacher, showRoom, showClass } = checkboxShowValue;

    const filteredScheduleItems = scheduleItems.filter(item =>
        classes.some(c => item.classesIds.includes(c.id.toString()))
    );
    const { sliced: slicedLessons, min: minLessonId } = sliceLessons(lessons, scheduleItems);

    if (!filteredScheduleItems.length) return <p className="text-center my-3 h3">אין שעות מערכת מתאימות לחתך</p>;
    const headerContent = classes.map(c => (
        <th key={c.id} className={TimetableThCss}>
            {c.name}
        </th>
    ));

    const bodyContent = (
        slicedLessons.map((time, index) => {
            const lessonIndex = index + minLessonId - 1;
            return (
                <tr key={lessonIndex} className="bg-white">
                    <LessonDesc time={time} number={lessonIndex + 1} />
                    {classes.map(c => {
                        const lessonsForSlot = filteredScheduleItems.filter(item =>
                            item.classesIds.includes(c.id.toString()) && item.lessonId - 1 === lessonIndex
                        );
                        return <Lesson lessons={lessonsForSlot} showSubject={showSubject} showTeacher={showTeacher} showRoom={showRoom} showClass={showClass} showAddToCalendar={showAddToCalendar} dayIndex={weekDay - 1} time={time} key={c.id + '-' + lessonIndex} />;
                    })}
                </tr>
            );
        })
    );

    return <Timetable headerContent={headerContent} bodyContent={bodyContent} title="מערכת שעות יומית" timeTableItem={timeTableItem} />;
}
export default function Schedule() {
    const [loading, setLoading] = useState(true);
    const [notAlowed, setNotAlowed] = useState(false);

    const [pageHeader, setPageHeader] = useState(null);
    const [studyYear, setStudyYear] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [isWithRooms, setIsWithRooms] = useState(false);
    const [isShowFilterAllSubject, setIsShowFilterAllSubject] = useState(false);
    const [name, setName] = useState(null);
    const [note, setNote] = useState(null);

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
    const [showAddToCalendar, setShowAddToCalendar] = useState(false);

    const rawDay = new Date().getDay();
    const today = rawDay === 6 ? 1 : rawDay + 1;  // +1 because your weekDays array starts with 1 for Sunday

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

    function handlePrevClick(item, itemArray, curId) {
        let prevIndex = itemArray.findIndex(item => item.id == curId) - 1;
        if (prevIndex < 0) prevIndex = itemArray.length - 1;
        let prevItem = itemArray[prevIndex];

        handleSelect(item, prevItem.id);
    }
    function handleNextClick(item, itemArray, curId) {
        let nextIndex = itemArray.findIndex(item => item.id == curId) + 1;
        if (nextIndex >= itemArray.length) nextIndex = 0;
        let nextItem = itemArray[nextIndex];

        handleSelect(item, nextItem.id);
    }


    function PrevButton({ item, itemArray, curId }) {
        return (
            <FontAwesomeIcon className="my-auto ms-2" icon={"fas fa-chevron-right"} role="button" onClick={() => handlePrevClick(item, itemArray, curId)} />
        );
    }
    function NextButton({ item, itemArray, curId }) {
        return (
            <FontAwesomeIcon className="my-auto ms-2" icon={"fas fa-chevron-left"} role="button" onClick={() => handleNextClick(item, itemArray, curId)} />
        );
    }

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
    function getFilteredScheduleText(type) {
        switch (type) {
            case "class": return "כיתה";
            case "teacher": return "מורה";
            // case "room": return "חדר";
            case "weekDay": return "יום";
            case "grade": return "שכבה";
            // case "section": return "חטיבה";
            default: return "";
        }
    }

    function renderTimetable(id, type, weekDay, timeTableItem) {
        if (id <= 0) return null;
        const filteredItems = !weekDay ? getFilteredScheduleItems(id, type) : getFilteredScheduleItems(weekDay, "weekDay");
        const filteredScheduleText = getFilteredScheduleText(type);
        if (filteredScheduleText?.length > 0) timeTableItem = timeTableItem ? `ל${getFilteredScheduleText(type)} ${timeTableItem}` : null;
        if (weekDay) {
            timeTableItem = `ל${days[weekDay - 1]} ${timeTableItem}`;
            const filterClasses = type === "grade" ?
                classes.filter(c => c.gradeId == id) :
                classes.filter(c => c.sectionId == id);
            return <DailyTimetable checkboxShowValue={checkboxShowValue} lessons={lessons} scheduleItems={filteredItems} classes={filterClasses} timeTableItem={timeTableItem} showAddToCalendar={showAddToCalendar} weekDay={weekDay} />;
        }
        else {
            return <WeeklyTimetable checkboxShowValue={checkboxShowValue} lessons={lessons} scheduleItems={filteredItems} timeTableItem={timeTableItem} showAddToCalendar={showAddToCalendar} />;
        }
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


            const { data: fetchedScheduleInfo } = await fetchData('/api/ScheduleInfo');
            setLastUpdate(fetchedScheduleInfo.lastUpdate);
            setStudyYear(fetchedScheduleInfo.studyYear);
            setIsWithRooms(fetchedScheduleInfo.isWithRooms);
            setIsShowFilterAllSubject(fetchedScheduleInfo.isShowFilterAllSubject);
            setName(fetchedScheduleInfo.name?.trim());
            setNote(fetchedScheduleInfo.note?.trim());


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
    const header = pageHeader && `${pageHeader} - ${studyYear}${name ? ` - ${name}` : ''}`;
    return (
        <div className="py-3 w-lg-90 mx-auto">
            <div className={note ? "" : "d-flex align-items-center"}>
                <MobileRotateAdvice />
                <Header header={header} />
                <div >
                    {note && <span className=""> {note}</span>}
                    {lastUpdate && <sub className="mx-1">עודכן {toDate(lastUpdate, "dd/MM")}</sub>}
                </div>
            </div>
            {classes && <div className="w-md-75 mx-auto no-print">
                <div className="row">
                    <div className="col-4"></div>
                    <div className="col">
                        <div className="d-flex justify-content-start flex-wrap">
                            {showWeekly &&
                                <>
                                    <IconButton show="class" icon="fas fa-user-group" text="לכיתה" isChose={showSelects.class} onClick={handleShowClick} />
                                    <IconButton show="teacher" icon="fas fa-chalkboard-user" text="למורה" isChose={showSelects.teacher} onClick={handleShowClick} />
                                    {isWithRooms && <IconButton show="room" icon="fas fa-house" text="לחדר" isChose={showSelects.room} onClick={handleShowClick} />}
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
                                    <>
                                        <PrevButton item="class" itemArray={classes} curId={selectedIds.class} />
                                        <SelectItems filterBy="class" preText="" items={classes} defaultText="בחירת כיתה" selectedValue={selectedIds.class} onSelect={handleSelect} />
                                        <NextButton item="class" itemArray={classes} curId={selectedIds.class} />
                                    </>
                                }
                                {showSelects.teacher && teachers &&
                                    <>
                                        <PrevButton item="teacher" itemArray={teachers} curId={selectedIds.teacher} />
                                        <SelectItems filterBy="teacher" preText="" items={teachers} defaultText="בחירת מורה" selectedValue={selectedIds.teacher} onSelect={handleSelect} />
                                        <NextButton item="teacher" itemArray={teachers} curId={selectedIds.teacher} />
                                    </>
                                }
                                {showSelects.room && rooms &&
                                    <>
                                        <PrevButton item="room" itemArray={rooms} curId={selectedIds.room} />
                                        <SelectItems filterBy="room" preText="" items={rooms} defaultText="בחירת חדר" selectedValue={selectedIds.room} onSelect={handleSelect} />
                                        <NextButton item="room" itemArray={rooms} curId={selectedIds.room} />
                                    </>
                                }
                            </>}
                        {!showWeekly &&
                            <>
                                {showSelects.grade && grades &&
                                    <>
                                        <PrevButton item="grade" itemArray={grades} curId={selectedIds.grade} />
                                        <SelectItems filterBy="grade" preText="" items={grades} defaultText="בחירת שכבה" selectedValue={selectedIds.grade} onSelect={handleSelect} />
                                        <NextButton item="grade" itemArray={grades} curId={selectedIds.grade} />
                                    </>
                                }
                                {showSelects.section && sections &&
                                    <SelectItems filterBy="section" preText="" items={sections} defaultText="בחירת חטיבה" selectedValue={selectedIds.section} onSelect={handleSelect} />
                                }
                                {(showSelects.grade || showSelects.section) && weekDays &&
                                    <>
                                        <PrevButton item="weekDay" itemArray={weekDays} curId={selectedIds.weekDay} />
                                        <SelectItems filterBy="weekDay" preText="" items={weekDays} defaultText="בחירת יום בשבוע" selectedValue={selectedIds.weekDay} onSelect={handleSelect} moreCss="ms-2" isBbColorSelectedValue="true" />
                                        <NextButton item="weekDay" itemArray={weekDays} curId={selectedIds.weekDay} />
                                    </>
                                }
                            </>}
                        <FontAwesomeIcon className="my-auto ms-2" icon={showFilertMore ? "fas fa-circle-chevron-up" : "fas fa-circle-chevron-down"} role="button" onClick={() => handleFilertMoreClick()} />
                        <PrintButton moreCss="ms-2" />
                    </div>
                </div>
                <div className="row pt-3">
                    <div className="col col-4"></div>
                    <div className="col input-group">
                        {showFilertMore &&
                            <div className="d-flex ps-0">
                                <b className="">הצגת:</b>
                                <CheckboxControls controlDefinitions={controlDefinitions} controls={checkboxShowValue} setControls={setCheckboxShowValue} />
                                {isShowFilterAllSubject && <div className="form-check form-switch ms-3 me-0">
                                    <input type="checkbox" id="SwitchFilterSubject" className="form-check-input"
                                        checked={showShowAllSubjects} onChange={() => setShowAllSubjects(prev => !prev)} />
                                    <label htmlFor="SwitchFilterSubject" className="form-check-label">כל המקצועות</label>
                                </div>}
                                {<div className="form-check form-switch ms-3 me-0">
                                    <input type="checkbox" id="SwitchShowAddToCalendar" className="form-check-input"
                                        checked={showAddToCalendar} onChange={() => setShowAddToCalendar(prev => !prev)} />
                                    <label htmlFor="SwitchShowAddToCalendar" className="form-check-label">הוספה ליומן <AddToCalendarIcon /></label>
                                </div>}
                            </div>
                        }
                    </div>
                </div>
            </div>}
            {renderTimetable(selectedIds.class, "class", null, classes.find(c => c.id == selectedIds.class)?.name)}
            {renderTimetable(selectedIds.teacher, "teacher", null, teachers.find(t => t.id == selectedIds.teacher)?.name)}
            {renderTimetable(selectedIds.room, "room", null, rooms.find(r => r.id == selectedIds.room)?.name)}
            {renderTimetable(selectedIds.grade, "grade", selectedIds.weekDay, grades.find(g => g.id == selectedIds.grade)?.name)}
            {renderTimetable(selectedIds.section, "section", selectedIds.weekDay, sections.find(s => s.id == selectedIds.section)?.name)}
        </div >
    )
}
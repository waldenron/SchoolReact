import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, useCourseigate, useParams } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Courses.css';
// import '../css/Course.css';

import { fetchData } from '../utils/apiServices';
import { Header, ItemIcon, Logo, getHomePageUrl } from './Common';
import { toPageTitle } from '../utils/utilityFunctions';


const CourseDetails = ({ id, courseItems, homePageUrl }) => {
    const courseItem = courseItems.find(courseItem => courseItem.id == id);

    document.title = toPageTitle(courseItem.header);

    return (
        courseItem && homePageUrl &&
        <div className="pb-5">
            <h2 className="text-center pt-3">
                {<ItemIcon itemIcon={courseItem.itemIcon} homePageUrl={homePageUrl} />}
                <span className="me-2 ms-0">
                {courseItem.header}
                </span>
            </h2>
            <div dangerouslySetInnerHTML={{ __html: courseItem.text }} />
        </div>)
};

const CourseItem = ({ courseItem, homePageUrl }) => {
    return (
        courseItem && homePageUrl &&
        <tr>
            <td className="col-1 icon">
                {<ItemIcon itemIcon={courseItem.itemIcon} homePageUrl={homePageUrl} />}
            </td>
            {/* <td className="col-11"><h5>{courseItem.header}</h5></td> */}
            <td className="col-11">
                <Link to={`/${"Courses"}/${courseItem.id}`} target="_blank" rel="noopener noreferrer"><h5>{courseItem.header}</h5></Link>
            </td>
        </tr>
    )
};
const CourseItems = ({ courseItems, homePageUrl }) => {
    return (
        <table className="table">
            <tbody>
                {courseItems.map((courseItem, index) => (
                    <CourseItem courseItem={courseItem} homePageUrl={homePageUrl} key={index} />
                ))}
            </tbody>
        </table>
    )
};

export default function Course() {
    const { id } = useParams();

    const [homePageUrl, setHomePageUrl] = useState(null);
    const [courseItems, setCourseItems] = useState([]);

    useEffect(() => {
        (async () => {
            const fetchedData = await fetchData('/api/Courses');
            setCourseItems(fetchedData);

            const fetchedUrl = await getHomePageUrl();
            setHomePageUrl(fetchedUrl);
        })();
    }, []);

    return (
        <div className="py-3 w-md-75 mx-auto">
            <Logo />
            <Header header="מגמות הלימוד" />
            {!id && courseItems.length > 0 && <CourseItems courseItems={courseItems} homePageUrl={homePageUrl} />}
            {id && courseItems.length > 0 && <CourseDetails id={id} courseItems={courseItems} homePageUrl={homePageUrl} />}
        </div>
    );
}
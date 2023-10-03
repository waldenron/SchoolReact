import React, { useState, useEffect } from 'react';
import { Link, useCourseigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Courses.css';
// import '../css/Course.css';

import { fetchData } from '../utils/apiServices';
import { Header, ItemIcon, Logo, getHomePageUrl } from './Common';


export const CourseItem = ({ courseItem, homePageUrl }) => {
    return (
        courseItem && homePageUrl &&
        <tr>
            <td className="col-1 icon">
                {<ItemIcon itemIcon={courseItem.itemIcon} homePageUrl={homePageUrl} />}
            </td>
            <td className="col-11"><h5>{courseItem.header}</h5></td>
        </tr>)
};
export default function Course() {
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
            <table className="table">
                <tbody>
                    {courseItems.map((courseItem, index) => (
                        <CourseItem courseItem={courseItem} homePageUrl={homePageUrl} key={index} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
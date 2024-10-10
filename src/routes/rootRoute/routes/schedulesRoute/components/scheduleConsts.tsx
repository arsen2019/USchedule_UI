import React, {useEffect, useState} from "react";
import {Card, Collapse, Col, CollapseProps} from "antd";
import {components} from "../../../../../types/api"
import {TLanguage, pageContent} from "../../core/pageContent";

const cardStyle = {
    width: '100%',
    borderRadius: '0px',
    marginBottom: '15px',

}
const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between'
}

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
export type TDayOfWeek = typeof DAYS_OF_WEEK[number];
export type TCourse = components["schemas"]["Course"]

function isCurrentCourse(course:TCourse): boolean {
    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();
    const [startHour, startMinutes] = course.start_time.split(":").map(Number);
    const [endHour, endMinutes] = course.end_time.split(":").map(Number);

    const startTime = startHour * 60 + startMinutes;
    const endTime = endHour * 60 + endMinutes;
    const currentTime = currentHour * 60 + currentMinutes - 500;

    return currentTime >= startTime && currentTime < endTime;
}

export const DayCard = ({day, courses, language}: { day: TDayOfWeek, courses: TCourse[], language: TLanguage }) => {
    const [activeKey, setActiveKey] = useState<string | string[]>("");
    const today = new Date().getDay();
    const currentDay: TDayOfWeek = today === 0 || today === 6 ? 'Monday' : DAYS_OF_WEEK[today - 1];

    useEffect(() => {

        if (day === currentDay) {
            const ongoingCourse = courses.find(course => {
                return isCurrentCourse(course)
            });

            if (ongoingCourse) {
                setActiveKey(ongoingCourse.uuid);
            }
        }
    }, [courses, day]);

    const items: CollapseProps['items'] = courses.map((course) => {
        const isOngoing = (isCurrentCourse(course) && day==currentDay)


            return {
                label: (<div style={{...headerStyle}} className={isOngoing ? 'ongoing-course' : ''}>
                    <span style={{width: '75%'}}>{course.name}</span>
                    <span style={{width: '20%'}}>{`${course.start_time}\n${course.end_time}`}</span>
                </div>),

                key: course.uuid,
                children: (
                    <>
                        <p>{`${pageContent.Teacher[language]}: ${course.teacher?.first_name}. ${course.teacher?.last_name}`}</p>
                        <p>{`${pageContent.Type[language]}: ${pageContent[course.type][language]}`}</p>
                        <p>{`${pageContent.Building[language]}: ${course.building?.name}`}</p>
                        <p>{`${pageContent.Room[language]}: ${course.room?.name}`}</p>
                    </>
                )
            }
    })

    const handleChange = (key : string | string[]) =>{
        setActiveKey(key)
    }

    return (
        <div>
            <Col>
                <Card style={cardStyle} title={pageContent[day][language]} bordered={true}>
                    {courses.length > 0 ? (
                        <Collapse accordion items={items} activeKey={activeKey} onChange={handleChange} />
                    ) : (
                        <p style={{margin: 0, textAlign: "center"}}>No Courses</p>
                    )}
                </Card>
            </Col>
        </div>

    );
};


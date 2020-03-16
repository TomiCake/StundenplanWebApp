import React from 'react';
import Lesson from './Lesson';
import LessonContent from './LessonContent';
import { equalPeriods } from '../../Selector/timetable';
import ExpandLesson from './Popover/ExpandLesson';
import LessonBadge from './LessonBadge';

function LessonEntity({ lesson }) {
    return (
        <ExpandLesson lesson={lesson}>
            <LessonBadge lesson={lesson}>
                <Lesson specificSubstitutionType={lesson.specificSubstitutionType}>
                    <LessonContent lesson={lesson}></LessonContent>
                </Lesson>
            </LessonBadge>
        </ExpandLesson>
    );
}

export default React.memo(LessonEntity, (prevProps, nextProps) => {
    if (nextProps.type !== prevProps.type) {
        return false;
    }

    const prevLesson = prevProps.lesson;
    const nextLesson = nextProps.lesson;
    return equalPeriods(prevLesson, nextLesson);
});

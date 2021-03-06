import React from 'react';
import styled from 'styled-components';
import AbstractLesson from './lesson';
import Absence from './absence';
import { equalPeriods } from '../Selector/timetable';
import { getFields } from './Fields';


class Period extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps.type !== this.props.type || nextProps.small !== this.props.small) {
            return true;
        }
        let l1 = this.props.lessons;
        let l2 = nextProps.lessons;
        if (l1.length !== l2.length) return true;
        for (let i = 0; i < l1.length; i++) {
            let o1 = l1[i];
            let o2 = l2[i];
            if (!equalPeriods(o1, o2)) {
                return true;
            }
        }
        return false;
    }
    render() {
        const { lessons, type, small, supervisions, continueation, setTimeTable } = this.props;
        if (!lessons || !type) {
            return null;
        }
        return (
            <PeriodsContainer>
                {this.props.children}
                {lessons.map((lesson, i) => {
                    let { classes, subject, teachers, room, ...other } = lesson;
                    if (other.absence) {
                        return (
                            <Absence
                                {...other}
                                key={other.absence.ABSENCE_ID}
                                table
                            />
                        );
                    } else {
                        return (
                            <AbstractLesson
                                {...other}
                                continueation={continueation}
                                key={lesson.reference.TIMETABLE_ID || -i}
                                supervisions={supervisions}
                                last={lessons.length - 1 === i}
                                multiple={lessons.length > 1}
                                small={small}
                                setTimeTable={setTimeTable}
                                {...getFields(type)(lesson)}
                            />
                        );
                    }
                })}
            </PeriodsContainer>
        );
    }
}

const PeriodsContainer = styled.div`
    flex: 1;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    border-radius: 0px;
    flex-direction: column;
`;

export default Period;
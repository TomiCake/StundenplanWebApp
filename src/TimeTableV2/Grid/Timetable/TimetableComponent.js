import React from 'react';
import { makeStyles } from '@material-ui/core';
import Lesson from '../../Lesson/Lesson';
import LessonCell from '../LessonCell';
import HeaderCell from '../HeaderCell';
import Holiday from '../../Lesson/Holiday';
import Absence from '../../Lesson/Absence';
import DatesFooterContainer from '../../DatesFooter/DatesFooter.container';

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'grid',
            gridTemplateRows: props => `repeat(${props.rows},auto)`,
            gridAutoFlow: 'column',
            [theme.breakpoints.down('sm')]: {
                gridTemplateColumns: props => `20px repeat(${props.columns},1fr)`,
            },
            [theme.breakpoints.up('sm')]: {
                gridTemplateColumns: props => `70px repeat(${props.columns},1fr)`,
            },
        },
    }),
    { name: 'GridComponent' }
);

function Period(props) {
    const { row, dayObject, day, GridCellComponent, timetable, rows } = props;
    const period = row.period;
    const periodNumber = period.PERIOD_TIME_ID - 1;

    if (!dayObject || !dayObject.periods) {
        if (dayObject && dayObject.holiday) {
            if (periodNumber !== 1) return null;
            let isNextDay = (timetable[day - 1] || {}).holiday === dayObject.holiday;
            if (isNextDay) return null;
            let colSpan = timetable.slice(day).filter(dayX => dayX.holiday === dayObject.holiday).length;
            let mDate = dayObject.date
                ? dayObject.date
                    .clone()
                    .weekday(0)
                    .add(day, 'days')
                    .format('DD.MM')
                : null;

            return (
                <GridCellComponent
                    key={row.key}
                    rowspan={rows.filter(row => row.type === 'main').length}
                    colspan={colSpan}
                >
                    <Holiday date={mDate} holiday={dayObject.holiday}></Holiday>
                </GridCellComponent>
            );
        }

        return (
            <LessonCell key={row.key} GridCellComponent={GridCellComponent}>
                {periodNumber >= 1 && periodNumber < 9 - ((day * 2) % 3) && <Lesson></Lesson>}
            </LessonCell>
        );
    }
    const periodObject = dayObject.periods[periodNumber];
    if (!periodObject) {
        // empty cell
        return null;
    }
    return (
        <LessonCell
            GridCellComponent={GridCellComponent}
            rowspan={(periodObject.skip || 0) + 1}
            lessons={periodObject.lessons}
            key={row.key}
        />
    );
}

function Header(props) {
    const { row, dayObject, GridCellComponent, mode } = props;

    if (!dayObject) {
        return <GridCellComponent key={row.key}></GridCellComponent>;
    }
    return (
        <HeaderCell
            mode={mode}
            variant={row.variant}
            key={row.key}
            date={dayObject.date}
            GridCellComponent={GridCellComponent}
        ></HeaderCell>
    );
}

function AbsenceCell(props) {
    const { row, dayObject, GridCellComponent } = props;

    if (dayObject && dayObject.absences) {
        var content = (
            <>
                {dayObject.absences.map(absence => (
                    <Absence absence={absence} key={absence.ABSENCE_ID}></Absence>
                ))}
            </>
        );
    }
    return <GridCellComponent key={row.key}>{content}</GridCellComponent>;
}

function Footer(props) {
    const { row, dayObject, day, GridCellComponent, weekDays } = props;

    if (day !== 0) {
        return null;
    }
    return (
        <GridCellComponent key={row.key} colspan={weekDays.length}>
            <DatesFooterContainer date={dayObject.date}></DatesFooterContainer>
        </GridCellComponent>
    );
}

function GridComponent({ children, rows, timetable, type, GridCellComponent, index, mode }) {
    

    const weekDays = [ 0, 4, 3, 2, 1 ];
    const classes = useStyles({
        rows: rows.length || 10,
        columns: weekDays.length || 5,
    });
    console.log("test");
    return (
        <div className={classes.root}>
            {children}
            {weekDays.map(day => {
                console.log(day);
                const dayObject = timetable && timetable[day];
                return (
                    <React.Fragment key={day}>
                        {rows.map((row, i) => {
                            if (!dayObject) {
                                return <GridCellComponent key={row.key}></GridCellComponent>;
                            }
                            const props = {
                                rows, timetable, GridCellComponent, row, dayObject, day, weekDays, mode
                            };
                            switch (row.type) {
                                case 'absences':
                                    return <AbsenceCell {...props}/>;
                                case 'footer':
                                    return <Footer {...props} />;
                                case 'header':
                                    return <Header {...props} />;
                                case 'main':
                                    return <Period {...props} />;
                                default:
                            }
                            return <GridCellComponent key={row.key}></GridCellComponent>;
                        })}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default React.memo(GridComponent);

import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PeriodColumn from '../period';
import { WEEKDAY_NAMES, classNames } from '../../Common/const';
import { setTimeTable,  retryTimetable } from '../../Main/actions';
import Holiday from '../Holiday';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import RoomList from '../roomlist';
import Supervision from '../supervision';
import Absence from '../absence';
import { LinearProgress } from '@material-ui/core';
import PeriodCell from './periodCell';
import Offline from './offline';

class TimeTableGrid extends React.Component {

    shouldComponentUpdate(nextProps) {
        // controlled non-updating to update data in background
        const nextDetected = nextProps.counterChanged === 'detected';
        const nowDetected = this.props.counterChanged === 'detected';
        return (
            nextProps.offline !== this.props.offline
            || !!nextProps.currentTimetable
            || (nextDetected && !nowDetected)
            || (!nowDetected && nextProps.currentTimetable !== this.props.currentTimetable)
        );
    }

    periodTime(timeAsNumber) {
        const lpad2 = (number) => (number < 10 ? '0' : '') + number;
        return Math.floor(timeAsNumber / 100) + ':' + lpad2(timeAsNumber % 100);
    }

    renderPeriodTimes(period) {
        return (
            <Times key={period.PERIOD_TIME_ID}>
                <Time>{this.periodTime(period.START_TIME)}</Time>
                <Time>{this.periodTime(period.END_TIME)}</Time>
            </Times>
        );
    }

    renderPeriodHeader(period) {
        return (
            <Periods key={-period.PERIOD_TIME_ID}>
                <Tooltip
                    placement="right"
                    title={this.periodTime(period.START_TIME) + ' - ' + this.periodTime(period.END_TIME)}>
                    <Period>{period.PERIOD_TIME_ID - 1}.</Period>
                </Tooltip>
            </Periods>
        )
    }

    renderPeriodsColumn(day, periodNumber) {
        const { currentTimetable, periods, type, small, date, setTimeTable } = this.props;

        if (!currentTimetable) { return <TableCell key={day} rowSpan={1} />; }
        let dayObject = currentTimetable[day];
        if (dayObject.holiday) {
            if (periodNumber !== 1) return;
            let isNextDay = (currentTimetable[day - 1] || {}).holiday === dayObject.holiday;
            if (isNextDay) return;
            let colSpan = currentTimetable.slice(day).filter((dayX) => dayX.holiday === dayObject.holiday).length;
            let mDate = date ? date.clone().weekday(0).add(day, 'days').format("DD.MM") : null;
            return (
                <TableCell
                    key={day}
                    rowSpan={Object.values(periods).length}
                    style={{ padding: 0 }}
                    colSpan={colSpan}>
                    <Holiday holiday={dayObject.holiday} date={mDate} />
                </TableCell>
            );
        } else {
            let period = dayObject.periods[periodNumber - 1];
            if (!period) {
                return null;
            }
            return (
                <TableCell
                    key={day}
                    style={{
                        textAlign: 'center', padding: '0.5vmin', overflow: 'visible', fontSize: '100%'
                    }}
                    rowSpan={(period.skip || 0) + 1}>

                    {period.freeRooms ?
                        <RoomList
                            rooms={period.freeRooms}
                        />
                        :
                        <PeriodColumn
                            continueation={period.continueation}
                            lessons={period.lessons}
                            type={type}
                            small={small}
                            setTimeTable={setTimeTable}>
                            {period.supervision &&
                                <Supervision supervision={period.supervision} />
                            }
                        </PeriodColumn>
                    }
                </TableCell>
            );
        }
    }

    renderRows() {
        const { small, periods, offline, currentTimetable: timetable, retry } = this.props;
        return [
            this.renderAbsences(),
            this.renderUnmatchedAssignments(),
            ...(offline && !timetable ? [
                <Offline retry={retry}/>
            ] :
                Object.values(periods).map(period => (
                    <TableRow style={{ height: "100%" }} key={period.PERIOD_TIME_ID}>
                        <PeriodCell small={small}>
                            <div style={{ display: 'flex', alignContent: 'space-between', height: '100%' }}>
                                {small || this.renderPeriodTimes(period)}
                                {this.renderPeriodHeader(period)}
                            </div>
                        </PeriodCell>
                        {WEEKDAY_NAMES.map((name, i) => this.renderPeriodsColumn(i, period.PERIOD_TIME_ID))}
                    </TableRow>
                ))),
            ];
    }

    renderUnmatchedAssignments() {
        const { currentTimetable: timetable, small, me } = this.props;  
        if(!timetable || !me || !timetable.some((day) => !!day.unmatchedAssignments.length)) {
            return null;
        }
        return (
            <TableRow style={{ height: 'unset' }} key={-2}>
                <PeriodCell small={small}><Times>{small ? "HA" : "Hausaufgaben"}</Times></PeriodCell>
                {WEEKDAY_NAMES.map((name, i) => {
                    const day = timetable[i];
                    return (
                        <TableCell key={i} style={{ padding: 0, fontSize: '100%' }}>
                            {day.unmatchedAssignments && day.unmatchedAssignments.map(assignment => (
                                <Times key={assignment.id}><Time>{assignment.displayName}</Time></Times>
                            ))}
                        </TableCell>
                    );
                })}
            </TableRow>
        );
    }

    renderAbsences() {
        const { type, id, small, currentTimetable: timetable, offline } = this.props;
        if (!type || !id || offline) {
            return null;
        }
        if (!timetable) {
            return (
                <TableRow
                    key={-1}
                    style={{ height: 'unset' }}
                >
                    <PeriodCell small={small} />
                    <td colSpan={WEEKDAY_NAMES.length}>
                        <LinearProgress variant="query">
                        </LinearProgress>
                    </td>
                </TableRow>
            );
        }
        const absences = WEEKDAY_NAMES.map((name, i) => timetable[i]);
        if (absences.every(day => !day.absences)) {
            return null;
        }

        return (
            <TableRow style={{ height: 'unset' }} key={-1}>
                <PeriodCell small={small} />
                {WEEKDAY_NAMES.map((name, i) => {
                    const day = timetable[i];
                    return (
                        <TableCell key={i} style={{ padding: 0, fontSize: '100%' }}>
                            {day.absences && day.absences.map(absence => (
                                <Absence key={absence.ABSENCE_ID} absence={absence} />
                            ))}
                        </TableCell>
                    );
                })}
            </TableRow>
        );
    }

    render() {
        const { classes, small, print } = this.props;
        return (
            <div className={classNames(classes.root, (!small && !print) && classes.rootLarge)}>
                <GrayoutTable
                    className={classes.table}
                    disabled={this.props.counterChanged === 'detected'}
                >
                    <TableBody>
                        {this.renderRows()}
                    </TableBody>
                </GrayoutTable>
            </div>
        );
    }
}


const styles = theme => ({
    root: {
        overflowY: 'auto'
    },
    rootLarge: {
        maxHeight: `calc(100vh - ${180}px)`,
    },
    table: {
        backgroundColor: theme.palette.background.default,
        flexShrink: 0,
    },
});

const GrayoutTable = styled(Table)`
    ${props => props.disabled && `
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);
        filter: grayscale(100%);
        filter: gray;`
    }
    table-layout: fixed;
    width: 100%;
    height: 100%;
`;

const Times = styled.div`
    font-size:50%;
    flex:1;
    display: flex;
    flex-direction: column;
    padding: 1vmin;
    justify-content: center;
`;
const Time = styled.div`
        
`;
const Periods = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: bold;
    padding-left: 3px;
    flex:1;
`;
const Period = 'div';

const mapDispatchToProps = dispatch => {
    return {
        setTimeTable: (type, id) => dispatch(setTimeTable(type, id)),
        retry: () => dispatch(retryTimetable()),
    };
};

export default connect(null, mapDispatchToProps)(withStyles(styles, { withTheme: true })(TimeTableGrid));
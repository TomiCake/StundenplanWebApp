import { createSelector } from 'reselect'
import { getSpecificSubstitutionType, WEEKDAY_NAMES, getSubstitutionsCacheKey, getTimetableCacheKey } from '../Common/const';
import moment from 'moment';

const getTimetableState = (state) => state.timetable;
const getMasterdata = createSelector(getTimetableState, (state) => state.masterdata);
const getTimetables = createSelector(getTimetableState, (state) => state.timetables);
const getSubstitutions = createSelector(getTimetableState, (state) => state.substitutions);

const getDate = createSelector(getTimetableState, (state) => state.timetableDate);
const getWeekSelector = createSelector(getDate, (date) => moment(date).week());
const getYearSelector = createSelector(getDate, (date) => moment(date).year());

const getType = createSelector(getTimetableState, (state) => state.currentTimeTableType);
const getId = createSelector(getTimetableState, (state) => state.currentTimeTableId);
const getPeriods = createSelector(getTimetableState, (state) => state.masterdata.Period_Time);

const getCurrentTimetableSelector = createSelector(
    getTimetables,
    getType,
    getId,
    (timetables, type, id) => timetables[getTimetableCacheKey({ type, id })]
);
const getCurrentSubstitutionsSelector = createSelector(
    getSubstitutions,
    getType,
    getId,
    getWeekSelector,
    getYearSelector,
    (substitutions, type, id, week, year) => substitutions[getSubstitutionsCacheKey({ type, id, week, year })]
);




function translateTimetable(masterdata, timetable, substitutions, periods, type, id, date) {
    if (!timetable || !masterdata || !substitutions) return null;
    periods = Object.values(periods);
    let data = [];
    for (let x = 0; x < WEEKDAY_NAMES.length; x++) {
        let day = readTimetable(timetable, x, periods, date);
        if (substitutions) {
            joinSubstitutions(day, substitutions.substitutions[x], type, id);
        }
        skipDuplications(day, periods);
        translatePeriods(masterdata, day, periods);
        data[x] = day;
    }
    return data;
}
function joinSubstitutions(day, subOnDay, type, id) {
    if (!subOnDay) return;
    if (subOnDay.holiday) {
        day.holiday = subOnDay.holiday;
        day.periods = undefined;
    } else if (subOnDay.substitutions && day.periods) {

        subOnDay.substitutions.forEach((substitution) => {
            let period = day.periods[substitution.PERIOD - 1];
            if (!period) return;
            let lessons = period.lessons;
            if (lessons) {
                for (let i = 0; i < lessons.length; i++) {
                    let lesson = lessons[i];
                    if (lesson.TIMETABLE_ID === substitution.TIMETABLE_ID) {
                        let remove = !!['ROOM', 'TEACHER'].find((key) =>
                            type === key.toLowerCase()
                            && substitution[key + "_ID"] === lesson[key + "_ID"]
                            && substitution[key + "_ID_NEW"]
                            && lesson[key + "_ID"] !== substitution[key + "_ID_NEW"]
                        );
                        lessons[i] = {
                            substitutionRemove: remove,
                            substitutionType: substitution.TYPE,
                            substitutionText: substitution.TEXT,
                            specificSubstitutionType: getSpecificSubstitutionType(substitution),
                            CLASS_IDS: substitution.CLASS_IDS_NEW.length
                                ? substitution.CLASS_IDS_NEW : substitution.CLASS_IDS,
                            CLASS_IDS_ABSENT: substitution.CLASS_IDS_ABSENT,
                            TEACHER_ID: substitution.TEACHER_ID_NEW || lesson.TEACHER_ID,
                            SUBJECT_ID: substitution.SUBJECT_ID_NEW || lesson.SUBJECT_ID,
                            ROOM_ID: substitution.ROOM_ID_NEW || lesson.ROOM_ID,

                        };
                        return;
                    }
                }
            }
            if (!lessons) {
                period.lessons = lessons = [];
            }
            lessons.push({
                substitutionText: substitution.TEXT,
                substitutionRemove:
                    substitution.TEACHER_ID === id
                    && substitution.TEACHER_ID_NEW !== id,
                substitutionType: substitution.TYPE,
                CLASS_IDS: substitution.CLASS_IDS_NEW,
                TEACHER_ID: substitution.TEACHER_ID_NEW,
                SUBJECT_ID: substitution.SUBJECT_ID_NEW,
                ROOM_ID: substitution.ROOM_ID_NEW,
                specificSubstitutionType: getSpecificSubstitutionType(substitution),
            });
        });
    }
    if (subOnDay.absences) {
        let absences = day.absences = [];
        subOnDay.absences.forEach((absence) => {
            absences[absence.PERIOD_FROM] = {
                first: true,
                skip: absence.PERIOD_TO - absence.PERIOD_FROM + 1,
                text: absence.TEXT,
            };
            absences.length = absence.PERIOD_TO + 1;
            absences.fill({}, absence.PERIOD_FROM + 1, absence.PERIOD_TO + 1);
        });
    }

}
function comparePeriod(current, next) {
    if (!next || !current) return false;
    if (current.length !== next.length) return false;
    if (current.length === 0) return false;
    next = [...next];
    for (let i = 0; i < current.length; i++) {
        for (let j = 0; j < next.length; j++) {
            if (compareLesson(current[i], next[j])) {
                next.splice(j);
                break;
            }
        }
    }
    return next.length === 0;
}
function compareLesson(p1, p2) {
    if (p1.TEACHER_ID !== p2.TEACHER_ID
        || p1.SUBJECT_ID !== p2.SUBJECT_ID
        || p1.ROOM_ID !== p2.ROOM_ID)
        return false;
    let classIds1 = p1.CLASS_IDS || [];
    let classIds2 = p2.CLASS_IDS || [];

    if (!(classIds1.length === classIds2.length && classIds1.every((v, i) => classIds2.indexOf(v) >= 0)))
        return false;
    return true;
}

function skipDuplications(day, periods) {
    if (!day || !day.periods || day.holiday) {
        return;
    }
    for (let y = 0; y < periods.length; y++) {
        let current = day.periods[y];
        current.skip = 0;
        while (y + 1 < periods.length
            && comparePeriod(current.lessons, day.periods[y + 1].lessons)) {
            y++;
            delete day.periods[y];
            current.skip++;
        }
        if (current.lessons) {
            for (let i = 0; i < current.lessons.length; i++) {
                let last = current.lessons[i] = { ...current.lessons[i] };
                last.TEACHER_IDS = [last.TEACHER_ID];
                delete last.TEACHER_ID;
                for (let j = i + 1; j < current.lessons.length; j++) {
                    let lesson = current.lessons[j];
                    if (lesson.ROOM_ID === last.ROOM_ID
                        && lesson.SUBJECT_ID === last.SUBJECT_ID
                        && lesson.substitutionType === last.substitutionType) {
                        last.TEACHER_IDS.push(lesson.TEACHER_ID);
                        current.lessons.splice(j);
                    }
                }
            }
        }
    }
}
function readTimetable(_data, day, periods, date) {
    if (!_data) return {};
    let data = [];
    let timetableDate = moment(date).weekday(0).add(day, 'day');
    for (let y = 0; y < periods.length; y++) {
        let lessons = (_data[day] || [])[y + 1] || [];
        if (lessons) {
            lessons = lessons.filter((lesson) =>
                lesson.DATE_FROM
                && lesson.DATE_TO
                && moment(lesson.DATE_FROM.date).isBefore(timetableDate)
                && moment(lesson.DATE_TO.date).isAfter(timetableDate)
            );
        }
        data[y] = { lessons, date: timetableDate };
    }
    return { periods: data, date: timetableDate };
}

function translatePeriods(masterdata, day, periods) {
    if (day.holiday) {
        return day;
    }
    for (let y = 0; y < periods.length; y++) {
        if (day.periods[y] && day.periods[y].lessons) {
            translate(masterdata, day.periods[y]);
        }
    }
}

function translate(masterdata, period) {
    if (!period) return period;
    period.lessons = period.lessons.map((period) => ({
        substitutionText: period.substitutionText,
        substitutionType: period.substitutionType,
        specificSubstitutionType: period.specificSubstitutionType,
        substitutionRemove: period.substitutionRemove,
        teacher: period.TEACHER_IDS.map((t) => masterdata.Teacher[t]),
        subject: masterdata.Subject[period.SUBJECT_ID],
        room: masterdata.Room[period.ROOM_ID],
        classes: (period.CLASS_IDS || []).map((c) => masterdata.Class[c]),
        absentClasses: (period.CLASS_IDS_ABSENT || []).map((c) => masterdata.Class[c])
    }));
    return period;
}

const makeGetCurrentTimetable = () => {
    return createSelector(
        getMasterdata,
        getCurrentTimetableSelector,
        getCurrentSubstitutionsSelector,
        getPeriods,
        getType,
        getId,
        getDate,
        translateTimetable
    );
};

export default makeGetCurrentTimetable;

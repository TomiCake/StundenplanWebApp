import { createSelector } from 'reselect'
import computeUser from './user';
import { getTimetableCacheKey } from '../Common/const';

const getMasterdata = (state) => state.timetable.masterdata;
const getSelectedType = (state, props) => props.selectedType;
const getTimetables = state => state.timetable.timetables;

const getCurrentTimetableSelector = (timetables, type, id) => timetables[getTimetableCacheKey({ type, id })];
const sortName = (o1, o2) => (o1.LASTNAME || o1.NAME).localeCompare(o2.LASTNAME || o2.NAME);

const computeData = (masterdata, timetables, selectedType, user) => {
    let data = [
        ...(!user.id ? [] : [{
            upn: user.upn,
            type: user.type,
            id: user.id,
            favorite: true,
            text: `${user.firstname} ${user.lastname}`,
            secondary: "",
            progress: getCurrentTimetableSelector(timetables, user.type, user.id) ? 100 : 0,
        }]),
    ];
    if (selectedType === 'teacher') {
        data.push(...Object.values(masterdata.Teacher).sort(sortName).map((entry) => ({
            upn: entry.UPN,
            type: "teacher",
            id: entry.TEACHER_ID,
            text: entry.FIRSTNAME[0] + '. ' + entry.LASTNAME,
            secondary: "Lehrer",
            progress: getCurrentTimetableSelector(timetables, 'teacher', entry.TEACHER_ID) ? 100 : 0,
        })))
    } else if (selectedType === 'room') {
        data.push(...Object.values(masterdata.Room).sort(sortName).map((entry) => ({
            type: "room",
            id: entry.ROOM_ID,
            text: entry.NAME,
            secondary: "Raum",
            progress: getCurrentTimetableSelector(timetables, 'room', entry.ROOM_ID) ? 100 : 0,            
        })))
    } else {
        const classId = selectedType;
        data.push(...Object.values(masterdata.Student).filter(student => student.CLASS_ID === classId).sort(sortName).map((entry) => ({
            upn: entry.UPN,
            type: "student",
            id: entry.STUDENT_ID,
            text: entry.FIRSTNAME + " " + entry.LASTNAME,
            secondary: "Schüler (" + (masterdata.Class[entry.CLASS_ID] || {}).NAME + ")",
            progress: getCurrentTimetableSelector(timetables, 'student', entry.STUDENT_ID) ? 100 : 0,            

        })));
    }
    return data;
}


const makeGetSelectionList = () => {
    return createSelector(getMasterdata, getTimetables, getSelectedType, computeUser, computeData);
};

export default makeGetSelectionList;
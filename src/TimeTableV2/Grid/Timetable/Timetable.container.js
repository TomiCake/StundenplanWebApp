import { connect } from 'react-redux';
import makeGetCurrentTimetable from '../../../Selector/timetable';
import TimetableComponent from './TimetableComponent';
const mapStateToProps = () => {
    const getCurrentTimetable = makeGetCurrentTimetable();

    return (state, props) => {
        return {
            timetable: getCurrentTimetable(state, props),
        }
    }
}


export default connect(mapStateToProps, undefined)(TimetableComponent);

const actionRedirector = store => next => action => {
    next(action);
    switch (action.type) {
        case 'RETRY_TIMETABLE':
        case 'NETWORK_ONLINE':
        case 'GET_TIMETABLE':
        case 'SET_TIMETABLE':
        case 'ADD_TIMETABLE':
        case 'SET_MY_TIMETABLE':
        case 'GET_ME_RECEIVED':
        case 'COUNTER_CHANGED':
        case 'COUNTER_RECEIVED':
        case 'CHANGE_WEEK':
        case 'SET_DATE': {
            let { currentProfiles } = store.getState().timetable;
            let profileIn = action.payload;
            let profiles = (profileIn && profileIn.type && profileIn.id) ? [profileIn] : (currentProfiles || []);
            profiles.forEach(profile => {
                if (!profile) return;
                next({ type: 'GET_TIMETABLE', payload: profile });
                next({
                    type: 'GET_SUBSTITUTIONS',
                    payload: profile,
                });
            })

            break;
        }
        default:
    }
};

export default actionRedirector;

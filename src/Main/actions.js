
export function loadMe() {
    return { type: "GET_ME" };
}

export function checkCounter() {
    return { type: "GET_COUNTER" };
}

export function counterChanged(counterChanged) {
    return (dispatch) => {
        dispatch({ type: "COUNTER_CHANGED", payload: counterChanged });
        if (counterChanged) {
            dispatch(loadMe());
            dispatch(loadMasterData());
        }
    }
}

export function loadProfilePicture() {
    return { type: "GET_PROFILE_PICTURE" };
}

export function loadProfilePictureSmall() {
    return { type: "GET_PROFILE_PICTURE_SMALL" };
}

export function loadAvatars(upns) {
    return { type: "GET_BATCH_AVATARS", payload: upns };
}

export function showError(text) {
    return { type: "_ERROR", payload: { text } };
}

export function clearErrors() {
    return { type: "CLEAR_ERROR", payload: null };
}

export function setTimeTable(type, id) {
    return { type: "SET_TIMETABLE", payload: { type, id } };
}

export function setNotification({ newToken, oldToken }) {
    return { type: "SET_NOTIFICATION", payload: { newToken, oldToken } };
}

export function changeWeek(direction, id, type) {
    return { type: "CHANGE_WEEK", payload: { direction, id, type } };
}
export function setMyTimetable() {
    return (dispatch, getState) => {
        let { id, type } = getState().user;
        if (id && type) {
            dispatch({ type: "SET_MY_TIMETABLE", payload: { id, type } });
        }    
    };
}

export function loadMasterData() {
    return {
        type: "GET_MASTERDATA"
    };
}
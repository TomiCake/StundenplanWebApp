import moment from 'moment';

const initialState = {
    type: null,
    id: null,
    upn: null,
    loading: false,
    counter: 0,
    counterChanged: true,
    lastUpdate: null,
    lastCheck: null,
    warning: true,
    notifications: false,
    themeType: 'light',
    favorites: null,
};

export default function userReducer(state = initialState, action = {}) {
    switch (action.type) {
        case "LOGOUT": {
            return {
                
            };
        }
        case "COUNTER_RECEIVED":
            return {
                ...state,
                counterChanged: state.counter !== action.payload.COUNTER ? 'detected' : 'none',
                counter: action.payload.COUNTER,
                lastUpdate: +moment(action.payload.LAST_CHANGE.date),
                lastCheck: +moment(),
                offline: false
            };
        case "REFRESH_COMPLETE":
            return {
                ...state,
                counterChanged: 'none',
            };
        case "REFRESH_LOADING":
            return {
                ...state,
                counterChanged: 'loading',
            };
        case "CHANGE_THEME":
            return {
                ...state,
                themeType: action.payload,
            };
        case "COUNTER_ERROR":
            return {
                ...state,
                offline: true
            };
        case "GET_ME":
            return {
                ...state,
                loading: true
            };
        case "GET_ME_ERROR":
            return {
                ...state,
                loading: false
            };
        case "GET_ME_RECEIVED":
            return {
                ...state,
                loading: false,
                ...action.payload,
            };
        case "PATCH_REMIND_SETTINGS":
            return {
                ...state,
                loading: true
            };
        case "FEEDBACK_RECEIVED":
            return {
                ...state,
                feedbackSuccess: true,
            }
        case "PROFILE_PICTURE_RECEIVED":
            return {
                ...state,
                profilePicture: URL.createObjectURL(action.payload.blob)
            };
        case "PROFILE_PICTURE_SMALL_RECEIVED":
            return {
                ...state,
                profilePictureSmall: URL.createObjectURL(action.payload.blob)
            };
        case "SET_NOTIFICATION_RECEIVED":
            return {
                ...state,
                notificationToken: action.payload.newToken && action.payload.newToken.TOKEN
            };
        case "ADD_FAVORITE":
            return {
                ...state,
                favorites: [...state.favorites, action.payload]
            };
        case "REMOVE_FAVORITE":
            return {
                ...state,
                favorites: [...state.favorites.filter((fav) => fav !== action.payload)]
            };
 
        default:
            return state;
    }
}
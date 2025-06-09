import actions from "./actions";

const {
    GET_CAMPUS_APP_SESSION_DATA_BEGIN,
    GET_CAMPUS_APP_SESSION_DATA_SUCCESS,
    GET_CAMPUS_APP_SESSION_DATA_ERR,

} = actions;

//----INITIAL-STATES----//

const getCampusAppUsageInitialstate = {
    data: null,
    loading: false,
    error: null,
};


//--------REDUCERS-------//

const getCampusAppsUsageReducer = (state = getCampusAppUsageInitialstate, action) => {
    const { type, data, err } = action;
    switch (type) {
        case GET_CAMPUS_APP_SESSION_DATA_BEGIN:
            return {
                ...state,
                loading: true,
            };

        case GET_CAMPUS_APP_SESSION_DATA_SUCCESS:
            return {
                ...state,
                data,
                error: false,
                loading: false,
            };

        case GET_CAMPUS_APP_SESSION_DATA_ERR:
            return {
                ...state,
                error: err,
                loading: false,
            };

        default:
            return state;
    }
};

export {
    getCampusAppsUsageReducer,
}

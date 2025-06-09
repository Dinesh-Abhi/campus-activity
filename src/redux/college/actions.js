const actions = {

    GET_CAMPUS_APP_SESSION_DATA_BEGIN: 'GET_CAMPUS_APP_SESSION_DATA_BEGIN',
    GET_CAMPUS_APP_SESSION_DATA_SUCCESS: 'GET_CAMPUS_APP_SESSION_DATA_SUCCESS',
    GET_CAMPUS_APP_SESSION_DATA_ERR: 'GET_CAMPUS_APP_SESSION_DATA_ERR',
  
    // getCampusAppUsageData
    getCampusAppUsageDataBegin: () => {
        return {
            type: actions.GET_CAMPUS_APP_SESSION_DATA_BEGIN,
        };
    },
    getCampusAppUsageDataSuccess: (data) => {
        return {
            type: actions.GET_CAMPUS_APP_SESSION_DATA_SUCCESS,
            data,
        };
    },
    getCampusAppUsageDataErr: (err) => {
        return {
            type: actions.GET_CAMPUS_APP_SESSION_DATA_ERR,
            err,
        };
    },
    
};



export default actions;

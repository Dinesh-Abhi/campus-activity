import actions from "./actions";

const {
    GET_ALL_SIDEBARDATA_BEGIN,
    GET_ALL_SIDEBARDATA_SUCCESS,
    GET_ALL_SIDEBARDATA_ERR,

    GET_DASHBOARD_CHARTS_BEGIN,
    GET_DASHBOARD_CHARTS_SUCCESS,
    GET_DASHBOARD_CHARTS_ERR,

    SANCHIT_DASHBOARD_TABLE_BEGIN,
    SANCHIT_DASHBOARD_TABLE_SUCCESS,
    SANCHIT_DASHBOARD_TABLE_ERR,

} = actions;

//----INITIAL-STATES----//
const getAllSidebarDataInitialstate = {
    data: null,
    loading: false,
    error: null,
};

const getDrugModalitiesInitialstate = {
    data: null,
    loading: false,
    error: null,
};

const postDrugModalitiesInitialstate = {
    data: null,
    loading: false,
    error: null,
};

//--------REDUCERS-------//
const getAllSidebarDataReducer = (state = getAllSidebarDataInitialstate, action) => {
    const { type, data, err } = action;
    switch (type) {
        case GET_ALL_SIDEBARDATA_BEGIN:
            return {
                ...state,
                loading: true,
            };

        case GET_ALL_SIDEBARDATA_SUCCESS:
            return {
                ...state,
                data,
                error: false,
                loading: false,
            };

        case GET_ALL_SIDEBARDATA_ERR:
            return {
                ...state,
                error: err,
                loading: false,
            };

        default:
            return state;
    }
};

const getSanchitDashboardChartsReducer = (state = getDrugModalitiesInitialstate, action) => {
    const { type, data, err } = action;
    switch (type) {
        case GET_DASHBOARD_CHARTS_BEGIN:
            return {
                ...state,
                loading: true,
            };

        case GET_DASHBOARD_CHARTS_SUCCESS:
            return {
                ...state,
                data,
                error: false,
                loading: false,
            };

        case GET_DASHBOARD_CHARTS_ERR:
            return {
                ...state,
                error: err,
                loading: false,
            };

        default:
            return state;
    }
};

const getSanchitTableReducer = (state = postDrugModalitiesInitialstate, action) => {
    const { type, data, err } = action;
    switch (type) {
        case SANCHIT_DASHBOARD_TABLE_BEGIN:
            return {
                ...state,
                loading: true,
            };

        case SANCHIT_DASHBOARD_TABLE_SUCCESS:
            return {
                ...state,
                data,
                error: false,
                loading: false,
            };

        case SANCHIT_DASHBOARD_TABLE_ERR:
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
    getAllSidebarDataReducer,
    getSanchitDashboardChartsReducer,
    getSanchitTableReducer,
}

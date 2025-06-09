const actions = {

    GET_DASHBOARD_CHARTS_BEGIN: 'GET_DASHBOARD_CHARTS_BEGIN',
    GET_DASHBOARD_CHARTS_SUCCESS: 'GET_DASHBOARD_CHARTS_SUCCESS',
    GET_DASHBOARD_CHARTS_ERR: 'GET_DASHBOARD_CHARTS_ERR',

    SANCHIT_DASHBOARD_TABLE_BEGIN: 'SANCHIT_DASHBOARD_TABLE_BEGIN',
    SANCHIT_DASHBOARD_TABLE_SUCCESS: 'SANCHIT_DASHBOARD_TABLE_SUCCESS',
    SANCHIT_DASHBOARD_TABLE_ERR: 'SANCHIT_DASHBOARD_TABLE_ERR',

    // getdashboardCharts
    getDashboardChartsBegin: () => {
        return {
            type: actions.GET_DASHBOARD_CHARTS_BEGIN,
        };
    },
    getDashboardChartsSuccess: (data) => {
        return {
            type: actions.GET_DASHBOARD_CHARTS_SUCCESS,
            data,
        };
    },
    getDashboardChartsErr: (err) => {
        return {
            type: actions.GET_DASHBOARD_CHARTS_ERR,
            err,
        };
    },

    // sanchitDashboardTable
    SanchitDashboardTableBegin: () => {
        return {
            type: actions.SANCHIT_DASHBOARD_TABLE_BEGIN,
        };
    },
    SanchitDashboardTableSuccess: (data) => {
        return {
            type: actions.SANCHIT_DASHBOARD_TABLE_SUCCESS,
            data,
        };
    },
    SanchitDashboardTableErr: (err) => {
        return {
            type: actions.SANCHIT_DASHBOARD_TABLE_ERR,
            err,
        };
    },

};



export default actions;

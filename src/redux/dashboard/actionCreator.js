import { DataService } from "../../components/config/dataservice";
import actions from "./actions";
import Cookies from 'js-cookie';
const {

  getDashboardChartsBegin,
  getDashboardChartsSuccess,
  getDashboardChartsErr,

  SanchitDashboardTableBegin,
  SanchitDashboardTableSuccess,
  SanchitDashboardTableErr,


} = actions;

// Fetching Sanchith Dashboard Data for charts
const GetSanchithData = (range) => {
  return async (dispatch) => {
    try {
      await dispatch(getDashboardChartsBegin());
      const dbconfig = Cookies.get("dbconfig") || "sanchit";  // Default to 'sanchit'
      const response = await DataService.get(`/getsessionsdata.php?range=${range}&env=${dbconfig}`);
      if (response && response.status === 200 && response.data !== null) {
        await dispatch(getDashboardChartsSuccess(response.data));
      } else if (response && response.status === 200 && response.data === null) {
        await dispatch(getDashboardChartsSuccess([]));
      } else {
        await dispatch(getDashboardChartsSuccess([]));
        // message.error("Something went wrong");
        throw response.data?.message;
      }
    } catch (err) {
      await dispatch(getDashboardChartsErr(err));
    }
  };
};



// sanchit dashboard table data
const SanchitDashboardTableData = (range) => {
  return async (dispatch) => {
    try {
      dispatch(SanchitDashboardTableBegin());
      const dbconfig = Cookies.get("dbconfig") || "sanchit";  // Default to 'sanchit'
      const response = await DataService.get(`/fetchtodaysession.php?range=${range}&env=${dbconfig}`);
      if (response.data && response.data !== null) {
        await dispatch(SanchitDashboardTableSuccess(response.data));
      }
      else {
        await dispatch(SanchitDashboardTableSuccess(null));
        throw response.data.message;
      }
    }
    catch (err) {
      dispatch(SanchitDashboardTableErr(err));
    }
  }
};



export {
  GetSanchithData,
  SanchitDashboardTableData,
};


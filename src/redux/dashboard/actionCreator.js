import { DataService } from "../../components/config/dataservice";
import actions from "./actions";
import Cookies from 'js-cookie';

const {
  getAllSidebarDataBegin,
  getAllSidebarDataSuccess,
  getAllSidebarDataErr,

  getDashboardChartsBegin,
  getDashboardChartsSuccess,
  getDashboardChartsErr,

  SanchitDashboardTableBegin,
  SanchitDashboardTableSuccess,
  SanchitDashboardTableErr,
} = actions;

// Fetching all campus apps data for the sidebar
const GetAllCampusAppsData = () => {
  return async (dispatch) => {
    try {
      await dispatch(getAllSidebarDataBegin());
      let url = "/tools_clg_list.php";      
      const response = await DataService.get(url);
      if (response && response.status === 200 && response.data !== null) {
        await dispatch(getAllSidebarDataSuccess(response.data));
      } else if (
        response &&
        response.status === 200 &&
        response.data === null
      ) {
        await dispatch(getAllSidebarDataSuccess([]));
      } else {
        await dispatch(getAllSidebarDataSuccess([]));
        throw response.data?.message;
      }
    } catch (err) {
      await dispatch(getAllSidebarDataErr(err));
    }
  };
};
// Fetching Sanchith Dashboard Data for charts
const GetSanchithData = (range) => {
  return async (dispatch) => {
    try {
      await dispatch(getDashboardChartsBegin());
      const dbconfig = Cookies.get("dbconfig");
      
      // Conditionally create the URL based on dbconfig
      let url = `/getsessionsdata.php?range=${range}`;
      if (dbconfig) {
        url += `&env=${dbconfig}`;
      }

      const response = await DataService.get(url);

      if (response && response.status === 200 && response.data !== null) {
        await dispatch(getDashboardChartsSuccess(response.data));
      } else if (response && response.status === 200 && response.data === null) {
        await dispatch(getDashboardChartsSuccess([]));
      } else {
        await dispatch(getDashboardChartsSuccess([]));
        throw response.data?.message;
      }
    } catch (err) {
      await dispatch(getDashboardChartsErr(err));
    }
  };
};

// Sanchit dashboard table data
const SanchitDashboardTableData = (range) => {
  return async (dispatch) => {
    try {
      dispatch(SanchitDashboardTableBegin());
      const dbconfig = Cookies.get("dbconfig");
      
      // Conditionally create the URL based on dbconfig
      let url = `/fetchtodaysession.php?range=${range}`;
      if (dbconfig) {
        url += `&env=${dbconfig}`;
      }

      const response = await DataService.get(url);

      if (response.data && response.data !== null) {
        await dispatch(SanchitDashboardTableSuccess(response.data));
      } else {
        await dispatch(SanchitDashboardTableSuccess(null));
        throw response.data?.message;
      }
    } catch (err) {
      dispatch(SanchitDashboardTableErr(err));
    }
  };
};

export {
  GetAllCampusAppsData,
  GetSanchithData,
  SanchitDashboardTableData,
};

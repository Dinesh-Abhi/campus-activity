import { DataService } from "../../components/config/dataservice";
import actions from "./actions";
import Cookies from 'js-cookie';

const {

  // getCampusAppUsageData
  getCampusAppUsageDataBegin,
  getCampusAppUsageDataSuccess,
  getCampusAppUsageDataErr,


} = actions;

// Fetching Sanchith Dashboard Data for charts
const GetCampusAppsUsageData = (collegecode) => {
  return async (dispatch) => {
    try {
      await dispatch(getCampusAppUsageDataBegin());
      const dbconfig = Cookies.get("dbconfig") || "sanchit";  // Default to 'sanchit'
      const response = await DataService.get(`collegewisetoolsessions.php?college=${collegecode.toUpperCase()}&env=${dbconfig}`);
      if (response && response.status === 200 && response.data !== null) {
        await dispatch(getCampusAppUsageDataSuccess(response.data));
      } else if (response && response.status === 200 && response.data === null) {
        await dispatch(getCampusAppUsageDataSuccess([]));
      } else {
        await dispatch(getCampusAppUsageDataSuccess([]));
        message.error("Something went wrong");
        throw response.data?.message;
      }
    } catch (err) {
      await dispatch(getCampusAppUsageDataErr(err));
    }
  };
};



export {
  GetCampusAppsUsageData,
};


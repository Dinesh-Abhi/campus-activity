import { DataService } from "../../components/config/dataservice";
import actions from "./actions";
import Cookies from 'js-cookie';

const {
  // getCampusAppUsageData
  getCampusAppUsageDataBegin,
  getCampusAppUsageDataSuccess,
  getCampusAppUsageDataErr,
} = actions;

// Fetching Campus App Usage Data
const GetCampusAppsUsageData = (collegecode) => {
  return async (dispatch) => {
    try {
      await dispatch(getCampusAppUsageDataBegin());
      const dbconfig = Cookies.get("dbconfig");  // Get dbconfig (or undefined if it doesn't exist)

      // Conditionally create the URL based on dbconfig
      let url = `collegewisetoolsessions.php?college=${collegecode.toUpperCase()}`;
      if (dbconfig) {
        url += `&env=${dbconfig}`;
      }

      const response = await DataService.get(url);

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

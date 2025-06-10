// redux/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import {
  getAllSidebarDataReducer,
  getSanchitDashboardChartsReducer,
  getSanchitTableReducer,
} from "./dashboard/reducers";
import { getCampusAppsUsageReducer } from "./college/reducers";

const rootReducers = combineReducers({
  // drugmodalities reducers
  getAllSidebarDataReducerRes: getAllSidebarDataReducer,
  getSanchitDashboardChartsRes: getSanchitDashboardChartsReducer,
  getSanchitTableReducerRes: getSanchitTableReducer,

  //campus app usage reducers
  getCampusAppUsageReducerRes: getCampusAppsUsageReducer,
  
});

export default rootReducers;

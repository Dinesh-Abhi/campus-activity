// redux/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import {
  getSanchitDashboardChartsReducer,
  getSanchitTableReducer,
} from "./dashboard/reducers";
import { getCampusAppsUsageReducer } from "./college/reducers";

const rootReducers = combineReducers({
  // drugmodalities reducers
  getSanchitDashboardChartsRes: getSanchitDashboardChartsReducer,
  getSanchitTableReducerRes: getSanchitTableReducer,

  //campus app usage reducers
  getCampusAppUsageReducerRes: getCampusAppsUsageReducer,
  
});

export default rootReducers;

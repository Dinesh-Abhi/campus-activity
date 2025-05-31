// redux/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import {
  getDrugModalitiesReducer,
  postDrugModalitiesReducer,
  updateDrugModalitiesReducer,
} from "./drugmodailities/reducers";


const rootReducers = combineReducers({
  // drugmodalities reducers
  getDrugModalitiesReducerRes: getDrugModalitiesReducer,
  getSanchitTableReducerRes: postDrugModalitiesReducer,
  updateDrugModalitiesReducerRes: updateDrugModalitiesReducer,

  
});

export default rootReducers;

import { DataService } from "../../components/config/dataservice";
import actions from "./actions";

const {

    getDrugModalitesBegin,
    getDrugModalitesSuccess,
    getDrugModalitesErr,

    postDrugModalityBegin,
    postDrugModalitySuccess,
    postDrugModalityErr,

    updateDrugModalitiesBegin,
    updateDrugModalitiesSuccess,
    updateDrugModalitiesErr,


} = actions;

// get-drugmodalities-details
const GetSanchithData = () => {
  return async (dispatch) => {
    try {
      await dispatch(getDrugModalitesBegin());
      const response = await DataService.get('/fetchdata2.php');
      if (response && response.status === 200 && response.data !== null) {
        await dispatch(getDrugModalitesSuccess(response.data));
      } 
      else if (response && response.status === 200 && response.data === null) {
        await dispatch(getDrugModalitesSuccess([]));
      }
      else {
          await dispatch(getDrugModalitesSuccess([]));
          message.error("Something went wrong");
          throw response.data.message;
      }
    } catch (err) {
      await dispatch(getDrugModalitesErr(err));
    }
  };
};



// uploaddrug-modalities
const SanchitDashboardTableData = () => {
  return async (dispatch) => {
    try {
      dispatch(postDrugModalityBegin());
      const response = await DataService.get(`/fetchtodaysession.php`);
      if (response.data && response.data !== null) {
        await dispatch(postDrugModalitySuccess(response.data));
      }
      else {
        await dispatch(postDrugModalitySuccess(null));      
        throw response.data.message;
      }
    }
    catch (err) {
      dispatch(postDrugModalityErr(err));
    }
  }
};

const UpdateDrugModalities = (values) => {
  return async (dispatch) => {
    try {
      dispatch(updateDrugModalitiesBegin());
      const response = await DataService.post(`/drug-modality/update`, values);
      if (response.data && response.data.Error === false) {
        await dispatch(updateDrugModalitiesSuccess(response.data));
        message.success(response.data.message);
      } else {
        await dispatch(updateDrugModalitiesSuccess(null));
        if (response.data && response.data.Error === true) {
          message.error(response.data.message);
        }
        throw response.data.message;
      }
    } catch (err) {
      dispatch(updateDrugModalitiesErr(err));
    }
  };
};


export {
  GetSanchithData,
  SanchitDashboardTableData,
  UpdateDrugModalities,
};


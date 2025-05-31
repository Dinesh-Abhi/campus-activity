import actions from "./actions";

const {
    GET_DRUG_MODALITIES_BEGIN,
    GET_DRUG_MODALITIES_SUCCESS,
    GET_DRUG_MODALITIES_ERR,

    POST_DRUG_MODALITIES_BEGIN,
    POST_DRUG_MODALITIES_SUCCESS,
    POST_DRUG_MODALITIES_ERR,

    UPDATE_DRUG_MODALITIES_BEGIN,
    UPDATE_DRUG_MODALITIES_SUCCESS,
    UPDATE_DRUG_MODALITIES_ERR,

} = actions;

//----INITIAL-STATES----//

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

const updateDrugModalitiesInitialstate = {
    data: null,
    loading: false,
    error: null,
};

//--------REDUCERS-------//

const getDrugModalitiesReducer = (state = getDrugModalitiesInitialstate, action) => {
    const { type, data, err } = action;
    switch (type) {
        case GET_DRUG_MODALITIES_BEGIN:
            return {
                ...state,
                loading: true,
            };

        case GET_DRUG_MODALITIES_SUCCESS:
            return {
                ...state,
                data,
                error: false,
                loading: false,
            };

        case GET_DRUG_MODALITIES_ERR:
            return {
                ...state,
                error: err,
                loading: false,
            };

        default:
            return state;
    }
};

const postDrugModalitiesReducer = (state = postDrugModalitiesInitialstate, action) => {
    const { type, data, err } = action;
    switch (type) {
        case POST_DRUG_MODALITIES_BEGIN:
            return {
                ...state,
                loading: true,
            };

        case POST_DRUG_MODALITIES_SUCCESS:
            return {
                ...state,
                data,
                error: false,
                loading: false,
            };

        case POST_DRUG_MODALITIES_ERR:
            return {
                ...state,
                error: err,
                loading: false,
            };

        default:
            return state;
    }
};


//update-drugmodalities-Details
const updateDrugModalitiesReducer = (state = updateDrugModalitiesInitialstate, action) => {
    const { type, data, err } = action;
    switch (type) {
        case UPDATE_DRUG_MODALITIES_BEGIN:
            return {
                ...state,
                loading: true,
            };

        case UPDATE_DRUG_MODALITIES_SUCCESS:
            return {
                ...state,
                data,
                error: false,
                loading: false,
            };

        case UPDATE_DRUG_MODALITIES_ERR:
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
    getDrugModalitiesReducer,
    postDrugModalitiesReducer,
    updateDrugModalitiesReducer,
}

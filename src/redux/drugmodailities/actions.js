const actions = {

    GET_DRUG_MODALITIES_BEGIN: 'GET_DRUG_MODALITIES_BEGIN',
    GET_DRUG_MODALITIES_SUCCESS: 'GET_DRUG_MODALITIES_SUCCESS',
    GET_DRUG_MODALITIES_ERR: 'GET_DRUG_MODALITIES_ERR',

    POST_DRUG_MODALITIES_BEGIN: 'POST_DRUG_MODALITIES_BEGIN',
    POST_DRUG_MODALITIES_SUCCESS: 'POST_DRUG_MODALITIES_SUCCESS',
    POST_DRUG_MODALITIES_ERR: 'POST_DRUG_MODALITIES_ERR',

    UPDATE_DRUG_MODALITIES_BEGIN: 'UPDATE_DRUG_MODALITIES_BEGIN',
    UPDATE_DRUG_MODALITIES_SUCCESS: 'UPDATE_DRUG_MODALITIES_SUCCESS',
    UPDATE_DRUG_MODALITIES_ERR: 'UPDATE_DRUG_MODALITIES_ERR',

    // getall
    getDrugModalitesBegin: () => {
        return {
            type: actions.GET_DRUG_MODALITIES_BEGIN,
        };
    },
    getDrugModalitesSuccess: (data) => {
        return {
            type: actions.GET_DRUG_MODALITIES_SUCCESS,
            data,
        };
    },
    getDrugModalitesErr: (err) => {
        return {
            type: actions.GET_DRUG_MODALITIES_ERR,
            err,
        };
    },

    // post
    postDrugModalityBegin: () => {
        return {
            type: actions.POST_DRUG_MODALITIES_BEGIN,
        };
    },
    postDrugModalitySuccess: (data) => {
        return {
            type: actions.POST_DRUG_MODALITIES_SUCCESS,
            data,
        };
    },
    postDrugModalityErr: (err) => {
        return {
            type: actions.POST_DRUG_MODALITIES_ERR,
            err,
        };
    },

    // update
    updateDrugModalitiesBegin: () => {
        return {
            type: actions.UPDATE_DRUG_MODALITIES_BEGIN,
        };
    },
    updateDrugModalitiesSuccess: (data) => {
        return {
            type: actions.UPDATE_DRUG_MODALITIES_SUCCESS,
            data,
        };
    },
    updateDrugModalitiesErr: (err) => {
        return {
            type: actions.UPDATE_DRUG_MODALITIES_ERR,
            err,
        };
    },


};



export default actions;

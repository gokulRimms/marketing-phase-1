import HIT_SERVER from '../HIT_SERVER';

export const _FETCH_LEADS = async (params) => {
    return await HIT_SERVER.get('leads', {
        params
    });
};

export const _ADD_LEAD = async (leadData) => {
    return await HIT_SERVER.post(leadData);
};
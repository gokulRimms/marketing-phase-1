import HIT_SERVER from '../HIT_SERVER';

export const _FETCH_LEADS = async (params) => {
    
    try {
        const response = await HIT_SERVER.get('leads');
        return response.data; // Adjust based on the structure of your API response
    } catch (error) {
        throw error;
    }
};

export const _ADD_LEAD = async (leadData) => {
    try {
        const response = await HIT_SERVER.post('leads', leadData);
        return response.data; // Adjust based on the structure of your API response
    } catch (error) {
        throw error;
    }   
};
import HIT_SERVER from '../HIT_SERVER';


export const _CREATE_HISTORY = async (groupId, contacts) => {
    try {
        const response = await HIT_SERVER.post('create-histories', { group_id: groupId, contacts: contacts });
        return response.data; // Adjust based on the structure of your API response
    } catch (error) {
        throw error;
    }
}
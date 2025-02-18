import HIT_SERVER from '../HIT_SERVER';

export const _FETCH_GROUPS = async () => {
  try {
    const response = await HIT_SERVER.get("groups"); // Update with your actual API endpoint
    return response.data; // Adjust based on the structure of your API response
  } catch (error) {
    throw error;
  }
};


export const _FETCH_GROUP_CONTACTS = async (groupId, balance) => {
  try {
    const response = await HIT_SERVER.post(`groups/${groupId}/contacts`, { 'limit': balance }); // Update with your actual API endpoint
    return response.data; // Adjust based on the structure of your API response
  } catch (error) {
    throw error;
  }
};

export const _FETCH_GROUPS_BY_PHONE = async (phone) => {
  try {
    const response = await HIT_SERVER.get(`groupsByPhone/${phone}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
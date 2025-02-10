import HIT_SERVER  from '../HIT_SERVER';

export const _FETCH_GROUPS = async () => {
    try {
      const response = await HIT_SERVER.get("groups"); // Update with your actual API endpoint
      return response.data; // Adjust based on the structure of your API response
    } catch (error) {
      throw error;
    }
  };
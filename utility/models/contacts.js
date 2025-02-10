import HIT_SERVER  from '../HIT_SERVER';


export const _FETCH_CONTACTS = async () => {
    try {
      const response = await HIT_SERVER.get("contacts"); // Update with your actual API endpoint
      return response.data; // Adjust based on the structure of your API response
    } catch (error) {
      throw error;
    }
  };

  export const _FETCH_HISTORIES = async () => {
    try {
      const response = await HIT_SERVER.get("histories"); // Update with your actual API endpoint
      return response.data; // Adjust based on the structure of your API response
    } catch (error) {
      throw error;
    }
  };
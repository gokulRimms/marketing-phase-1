import HIT_SERVER from '../HIT_SERVER';

export const _FETCH_DASHBOARD = async () => {
    try {
        const response = await HIT_SERVER.get("dashboard"); // Update with your actual API endpoint
        return response.data; // Adjust based on the structure of your API response
    } catch (error) {
        console.error(error);
    }
};
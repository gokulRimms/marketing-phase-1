import axios from "axios";
import { get, remove } from "./storage/Actions"; // Import storage functions
import { router } from "expo-router";
import { API_URL } from "../constants/endpoints";

// Create Axios instance
const HIT_SERVER = axios.create({
    baseURL: API_URL, // Change to your API base URL
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

console.log('API_URL', API_URL);
// Request Interceptor: Attach Token
HIT_SERVER.interceptors.request.use(
    async (config) => {
        const token = await get("access_token"); // Fetch token from storage
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401
HIT_SERVER.interceptors.response.use(
    (response) => response, // Return response if successful
    async (error) => {
        const requestUrl = error.config.url; // Get request URL
        if (requestUrl.includes("login")) {
            return await Promise.reject(error); // Don't redirect, just return the error
        }
        if (error.response && error.response.status === 401) {
            await remove("access_token");
            await remove("authenticated");
            console.warn("Session expired. Please log in again.", router);
            router.replace("/(auth)/login"); // Redirect to login page
        }
        return await Promise.reject(error);
    }
);

export default HIT_SERVER; // ✅ Ensure this is a default export

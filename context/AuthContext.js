import { createContext, useContext, useState, useEffect } from "react";
import { get, remove } from "../utility/storage/Actions"; // Import remove function

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); // Store user object

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await get("authenticated"); // Fetch user details
        const token = await get("access_token");

        if (authenticated && token) {
          console.log("Setting user in context", authenticated, token);
          setAuth({ user: authenticated, token }); // ✅ Store user & token
        } else {
          setAuth(null);
        }
      } catch (error) {
        console.error("Error fetching authentication data:", error);
        setAuth(null);
      }
    };

    checkAuth();
  }, []);

  // ✅ Logout function
  const logout = async () => {
    try {
      await remove("authenticated"); // Remove user data
      await remove("access_token"); // Remove token
      setAuth(null); // Clear context
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);

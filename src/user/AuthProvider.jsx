import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();
  const loginAction = async (data) => {
    try {
      const res = await axios.post(process.env.REACT_APP_API_BASE_URL + "auth/login", data);
      if (res.data) {
        console.log(res.data)
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        navigate("/");
        return "";
      }
      throw new Error(res.message);
    } catch (err) {
      return "Invalid email or password";
    }
  };
  
  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };
  
  return (
      <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
        {children}
      </AuthContext.Provider>
  );
  
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
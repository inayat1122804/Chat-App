import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const storedUser = localStorage.getItem("userInfo");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const token = currentUser?.token;
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

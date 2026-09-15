import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.clear();
      return <Navigate to="/signin" replace />;
    }

    return children;
  } catch {
    localStorage.clear();
    return <Navigate to="/signin" replace />;
  }
};

export default AuthGuard;
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // =========================
    // NOT LOGGED IN
    // =========================

    if (!token) {
        return <Navigate to="/login" replace />;
    }


    // =========================
    // ROLE CHECK
    // =========================

    if (
        allowedRoles &&
        !allowedRoles.includes(role)
    ) {
        return <Navigate to="/" replace />;
    }


    // =========================
    // ACCESS GRANTED
    // =========================

    return children;
};

export default ProtectedRoute;
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const { token, user } = useAuth();
    if (!token) return <Navigate to="/login" />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/pub" />;
    return children;
};



export default RoleBasedRoute;

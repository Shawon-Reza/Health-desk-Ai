import { Navigate, useLocation } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";

const PrivateRoute = ({ children, roles = [] }) => {
    const location = useLocation();

    // Get user from profile
    const { userProfileData, userProfileLoading, userProfileError, accessToken } = useGetUserProfile();
    const userRole = userProfileData?.role;

    console.log("User Role from PrivateRoute:", userRole);

    // While loading profile, keep user on the page to avoid flicker/redirect on refresh
    if (userProfileLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    // If no token or profile failed, redirect to login
    if (!accessToken || userProfileError || !userProfileData) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // Check role
    if (roles.length && !roles.includes(userRole)) {
        return <Navigate to="/login" replace />;
    }

    // ✅ Allowed
    return children;
};

export default PrivateRoute;

import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import ResetPasswordPage from "../features/auth/ResetPasswordPage";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage";
import AdminDashboard from "../features/AdminDashboard/AdminDashboard";
import NotFoundpage from "../Components/NotFoundpage";
import DashboardContent from "../features/AdminDashboard/DashboardContent";
import ClinicManagement from "../features/AdminDashboard/ClinicManagement";
import SubjectMatters from "../features/AdminDashboard/SubjectMatters";
import Settings from "../features/AdminDashboard/Settings";
import ProfilePersonalInformationForm from "../features/AdminDashboard/ProfilePersonalInformationForm";
import Notifications from "../features/AdminDashboard/Notifications";
import Security from "../features/AdminDashboard/Security";
import AITrainingPage from "../features/AdminDashboard/AITrainingPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <div className="text-2xl">Hello world!</div>,
    },
    // Admin Dashboard Route
    {
        path: "/admin",
        element: <AdminDashboard />,
        children: [
            // Define child routes for admin dashboard here
            {
                index: true,
                element: <div>Admin Home</div>,
            },
            {
                path: "dashboard",
                element: <DashboardContent></DashboardContent>,
            },
            {
                path: "communication",
                element: <div>communication</div>,
            },
            {
                path: "manage-clinic",
                element: <ClinicManagement></ClinicManagement>,
            },
            {
                path: "subject-matters",
                element: <SubjectMatters></SubjectMatters>,
            },
            {
                path: "user-management",
                element: <div>user-management</div>,
            },
            {
                path: "ai-training",
                element: <AITrainingPage></AITrainingPage>,
            },
            {
                path: "assessments",
                element: <div>assessments</div>,
            },
            {
                path: "settings",
                element: <Settings></Settings>,
                children: [
                    {
                        index: true,
                        // element: <div>profile</div>,
                        element: <Navigate to="profile" replace />,
                    },
                    {
                        path: 'profile',
                        element: <ProfilePersonalInformationForm></ProfilePersonalInformationForm>,
                    },
                    {
                        path: 'notifications',
                        element: <Notifications></Notifications>,
                    },
                    {
                        path: 'security',
                        element: <Security></Security>,
                    },
                ]
            },
        ],
    },





    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/reset-password",
        element: <ResetPasswordPage />,
    },
    {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
    },
    // Not Found Page Route
    {
        path: "*",
        element: <NotFoundpage />,
    },
]);


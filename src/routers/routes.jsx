import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import ResetPasswordPage from "../features/auth/ResetPasswordPage";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage";
import AdminDashboard from "../features/AdminDashboard/AdminDashboard";
import NotFoundpage from "../Components/NotFoundpage";
import DashboardContent from "../features/AdminDashboard/DashboardContent";
import ClinicManagement from "../features/AdminDashboard/ClinicManagement";
import SubjectMatters from "../features/AdminDashboard/SubjectMatters";

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
                element: <DashboardContent></DashboardContent> ,
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
                element: <div>ai-training</div>,
            },
            {
                path: "assessments",
                element: <div>assessments</div>,
            },
            {
                path: "settings",
                element: <div>settings</div>,
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


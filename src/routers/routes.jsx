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
import UserManagement from "../features/AdminDashboard/UserManagement";
import UserProfileFromAdmin from "../features/AdminDashboard/UserProfileFromAdmin";
import Assesments from "../features/AdminDashboard/Assesments";
import ReviewAssesmentResult from "../features/AdminDashboard/ReviewAssesmentResult";
import CreatedAssesmentDetails from "../features/AdminDashboard/CreatedAssesmentDetails";
import Communication from "../features/AdminDashboard/Communication/Communication";

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
                element: <DashboardContent></DashboardContent>,
            },
            {
                path: "dashboard",
                element: <DashboardContent></DashboardContent>,
            },
            {
                path: "communication",
                element: <Communication></Communication>,
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
                element: <UserManagement></UserManagement>,
            },
            {
                path: "user-management/user/:userId",
                element: <UserProfileFromAdmin></UserProfileFromAdmin>,
            },
            {
                path: "ai-training",
                element: <AITrainingPage></AITrainingPage>,
            },
            {
                path: "assessments",
                element: <Assesments></Assesments>,
            },
            {
                path: "assessments/created/:assessmentId",
                element: <CreatedAssesmentDetails></CreatedAssesmentDetails>,
            },
            {
                path: "assessments/history/:assessmentId",
                element: <ReviewAssesmentResult></ReviewAssesmentResult>,
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


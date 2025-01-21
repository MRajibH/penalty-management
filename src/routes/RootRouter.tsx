import { useAuthContext } from "@/context";
import RootLayout from "@/layout/RootLayout";
import AppSettings from "@/pages/app-settings";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Settings from "@/pages/settings";
import UserManagement from "@/pages/user-management";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

const RootRouter = () => {
  return (
    <Routes>
      <Route path="/app" element={<RootLayout />}>
        <Route index path="dashboard" element={<Dashboard />} />
        {/* <Route element={<ProtectedRoutes />}> */}
        <Route path="user_management" element={<UserManagement />} />
        <Route path="manage_contitution" element={<></>} />
        <Route path="settings" element={<Settings />} />
        <Route path="app_settings" element={<AppSettings />} />
        {/* </Route> */}
      </Route>
      <Route element={<UnAuthRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={"/app/dashboard"} replace={true} />}
      />
    </Routes>
  );
};

// const ProtectedRoutes = () => {
//   const { currentUser } = useAuthContext();
//   return currentUser ? <Outlet /> : <Navigate to={"/login"} replace={true} />;
// };

const UnAuthRoutes = () => {
  const { currentUser } = useAuthContext();
  return currentUser ? (
    <Navigate to={"/app/dashboard"} replace={true} />
  ) : (
    <Outlet />
  );
};

export default RootRouter;

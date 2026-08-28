import { createBrowserRouter } from "react-router";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import NavigatorDashboard from "../pages/NavigatorDashboard";
import Session from "../pages/Session";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/navigator-dashboard",
    Component: NavigatorDashboard,
  },
  {
    path: "/session",
    Component: Session,
  },
]);

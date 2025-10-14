import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";

const DashboardRouter = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Login />}>
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    )
  );
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
};

export default DashboardRouter;

import React from "react";
import DashboardRouter from "./routes/DashboardRouter";
import AuthProvider from "./context/AuthProvide";

const App = () => {
  return (
    <>
      <AuthProvider>
        <DashboardRouter />
      </AuthProvider>
    </>
  );
};

export default App;

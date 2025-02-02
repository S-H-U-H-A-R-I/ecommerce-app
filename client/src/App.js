import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StoreLayout from "./layouts/StoreLayout.js";
import AdminLayout from "./layouts/AdminLayout.js";
import HomePage from "./pages/store/HomePage.js";
import AdminDashboard from "./pages/admin/AdminDashboard.js";
import UserManagement from "./pages/admin/UserManagement.js";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <StoreLayout>
            <HomePage />
          </StoreLayout>
        } />
        <Route path="/admin" element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        } />
        <Route path="/admin/users" element={
          <AdminLayout>
            <UserManagement />
          </AdminLayout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
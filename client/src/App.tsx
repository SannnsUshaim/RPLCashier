import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/layout";
import Login from "./pages/login";
import ProtectedPath from "./components/element/ProtectedPath";
import useAuth from "./hooks/useAuth";
import Forbidden from "./pages/error/forbidden";
import NotFound from "./pages/error/notfound";
import { Report as ReportProduct } from "./pages/admin/product/report";
import { Save as SaveProduct } from "./pages/admin/product/save";
import { Report as ReportUser } from "./pages/admin/user/report";
import { Save as SaveUser } from "./pages/admin/user/save";
import { Dashboard as DashboardAdmin } from "./pages/admin/dashboard";
import { Dashboard as DashboardCashier } from "./pages/cashier/dashboard";
import { Print as PrintProductReceipt } from "./pages/cashier/print";

function App() {
  const { auth } = useAuth();
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/404-not-found" element={<NotFound />} />
        <Route path="/403-forbidden" element={<Forbidden />} />
        <Route path="/cashier/print" element={<PrintProductReceipt />} />
        <Route path={"/"} element={<Layout />}>
          {/* admin panel start */}
          <Route element={<ProtectedPath allowedDepartments={"admin"} />}>
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/admin/product" element={<ReportProduct />} />
            <Route path="/admin/product/save" element={<SaveProduct />} />
            <Route path="/admin/users/" element={<ReportUser />} />
            <Route path="/admin/users/save" element={<SaveUser />} />
          </Route>
          {/* admin panel end */}
          {/* cashier panel start */}
          <Route element={<ProtectedPath allowedDepartments={"cashier"} />}>
            <Route path="/cashier" element={<DashboardCashier />} />
          </Route>
          {/* cashier panel end */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

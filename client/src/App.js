
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Budgets from './pages/Budgets';
import { Route, Routes } from 'react-router-dom';
import HomeLayout from './layouts/HomeLayout';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';
import AuthProtectedRoute from './VerifyRoutes/AuthProtectedRoute';
import PublicRoute from './VerifyRoutes/PublicRoute';



export default function ExpenseTracker() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
      </Route>

      {/* 🔐 Protected Routes (ONE TIME) */}
      <Route element={<AuthProtectedRoute />}>
        <Route path="/dashboard" element={
          <HomeLayout>
            <Dashboard />
          </HomeLayout>
        } />
        <Route path="/dashboard/income" element={
          <HomeLayout>
            <Income />
          </HomeLayout>
        } />
        <Route path="/dashboard/expenses" element={
          <HomeLayout>
            <Expense />
          </HomeLayout>
        } />
        <Route path="/dashboard/budgets" element={
          <HomeLayout>
            <Budgets />
          </HomeLayout>
        } />
      </Route>
      <Route path='*' element={<h1>404 page not found</h1>}/>
    </Routes>
  );
}
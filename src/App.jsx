import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import StudentManagement from './pages/StudentManagement';
import StaffManagement from './pages/StaffManagement';
import PropertyManagement from './pages/PropertyManagement';
import Payments from './pages/Payments';
import AddProperty from './pages/Add-Details/AddProperty';
import AddStaff from './pages/Add-Details/AddStaff';
import PendingRequest from './pages/PendingRequest';
import StudentDetail from './pages/StudentDetails/StudentDetail';
import LoginPage from './pages/LoginPage'; // Ensure the path to LoginPage is correct
import SignupPage from './pages/SignupPage';
import WardenDashboard from './pages/WardenDashboard';
import WardenStudent from './pages/WardenStudent';
import WardenPayments from './pages/WardenPayments';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login page without Sidebar */}
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/signup-page" element={<SignupPage />} />

        {/* Routes with Sidebar */}
        <Route
          path="*"
          element={
            <Sidebar>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/StudentManagement" element={<StudentManagement />} />
                <Route path="/StaffManagement" element={<StaffManagement />} />
                <Route path="/PropertyManagement" element={<PropertyManagement />} />
                <Route path="/Payments" element={<Payments />} />
                <Route path="/add-property" element={<AddProperty />} />
                <Route path="/add-staff" element={<AddStaff />} />
                <Route path="/pending-req" element={<PendingRequest />} />
                <Route path="/student/:id" element={<StudentDetail />} />
                <Route path="/dashboard-property-manage" element={<WardenDashboard />} />
                <Route path="/dashboard-manage-studentmanagement" element={<WardenStudent />} />
                <Route path="/dashboard-manage-paymentmanagement" element={<WardenPayments />} />
              </Routes>
            </Sidebar>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

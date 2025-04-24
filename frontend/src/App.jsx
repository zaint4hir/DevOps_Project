import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportLost from "./pages/ReportLost"; // Import the new page for reporting lost items
import ReportFound from "./pages/ReportFound"; // Import the new page for reporting found items
import SearchForLostItem from "./pages/SearchForLostItem";  
import SearchForFoundItem from "./pages/SearchForFoundItem";
import AdminDashboard from "./pages/AdminDashboard";



function App() {
    return (
        <Routes>
            {/* Redirect root path to /login */}
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* Route for login page */}
            <Route path="/login" element={<Login />} />
            
            {/* Route for register page */}
            <Route path="/register" element={<Register />} />
            
            {/* Route for dashboard page */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Route for reporting a lost item */}
            <Route path="/report-lost" element={<ReportLost />} />
            
            {/* Route for reporting a found item */}
            <Route path="/report-found" element={<ReportFound />} /> 
            
            {/* Route for searching lost items */}
            <Route path="/search-lost" element={<SearchForLostItem />} />
            
            {/* Route for searching found items */}
            <Route path="/search-found" element={<SearchForFoundItem />} />

            <Route path="/admin-dashboard" element={<AdminDashboard />} />

        </Routes>
    );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Login from "./pages/login";
import Register from "./pages/register";
import AdminDashboard from "./pages/adminDashboard";
import MyComplaints from "./pages/myComplaints";
import CreateComplaint from "./pages/createComplaint";
import Support from "./pages/Support";
import AllComplaints from "./pages/allComplaints";
import Users from "./pages/users";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import CouncilDashboard from "./pages/councilDashboard";


import UserDashboard from "./pages/userDashboard";
  




function App() {
  return (
    <Router>
    
      <Routes>
        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Dashboard */}
        <Route path="/adminDashboard" element={<AdminDashboard />} />

        {/* Temporary Pages for Sidebar Navigation */}
        <Route
          path="/myComplaints"
          element={<MyComplaints />}
        />
                {/* FORGOT PASSWORD */}
        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
        />

        {/* RESET PASSWORD */}
        <Route
          path="/reset-password/:token"
          element={
            <ResetPassword />
          }
        />


        <Route
          path="/createComplaint"
          element={<CreateComplaint />}
        />
        

        //support
                <Route
          path="/support"
          element={<Support />}
          
        />
        //councildashboard
                <Route
  path="/councilDashboard"
  element={<CouncilDashboard />}
/>

        //allComplaints
       <Route path="/allComplaints"
          element={<AllComplaints />} />

//get users
                          <Route
            path="/users"
            element={<Users />}
          />

          //user dashboard
                  <Route path="/userDashboard" element={<UserDashboard />} />

  
        




      </Routes>

    </Router>
  );
}

export default App;
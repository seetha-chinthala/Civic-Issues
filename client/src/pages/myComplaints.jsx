import React, { useEffect, useState } from "react";
import { useNavigate ,Link} from "react-router-dom"; 

import { getMyComplaints } from "../api";
import {
  FaHome,
  FaClipboardList,
  FaUsers,
  FaBell,
  FaSignOutAlt,
  FaHeadset,
  FaFilter,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";




function MyComplaints() {
  const navigate = useNavigate();


  

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {

    try {

      const data = await getMyComplaints();

      if (Array.isArray(data)) {
        setComplaints(data);
      } else {
        console.log("My complaints error:", data);
        setComplaints([]);
      }

    } catch (error) {

      console.log("Error fetching complaints:", error);

      setComplaints([]);
    }
  };

  return (



    <div style={{ padding: "20px" }}>
      <div className="sidebar">
        <div>
          
<h2>CivicTrack</h2>
          <ul>
            <li>
              <Link to="/userDashboard">
                <FaHome />  <span>
                Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to="/createComplaint">
                <FaUsers />         <span>
                  Create Complaint
                </span>
              </Link>
            </li>

            <li>
              <Link to="/myComplaints">
            <FaClipboardList />    <span>
                My Complaints
                </span>
              </Link>
            </li>

            <li>
              <Link to="/login">
              <FaSignOutAlt />   <span>
                Logout  </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* HELP BOX */}
        <div className="help-box">
          <FaHeadset size={40} />

          <h3>
            Need Help?
          </h3>

          <Link to="/support">
            Contact Support
          </Link>
        </div>
      </div>

                    
    
        


      <h1>My Complaints</h1>

      {complaints.length === 0 ? (

        <p>No Complaints Found</p>

      ) : (

        complaints.map((item) => (

          <div
            key={item._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginTop: "10px",
              borderRadius: "10px",
            }}
          >
            <h3>{item.title}</h3>

            <p>{item.description}</p>

            <p>Status: {item.status}</p>

          </div>
        ))
      )}
    </div>
  );
}

export default MyComplaints;
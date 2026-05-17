import React, { useState } from "react";
import {
  FaHome,
  FaClipboardList,
  FaUsers,
  FaSignOutAlt,
  FaHeadset,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./support.css";

function Support() {
  const navigate = useNavigate();

  const [message, setMessage] =
    useState("");

  // Sidebar Navigation
  const handleDashboard = () =>
    navigate("/userDashboard");

  const handleComplaints = () =>
    navigate("/createComplaint");

  const handleUsers = () =>
    navigate("/myComplaints");

  const handleLogout = () =>
    navigate("/login");

  const handleSupport = () =>
    navigate("/support");

  // Send Email
  const handleEmail = () => {
    const email =
      "support@civictrack.com";

    const subject =
      "CivicTrack Support Request";

    const body = message;

    window.location.href =
      `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="support-page">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div>
          <div className="logo-section">
            <h2>Civic Track</h2>
          </div>

          <div className="menu">
            <div
              className="menu-item"
              onClick={
                handleDashboard
              }
            >
              <FaHome />
              Dashboard
            </div>

            <div
              className="menu-item"
              onClick={
                handleComplaints
              }
            >
               <FaUsers />

              Create Complaint
            </div>

            <div
              className="menu-item"
              onClick={
                handleUsers
              }
            >
              <FaClipboardList />

              My Complaints
            </div>

            <div
              className="menu-item"
              onClick={
                handleLogout
              }
            >
              <FaSignOutAlt />
              Logout
            </div>
          </div>
        </div>

        {/* HELP BOX */}
        <div className="help-box">
          <FaHeadset size={40} />

          <h3>
            Need Help?
          </h3>

          <button
            onClick={
              handleSupport
            }
          >
            Contact Support
          </button>
        </div>
      </div>

      {/* SUPPORT CONTENT */}
      <div className="support-container">
        <div className="support-card">
          <h1 className="title">
            Contact Support
          </h1>

          <p className="text">
            Need help? Contact
            our support team.
          </p>

          <div className="info-box">
            <p>
              <strong>
                Email:
              </strong>{" "}
              support@civictrack.com
            </p>

            <p>
              <strong>
                Phone:
              </strong>{" "}
              +91 9876543210
            </p>
          </div>

          <textarea
            placeholder="Describe your issue..."
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            className="textarea"
          />

          <button
            className="send-btn"
            onClick={
              handleEmail
            }
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}

export default Support;
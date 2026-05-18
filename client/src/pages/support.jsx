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
import {
  sendSupportMessage
} from "../api";

function Support() {
  const navigate = useNavigate();
  const user =
  JSON.parse(localStorage.getItem("user"));

const role =
  user?.role?.toLowerCase();

  const [message, setMessage] =
    useState("");

  // Sidebar Navigation
  const handleDashboard = () =>
    navigate("/userDashboard");

  const handleComplaints = () =>
    navigate("/createComplaint");

  const handleUsers = () =>
    navigate("/myComplaints");

    const handleAdminDashboard = () =>
    navigate("/adminDashboard");


  const handleLogout = () =>
    navigate("/login");

  

  // Send Email
  const handleEmail =
async () => {

  if (!message.trim()) {
   // alert(
  //    "Please enter message"
    //);
    return;
  }
      

  const supportData = {


    name: user.username,

    email: user.email,

    subject:
      "CivicTrack Support Request",

    message,
  };

  try {

    const response =
      await sendSupportMessage(
        supportData
      );

    console.log(response);

    const email =
      "support@civictrack.com";

    const subject =
      "CivicTrack Support Request";

    const body =
      message;

    window.location.href =
      `mailto:${email}?subject=${subject}&body=${body}`;

    alert(
      "Support message saved successfully ✅"
    );

    setMessage("");

  } catch (error) {

    console.log(error);

    alert(
      "Support message failed ❌"
    );
  }
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

  {/* USER MENU */}
  {role === "user" && (
    <>
      <div
        className="menu-item"
        onClick={handleDashboard}
      >
        <FaHome />
        Dashboard
      </div>

      <div
        className="menu-item"
        onClick={handleComplaints}
      >
        <FaUsers />
        Create Complaint
      </div>

      <div
        className="menu-item"
        onClick={handleUsers}
      >
        <FaClipboardList />
        My Complaints
      </div>
    </>
  )}

  {/* ADMIN MENU */}
  {role === "admin" && (
    <>
      <div
        className="menu-item"
        onClick={handleAdminDashboard}
      >
        <FaHome />
        Admin Dashboard
      </div>

      <div
        className="menu-item"
        onClick={() =>
          navigate("/allComplaints")
        }
      >
        <FaClipboardList />
        All Complaints
      </div>

      <div
        className="menu-item"
        onClick={() =>
          navigate("/users")
        }
      >
        <FaUsers />
        Users
      </div>
    </>
  )}

  {/* COMMON MENU */}
  <div
    className="menu-item"
    onClick={handleLogout}
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
    handleEmail
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
                   }>
  Send Email
</button>
        </div>
      </div>
    </div>
  );
}

export default Support;
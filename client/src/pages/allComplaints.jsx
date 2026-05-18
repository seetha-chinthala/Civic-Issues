import React, { useEffect, useState } from "react";
import "./allComplaints.css";
import {
  allComplaints,
  updateComplaintStatus,
  deleteComplaint,
} from "../api";
import {
  FaHome,
  FaClipboardList,
  FaUsers,
  FaSignOutAlt,
  FaHeadset,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function AllComplaints() {
  const [complaints, setComplaints] = useState([]);

  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComplaint, setSelectedComplaint] =
  useState(null);

const [activeFilter, setActiveFilter] =
  useState("all");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await allComplaints();
        setComplaints(data);
      } catch (error) {
        console.log("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  const handleUpdate = async (id, currentStatus) => {
    let newStatus = currentStatus;

    if (currentStatus === "Pending") newStatus = "In Progress";
    else if (currentStatus === "In Progress") newStatus = "Resolved";

    try {
      await updateComplaintStatus(id, newStatus);

      setComplaints((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.log("Error updating status:", error);
    }
  };

 const filteredComplaints = complaints.filter((item) => {

  const statusMatch =
    statusFilter === "All Status" ||
    item?.status === statusFilter;

  const categoryMatch =
    categoryFilter === "All Categories" ||
    item?.category === categoryFilter;

  const searchLower =
    (searchTerm || "").toLowerCase().trim();

  const searchMatch =
    (item?.title || "")
      .toLowerCase()
      .includes(searchLower) ||

    (item?.user || "")
      .toLowerCase()
      .includes(searchLower) ||

    (item?.username || "")
      .toLowerCase()
      .includes(searchLower) ||

    (item?.location || "")
      .toLowerCase()
      .includes(searchLower) ||

    (item?.category || "")
      .toLowerCase()
      .includes(searchLower);


  return (
    statusMatch &&
    categoryMatch &&
    searchMatch
  );
});

const openComplaints = filteredComplaints.filter(
  (item) =>
    item.status === "Pending" ||
    item.status === "In Progress" ||
    (
      item.status === "Resolved" &&
      (
        !item.feedbackImage ||
        item.feedbackImage.trim() === ""
      )
    )
);
const displayComplaints =
  openComplaints.filter((item) => {

    if (activeFilter === "pending") {
      return item.status === "Pending";
    }

    if (activeFilter === "progress") {
      return item.status === "In Progress";
    }

    if (activeFilter === "resolved") {
      return (
        item.status === "Resolved" &&
        (
          !item.feedbackImage ||
          item.feedbackImage.trim() === ""
        )
      );
    }

    return true;
  });
const closedComplaints = complaints.filter(
  (item) =>
    item.status === "Resolved" &&
    item.feedbackImage &&
    item.feedbackImage.trim() !== ""
);

const pendingCount = openComplaints.filter(
  (item) => item.status === "Pending"
).length;

const progressCount = openComplaints.filter(
  (item) => item.status === "In Progress"
).length;

const resolvedNoFeedbackCount = openComplaints.filter(
  (item) =>
    item.status === "Resolved" &&
    (!item.feedbackImage || item.feedbackImage.trim() === "")
).length;

  return (
    <div className="dashboard-layout">

        {/* SIDEBAR */}
        <div className="sidebar">
          <div>
            
  <h2>CivicTrack</h2>
            <ul>
              <li>
                <Link to="/adminDashboard">
                  <FaHome />  <span>
                  Dashboard</span>
                </Link>
              </li>
  
              <li>
                <Link to="/allComplaints">
                  
                  <FaClipboardList />        <span>
                    All Complaints
                  </span>
                </Link>
              </li>
  
              <li>
                <Link to="/users">
               <FaUsers />   <span>
                  users
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
  
  

  <div className="all-complaints-container">

    <h1 className="all-complaints-title">
      All Complaints
    </h1>

    <div className="top-counts">

  <div
    className={`count-card ${
      activeFilter === "all" ? "active-card" : ""
    }`}
    onClick={() => setActiveFilter("all")}
  >
    <h3>Total</h3>
    <p>{openComplaints.length}</p>
  </div>

  <div
    className={`count-card ${
      activeFilter === "pending" ? "active-card" : ""
    }`}
    onClick={() => setActiveFilter("pending")}
  >
    <h3>Pending</h3>
    <p>{pendingCount}</p>
  </div>

  <div
    className={`count-card ${
      activeFilter === "progress" ? "active-card" : ""
    }`}
    onClick={() => setActiveFilter("progress")}
  >
    <h3>In Progress</h3>
    <p>{progressCount}</p>
  </div>

  <div
    className={`count-card ${
      activeFilter === "resolved" ? "active-card" : ""
    }`}
    onClick={() => setActiveFilter("resolved")}
  >
    <h3>Resolved No Feedback</h3>
    <p>{resolvedNoFeedbackCount}</p>
  </div>

</div>

      <div className="filters-section">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option>All Categories</option>
          <option>Roads</option>
          <option>Sanitation</option>
          <option>Water</option>
        </select>

        <input
          type="text"
          placeholder="Search complaints..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box"
        />
      </div>

      <div className="complaints-layout">
       
     <div className="complaints-grid">
  {displayComplaints.map((item) => (
    <div className="complaint-card" key={item._id}>
      {item.image ? (
        <img
          src={`http://localhost:5000/uploads/${item.image}`}
          alt="complaint"
          className="complaint-image"
        />
      ) : (
        <div className="no-image">No Image</div>
      )}

      <div className="complaint-content">
        <h3>{item.title}</h3>

        {/* <p><b>User:</b> {item.user || item.username || "Unknown"}</p> */}
        <p><b>Category:</b> {item.category}</p>
        <p><b>Location:</b> {item.location}</p>

        <span
          className={
            item.status === "Pending"
              ? "pending"
              : item.status === "In Progress"
              ? "progress"
              : "resolved"
          }
        >
          {item.status}
        </span>

        <div className="card-buttons">
          <button
            className="update-btn"
            onClick={() => handleUpdate(item._id, item.status)}
          >
            Update
          </button>

          <button
            className="view-btn"
            onClick={() => setSelectedComplaint(item)}
          >
            👁
          </button>

          <button
  className="delete-btn"
  onClick={async () => {

    await deleteComplaint(item._id);

    setComplaints((prev) =>
      prev.filter(
        (complaint) =>
          complaint._id !== item._id
      )
    );
  }}
>
  🗑
</button>
        </div>
      </div>
    </div>
  ))} 
</div>

<div className="closed-section">
  <h2>Closed Complaints</h2>

  {closedComplaints.length > 0 ? (
    <div className="closed-grid">

      {closedComplaints.map((item) => (
        <div
          className="closed-card"
          key={item._id}
        >
          {/* Complaint Image */}
          {item.image ? (
            <img
              src={`http://localhost:5000/uploads/${item.image}`}
              alt="complaint"
              className="closed-image"
            />
          ) : (
            <div className="closed-no-image">
              No Complaint Image
            </div>
          )}

          <div className="closed-content">

            <h3>{item.title}</h3>

            <p>
              <b>Category:</b>{" "}
              {item.category}
            </p>

            <p>
              <b>Location:</b>{" "}
              {item.location}
            </p>

            <p>
              <b>Status:</b>{" "}
              {item.status}
            </p>

            <p>
              <b>Description:</b>{" "}
              {item.description ||
                "No Description"}
            </p>

            <p>
              <b>Feedback:</b>{" "}
              {item.feedback ||
                "No Feedback"}
            </p>

            {/* Feedback Image */}
            {item.feedbackImage && (
              <>
                <h4>Feedback Image</h4>

                <img
                  src={`http://localhost:5000/uploads/${item.feedbackImage}`}
                  alt="feedback"
                  className="feedback-image"
                />
              </>
            )}

          </div>
        </div>
      ))}

    </div>
  ) : (
    <p>No closed complaints</p>
  )}
</div>

</div>

{selectedComplaint && (
  <div
    className="popup-overlay"
    onClick={() =>
      setSelectedComplaint(null)
    }
  >
    <div
      className="popup-card"
      onClick={(e) =>
        e.stopPropagation()
      }
    >
      <button
        className="popup-close"
        onClick={() =>
          setSelectedComplaint(null)
        }
      >
        ✕
      </button>

      <h2 className="popup-title">
        {selectedComplaint.title}
      </h2>

      {selectedComplaint.image && (
        <img
          src={`http://localhost:5000/uploads/${selectedComplaint.image}`}
          alt="complaint"
          className="popup-image"
        />
      )}

      <div className="popup-content">

        <div className="popup-row">
          <span>Description</span>
          <p>
            {selectedComplaint.description ||
              "No description"}
          </p>
        </div>

        <div className="popup-row">
          <span>Category</span>
          <p>
            {selectedComplaint.category}
          </p>
        </div>

        <div className="popup-row">
          <span>Location</span>
          <p>
            {selectedComplaint.location}
          </p>
        </div>

        <div className="popup-row">
          <span>Status</span>

          <p
            className={`status-tag ${
              selectedComplaint.status ===
              "Pending"
                ? "pending"
                : selectedComplaint.status ===
                  "In Progress"
                ? "progress"
                : "resolved"
            }`}
          >
            {selectedComplaint.status}
          </p>
        </div>

        <div className="popup-row">
          <span>Feedback</span>
          <p>
            {selectedComplaint.feedback ||
              "No Feedback"}
          </p>
        </div>

      </div>

      {selectedComplaint.feedbackImage && (
        <div className="feedback-section">
          <h4>Feedback Image</h4>

          <img
            src={`http://localhost:5000/uploads/${selectedComplaint.feedbackImage}`}
            alt="feedback"
            className="popup-image"
          />
        </div>
      )}
    </div>
  </div>
)}
    </div>
    </div>
  );
}

export default AllComplaints;
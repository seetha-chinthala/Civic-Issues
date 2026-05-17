import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./myComplaints.css";

import {
  getMyComplaints,
  submitFeedback,
  deleteComplaint,
} from "../api";

import {
  FaHome,
  FaClipboardList,
  FaUsers,
  FaSignOutAlt,
  FaHeadset,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaEye,
  FaTrash,
  FaUpload,
  FaUndo,
} from "react-icons/fa";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await getMyComplaints();

      if (Array.isArray(data)) {
        setComplaints(data);
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.log(error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  // stats
  const total = complaints.length;
  const pending = complaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const progress = complaints.filter(
    (item) => item.status === "in Progress"
  ).length;

  const resolved = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  // feedback upload
  const handleFeedbackUpload = async (id, file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      await submitFeedback(id, formData);
      fetchComplaints();
    } catch (error) {
      console.log(error);
    }
  };

  // undo feedback image
  const handleUndo = async (itemId) => {
    const updated = complaints.map((item) =>
      item._id === itemId
        ? { ...item, feedbackImage: null }
        : item
    );

    setComplaints(updated);
  };

  // delete complaint
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      await deleteComplaint(id);

      setComplaints((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2>CivicTrack</h2>

          <ul>
            <li>
              <Link to="/userDashboard">
                <FaHome />
                <span> Dashboard</span>
              </Link>
            </li>
            <li>

              <Link to="/createComplaint">
                <FaHome />
                <span> Create Complaint</span>
              </Link>
            </li>


            <li className="active">
              <Link to="/myComplaints">
                <FaClipboardList />
                <span> My Complaints</span>
              </Link>
            </li>

            <li>
              <Link to="/login">
                <FaSignOutAlt />
                <span> Logout</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="help-box">
          <FaHeadset size={40} />
          <h3>Need Help?</h3>
          <Link to="/support">Contact Support</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>My Complaints</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card total-card">
            <FaClipboardList />
            <h2>{total}</h2>
            <p>Total Complaints</p>
          </div>

          <div className="stat-card pending-card">
            <FaExclamationCircle />
            <h2>{pending}</h2>
            <p>Pending</p>
          </div>

          <div className="stat-card progress-card">
            <FaClock />
            <h2>{progress}</h2>
            <p>in Progress</p>
          </div>

          <div className="stat-card resolved-card">
            <FaCheckCircle />
            <h2>{resolved}</h2>
            <p>Resolved</p>
          </div>
        </div>

        {/* Complaint Cards */}
        {loading ? (
          <p>Loading...</p>
        ) : complaints.length === 0 ? (
          <p>No Complaints Found</p>
        ) : (
          <div className="complaints-grid">
            {complaints.map((item) => (
              <div
                className="complaint-card"
                key={item._id}
              >
                {/* complaint image */}
                {item.image && (
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt="complaint"
                    className="complaint-image"
                  />
                )}

                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <span
                  className={`status-badge ${
                    item.status === "Pending"
                      ? "pending"
                      : item.status === "in Progress"
                      ? "progress"
                      : "resolved"
                  }`}
                >
                  {item.status}
                </span>

                {/* buttons */}
                <div className="btn-group">
                  <button
                    className="view-btn"
                    onClick={() =>
                      setSelectedComplaint(item)
                    }
                  >
                    <FaEye />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(item._id)
                    }
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Feedback Upload */}
                <div className="feedback-section">
                  {!item.feedbackImage ? (
                    <>
                      <label className="upload-btn">
                        <FaUpload />
                        Upload Feedback

                        <input
                          type="file"
                          hidden
                          onChange={(e) =>
                            handleFeedbackUpload(
                              item._id,
                              e.target.files[0]
                            )
                          }
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <img
                        src={`http://localhost:5000/uploads/${item.feedbackImage}`}
                        alt="feedback"
                        className="feedback-image"
                      />

                      <button
                        className="undo-btn"
                        onClick={() =>
                          handleUndo(item._id)
                        }
                      >
                        <FaUndo />
                        Re-upload
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {selectedComplaint && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button
              className="close-btn"
              onClick={() =>
                setSelectedComplaint(null)
              }
            >
              ✖
            </button>

            <h2>{selectedComplaint.title}</h2>

            {selectedComplaint.image && (
              <img
                src={`http://localhost:5000/uploads/${selectedComplaint.image}`}
                alt=""
                className="popup-image"
              />
            )}

            <p>
              <strong>Category:</strong>{" "}
              {selectedComplaint.category}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {selectedComplaint.description}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {selectedComplaint.location}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selectedComplaint.status}
            </p>

            {selectedComplaint.feedbackImage && (
              <>
                <h3>Feedback Image</h3>

                <img
                  src={`http://localhost:5000/uploads/${selectedComplaint.feedbackImage}`}
                  alt=""
                  className="popup-image"
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyComplaints;
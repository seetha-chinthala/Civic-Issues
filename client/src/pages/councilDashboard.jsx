import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaUsers,
  FaSignOutAlt,
  FaHeadset,
  FaFilter,
  FaEye,
  FaTrash,
} from "react-icons/fa";

import {
  allComplaints,
  updateComplaintStatus,
  deleteComplaint,
} from "../api";

import "./councilDashboard.css";

function CouncilDashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [tempStatus, setTempStatus] = useState("All Status");
  const [tempCategory, setTempCategory] = useState("All Categories");
  const [tempDate, setTempDate] = useState("");
  const [tempSearch, setTempSearch] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await allComplaints();
      const escalated = data.filter((item) => item.isEscalated === true);
      setComplaints(escalated);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (id, currentStatus) => {
    let newStatus = currentStatus;

    if (currentStatus === "Pending") newStatus = "In Progress";
    else if (currentStatus === "In Progress") newStatus = "Resolved";
    else return;

    await updateComplaintStatus(id, newStatus);

    setComplaints((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;

    await deleteComplaint(id);

    setComplaints((prev) =>
      prev.filter((item) => item._id !== id)
    );
  };

  const filteredComplaints = complaints.filter((item) => {

    const statusMatch =
      statusFilter === "All Status" || item.status === statusFilter;

    const categoryMatch =
      categoryFilter === "All Categories" || item.category === categoryFilter;

    const search = searchTerm.toLowerCase();

    const searchMatch =
      item.title?.toLowerCase().includes(search) ||
      item.username?.toLowerCase().includes(search) ||
      item.location?.toLowerCase().includes(search) ||
      item.category?.toLowerCase().includes(search);

    const dateMatch =
      !dateFilter ||
      new Date(item.createdAt || item.date).toISOString().slice(0, 10) ===
        dateFilter;

    return statusMatch && categoryMatch && searchMatch && dateMatch;
  });
  const complaintsPerPage = 5;

const indexOfLastComplaint =
  currentPage * complaintsPerPage;

const indexOfFirstComplaint =
  indexOfLastComplaint - complaintsPerPage;

const currentComplaints =
  filteredComplaints.slice(
    indexOfFirstComplaint,
    indexOfLastComplaint
  );

const totalPages =
  Math.ceil(filteredComplaints.length / complaintsPerPage);

  const total = complaints.length;
  const pending = complaints.filter((item) => item.status === "Pending").length;
  const progress = complaints.filter(
    (item) => item.status === "In Progress"
  ).length;
  const resolved = complaints.filter((item) => item.status === "Resolved").length;

  return (
    <div className="council-layout">
      <aside className="sidebar">
        <h2>CivicTrack</h2>

        <ul>
        <li>
  <Link to="/councilDashboard">
    <FaHome /> Dashboard
  </Link>
</li>

<li>
  <Link to="/allComplaints">
    <FaClipboardList /> All Complaints
  </Link>
</li>

<li>
  <Link to="/users">
    <FaUsers /> Users
  </Link>
</li>
          <li>
            <Link to="/login">
              <FaSignOutAlt /> Logout
            </Link>
          </li>
        </ul>

        <div className="help-box">
          <FaHeadset size={40} />
          <h3>Need Help?</h3>
          <Link to="/support" >
            Contact Support
          </Link>
        </div>
      </aside>

      <main className="council-main">
        <h1>Municipal Council Dashboard</h1>

        <div className="stats-cards">
          <div className="stat-card">
            <h3>Total Complaints</h3>
            <p>{total}</p>
          </div>

          <div className="stat-card">
            <h3>Pending</h3>
            <p>{pending}</p>
          </div>

          <div className="stat-card">
            <h3>In Progress</h3>
            <p>{progress}</p>
          </div>

          <div className="stat-card">
            <h3>Resolved</h3>
            <p>{resolved}</p>
          </div>
        </div>

        <div className="filters">
          <select
            value={statusFilter}
            onChange={(e) => setTempStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setTempCategory(e.target.value)}
          >
            <option>All Categories</option>
            <option>Roads</option>
            <option>Sanitation</option>
            <option>Water</option>
            <option>undefined</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setTempDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setTempSearch(e.target.value)}
          />
        <button
           className="filter-btn"
           onClick={() => {
          setStatusFilter(tempStatus);
          setCategoryFilter(tempCategory);
          setDateFilter(tempDate);
          setSearchTerm(tempSearch);
        }}
         > Filter
          </button>
        </div>

        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Complaint</th>
                <th>User</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
                <th>View</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {currentComplaints.map((item, index) => (
                <tr key={item._id}>
                  <td>{indexOfFirstComplaint + index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.username || item.user || "Unknown"}</td>
                  <td>{item.category}</td>
                  <td>{item.location}</td>
                  <td>
                    <span className={`status ${item.status}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : item.date || "N/A"}
                  </td>
                  <td>
                    <button
                      className="update-btn"
                      onClick={() => handleUpdate(item._id, item.status)}
                    >
                      {item.status === "Resolved" ? "Done" : "Update"}
                    </button>
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => setSelectedComplaint(item)}
                    >
                      <FaEye />
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Previous
  </button>

  <span>
    Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
  </span>

  <button
    disabled={currentPage === totalPages || totalPages === 0}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>
</div>

          {filteredComplaints.length === 0 && (
            <p className="empty">No escalated complaints found</p>
          )}
        </div>
      </main>

      {selectedComplaint && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>{selectedComplaint.title}</h2>

            {selectedComplaint.image && (
              <img
                src={`http://localhost:5000/uploads/${selectedComplaint.image}`}
                alt="complaint"
              />
            )}

            <p><b>User:</b> {selectedComplaint.username || "Unknown"}</p>
            <p><b>Description:</b> {selectedComplaint.description}</p>
            <p><b>Category:</b> {selectedComplaint.category}</p>
            <p><b>Location:</b> {selectedComplaint.location}</p>
            <p><b>Status:</b> {selectedComplaint.status}</p>
            <p><b>Escalated:</b> Yes</p>

            <button onClick={() => setSelectedComplaint(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CouncilDashboard;
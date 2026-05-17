import React, { useState } from "react";
import { Link } from "react-router-dom";
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

import "./createComplaint.css";
import { createComplaint } from "../api";
import { useNavigate } from "react-router-dom";





function CreateComplaint() {
  const Navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    date: "",
    image: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] =
    useState(false);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const {
      name,
      value,
      files,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "image"
          ? files[0]
          : value,
    }));
  };

  // SUPPORT BUTTON
  const handleSupport = () =>{
    Navigate("/support");
  };

  // HANDLE FORM SUBMIT
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const formData =
      new FormData();

    formData.append(
      "title",
      form.title
    );

    formData.append(
      "category",
      form.category
    );

    formData.append(
      "location",
      form.location
    );

    formData.append(
      "description",
      form.description
    );

    formData.append(
      "date",
      form.date
    );

    formData.append(
      "status",
      "Pending"
    );

    if (form.image) {
      formData.append(
        "image",
        form.image
      );
    }

    try {
      const response =
        await createComplaint(
          formData
        );

      setMessage(
        response.message ||
          "Complaint submitted successfully ✅"
      );

      // RESET FORM
      setForm({
        title: "",
        category: "",
        location: "",
        description: "",
        date: "",
        image: null,
      });
    } catch (error) {
      console.log(error);

      setMessage(
        "Something went wrong ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">
      {/* SIDEBAR */}
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

      {/* FORM SECTION */}
      <div className="form-section">
        <form
          onSubmit={
            handleSubmit
          }
          className="complaint-form"
        >
          <h1>
            Create Complaint
          </h1>

          {/* TITLE */}
          <input
            type="text"
            name="title"
            placeholder="Complaint Title"
            value={form.title}
            onChange={
              handleChange
            }
            required
          />

          {/* CATEGORY */}
          <select
            name="category"
            value={form.category}
            onChange={
              handleChange
            }
            required
          >
            <option value="">
              Select Category
            </option>

            <option value="Roads">
              Roads
            </option>

            <option value="Sanitation">
              Sanitation
            </option>

            <option value="Water">
              Water
            </option>

            <option value="Electricity">
              Electricity
            </option>

            <option value="Drainage">
              Drainage
            </option>
          </select>

          {/* LOCATION */}
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={
              form.location
            }
            onChange={
              handleChange
            }
            required
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Describe the issue in detail..."
            value={
              form.description
            }
            onChange={
              handleChange
            }
            required
          />

          {/* DATE */}
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={
              handleChange
            }
            required
          />

          {/* IMAGE */}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={
              handleChange
            }
            required
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Submit Complaint"}
          </button>

          {/* MESSAGE */}
          {message && (
            <p className="message">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateComplaint;
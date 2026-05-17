import React, { useEffect, useState } from "react";
import "./users.css";

import { getUsers } from "../api";

function Users() {

const [users, setUsers] = useState([]);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  fetchUsers();
}, []);

  return (
    <div className="users-container">

      <h1 className="users-title">
        Users Management
      </h1>

      <div className="users-grid">

        {users.map((user) => (
          <div className="user-card" key={user.id}>

            <div className="user-avatar">
              {user.username.charAt(0)}
            </div>

            <h2>{user.username}</h2>

            <p>{user.email}</p>

            <span
              className={
                user.role === "Admin"
                  ? "admin-role"
                  : "citizen-role"
              }
            >
              {user.role}
            </span>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Users;
import React, { useEffect, useState } from "react";
import "./councilDashboard.css";
import { allComplaints } from "../api";

function CouncilDashboard() {

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {

    const fetchComplaints = async () => {

      try {

        const data = await allComplaints();

        const escalated =
          data.filter(
            (item) => item.isEscalated
          );

        setComplaints(escalated);

      } catch (error) {

        console.log(error);

      }
    };

    fetchComplaints();

  }, []);

  return (

    <div className="council-container">

      <h1>
        Municipal Council Dashboard
      </h1>

      <div className="complaints-grid">

        {complaints.length === 0 ? (

          <p>
            No escalated complaints
          </p>

        ) : (

          complaints.map((item) => (

            <div
              className="complaint-card"
              key={item._id}
            >

              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt="complaint"
                className="complaint-image"
              />

              <h2>{item.title}</h2>

              <p>
                <b>User:</b>
                {item.username}
              </p>

              <p>
                <b>Category:</b>
                {item.category}
              </p>

              <p>
                <b>Location:</b>
                {item.location}
              </p>

              <p>
                <b>Status:</b>
                {item.status}
              </p>

              <div className="escalated-badge">
                Escalated
              </div>

            </div>

          ))
        )}

      </div>

    </div>

  );
}

export default CouncilDashboard;
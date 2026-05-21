const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const app = express();

app.use(cors({ origin: "" }));
app.use(express.json());

/* ROUTES */
const supportRoutes = require("./routes/supportRoutes");

const userRoutes = require("./routes/userRoutes");
const issueRoutes = require("./routes/issueRoutes");
app.use("/api/userRoutes", userRoutes);
app.use("/api/issueRoutes", issueRoutes);

app.use("/api/supportRoutes", supportRoutes);



app.use("/uploads", express.static("uploads"));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
// Serve frontend
app.use(
    express.static(
        path.join(
            __dirname,
            "../client/dist"
        )
    )
);

// React routing
app.get("/m", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "../client/dist/index.html"
        )
    );
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
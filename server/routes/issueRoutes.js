const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const uploads = require("../multerConfig");

const authMiddleware = require("../middleware/authMiddleware");

router.use(bodyParser.json());

const Issue = require("../models/Issue");
router.use("/uploads", express.static("uploads"));


//check escalation  
router.get("/", async(req, res) => {
    try {
        const issues = await Issue.find();

        for (let issue of issues) {

            const createdDate =
                new Date(issue.createdAt);

            const currentDate =
                new Date();

            const diffTime =
                currentDate - createdDate;

            const diffDays =
                diffTime / (1000 * 60 * 60 * 24);

            if (
                diffDays > 0 &&
                issue.status !== "Resolved" &&
                !issue.isEscalated
            ) {

                issue.isEscalated = true;

                issue.escalatedAt =
                    new Date();

                await issue.save();
            }
        }

        const updatedIssues =
            await Issue.find();

        res.json(updatedIssues);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
});


// Create complaint
router.post(
    "/createComplaint",
    uploads.single("image"),
    async(req, res) => {
        try {
            const { title, category, description, location, date, username } =
            req.body;


            const issue = new Issue({
                title,
                category,
                description,
                location,
                date,
                username,


                image: req.file ?
                    req.file.filename : "",
            });

            await issue.save();

            res.status(201).json({
                success: true,
                message: "Complaint created",
                issue,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);


/* GET ALL ISSUES */
router.get("/allComplaints", async(req, res) => {

    const issues = await Issue.find();
    console.log("issues", issues)
    res.json(issues);

});

/* UPDATE ISSUE STATUS */
router.put("/updateStatus/:id", async(req, res) => {

    const updated = await Issue.findByIdAndUpdate(
        req.params.id,
        req.body, { new: true }
    );

    res.json(updated);
});

//my Complaints
router.get("/myComplaints/:username", authMiddleware, async(req, res) => {

    const issues = await Issue.find({
        username: req.params.username,
    }).sort({ date: -1 });
    console.log("mee to", req.user.username)
    console.log(issues)
    res.json(issues);
});



//feedback
router.put(
    "/allComplaints/feedback/:id",
    authMiddleware,
    uploads.single("image"),
    async(req, res) => {
        try {
            const updated = await Issue.findByIdAndUpdate(
                req.params.id, {
                    feedbackImage: req.file ? req.file.filename : null,
                }, { new: true }
            );

            res.json({
                message: "Feedback submitted successfully",
                data: updated,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

//delete complaint
router.delete("/allComplaints/:id", authMiddleware, async(req, res) => {
    try {

        await Issue.findByIdAndDelete(req.params.id);

        res.json({
            message: "Complaint deleted successfully",
        });

    } catch (err) {

        res.status(500).json({
            error: err.message,
        });

    }
});

router.put(
    "/allComplaints/remove-feedback/:id",
    authMiddleware,
    async(req, res) => {
        try {
            const updated =
                await Issue.findByIdAndUpdate(
                    req.params.id, {
                        feedbackImage: "",
                    }, { new: true }
                );

            res.json({
                message: "Feedback removed successfully",
                data: updated,
            });
        } catch (err) {
            res.status(500).json({
                error: err.message,
            });
        }
    }
);

module.exports = router;
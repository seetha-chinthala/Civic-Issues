const express = require("express");
const router = express.Router();

const Support = require(
    "../models/support"
);

// SAVE SUPPORT MESSAGE
router.post(
    "/",
    async(req, res) => {
        try {
            const supportMessage =
                new Support(req.body);

            await supportMessage.save();

            res.json({
                message: "Support message saved successfully",

                data: supportMessage,
            });
        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "Support message failed",
            });
        }
    }
);

module.exports = router;
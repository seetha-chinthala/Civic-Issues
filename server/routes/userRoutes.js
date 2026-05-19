const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());


const jwt = require("jsonwebtoken");
const crypto = require("crypto");






const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

/* REGISTER */

router.post(
    "/register",
    async(req, res) => {
        try {

            const {
                username,
                email,
                password,
                role,
            } = req.body;

            // CHECK USERNAME
            const existingUsername =
                await User.findOne({
                    username,
                });

            if (
                existingUsername
            ) {
                return res
                    .status(400)
                    .json({
                        message: "Username already exists ❌",
                    });
            }

            // CHECK EMAIL
            const existingEmail =
                await User.findOne({
                    email,
                });

            if (
                existingEmail
            ) {
                return res
                    .status(400)
                    .json({
                        message: "Email already exists ❌",
                    });
            }

            // CREATE USER
            const user =
                new User({
                    username,
                    email,
                    password,
                    role,
                });

            await user.save();

            // TOKEN
            const token =
                jwt.sign({
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                    },
                    "SECRET_KEY", {
                        expiresIn: "7d",
                    }
                );

            res.json({
                message: "Registration successful ✅",

                token,

                user: {
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
            });

        } catch (error) {

            console.log(error);

            res.status(500)
                .json({
                    message: "Registration failed ❌",
                });
        }
    }
);

/* LOGIN */


router.post(
    "/login",
    async(req, res) => {
        try {
            const {
                username,
                password,
            } = req.body;

            const user =
                await User.findOne({
                    username,
                    password,
                });

            if (!user) {
                return res
                    .status(401)
                    .json({
                        message: "Invalid username or password",
                    });
            }

            // Create token
            const token = jwt.sign({
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    email: user.email
                },
                "mysecretkey", {
                    expiresIn: "7d",
                }
            );

            res.json({
                message: "Login Successful",
                token,
                user: {
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    password: user.password
                },
            });
        } catch (error) {
            console.log(error);

            res
                .status(500)
                .json({
                    message: "Server Error",
                });
        }
    }
);
//get users
router.get("/users", async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});
//forgot password api
router.post(
    "/forgot-password",
    async(req, res) => {

        try {

            const { email } = req.body;

            const user =
                await User.findOne({
                    email: email.trim(),
                });

            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }

            const token =
                crypto.randomBytes(32).toString("hex");

            user.resetToken = token;

            user.resetTokenExpiry =
                Date.now() + 3600000;

            await user.save();

            // DEMO LINK
            const resetLink =
                `/reset-password/${token}`;

            res.json({
                message: "Reset link generated",
                resetLink,
            });

        } catch (err) {

            res.status(500).json({
                message: err.message,
            });

        }
    }
);

router.post(
    "/reset-password/:token",
    async(req, res) => {
        console.log(req.body.password);
        try {

            const user =
                await User.findOne({
                    resetToken: req.params.token,

                    resetTokenExpiry: {
                        $gt: Date.now(),
                    },
                });

            if (!user) {
                return res.status(400).json({
                    message: "Invalid or expired token",
                });
            }

            const hashedPassword =
                await bcrypt.hash(
                    req.body.password,
                    10
                );

            user.password = hashedPassword;

            user.resetToken = undefined;
            user.resetTokenExpiry = undefined;

            await user.save();

            res.json({
                message: "Password updated successfully",
            });

        } catch (err) {

            res.status(500).json({
                message: err.message,
            });

        }
    }
);

module.exports = router;
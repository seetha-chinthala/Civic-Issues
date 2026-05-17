const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());

const jwt = require("jsonwebtoken");




const User = require("../models/User");

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
                    _id: user._id,
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


module.exports = router;
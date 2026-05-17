const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());

const jwt = require("jsonwebtoken");


const User = require("../models/User");

/* REGISTER */
router.post("/register", async(req, res) => {

    const user = new User(req.body);
    console.log("Registering user:", req.body); // Debug log    
    await user.save();

    res.json(user);
});

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
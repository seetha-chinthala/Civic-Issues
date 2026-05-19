//login
export const loginUser =
    async(data) => {
        const response =
            await fetch(
                "http://localhost:5000/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(
                        data
                    ),
                }
            );
        console.log("chala bavunhi ", response)
        const result =
            await response.json();

        if (!response.ok) {
            throw new Error(
                result.message
            );
        }

        // Save token
        localStorage.setItem(
            "token",
            result.token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(
                result.user
            )
        );

        return result;
    };
//register
export const registerUser = async(data) => {
    try {
        const response = await fetch(
            `http://localhost:5000/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        const res =
            await response.json();

        if (!response.ok) {
            throw new Error(
                res.message || "Registration failed"
            );
        }

        return res;

    } catch (err) {
        console.error(err);
        throw err;
    }
}; //createComplaint
export const createComplaint = async(formData) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const username = user ? user.username : null;

    console.log("User in createComplaint:", user);

    console.log("Token:", token);

    const response = await fetch(
        `http://localhost:5000/api/createComplaint`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData, // for multer/file upload
        }
    );

    const data = await response.json();
    return data;
};

//allComplaints
// ==============================

// ==============================

export const allComplaints = async() => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:5000/api/allComplaints", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
};



//updtaeStatus
export const updateComplaintStatus = async(id, status) => {
    const response = await fetch(`http://localhost:5000/api/updateStatus/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });

    return await response.json();
};

//get users
export const getUsers = async() => {


    const response = await fetch(`http://localhost:5000/api/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    return await response.json();
};

//myComplaints
// ==============================
// GET MY COMPLAINTS
// ==============================

export const getMyComplaints = async() => {
    try {
        const token = localStorage.getItem("token");

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        const username = user ? user.username : null;

        console.log("Logged user:", username);

        // Notice the backticks (`) used here to properly allow ${username}
        const response = await fetch(`http://localhost:5000/api/myComplaints/${username}`, {
            method: "GET",
            headers: {
                // Notice the backticks (`) used here to properly allow ${token}
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        console.log("My complaints:", data);

        return data;
    } catch (error) {
        console.log("Error fetching complaints:", error);
        return [];
    }
};

// ==============================
// SUBMIT FEEDBACK IMAGE
// ==============================

export const submitFeedback = async(
    id,
    formData
) => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:5000/api/allComplaints/feedback/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // don't add content type
                },
                body: formData,
            }
        );

        const data = await response.json();

        console.log("Feedback uploaded:", data);

        return data;
    } catch (error) {
        console.log(
            "Feedback upload error:",
            error
        );
    }
};

// ==============================
// DELETE COMPLAINT
// ==============================

export const deleteComplaint = async(
    id
) => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:5000/api/allComplaints/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        console.log("Complaint deleted:", data);

        return data;
    } catch (error) {
        console.log(
            "Delete complaint error:",
            error
        );
    }
};
//remove feedback image

//support
export const sendSupportMessage =
    async(data) => {

        const response =
            await fetch(
                "http://localhost:5000/api/support", {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(data),
                }
            );

        return await response.json();
    };
//forgot password api
export const forgotPassword = async(email) => {
    try {
        const response = await fetch(
            `http://localhost:5000/api/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Forgot Password Error:", error);
        throw error;
    }
};
export const resetPassword =
    async(token, password) => {

        try {

            const response =
                await fetch(
                    `http://localhost:5000/api/reset-password/${token}`, {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                        },

                        body: JSON.stringify({
                            password,
                        }),
                    }
                );

            const data =
                await response.json();

            return data;

        } catch (error) {

            console.log(
                "Reset Password Error:",
                error
            );

            throw error;
        }
    };
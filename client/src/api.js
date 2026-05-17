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
        const response = await fetch("http://localhost:5000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const res = await response.json();
        if (response.ok) {
            //alert("Registration successful ✅");
        } else {
            alert(res.message);
        }
    } catch (err) {
        console.error(err);
        // alert("Registration make failed ❌");
    }
};
//createComplaint
export const createComplaint = async(formData) => {
    const token = localStorage.getItem("token");

    console.log("Token:", token);

    const response = await fetch(
        "http://localhost:5000/api/createComplaint", {
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
export const allComplaints = async() => {
    const response = await fetch("http://localhost:5000/api/allComplaints");

    return await response.json();
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
    const response = await fetch(`http://localhost:5000/api/users`);
    return await response.json();
};

//myComplaints
export const getMyComplaints = async() => {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/api/myComplaints`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log("dekho mera rowdism", response)
    return await response.json();
};
//submit feedback
export const submitFeedback = async(id, formData) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
        `http://localhost:5000/api/allComplaints/feedback/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        }
    );

    return await res.json();
};

//delete complaint
export const deleteComplaint = async(id) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://localhost:5000/api/complaints/${id}`, {
            method: "DELETE",

            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return await response.json();
};
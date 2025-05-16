import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Signup = () => {
    const [userData, setUserData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!userData.username || !userData.password) {
            setError("Username and password are required.");
            return;
        }

        try {
            const response = await api.post("/api/auth/signup/", userData);
            navigate("/login");
        } catch (err) {
            if (err.response && err.response.data) {
                setError(
                    err.response.data.username?.[0] ||
                    err.response.data.password?.[0] ||
                    err.response.data.detail ||
                    "Signup failed."
                );
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card shadow p-4" style={{ width: "400px", borderRadius: "10px" }}>
                <h2 className="text-center mb-4">Sign Up</h2>
                {error && <p className="text-danger text-center">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label className="fw-bold">First Name</label>
                        <input 
                            type="text" 
                            name="first_name" 
                            className="form-control" 
                            placeholder="Enter First Name" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label className="fw-bold">Last Name</label>
                        <input 
                            type="text" 
                            name="last_name" 
                            className="form-control" 
                            placeholder="Enter Last Name" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label className="fw-bold">Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            className="form-control" 
                            placeholder="Enter Username" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label className="fw-bold">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            className="form-control" 
                            placeholder="Enter Email" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label className="fw-bold">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            className="form-control" 
                            placeholder="Enter Password" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-bold">Sign Up</button>
                </form>

                <p className="text-center mt-3">
                    Already have an account? <a href="/login" className="text-decoration-none">Sign In</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;

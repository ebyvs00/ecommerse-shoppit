import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Axios instance

const Login = ({ setIsAuthenticated, setUser }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!username || !password) {
            setError("Username and password are required.");
            return;
        }

        try {
            // ✅ Authenticate User
            const response = await api.post("/api/token/", {  
                username: username.trim(),
                password: password.trim(),
            });

            const { access, refresh } = response.data;
            if (!access || !refresh) throw new Error("No tokens received!");

            // ✅ Save tokens
            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);
            setIsAuthenticated(true);

            // ✅ Fetch user profile after login
            const profileRes = await api.get("/api/profile/");
            localStorage.setItem("user", JSON.stringify(profileRes.data));
            setUser(profileRes.data); // Set user state

            // ✅ Redirect to Home Page
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.detail || "❌ Login failed. Check your credentials.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card shadow p-4" style={{ width: "400px", borderRadius: "10px" }}>
                <h2 className="text-center mb-4">Login</h2>
                {error && <p className="text-danger text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label className="fw-bold">Username</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Enter Username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label className="fw-bold">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Enter Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold">Login</button>
                </form>
                <p className="text-center mt-3">
                    Don't have an account? <a href="/signup" className="text-decoration-none">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;

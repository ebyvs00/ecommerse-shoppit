import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access"); // ✅ Remove token from storage
        navigate("/login"); // ✅ Redirect to login after logout
    };

    return (
        <div>
            <h2>Welcome to Your Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;

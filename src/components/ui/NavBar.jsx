import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const NavBar = ({ numCartItems = 0, user, setUser }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access"));
    const [hovered, setHovered] = useState(false); // Track hover state

    useEffect(() => {
        if (!user) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser && setUser(JSON.parse(storedUser));
            }
        }
        setIsAuthenticated(!!localStorage.getItem("access"));
    }, [user, setUser]);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser && setUser(null);
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-2 py-md-3">
            <div className="container-fluid px-3 px-md-4 px-lg-5">
                <Link className="navbar-brand fw-bold text-uppercase d-flex align-items-center" to="/">
                    <FaShoppingCart size={24} className="me-2" />
                    SHOP
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contact</Link>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center gap-3 ms-auto">
                        <Link to="/cart" className="btn btn-dark rounded-pill position-relative">
                            <FaShoppingCart />
                            {numCartItems > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {numCartItems}
                                </span>
                            )}
                        </Link>

                        {/* ✅ Profile Button with Smooth Animation */}
                        {isAuthenticated && user?.username && (
                            <button 
                                onClick={() => navigate("/profile")}
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                                className="btn d-flex align-items-center gap-2 bg-transparent"
                                style={{
                                    fontWeight: "bold",
                                    color: "black",
                                    border: "1px solid #bbb", // Light black border
                                    borderRadius: "5px",
                                    padding: "5px 10px",
                                    transition: "all 0.3s ease-in-out" // Smooth transition effect
                                }}
                            >
                                <FaUser />
                                <span 
                                    style={{
                                        opacity: hovered ? 1 : 0.6, // Fade effect
                                        transform: hovered ? "translateX(3px)" : "translateX(0px)", // Move slightly
                                        transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out"
                                    }}
                                >
                                    {user.username}
                                </span>
                            </button>
                        )}

                        {/* ✅ Logout Button (Black, Round) */}
                        {isAuthenticated ? (
                            <button 
                                onClick={handleLogout} 
                                className="btn d-flex align-items-center justify-content-center"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: "black",
                                    color: "white",
                                    borderRadius: "50%"
                                }}
                            >
                                <FaSignOutAlt size={18} />
                            </button>
                        ) : (
                            <Link to="/login" className="btn btn-outline-primary">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;

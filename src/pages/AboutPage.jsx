import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // ✅ CSS Fixes
    const styles = {
        container: {
            fontFamily: "Poppins, sans-serif",
            textAlign: "center",
            padding: "60px 20px",
            background: "linear-gradient(to right, #f8f9fa, #e3eaf3)",
            color: "#333",
            minHeight: "100vh",
            position: "relative"
        },
        header: {
            background: "linear-gradient(135deg, #6a11cb, #2575fc)",
            color: "white",
            padding: "60px 20px",
            borderRadius: "10px",
            marginBottom: "40px",
            position: "relative"
        },
        content: {
            maxWidth: "800px",
            margin: "0 auto",
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
        },
        backButton: {
            position: "fixed", // ✅ Fixed at the top
            top: "15px",
            left: "15px",
            background: "#fff",
            border: "none",
            padding: "10px 15px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "5px",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
            transition: "0.3s",
            zIndex: "1000" // ✅ Ensures visibility
        },
        menuButton: {
            position: "fixed", // ✅ Stays at top-right corner
            top: "15px",
            right: "15px",
            background: "#fff",
            border: "none",
            padding: "10px 15px",
            fontSize: "18px",
            cursor: "pointer",
            borderRadius: "5px",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
            transition: "0.3s",
            zIndex: "1000" // ✅ Ensures visibility
        },
        menu: {
            position: "absolute",
            top: "50px",
            right: "15px",
            background: "white",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "5px",
            padding: "10px",
            display: menuOpen ? "block" : "none", // ✅ This ensures menu visibility
            zIndex: "1000"
        },
        menuItem: {
            padding: "10px",
            textDecoration: "none",
            color: "#333",
            display: "block",
            fontSize: "1rem",
            transition: "0.3s",
            borderBottom: "1px solid #eee"
        }
    };

    return (
        <div style={styles.container}>
            {/* ⬅️ Back Button (Fixed on Screen) */}
            <button style={styles.backButton} onClick={() => navigate(-1)}>
                ⬅ Back
            </button>

            {/* ☰ Menu Button (Fixed on Screen) */}
            <button style={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </button>

            {/* ✅ Dropdown Menu (Now Visible & Fixed at Top) */}
            {menuOpen && (
                <div style={styles.menu}>
                    <a href="/" style={styles.menuItem}>🏠 Home</a>
                    <a href="/contact" style={styles.menuItem}>📞 Contact</a>
                    <a href="/cart" style={styles.menuItem}>🛒 Cart</a>
                </div>
            )}

            <div style={styles.header}>
                <h1>About Us</h1>
                <p>Discover our story and what makes us unique.</p>
            </div>

            <div style={styles.content}>
                <h2>Our Mission</h2>
                <p>We strive to provide the best quality products with a seamless shopping experience.</p>
            </div>
        </div>
    );
};

export default AboutPage;

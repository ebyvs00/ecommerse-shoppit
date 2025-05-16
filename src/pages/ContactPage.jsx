import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ContactPage = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // ✅ Inline Styles
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
            position: "fixed",
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
            zIndex: "1000"
        },
        menuButton: {
            position: "fixed",
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
            zIndex: "1000"
        },
        menu: {
            position: "absolute",
            top: "50px",
            right: "15px",
            background: "white",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "5px",
            padding: "10px",
            display: menuOpen ? "block" : "none",
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
        },
        form: {
            display: "flex",
            flexDirection: "column",
            textAlign: "left"
        },
        formGroup: {
            marginBottom: "15px"
        },
        input: {
            width: "100%",
            padding: "10px",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "1px solid #ccc"
        },
        button: {
            padding: "10px",
            fontSize: "1rem",
            background: "#2575fc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "0.3s"
        }
    };

    return (
        <div style={styles.container}>
            {/* ⬅️ Back Button */}
            <button style={styles.backButton} onClick={() => navigate(-1)}>
                ⬅ Back
            </button>

            {/* ☰ Menu Button */}
            <button style={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </button>

            {/* ✅ Dropdown Menu */}
            {menuOpen && (
                <div style={styles.menu}>
                    <a href="/" style={styles.menuItem}>🏠 Home</a>
                    <a href="/about" style={styles.menuItem}>📖 About</a>
                    <a href="/cart" style={styles.menuItem}>🛒 Cart</a>
                </div>
            )}

            <div style={styles.header}>
                <h1>Contact Us</h1>
                <p>Have questions? We're here to help!</p>
            </div>

            <div style={styles.content}>
                <form style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" placeholder="Your Name" style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="you@example.com" style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="message">Message</label>
                        <textarea id="message" rows="4" placeholder="Your message" style={styles.input}></textarea>
                    </div>

                    <button type="submit" style={styles.button}>Send Message</button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;

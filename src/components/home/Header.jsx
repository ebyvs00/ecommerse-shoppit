import React, { useEffect, useState } from "react";
import "./styles.css";

const Header = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 300);
  }, []);

  return (
    <header
      className={`py-3 py-md-4 py-lg-5 w-100 header-section ${fadeIn ? "fade-in" : ""}`}
      style={{
        backgroundColor: "#12343b",
        width: "100vw",
        minHeight: "40vh", // Adjusted for better mobile view
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="container px-3 px-md-4 px-lg-5">
        <div className="text-center text-white">
          <h1 className="display-5 display-md-4 display-lg-3 fw-bold slide-in-text">
            Welcome to Your Favorite Store
          </h1>
          <p className="lead fw-normal text-white-75 mb-3 mb-md-4 slide-in-text">
            Discover the latest trends with us
          </p>
          <a
            href="#shop"
            className="btn btn-light btn-lg rounded-pill px-3 px-md-4 py-2 zoom-in-btn"
            style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
          >
            Shop Now
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
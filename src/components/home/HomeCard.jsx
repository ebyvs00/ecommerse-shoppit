import React from "react";
import { Link } from "react-router-dom"; 
import { BASE_URL } from "../../api";

const HomeCard = ({ product }) => {
  return (
    <div className="card home-card border-0 shadow-sm h-100"> {/* Added h-100 for equal height */}
      {/* Clickable Image - Responsive */}
      <Link to={`/products/${product.slug}`} className="image-link">
        <img
          src={`${BASE_URL}${product.image}`}
          alt={product.name}
          className="card-img-top product-image"
          style={{ 
            height: "180px",
            objectFit: "cover",
            width: "100%"
          }}
        />
      </Link>
      
      {/* Card Body - Responsive Padding */}
      <div className="card-body text-center product-info p-2 p-sm-3">
        <h6 className="fw-bold product-name mb-1 mb-md-2" style={{ fontSize: "clamp(14px, 2vw, 16px)" }}>
          {product.name}
        </h6>
        <h6 className="text-dark product-price mb-0" style={{ fontSize: "clamp(14px, 2vw, 16px)" }}>
          {product.price} RS
        </h6>
      </div>
    </div>
  );
};

export default HomeCard;
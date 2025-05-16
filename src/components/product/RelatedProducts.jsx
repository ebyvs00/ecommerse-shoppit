import React from "react";
import HomeCard from "../home/HomeCard";

const RelatedProducts = ({ products = [] }) => {  // ✅ Default to an empty array
  return (
    <section className="py-3 bg-light">
      <div className="container px-4 px-lg-5 mt-3">
        <h2 className="fw-bolder mb-4">Related products</h2>
        <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
          {products.length > 0 ? (
            products.map((product) => <HomeCard key={product.id} product={product} />)
          ) : (
            <p>No related products available.</p> // ✅ Show message if empty
          )}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;

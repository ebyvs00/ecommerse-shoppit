import React from "react";
import HomeCard from "./HomeCard";

const CardContainer = ({ products }) => {
  return (
    <section className="py-3 py-md-4 py-lg-5" id="shop"> {/* Responsive padding */}
      <h4 className="text-center mb-3 mb-md-4">Our Products</h4> {/* Responsive margin */}
      <div className="container px-3 px-md-4 px-lg-5"> {/* Responsive padding */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-3 g-md-4"> {/* Responsive columns & gutters */}
          {products.map((product) => (
            <div key={product.id} className="col d-flex align-items-stretch">
              <HomeCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardContainer;
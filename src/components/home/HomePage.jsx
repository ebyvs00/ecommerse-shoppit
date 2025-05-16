import { useEffect, useState } from "react";
import Header from "./Header";
import CardContainer from "./CardContainer";
import api from "../../api";
import PlaceHolderContainer from "../ui/PlaceHolderContainer";
import Error from "../ui/Error";
import { randomValue } from "../../GenerateCartCode"; // Make sure this is a function

const HomePage = ({ onCartUpdate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only if you're still using cart_code — otherwise remove this
    if (!localStorage.getItem("cart_code")) {
      const newCartCode = randomValue(); // Now correctly calling a function
      localStorage.setItem("cart_code", newCartCode);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/products/");
        if (isMounted) {
          setProducts(res.data);
          setError("");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        if (isMounted) {
          setError(
            err.response?.data?.error ||
            err.response?.data?.detail ||
            "Failed to load products. Please try again later."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-page">
      <Header />

      <main className="container mt-3 mt-md-4 mt-lg-5">
        {error && (
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8 mx-auto">
              <Error error={error} />
            </div>
          </div>
        )}

        {loading && <PlaceHolderContainer />}

        {!loading && !error && products.length > 0 && (
          <CardContainer
            products={products}
            onCartUpdate={onCartUpdate}
          />
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-5">
            <h5 className="text-muted">No products available</h5>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductPagePlaceHolder from "./ProductPagePlaceHolder";
import RelatedProducts from "./RelatedProducts";
import { BASE_URL } from "../../api";
import api from "../../api";

const ProductPage = ({ onCartUpdate }) => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // ✅ Ensure cart_code exists only if not already set
  useEffect(() => {
    let cart_code = localStorage.getItem("cart_code");
    if (!cart_code) {
      cart_code = `cart_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem("cart_code", cart_code);
    }
  }, []);

  // ✅ Fetch Product Data
  useEffect(() => {
    setLoading(true);
    setError(null);

    api
      .get(`/api/products/${slug}/`) // ✅ Matches Django API path
      .then((res) => {
        setProduct(res.data);
        setSimilarProducts(res.data.similarProducts || []);
      })
      .catch((err) => {
        console.error("❌ Error fetching product:", err);
        setError("Product not found or an error occurred.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // ✅ Check if Product is in Cart
  useEffect(() => {
    if (!product || !product.id) return;

    const cart_code = localStorage.getItem("cart_code");
    api
      .get(`/api/cart/check/?cart_code=${cart_code}&product_id=${product.id}`) // ✅ Fixed API path
      .then((res) => {
        setInCart(res.data.product_in_cart);
      })
      .catch((err) => {
        console.error("❌ Error checking cart:", err);
      });
  }, [product]);

  // ✅ Add Item to Cart
  const add_item = async () => {
    if (!product || !product.id) {
      console.error("❌ Product ID is undefined, cannot add to cart.");
      return;
    }

    const cart_code = localStorage.getItem("cart_code");
    const newItem = {
      cart_code: cart_code,
      product_id: product.id,
      quantity: quantity,
    };

    try {
      await api.post("/api/cart/add/", newItem); // ✅ Matches Django API path
      setInCart(true);
      onCartUpdate();
      alert("✅ Product added to cart successfully!");
    } catch (err) {
      console.error("❌ Error adding item:", err.response?.data || err.message);
    }
  };

  if (loading) return <ProductPagePlaceHolder />;
  if (error) return <p className="text-danger text-center">{error}</p>;
  if (!product) return <p className="text-danger text-center">Product not found.</p>;

  return (
    <div>
      <section className="py-3">
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">
            <div className="col-md-6">
              <img
                className="card-img-top mb-5 mb-md-0"
                src={product.image ? `${BASE_URL}${product.image}` : "/fallback-image.jpg"} // ✅ Improved fallback image
                alt={product.name || "Product Image"}
                onError={(e) => (e.target.src = "/fallback-image.jpg")} // ✅ Better error handling
              />
            </div>
            <div className="col-md-6">
              <h1 className="display-5 fw-bolder">{product.name}</h1>
              <div className="fs-5 mb-5">
                <span>{`${parseInt(product.price)} RS/-`}</span>
              </div>
              <p className="lead">{product.description || "No description available."}</p>
              <div className="d-flex">
                <input
                  className="form-control text-center me-3"
                  id="inputQuantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  style={{ maxWidth: "3rem" }}
                  min="1"
                />
                <button
                  className="btn btn-outline-dark flex-shrink-0"
                  type="button"
                  onClick={add_item}
                  disabled={inCart}
                >
                  <i className="bi-cart-fill me-1"></i>
                  {inCart ? "Product added to cart" : "Add to cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <RelatedProducts products={similarProducts} />
    </div>
  );
};

export default ProductPage;

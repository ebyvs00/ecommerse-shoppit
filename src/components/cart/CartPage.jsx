import React, { useEffect, useState } from "react";
import Cartitem from './Cartitem';
import CartSummary from "./CartSummary";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaArrowLeft, FaSpinner } from "react-icons/fa";


const CartPage = ({ onCartUpdate }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const cart_code = localStorage.getItem("cart_code");

  const fetchCart = async () => {
    if (!cart_code) {
      setError("No cart found. Start shopping to add items!");
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/api/cart/?cart_code=${cart_code}`);
      setCart(res.data);
      if (onCartUpdate) onCartUpdate();
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.response?.data?.error || "Failed to load your cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAll = async () => {
    if (!cart_code || !window.confirm("Are you sure you want to empty your cart?")) return;
    
    setIsRemoving(true);
    try {
      await api.delete(`/api/cart/clear/?cart_code=${cart_code}`);
      await fetchCart();
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("Failed to empty cart. Please try again.");
    } finally {
      setIsRemoving(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [cart_code]);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <FaSpinner className="fa-spin mb-3" size={32} />
        <p className="text-muted">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: "600px" }}>
          {error}
          <button 
            className="btn btn-outline-primary mt-3"
            onClick={() => navigate('/products')}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header with back button */}
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" />
          Back
        </button>
        <h2 className="mb-0">
          <FaShoppingCart className="me-2 text-primary" />
          Your Shopping Cart
        </h2>
      </div>

      <div className="row">
        {/* Cart Items Column */}
        <div className="col-lg-8 mb-4 mb-lg-0">
          {cart?.items.length > 0 ? (
            <>
              <div className="card shadow-sm mb-4">
                <div className="card-body p-0">
                  {cart.items.map((item) => (
                    <CartItem 
                      key={item.id} 
                      item={item} 
                      onCartUpdate={fetchCart}
                    />
                  ))}
                </div>
              </div>
              
              <div className="d-flex justify-content-between">
                
                
              </div>
            </>
          ) : (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <FaShoppingCart size={48} className="text-muted mb-3" />
                <h4 className="text-muted mb-3">Your cart is empty</h4>
                <p className="text-muted mb-4">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <button 
                  className="btn btn-primary px-4"
                  onClick={() => navigate('/products')}
                >
                  Browse Products
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cart Summary Column */}
        <div className="col-lg-4">
          <CartSummary 
            cartTotal={cart?.sum_total || 0} 
            itemCount={cart?.items.length || 0}
            onCartUpdate={fetchCart}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
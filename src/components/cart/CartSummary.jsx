import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const CartSummary = ({ cartTotal = 0, onCartUpdate = () => {} }) => {
    const navigate = useNavigate();
    const [discount, setDiscount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(cartTotal);
    const [isLoading, setIsLoading] = useState(true);
    const platformFee = 3;
    const deliveryCharge = 120;

    useEffect(() => {
        const fetchCartTotal = async () => {
            try {
                const cart_code = localStorage.getItem("cart_code");
                if (!cart_code) return;

                const res = await api.get(`/api/cart/?cart_code=${cart_code}`);
                if (res.data && res.data.sum_total) {
                    const cartTotal = res.data.sum_total;
                    const discountAmount = res.data.total_discount || 0;

                    setDiscount(discountAmount);
                    setFinalTotal(cartTotal - discountAmount + platformFee); 
                    onCartUpdate();
                }
            } catch (err) {
                console.error("Error fetching cart:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCartTotal();
    }, [cartTotal, onCartUpdate]);

    const handleCheckout = () => {
        navigate("/checkout", { state: { totalAmount: finalTotal } });
    };

    if (isLoading) {
        return (
            <div className="card p-4 shadow-sm" style={{ borderRadius: "12px" }}>
                <div className="d-flex justify-content-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card p-4 shadow-sm" style={{ 
            borderRadius: "16px",
            border: "none",
            background: "white",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            ":hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
            }
        }}>
            {/* Header with decorative accent */}
            <div className="d-flex align-items-center mb-3 position-relative">
                <h5 className="mb-0" style={{ fontWeight: "600", color: "#2c3e50" }}>
                    Order Summary
                </h5>
                <div style={{
                    position: "absolute",
                    bottom: "-8px",
                    left: 0,
                    width: "40px",
                    height: "3px",
                    background: "linear-gradient(90deg, #3498db, #9b59b6)",
                    borderRadius: "3px"
                }}></div>
            </div>

            {/* Price Breakdown */}
            <div className="mb-3">
                <div className="d-flex justify-content-between py-2">
                    <span style={{ color: "#7f8c8d" }}>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                    <div className="d-flex justify-content-between py-2" style={{ color: "#27ae60" }}>
                        <span>Discount</span>
                        <span>- ₹{discount.toFixed(2)}</span>
                    </div>
                )}
                
                <div className="d-flex justify-content-between py-2">
                    <span style={{ color: "#7f8c8d" }}>Platform Fee</span>
                    <span>₹{platformFee.toFixed(2)}</span>
                </div>
                
                <div className="d-flex justify-content-between py-2">
                    <span style={{ color: "#7f8c8d" }}>Delivery</span>
                    <span style={{ color: "#27ae60", fontWeight: "500" }}>
                        <span style={{ 
                            color: "#bdc3c7", 
                            textDecoration: "line-through",
                            marginRight: "8px"
                        }}>
                            ₹{deliveryCharge.toFixed(2)}
                        </span>
                        FREE
                    </span>
                </div>
            </div>

            {/* Divider with subtle styling */}
            <hr style={{ 
                border: "none",
                height: "1px",
                background: "linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)",
                margin: "16px 0"
            }} />

            {/* Total Amount */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h6 style={{ fontWeight: "600", color: "#2c3e50", marginBottom: "4px" }}>Total Amount</h6>
                    <small className="text-muted">Inclusive of all taxes</small>
                </div>
                <h4 style={{ 
                    fontWeight: "700", 
                    color: "#27ae60",
                    background: "linear-gradient(135deg, #27ae60, #2ecc71)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}>
                    ₹{finalTotal.toFixed(2)}
                </h4>
            </div>

            {/* Checkout Button */}
            <button 
                className="btn w-100 py-3"
                onClick={handleCheckout}
                disabled={finalTotal <= 0}
                style={{
                    background: finalTotal <= 0 
                        ? "#bdc3c7" 
                        : "linear-gradient(135deg, #3498db, #9b59b6)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "600",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    boxShadow: finalTotal <= 0 
                        ? "none" 
                        : "0 4px 15px rgba(52, 152, 219, 0.3)",
                    ":hover": {
                        transform: finalTotal <= 0 ? "none" : "translateY(-2px)",
                        boxShadow: finalTotal <= 0 
                            ? "none" 
                            : "0 6px 20px rgba(52, 152, 219, 0.4)"
                    },
                    ":disabled": {
                        cursor: "not-allowed"
                    }
                }}
            >
                {finalTotal <= 0 ? "Add items to checkout" : "Proceed to Checkout"}
            </button>

            {/* Security Assurance */}
            <div className="text-center mt-3">
                <small className="text-muted d-flex align-items-center justify-content-center">
                    <span className="me-2" style={{ color: "#3498db" }}>🔒</span>
                    Secure SSL encrypted checkout
                </small>
            </div>
        </div>
    );
};

export default CartSummary;
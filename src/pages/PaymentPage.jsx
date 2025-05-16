import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const totalAmount = location.state?.totalAmount || 0;
    const [paymentMethod, setPaymentMethod] = useState("razorpay");
    const [isProcessing, setIsProcessing] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    const paymentMethods = [
        { id: "razorpay", name: "Razorpay", color: "#2d5bff", icon: "R" },
        { id: "paytm", name: "Paytm", color: "#00baf2", icon: "P" },
        { id: "gpay", name: "Google Pay", color: "#4285F4", icon: "G" },
        { id: "phonepe", name: "PhonePe", color: "#5f259f", icon: "Ph" },
        { id: "cod", name: "Cash on Delivery", color: "#6c757d", icon: "₹" }
    ];

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
            console.log("Razorpay script loaded");
            setRazorpayLoaded(true);
        };
        script.onerror = () => {
            console.error("Razorpay script failed to load");
            setRazorpayLoaded(false);
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleRazorpayPayment = async () => {
        setIsProcessing(true);
        try {
            const amountInPaise = Math.round(totalAmount * 100);

            const options = {
                key: "rzp_test_Q0j4EUBEIdftMa", // Your Razorpay test key
                amount: amountInPaise,
                currency: "INR",
                name: "Your Store Name",
                description: `Test Payment`,
                // No order_id for test
                handler: (response) => {
                    alert(`Payment successful!\nPayment ID: ${response.razorpay_payment_id}`);
                    navigate("/order-success", {
                        state: {
                            paymentId: response.razorpay_payment_id,
                            amount: totalAmount
                        }
                    });
                    setIsProcessing(false);
                },
                prefill: {
                    name: "Test User",
                    email: "test@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#2d5bff"
                },
                modal: {
                    ondismiss: () => {
                        console.log("Payment modal closed");
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", (response) => {
                alert(`Payment failed: ${response.error.description}`);
                setIsProcessing(false);
            });
            rzp.open();

        } catch (error) {
            console.error("Payment error", error);
            alert(`Payment Error: ${error.message}`);
            setIsProcessing(false);
        }
    };

    const handlePayment = () => {
        if (paymentMethod === "cod") {
            setIsProcessing(true);
            setTimeout(() => {
                alert("Cash on Delivery selected. Order placed!");
                navigate("/order-success", {
                    state: { paymentMethod: "cod", amount: totalAmount }
                });
                setIsProcessing(false);
            }, 1500);
        } else if (paymentMethod === "razorpay") {
            if (!razorpayLoaded) {
                alert("Payment gateway is still loading. Try again shortly.");
                return;
            }
            handleRazorpayPayment();
        } else {
            setIsProcessing(true);
            setTimeout(() => {
                alert(`Payment of ₹${totalAmount} via ${paymentMethod} processed.`);
                navigate("/order-success", {
                    state: { paymentMethod, amount: totalAmount }
                });
                setIsProcessing(false);
            }, 1500);
        }
    };

    return (
        <div className="container-fluid d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
            <div className="card p-4 shadow-lg" style={{ maxWidth: "450px", width: "100%", borderRadius: "16px", background: "white", border: "none" }}>
                <button className="btn btn-outline-secondary mb-3 align-self-start" onClick={() => navigate(-1)} style={{ fontWeight: "600", borderRadius: "8px" }}>
                    ← Back to Cart
                </button>

                <div className="text-center mb-4 position-relative">
                    <h2 className="mb-0" style={{ fontWeight: "700", color: "#2c3e50", position: "relative", display: "inline-block" }}>
                        Payment Options
                        <span style={{ position: "absolute", bottom: "-8px", left: "50%", transform: "translateX(-50%)", width: "50px", height: "3px", background: "linear-gradient(90deg, #3498db, #9b59b6)", borderRadius: "3px" }}></span>
                    </h2>
                    <p className="text-muted mt-2">Complete your purchase securely</p>
                </div>

                <div className="mb-4">
                    <h5 className="mb-3" style={{ color: "#7f8c8d", fontWeight: "600" }}>Digital Payment Methods</h5>
                    <div className="row g-3">
                        {paymentMethods.slice(0, 4).map((method) => (
                            <div className="col-md-3" key={method.id}>
                                <div className={`p-3 border rounded d-flex flex-column align-items-center ${paymentMethod === method.id ? "border-primary shadow-sm" : "border-light"}`}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: paymentMethod === method.id ? `${method.color}20` : "white",
                                        height: "100%"
                                    }}
                                    onClick={() => setPaymentMethod(method.id)}>
                                    <div className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                                        style={{
                                            width: "40px", height: "40px", backgroundColor: method.color, color: "white",
                                            fontWeight: "bold", fontSize: "1.1rem"
                                        }}>
                                        {method.icon}
                                    </div>
                                    <span style={{ fontWeight: "500", fontSize: "0.9rem", textAlign: "center" }}>{method.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-3">
                    <h5 className="mb-3" style={{ color: "#7f8c8d", fontWeight: "600" }}>Other Options</h5>
                    <div className={`p-3 border rounded d-flex align-items-center ${paymentMethod === "cod" ? "border-danger shadow-sm" : "border-light"}`}
                        style={{ cursor: "pointer", backgroundColor: paymentMethod === "cod" ? "#e74c3c20" : "white" }}
                        onClick={() => setPaymentMethod("cod")}>
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ width: "40px", height: "40px", backgroundColor: "#e74c3c", color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>
                            ₹
                        </div>
                        <div>
                            <div style={{ fontWeight: "500" }}>Cash on Delivery</div>
                            <small className="text-muted">Pay when you receive your order</small>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4 pt-3" style={{ borderTop: "1px dashed #ddd" }}>
                    <div>
                        <h5 className="mb-1" style={{ fontWeight: "600", color: "#2c3e50" }}>Total Amount</h5>
                        <small className="text-muted">Inclusive of all taxes</small>
                    </div>
                    <h3 className="mb-0" style={{ fontWeight: "700", color: "#27ae60" }}>₹{totalAmount.toFixed(2)}</h3>
                </div>

                <button className="btn w-100 mt-4 py-3" onClick={handlePayment} disabled={isProcessing}
                    style={{
                        fontSize: "1.1rem", fontWeight: "600", borderRadius: "10px",
                        background: isProcessing ? "#bdc3c7" : "linear-gradient(135deg, #3498db, #9b59b6)",
                        color: "white", border: "none"
                    }}>
                    {isProcessing ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing...
                        </>
                    ) : (
                        paymentMethod === "cod" ? "Place Order" : `Pay ₹${totalAmount}`
                    )}
                </button>

                <div className="text-center mt-3">
                    <small className="text-muted d-flex align-items-center justify-content-center">
                        <span className="me-2" style={{ color: "#27ae60" }}>🔒</span>
                        Your payment is securely encrypted
                    </small>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;

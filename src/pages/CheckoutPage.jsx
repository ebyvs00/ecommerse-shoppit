import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);

    const [address, setAddress] = useState({
        name: "",
        phone: "",
        street: "",
        city: "",
        zip: ""
    });
    const [isEditing, setIsEditing] = useState(false);

    const platformFee = 3;
    const deliveryCharge = 120;

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const cart_code = localStorage.getItem("cart_code");
                if (!cart_code) return;

                const response = await api.get(`/api/cart/?cart_code=${cart_code}`);
                if (response.data && response.data.items) {
                    setCartItems(response.data.items);
                    let totalPrice = 0;
                    let totalDiscount = 0;

                    response.data.items.forEach(item => {
                        if (item.product?.price != null && item.quantity != null) {
                            totalPrice += parseFloat(item.product.price) * parseInt(item.quantity);
                        }
                        if (item.product?.discount != null && item.quantity != null) {
                            totalDiscount += parseFloat(item.product.discount) * parseInt(item.quantity);
                        }
                    });

                    setCartTotal(totalPrice);
                    setDiscount(totalDiscount);
                    setFinalTotal(totalPrice - totalDiscount + platformFee);
                }
            } catch (err) {
                console.error("Error fetching cart data:", err);
            }
        };

        fetchCart();
    }, []);

    useEffect(() => {
        const savedAddress = localStorage.getItem("permanentAddress");
        if (savedAddress) {
            const parsed = JSON.parse(savedAddress);
            setAddress(parsed);
        }
    }, []);

    const handleInputChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleContinue = () => {
        const { name, phone, street, city, zip } = address;
        if (!name || !phone || !street || !city || !zip) {
            alert("❌ Please fill in all the shipping address details before continuing.");
            return;
        }

        navigate("/payment", { state: { totalAmount: finalTotal } });
    };

    return (
        <div style={{ maxWidth: "450px", margin: "auto", padding: "12px", fontFamily: "Arial, sans-serif", backgroundColor: "#f8f9fa" }}>
            {/* Address Section */}
            <div style={{ backgroundColor: "white", padding: "10px", borderRadius: "8px", boxShadow: "0px 0px 5px rgba(0,0,0,0.1)", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Shipping Address</h6>
                    <button onClick={() => setIsEditing(!isEditing)} style={{ fontSize: "0.9rem", border: "none", background: "none", color: "#007bff", cursor: "pointer" }}>
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                </div>

                {!isEditing ? (
                    <div>
                        <p><strong>Name:</strong> {address.name}</p>
                        <p><strong>Phone:</strong> {address.phone}</p>
                        <p><strong>Street:</strong> {address.street}</p>
                        <p><strong>City:</strong> {address.city}</p>
                        <p><strong>ZIP:</strong> {address.zip}</p>
                    </div>
                ) : (
                    <div>
                        <input type="text" name="name" placeholder="Full Name" value={address.name} onChange={handleInputChange} style={inputStyle} />
                        <input type="tel" name="phone" placeholder="Phone Number" value={address.phone} onChange={handleInputChange} style={inputStyle} />
                        <input type="text" name="street" placeholder="Street Address" value={address.street} onChange={handleInputChange} style={inputStyle} />
                        <div style={{ display: "flex", gap: "5px" }}>
                            <input type="text" name="city" placeholder="City" value={address.city} onChange={handleInputChange} style={{ ...inputStyle, flex: 1 }} />
                            <input type="text" name="zip" placeholder="ZIP Code" value={address.zip} onChange={handleInputChange} style={{ ...inputStyle, flex: 1 }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Price Details */}
            <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "8px", boxShadow: "0px 0px 5px rgba(0,0,0,0.1)" }}>
                <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Price Details</h6>
                <div style={rowStyle}><span>Price ({cartItems.length} items)</span><span>₹{cartTotal.toFixed(2)}</span></div>
                <div style={{ ...rowStyle, color: "green" }}><span>Discount</span><span>- ₹{discount.toFixed(2)}</span></div>
                <div style={rowStyle}><span>Platform Fee</span><span>₹{platformFee}</span></div>
                <div style={rowStyle}><span>Delivery Charges</span><span style={{ color: "green" }}><s style={{ color: "#888" }}>₹{deliveryCharge}</s> FREE</span></div>
                <hr />
                <div style={{ ...rowStyle, fontWeight: "bold", fontSize: "1.1rem" }}><span>Total Amount</span><span>₹{finalTotal.toFixed(2)}</span></div>
            </div>

            {/* Back & Continue Buttons */}
            <div style={{ position: "fixed", bottom: "0", width: "100%", maxWidth: "450px", backgroundColor: "white", padding: "10px", borderTop: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={() => navigate(-1)} style={backButtonStyle}>Back</button>
                <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>₹{finalTotal.toFixed(2)}</span>
                <button onClick={handleContinue} style={buttonStyle}>Continue</button>
            </div>
        </div>
    );
};

// Styles
const inputStyle = { width: "100%", padding: "8px", marginBottom: "6px", border: "1px solid #ddd", borderRadius: "4px" };
const rowStyle = { display: "flex", justifyContent: "space-between", marginBottom: "8px" };
const buttonStyle = { backgroundColor: "#ffb700", border: "none", color: "black", fontSize: "1rem", fontWeight: "bold", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" };
const backButtonStyle = { backgroundColor: "#ddd", border: "none", color: "black", fontSize: "1rem", fontWeight: "bold", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", marginRight: "10px" };

export default CheckoutPage;

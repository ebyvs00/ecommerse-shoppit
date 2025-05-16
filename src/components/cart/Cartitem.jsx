import { useState } from "react";
import api from "../../api";
import { BASE_URL } from "../../api";

const CartItem = ({ item, onCartUpdate = () => {} }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteCartItem = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) return;

        try {
            setLoading(true);
            await api.delete("/api/cart/delete/", { data: { item_id: item.id } });
            setError(null);
            onCartUpdate();
        } catch (error) {
            console.error("Error deleting item:", error);
            setError(error.response?.data?.error || "Failed to delete item.");
        } finally {
            setLoading(false);
        }
    };

    const productImage = item.product.image.startsWith("http")
        ? item.product.image
        : `${BASE_URL}${item.product.image}`;

    return (
        <div className="col-12">
            <div className="cart-item d-flex flex-column flex-md-row align-items-center p-3 mb-3"
                style={{ 
                    backgroundColor: "#f8f9fa", 
                    borderRadius: "8px",
                    gap: "1rem"
                }}
            >
                {/* Product Image */}
                <img 
                    src={productImage}
                    alt={item.product.name}
                    className="img-fluid rounded"
                    style={{ 
                        width: "80px", 
                        height: "80px", 
                        objectFit: "cover",
                        alignSelf: "flex-start"
                    }}
                    onError={(e) => (e.target.src = "/fallback-image.jpg")}
                />

                {/* Product Details */}
                <div className="flex-grow-1 text-center text-md-start">
                    <h5 className="mb-1 fw-bold">{item.product.name}</h5>
                    <p className="mb-2 text-muted">{`${item.product.price} RS`}</p>
                    <p className="mb-2">Quantity: {item.quantity}</p>

                    {/* Mobile-only error display */}
                    {error && (
                        <p className="text-danger d-md-none mb-2">{error}</p>
                    )}
                </div>

                {/* Remove Button */}
                <div className="d-flex" style={{ gap: "0.5rem" }}>
                    <button 
                        className="btn btn-danger btn-sm"
                        onClick={deleteCartItem}
                        disabled={loading}
                        style={{ minWidth: "80px" }}
                    >
                        {loading ? "..." : "Remove"}
                    </button>
                </div>

                {/* Desktop error display */}
                {error && (
                    <p className="text-danger mt-2 d-none d-md-block text-center">{error}</p>
                )}
            </div>
        </div>
    );
};

export default CartItem;

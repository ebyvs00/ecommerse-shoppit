import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api";
import MainLayout from "./layout/MainLayout"; // ✅ MainLayout already contains NavBar
import HomePage from "./components/home/HomePage";
import ProductPage from "./components/product/ProductPage";
import CartPage from "./components/cart/CartPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import ProductPage from './components/product/ProductPage';


const App = () => {
    const [numCartItems, setNumCartItems] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access"));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile();
            fetchCartStats();
        }
    }, [isAuthenticated]);

    // ✅ Fetch user profile
    const fetchProfile = async () => {
        try {
            const res = await api.get("/api/profile/");
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
        } catch (err) {
            console.error("❌ Profile fetch error:", err.message);
        }
    };

    // ✅ Fetch cart items count
    const fetchCartStats = async () => {
        const cart_code = localStorage.getItem("cart_code");
        if (!cart_code) return;
        try {
            const res = await api.get(`/api/cart/statistics/?cart_code=${cart_code}`);
            setNumCartItems(res.data.num_of_items || 0);
        } catch (err) {
            console.error("❌ Cart fetch error:", err.message);
        }
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
                <Route path="signup" element={<Signup />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="about" element={<AboutPage />} />

                <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                    <Route path="profile" element={<ProfilePage user={user} />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="payment" element={<PaymentPage />} />
                    <Route path="dashboard" element={<Dashboard user={user} />} />
                </Route>

                {/* ✅ Use MainLayout to wrap main pages */}
                <Route path="/" element={<MainLayout numCartItems={numCartItems} user={user} />}>
                    <Route index element={<HomePage onCartUpdate={fetchCartStats} />} />
                    <Route path="products/:slug" element={<ProductPage onCartUpdate={fetchCartStats} />} />
                    <Route path="cart" element={<CartPage onCartUpdate={fetchCartStats} />} />
                </Route>

                <Route path="*" element={<h2>Page Not Found</h2>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;

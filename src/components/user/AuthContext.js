import { createContext, useEffect, useState } from "react";
import api from "./api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("access") || null);

    useEffect(() => {
        if (token) {
            api.get("user/", { headers: { Authorization: `Bearer ${token}` } })
                .then(res => setUser(res.data))
                .catch(() => logout());
        }
    }, [token]);

    const login = async (credentials) => {
        try {
            const res = await api.post("login/", credentials);
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            setToken(res.data.access);
            setUser(res.data.user);
        } catch (error) {
            console.error("Login failed:", error.response.data);
        }
    };

    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

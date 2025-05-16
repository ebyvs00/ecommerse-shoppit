import React from "react";
import NavBar from "../components/ui/NavBar";  // ✅ NavBar only here
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = ({ numCartItems, user }) => {
  return (
    <>
      <NavBar numCartItems={numCartItems} user={user} />
      <main className="container my-4">
        <Outlet />  {/* ✅ This dynamically loads different pages */}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;

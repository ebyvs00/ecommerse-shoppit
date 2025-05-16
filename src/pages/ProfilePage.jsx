// ✅ ProfilePage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Avatar, Typography, Card, CardContent, CircularProgress, Button } from "@mui/material";
import { Email, AccountCircle, ArrowBack, Refresh } from "@mui/icons-material";
import { styled } from "@mui/system";

const ProfileCard = styled(Card)({
  maxWidth: 500,
  margin: "auto",
  marginTop: "40px",
  borderRadius: "16px",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(145deg, #f5f7fa 0%, #e4e8f0 100%)",
  padding: "20px",
});

const StyledAvatar = styled(Avatar)({
  width: 120,
  height: 120,
  margin: "auto",
  marginBottom: "20px",
  backgroundColor: "#4a6cf7",
});

const BackButton = styled(Button)({
  marginBottom: "20px",
  color: "#4a6cf7",
  "&:hover": {
    backgroundColor: "rgba(74, 108, 247, 0.1)",
  },
});

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem"
};

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [permAddress, setPermAddress] = useState(() => {
    const stored = localStorage.getItem("permanentAddress");
    return stored ? JSON.parse(stored) : {
      name: "",
      phone: "",
      street: "",
      city: "",
      zip: "",
      country: ""
    };
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get("/api/profile/");
      setUser(res.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setPermAddress({ ...permAddress, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = () => {
    localStorage.setItem("permanentAddress", JSON.stringify(permAddress));
    alert("✅ Permanent address saved!");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "40vh" }}>
        <CircularProgress color="primary" size={60} />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <Typography variant="h6" style={{ color: "#ff4d4f", marginBottom: "20px" }}>
          ❌ Failed to load profile. Please try again.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Refresh />} 
          onClick={fetchUserProfile}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <BackButton startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
        Back
      </BackButton>

      <ProfileCard>
        <CardContent>
          <div style={{ textAlign: "center" }}>
            <StyledAvatar>
              <AccountCircle style={{ fontSize: 60 }} />
            </StyledAvatar>
            <Typography variant="h4" style={{ color: "#2d3748", marginBottom: "20px" }}>
              {user.username}
            </Typography>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Email color="primary" />
            <Typography variant="body1">
              <strong>Email:</strong> {user.email}
            </Typography>
          </div>

          <hr style={{ margin: "20px 0" }} />
          <Typography variant="h6" gutterBottom>
            Permanent Address
          </Typography>
          <input name="name" placeholder="Full Name" value={permAddress.name} onChange={handleAddressChange} style={inputStyle} />
          <input name="phone" placeholder="Phone Number" value={permAddress.phone} onChange={handleAddressChange} style={inputStyle} />
          <input name="street" placeholder="Street Address" value={permAddress.street} onChange={handleAddressChange} style={inputStyle} />
          <input name="city" placeholder="City" value={permAddress.city} onChange={handleAddressChange} style={inputStyle} />
          <input name="zip" placeholder="ZIP Code" value={permAddress.zip} onChange={handleAddressChange} style={inputStyle} />
          <input name="country" placeholder="Country" value={permAddress.country} onChange={handleAddressChange} style={inputStyle} />
          <Button variant="contained" color="primary" onClick={handleSaveAddress} style={{ marginTop: "10px" }}>
            Save Address
          </Button>
        </CardContent>
      </ProfileCard>
    </div>
  );
};

export default ProfilePage;

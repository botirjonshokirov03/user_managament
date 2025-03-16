import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../stores/authSlice";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email and password are required!");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      console.log("Login Response:", res.data); // ✅ Debugging

      if (res.data.access_token) {
        dispatch(loginSuccess(res.data)); // ✅ Store in Redux
        navigate("/dashboard"); // ✅ Redirect to dashboard
      } else {
        alert("Login failed! No token received.");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert(error.response?.data?.detail || "Login failed! Check credentials.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
      >
        Login
      </Button>

      <Box textAlign="center" marginTop={2}>
        <Typography variant="body2">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;

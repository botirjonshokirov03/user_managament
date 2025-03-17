import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../stores/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { loginUser } from "../utils/api";

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
      const res = await loginUser({
        email: email.trim(),
        password: password.trim(),
      });

      if (res.data.access_token) {
        dispatch(loginSuccess(res.data));
        localStorage.setItem("token", res.data.access_token);
        navigate("/dashboard");
      } else {
        alert("Login failed! No token received.");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error);
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
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

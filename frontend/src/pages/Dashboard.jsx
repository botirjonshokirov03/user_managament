import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Paper } from "@mui/material";
import Navbar from "../components/Navbar";
import UserTable from "../components/UserTable";
import UserToolbar from "../components/Toolbar";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [users, setUsers] = useState([]); // ✅ Default empty array
  const [selectedUsers, setSelectedUsers] = useState([]); // ✅ Track selected users
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Users Data:", res.data);

      setUsers(res.data || []); // ✅ Ensure users is never undefined
      setSelectedUsers([]); // ✅ Reset selection when data reloads
    } catch (error) {
      console.error("Failed to fetch users", error);
      alert("Error loading users.");
    }
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom style={{ marginTop: "20px" }}>
          User Management
        </Typography>

        {/* ✅ Pass selectedUsers and setSelectedUsers to Toolbar */}
        <UserToolbar
          users={users} // ✅ Ensure users is always defined
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers} // ✅ Fix `setUsers is not a function` issue
          refreshUsers={fetchUsers}
        />

        <Paper>
          {/* ✅ Now properly passes `setUsers` */}
          <UserTable
            users={users}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        </Paper>
      </Container>
    </div>
  );
};

export default Dashboard;

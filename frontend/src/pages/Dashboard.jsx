import React, { useState, useEffect } from "react";
import { Container, Typography, Paper } from "@mui/material";
import Navbar from "../components/Navbar";
import UserTable from "../components/UserTable";
import UserToolbar from "../components/UserToolbar";
import SearchFilter from "../components/SearchFilter";
import { fetchUsers } from "../utils/api";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      loadUsers();
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, sortOrder]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users from API...");
      const res = await fetchUsers();
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        console.error("⚠️ API returned unexpected data format:", res.data);
        setUsers([]);
      }
      setSelectedUsers([]);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = (users || [])
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.last_login).getTime() || 0;
      const dateB = new Date(b.last_login).getTime() || 0;

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div>
      <Navbar />
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom style={{ marginTop: "20px" }}>
          User Management
        </Typography>

        <SearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        <UserToolbar
          users={filteredUsers}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          refreshUsers={loadUsers}
        />

        <Paper>
          <UserTable
            users={filteredUsers}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        </Paper>
      </Container>
    </div>
  );
};

export default Dashboard;

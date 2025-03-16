import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import axios from "axios";

const UserToolbar = ({
  users,
  selectedUsers,
  setSelectedUsers,
  refreshUsers,
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectAll, setSelectAll] = useState(false); // ✅ Track Select All

  // ✅ Handle Select All / Deselect All
  const handleSelectAllToggle = () => {
    if (selectAll) {
      setSelectedUsers([]); // Deselect all users
    } else {
      setSelectedUsers(users.map((user) => user.id)); // Select all users
    }
    setSelectAll(!selectAll);
  };

  const handleAction = async (action) => {
    if (!selectedUsers || selectedUsers.length === 0) {
      alert("No users selected!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/users/${action}`,
        { user_ids: selectedUsers }, // ✅ Correct JSON request format
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(`${action} response:`, res.data);
      refreshUsers();
      setSelectedUsers([]); // ✅ Reset selection after action
      setSelectAll(false);
    } catch (error) {
      console.error("Action failed:", error.response?.data || error.message);
      alert(error.response?.data?.detail || `Failed to ${action} users.`);
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
      {/* ✅ Select All / Deselect All Checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={selectAll}
            onChange={handleSelectAllToggle}
            color="primary"
          />
        }
        label={selectAll ? "Deselect All" : "Select All"}
      />

      <Button
        variant="contained"
        color="warning"
        onClick={() => setConfirmAction("block")}
        disabled={loading || selectedUsers.length === 0}
      >
        {loading ? <CircularProgress size={24} /> : "Block"}
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={() => setConfirmAction("unblock")}
        disabled={loading || selectedUsers.length === 0}
      >
        {loading ? <CircularProgress size={24} /> : "Unblock"}
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={() => setConfirmAction("delete")}
        disabled={loading || selectedUsers.length === 0}
      >
        {loading ? <CircularProgress size={24} /> : "Delete"}
      </Button>

      {/* ✅ Confirmation Dialog */}
      <Dialog
        open={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
      >
        <DialogTitle>
          Are you sure you want to {confirmAction} selected users?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmAction(null)}>Cancel</Button>
          <Button onClick={() => handleAction(confirmAction)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserToolbar;

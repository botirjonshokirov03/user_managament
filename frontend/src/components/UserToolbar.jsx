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
import { blockUsers, unblockUsers, deleteUsers } from "../utils/api"; // ✅ Use centralized API

const UserToolbar = ({
  users = [], // ✅ Default empty array to prevent undefined issues
  selectedUsers = [], // ✅ Default empty array
  setSelectedUsers,
  refreshUsers,
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  // ✅ Debugging logs
  useEffect(() => {
    console.log("Users:", users);
    console.log("Selected Users:", selectedUsers);
  }, [users, selectedUsers]);

  // ✅ Keep Select All state in sync with selectedUsers
  useEffect(() => {
    setSelectAll(
      selectedUsers?.length > 0 && selectedUsers.length === users?.length
    );
  }, [selectedUsers, users]);

  // ✅ Toggle Select All / Deselect All
  const handleSelectAllToggle = () => {
    if (selectAll) {
      setSelectedUsers([]); // Deselect all users
    } else {
      setSelectedUsers(users.map((user) => user.id)); // Select all users
    }
  };

  // ✅ Handle API calls for actions
  const handleAction = async (action) => {
    if (!selectedUsers.length) {
      alert("No users selected!");
      return;
    }

    setLoading(true);
    try {
      if (action === "block") await blockUsers(selectedUsers);
      if (action === "unblock") await unblockUsers(selectedUsers);
      if (action === "delete") await deleteUsers(selectedUsers);

      refreshUsers(); // Refresh user list after action
      setSelectedUsers([]); // Reset selection
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
      {/* ✅ Only show checkbox if users exist */}
      {users.length > 0 && (
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
      )}

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

import React, { useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
} from "@mui/material";

const UserTable = ({
  users = [],
  selectedUsers = [],
  setSelectedUsers = () => {},
}) => {
  const handleCheckboxChange = useCallback(
    (id) => {
      setSelectedUsers((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((userId) => userId !== id)
          : [...prevSelected, id]
      );
    },
    [setSelectedUsers]
  );

  const handleSelectAllToggle = useCallback(() => {
    if (users.length === 0) return;

    setSelectedUsers((prevSelected) =>
      prevSelected.length === users.length ? [] : users.map((u) => u.id)
    );
  }, [users, setSelectedUsers]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              {users.length > 0 && (
                <Checkbox
                  checked={
                    selectedUsers.length === users.length && users.length > 0
                  }
                  indeterminate={
                    selectedUsers.length > 0 &&
                    selectedUsers.length < users.length
                  }
                  onChange={handleSelectAllToggle}
                  inputProps={{ "aria-label": "Select all users" }}
                />
              )}
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                    inputProps={{ "aria-label": `Select user ${user.name}` }}
                  />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;

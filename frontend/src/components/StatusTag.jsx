import React from "react";
import { Chip } from "@mui/material";

const StatusTag = ({ status }) => {
  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      color={status === "active" ? "success" : "error"}
      variant="outlined"
    />
  );
};

export default StatusTag;

import React, { useState } from "react";
import { TextField, MenuItem, Box } from "@mui/material";

const SearchFilter = ({
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <Box display="flex" gap={2} marginBottom={2}>
      <TextField
        label="Search Users"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <TextField
        select
        label="Sort By"
        variant="outlined"
        size="small"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <MenuItem value="newest">Last Login (Newest)</MenuItem>
        <MenuItem value="oldest">Last Login (Oldest)</MenuItem>
      </TextField>
    </Box>
  );
};

export default SearchFilter;

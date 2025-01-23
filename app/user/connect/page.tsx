"use client";

import { Typography, Button, Container } from "@mui/material";
import ConnectList from "./connect-list";

export default function Page() {
  return (
    <Container maxWidth="sm">
      <Typography
        variant="h3"
        component="h2"
        className="text-center"
        fontWeight="bold"
        marginBottom="5%"
      >
        Connect to API
      </Typography>
      <ConnectList />
    </Container>
  );
}

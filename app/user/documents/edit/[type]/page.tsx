"use client";

import React from "react";
import { Container, Box, Typography } from "@mui/material";
import EditDocumentForm from "./edit-document-form";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const documentType = params.type as string;
  const decodedDocumentType = decodeURIComponent(documentType);
  const formattedType =
    decodedDocumentType[0].toUpperCase() + decodedDocumentType.slice(1);

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column">
        <Typography
          variant="h3"
          component="h2"
          className="text-center"
          fontWeight="bold"
          marginBottom="5%"
        >
          Edit {formattedType} Document
        </Typography>
        <EditDocumentForm />
      </Box>
    </Container>
  );
}

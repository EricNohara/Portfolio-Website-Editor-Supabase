"use client";

import { Input, Typography, Button } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { assertEachIs, PDFDocument } from "pdf-lib";

export default function EditDocumentsForm() {
  const router = useRouter();
  const [portrait, setPortrait] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile: File | null = e.target.files?.[0] || null;
    const { name } = e.target;

    if (name === "portrait") {
      setPortrait(selectedFile);
    } else if (name === "resume") {
      setResume(selectedFile);
    } else if (name === "transcript") {
      setTranscript(selectedFile);
    }
  };

  // image compression
  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1, // Target size in MB
      maxWidthOrHeight: 1080, // Max width/height
      useWebWorker: true, // Use Web Worker for performance
    };

    try {
      const compressedBlob = await imageCompression(file, options);

      // Convert Blob back to File to preserve the original file name and type
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });

      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      return file; // Return original file if compression fails
    }
  };

  const compressPDF = async (file: File) => {
    try {
      const fileBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);

      // Optionally remove unnecessary information or reduce image quality
      const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: false });

      return new File([compressedPdfBytes], file.name, {
        type: "application/pdf",
      });
    } catch {
      return file; // Return original if compression fails
    }
  };

  const handleSaveChanges = async () => {
    let success = true;

    const uploadFile = async (file: File, bucketName: string) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucketName", bucketName);

      const res = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("Error uploading file!");
        success = false;
      } else {
        alert("Successfully uploaded file");
        const data = await res.json();
        const url = data.url;
        console.log(url);
      }
    };

    if (portrait) {
      const compressedPortrait = await compressImage(portrait);
      uploadFile(compressedPortrait, "portraits");
    }
    if (resume) {
      const compressedResume = await compressPDF(resume);
      uploadFile(compressedResume, "resumes");
    }
    if (transcript) {
      const compressedTranscript = await compressPDF(transcript);
      uploadFile(compressedTranscript, "transcripts");
    }

    if (success) {
      setPortrait(null);
      setResume(null);
      setTranscript(null);

      router.push("/user/documents");
    }
  };

  return (
    <>
      <Typography variant="h6" marginTop="2rem">
        Portrait Image Upload
      </Typography>
      <Input
        type="file"
        name="portrait"
        inputProps={{ accept: "image/*" }}
        fullWidth
        onChange={handleFileChange}
      />
      <Typography variant="h6" marginTop="2rem">
        Resume Upload (PDF Only)
      </Typography>
      <Input
        type="file"
        name="resume"
        inputProps={{ accept: "application/pdf" }}
        fullWidth
        onChange={handleFileChange}
      />
      <Typography variant="h6" marginTop="2rem">
        Transcript Upload (PDF Only)
      </Typography>
      <Input
        type="file"
        name="transcript"
        inputProps={{ accept: "application/pdf" }}
        fullWidth
        onChange={handleFileChange}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleSaveChanges}
      >
        Save Changes
      </Button>
    </>
  );
}

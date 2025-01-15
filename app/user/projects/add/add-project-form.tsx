"use client";

import { useState } from "react";
import { Button, TextField, Box, Input } from "@mui/material";
import { IProjectInput } from "@/app/interfaces/IProject";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { compressImage } from "@/utils/file-upload/compress";
import { uploadThumbnail } from "@/utils/file-upload/upload";

export default function AddProjectForm() {
  const router = useRouter();

  const [project, setProject] = useState<IProjectInput>({
    name: "",
    date_start: null,
    date_end: null,
    languages_used: null,
    frameworks_used: null,
    technologies_used: null,
    description: "",
    github_url: null,
    demo_url: null,
    thumbnail_url: null,
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProject((prevData) => {
      if (
        ["languages_used", "frameworks_used", "technologies_used"].includes(
          name
        )
      ) {
        return {
          ...prevData,
          [name]: value ? value.split(",").map((item) => item) : null,
        };
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleDateChange = (field: string, value: Dayjs | null) => {
    setProject((prevData) => ({
      ...prevData,
      [field]: value ? value.format("YYYY-MM-DD") : null, // Convert Dayjs to Date or store null
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile: File | null = e.target.files?.[0] || null;
    setThumbnail(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let publicURL = null;
    const compressedThumbnail = await compressImage(thumbnail);
    publicURL = (await uploadThumbnail(
      compressedThumbnail,
      "project_thumbnails"
    )) as string;

    if (publicURL === "") {
      alert("Error uploading selected thumbnail file");
    }

    if (!project.name.trim() || !project.description.trim()) {
      alert("Please fill out all required fields.");
      return;
    }

    const projectData = { ...project };
    projectData.thumbnail_url = publicURL;

    try {
      const res = await fetch("/api/user/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert(data.message);

      router.push("/user/projects");
    } catch (err) {
      console.error(err);
      const error = err as Error;
      alert(error.message);
    }
  };

  return (
    <form>
      <TextField
        label="Project Name"
        name="name"
        onChange={handleChange}
        fullWidth
        margin="dense"
        size="medium"
        value={project.name}
        required
      ></TextField>
      <Box display="flex" justifyContent="space-between" marginTop="0.5rem">
        <DatePicker
          label="Start Date"
          name="date_start"
          value={project.date_start ? dayjs(project.date_start) : null}
          onChange={(val) => handleDateChange("date_start", val)}
        ></DatePicker>
        <DatePicker
          label="End Date"
          name="date_end"
          value={project.date_end ? dayjs(project.date_end) : null}
          onChange={(val) => handleDateChange("date_end", val)}
        ></DatePicker>
      </Box>
      <TextField
        label="Description"
        name="description"
        onChange={handleChange}
        fullWidth
        multiline
        required
        margin="dense"
        size="medium"
        value={project.description || ""}
      ></TextField>
      <TextField
        label="Programming Languages Used (Separated by Comma)"
        name="languages_used"
        onChange={handleChange}
        fullWidth
        multiline
        margin="dense"
        size="medium"
        value={project.languages_used || ""}
      ></TextField>
      <TextField
        label="Frameworks Used (Separated by Comma)"
        name="frameworks_used"
        onChange={handleChange}
        fullWidth
        multiline
        margin="dense"
        size="medium"
        value={project.frameworks_used || ""}
      ></TextField>
      <TextField
        label="Technologies Used (Separated by Comma)"
        name="technologies_used"
        onChange={handleChange}
        fullWidth
        multiline
        margin="dense"
        size="medium"
        value={project.technologies_used || ""}
      ></TextField>
      <TextField
        label="Github URL"
        name="github_url"
        onChange={handleChange}
        fullWidth
        margin="dense"
        size="medium"
        value={project.github_url || ""}
      ></TextField>
      <TextField
        label="Demo URL"
        name="demo_url"
        onChange={handleChange}
        fullWidth
        margin="dense"
        size="medium"
        value={project.demo_url || ""}
      ></TextField>
      <Input
        type="file"
        name="thumbnail"
        inputProps={{ accept: "image/*" }}
        fullWidth
        onChange={handleFileChange}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleSubmit}
        fullWidth
      >
        Add Project
      </Button>
    </form>
  );
}
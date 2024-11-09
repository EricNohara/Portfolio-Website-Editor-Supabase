"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import { Typography, Link, Button } from "@mui/material";

export default function UserList({ user }: { user: User | null }) {
  const supabase = createClient();
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    phone_number: "",
    location: "",
    github_url: "",
    linkedin_url: "",
    portrait_url: "",
    resume_url: "",
    transcript_url: "",
  });

  const getProfile = useCallback(async () => {
    try {
      const { data, error, status } = await supabase
        .from("users")
        .select()
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        const parsedData = {
          email: data.email,
          name: data.name,
          phone_number: data.phone_number,
          location: data.location,
          github_url: data.github_url,
          linkedin_url: data.linkedin_url,
          portrait_url: data.portrait_url,
          resume_url: data.resume_url,
          transcript_url: data.transcript_url,
        };
        setUserData(parsedData);
      }
    } catch (error) {
      alert("Error loading user data!");
      console.error(error);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  return (
    <>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        className="text-center"
      >
        {userData.name}
      </Typography>
      <Typography
        variant="body1"
        component="p"
        gutterBottom
        className="text-center"
      >
        {userData.email}
      </Typography>
      <Typography
        variant="body1"
        component="p"
        gutterBottom
        className="text-center"
      >
        {userData.phone_number}
      </Typography>
      <Typography
        variant="body1"
        component="p"
        gutterBottom
        className="text-center"
      >
        {userData.location}
      </Typography>
      {/* Display the URLs as clickable links with a label */}
      {userData.github_url && (
        <Typography
          variant="body1"
          component="p"
          gutterBottom
          className="text-center"
        >
          <strong>GitHub URL:</strong>{" "}
          <Link
            underline="hover"
            href={userData.github_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {userData.github_url}
          </Link>
        </Typography>
      )}

      {userData.linkedin_url && (
        <Typography
          variant="body1"
          component="p"
          gutterBottom
          className="text-center"
        >
          <strong>LinkedIn URL:</strong>{" "}
          <Link
            underline="hover"
            href={userData.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {userData.linkedin_url}
          </Link>
        </Typography>
      )}

      {userData.resume_url && (
        <Typography
          variant="body1"
          component="p"
          gutterBottom
          className="text-center"
        >
          <strong>Resume URL:</strong>{" "}
          <Link
            underline="hover"
            href={userData.resume_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {userData.resume_url}
          </Link>
        </Typography>
      )}

      {userData.transcript_url && (
        <Typography
          variant="body1"
          component="p"
          gutterBottom
          className="text-center"
        >
          <strong>Transcript URL:</strong>{" "}
          <Link
            underline="hover"
            href={userData.transcript_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {userData.transcript_url}
          </Link>
        </Typography>
      )}

      {userData.portrait_url && (
        <Typography
          variant="body1"
          component="p"
          gutterBottom
          className="text-center"
        >
          <strong>Portrait URL:</strong>{" "}
          <Link
            underline="hover"
            href={userData.portrait_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {userData.portrait_url}
          </Link>
        </Typography>
      )}
      <Button type="submit" variant="contained" color="primary">
        Edit
      </Button>
      <Button type="submit" variant="contained" color="error">
        Delete
      </Button>
    </>
  );
}

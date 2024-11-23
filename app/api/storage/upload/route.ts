import { createServerClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser to handle multipart form data manually
  },
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const serverSupabase = await createServerClient();

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const bucketName = formData.get("bucketName") as string | null;

  if (!file || !bucketName) {
    return NextResponse.json(
      { message: "Invalid upload arguments" },
      { status: 400 }
    );
  }

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { message: "User not signed in." },
      { status: 404 }
    );
  }

  // upload to supabase
  const fileContent = await file.arrayBuffer();
  const buffer = Buffer.from(fileContent);

  const { error } = await serverSupabase.storage
    .from(bucketName)
    .upload(`${file.name}`, buffer, {
      contentType: file.type,
    });

  if (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }

  // return the public URL
  const { data } = await supabase.storage
    .from(bucketName)
    .getPublicUrl(`${file.name}`);

  return NextResponse.json({ url: data.publicUrl }, { status: 200 });
}

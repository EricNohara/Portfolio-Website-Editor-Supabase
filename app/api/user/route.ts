import { createClient, createServiceRoleClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import IUser from "@/app/interfaces/IUser";

export async function GET(req: NextRequest) {
  const userID = req.nextUrl.searchParams.get("id"); // ?id=<user id>

  try {
    const supabase = await createClient();

    const { data, error, status } = await supabase
      .from("users")
      .select()
      .eq("id", userID)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    if (!data) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userData = {
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

    return NextResponse.json({ userData: userData }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const user: IUser = await req.json();
  } catch (err) {
    console.error(err);
  }
}

// user only able to delete its own account and only if it is logged in
export async function DELETE(req: NextRequest) {
  const serviceRoleSupabase = createServiceRoleClient();

  try {
    //   Check if a user's logged in
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: "User not signed in." },
        { status: 404 }
      );
    }

    const { error } = await serviceRoleSupabase.auth.admin.deleteUser(user.id);

    if (error) {
      throw new Error(error.message);
    } else {
      revalidatePath("/", "layout");
      return NextResponse.redirect(new URL("/user/login", req.url), {
        status: 302,
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 400 });
  }
}

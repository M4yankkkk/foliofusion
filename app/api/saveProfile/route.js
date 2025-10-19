import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, name, bio, avatar_url, skills, projects, experience } = body;

    const { data, error } = await supabase
      .from("profiles")
      .insert([{ username, name, bio, avatar_url, skills, projects, experience }]);

    if (error) throw error;
    return Response.json({ success: true, data });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

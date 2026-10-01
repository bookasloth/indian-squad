import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "is-community-media";
const MAX_FILES = 4;
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to upload." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "No files." }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `At most ${MAX_FILES} images.` }, { status: 400 });
  }

  const urls: string[] = [];
  for (const file of files) {
    const ext = TYPES[file.type];
    if (!ext) {
      return NextResponse.json({ error: "Only JPEG, PNG, WebP, or GIF." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Each image must be under 5 MB." }, { status: 400 });
    }
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await sb.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) {
      return NextResponse.json({ error: "Upload failed." }, { status: 500 });
    }
    urls.push(sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
  }

  return NextResponse.json({ urls });
}

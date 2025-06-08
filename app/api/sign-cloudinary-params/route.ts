import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Configure cloudinary
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const { public_id } = await req.json();

  try {
    const result = await cloudinary.v2.uploader.destroy(public_id);
    return NextResponse.json({ success: true, result });
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}

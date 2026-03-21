import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// The email address that receives contact form submissions
const TO_EMAIL = "stevenphan@outlook.com.au";

// The "from" address must be on a Resend-verified domain.
// Until you verify your own domain at resend.com/domains, use the shared
// test address — but note it can only deliver to your Resend-registered email.
// Once verified, change this to e.g. "Portfolio <noreply@yourdomain.com>".
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof message !== "string" || !message.trim()
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

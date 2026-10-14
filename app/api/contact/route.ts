import { SeverityNumber } from "@opentelemetry/api-logs";
import { Resend } from "resend";
import { after, NextResponse } from "next/server";
import { loggerProvider } from "@/instrumentation";

const resend = new Resend(process.env.RESEND_API_KEY);
const contactLogger = loggerProvider?.getLogger("posthog-contact-route");

function emitContactLog(
  body: string,
  severityNumber: SeverityNumber,
  outcome: "rejected" | "failed" | "sent",
) {
  contactLogger?.emit({
    body,
    severityNumber,
    attributes: { "contact.outcome": outcome },
  });
}

function flushContactLogs() {
  if (loggerProvider) {
    after(async () => {
      await loggerProvider.forceFlush();
    });
  }
}

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
    emitContactLog(
      "Contact request rejected: invalid JSON",
      SeverityNumber.WARN,
      "rejected",
    );
    flushContactLogs();
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof message !== "string" || !message.trim()
  ) {
    emitContactLog(
      "Contact request rejected: missing fields",
      SeverityNumber.WARN,
      "rejected",
    );
    flushContactLogs();
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
    emitContactLog(
      "Contact delivery failed",
      SeverityNumber.ERROR,
      "failed",
    );
    flushContactLogs();
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  emitContactLog("Contact delivery sent", SeverityNumber.INFO, "sent");
  flushContactLogs();
  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { getResendClient } from "@/lib/resend";
import { site } from "@/lib/site";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload." },
      { status: 400 },
    );
  }

  const honeypot = asString(body.company);
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const name = asString(body.name);
  const email = asString(body.email).toLowerCase();
  const message = asString(body.message);

  if (name.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Name must be at least 2 characters." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Email address is invalid." },
      { status: 400 },
    );
  }

  if (message.length < 10 || message.length > 4000) {
    return NextResponse.json(
      { ok: false, error: "Message must be between 10 and 4000 characters." },
      { status: 400 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "Ken Cheng Portfolio <onboarding@resend.dev>";
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  try {
    const resend = getResendClient();
    // Resend returns { data, error } and does not throw on API errors — check `error`
    // or failed sends look successful to the client.
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Portfolio radio check from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <hr />
          <p>${safeMessage}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend send failed", {
        name: error.name,
        message: error.message,
        from,
        to,
      });
      return NextResponse.json(
        { ok: false, error: "Email service is not configured or unavailable." },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Contact email failed", error);
    return NextResponse.json(
      { ok: false, error: "Email service is not configured or unavailable." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

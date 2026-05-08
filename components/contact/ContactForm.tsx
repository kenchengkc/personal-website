"use client";

import { FormEvent, useState } from "react";
import { Arrow } from "@/components/icons/Icons";

type FormState = {
  name: string;
  email: string;
  message: string;
  company: string;
};

type Status =
  | { ok: true; msg: string }
  | { ok: false; msg: string }
  | null;

const initialForm: FormState = {
  name: "",
  email: "",
  message: "",
  company: "",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<Status>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (name.length < 2 || !isValidEmail(email) || message.length < 10) {
      setStatus({
        ok: false,
        msg: "Please fill in your name, a valid email, and a longer message.",
      });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          company: form.company,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Message failed to send.");
      }

      setForm(initialForm);
      setStatus({
        ok: true,
        msg: "Thanks - I'll get back to you within a couple of days.",
      });
    } catch (error) {
      setStatus({
        ok: false,
        msg:
          error instanceof Error
            ? error.message
            : "Something went wrong - try email instead.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="v2-form" onSubmit={onSubmit} noValidate>
      <label className="v2-field">
        <span>Your name</span>
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Jane Recruiter"
          required
          minLength={2}
        />
      </label>
      <label className="v2-field">
        <span>Email</span>
        <input
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="jane@company.com"
          required
        />
      </label>
      <label className="v2-field" style={{ display: "none" }} aria-hidden>
        <span>Company</span>
        <input
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>
      <label className="v2-field">
        <span>Message</span>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="A bit about the role, team, or what you're working on."
          required
          minLength={10}
        />
      </label>
      {status && (
        <div
          className={`v2-status ${status.ok ? "v2-status--ok" : "v2-status--err"}`}
          role={status.ok ? "status" : "alert"}
        >
          {status.msg}
        </div>
      )}
      <button
        type="submit"
        className="v2-btn v2-btn--primary"
        disabled={submitting}
      >
        {submitting ? "Sending…" : "Send message"} <Arrow />
      </button>
    </form>
  );
}

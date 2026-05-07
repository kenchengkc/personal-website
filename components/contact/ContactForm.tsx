"use client";

import { FormEvent, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Send } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  message: string;
  company: string;
};

type Status =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

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
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [submitting, setSubmitting] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (name.length < 2 || !isValidEmail(email) || message.length < 10) {
      setStatus({
        type: "error",
        message: "RADIO CHECK FAILED — confirm name, email, and message.",
      });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "idle" });

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
        type: "success",
        message: "MESSAGE TRANSMITTED — I will reply from the pit wall soon.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? `RADIO CHECK FAILED — ${error.message}`
            : "RADIO CHECK FAILED — try email directly.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-base p-6 md:p-8">
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="telemetry-accent">Name</span>
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
            minLength={2}
            className="border border-[var(--color-border)] bg-black/40 px-4 py-3 text-sm text-white transition-colors placeholder:text-muted focus:border-accent focus:outline-none"
            placeholder="Your name"
          />
        </label>

        <label className="grid gap-2">
          <span className="telemetry-accent">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
            className="border border-[var(--color-border)] bg-black/40 px-4 py-3 text-sm text-white transition-colors placeholder:text-muted focus:border-accent focus:outline-none"
            placeholder="you@example.com"
          />
        </label>

        <label className="hidden">
          <span>Company</span>
          <input
            value={form.company}
            onChange={(event) => updateField("company", event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>

        <label className="grid gap-2">
          <span className="telemetry-accent">Message</span>
          <textarea
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            required
            minLength={10}
            rows={7}
            className="resize-y border border-[var(--color-border)] bg-black/40 px-4 py-3 text-sm leading-relaxed text-white transition-colors placeholder:text-muted focus:border-accent focus:outline-none"
            placeholder="Recruiting, collaboration, research, F1, or anything technical."
          />
        </label>

        {status.type !== "idle" && (
          <div
            className={`flex items-start gap-3 border p-4 text-sm ${
              status.type === "success"
                ? "border-emerald-400/30 bg-emerald-400/5 text-emerald-200"
                : "border-accent/40 bg-accent/10 text-white"
            }`}
            role={status.type === "error" ? "alert" : "status"}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-accent" />
            )}
            <span className="font-mono text-xs uppercase tracking-widest">
              {status.message}
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Send size={14} />
          )}
          TRANSMIT
        </button>
      </div>
    </form>
  );
}

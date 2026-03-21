"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";

// ── Config ────────────────────────────────────────────────────────────────────
const CONTACT_EMAIL = "stevenphan@outlook.com.au";

// ── Types ─────────────────────────────────────────────────────────────────────
type FormStatus = "idle" | "loading" | "success" | "error";

type FormData = {
  name: string;
  email: string;
  message: string;
};

// ── Variants ──────────────────────────────────────────────────────────────────
const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const columnVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
  },
};

const fieldsContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
  },
};

// ── FloatingField ─────────────────────────────────────────────────────────────
type FloatingFieldProps = {
  id: string;
  label: string;
  type?: "text" | "email" | "textarea";
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  rows?: number;
};

function FloatingField({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  rows = 4,
}: FloatingFieldProps) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  const sharedClass =
    "bg-transparent border-0 border-b border-navy/30 focus:border-navy focus:outline-none w-full py-2 text-navy font-lora text-base transition-colors duration-200";

  return (
    <motion.div variants={fieldVariants} className="relative pt-6">
      <motion.label
        htmlFor={id}
        className="absolute left-0 top-6 pointer-events-none font-poppins"
        animate={isActive ? "active" : "resting"}
        variants={{
          resting: {
            y: type === "textarea" ? 8 : 6,
            fontSize: "1rem",
            color: "rgba(0,33,71,0.45)",
          },
          active: {
            y: -22,
            fontSize: "0.75rem",
            color: "#002147",
          },
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {label}
      </motion.label>

      {type === "textarea" ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className={`${sharedClass} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className={sharedClass}
        />
      )}
    </motion.div>
  );
}

// ── CopyEmailCard ─────────────────────────────────────────────────────────────
function CopyEmailCard() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  return (
    <div className="border border-navy/20 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
      <span className="font-poppins text-sm text-navy truncate">
        {CONTACT_EMAIL}
      </span>

      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy email address"
        className="flex-shrink-0 flex items-center gap-1.5 text-navy/50 hover:text-navy transition-colors duration-200 cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1 font-poppins text-xs text-navy"
            >
              {/* Checkmark */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="flex items-center"
            >
              {/* Copy icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}

// ── ContactSection ────────────────────────────────────────────────────────────
export function ContactSection() {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4">

      {/* Eyebrow + heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.25, 0, 0, 1] }}
      >
        <p className="font-poppins text-xs tracking-[0.3em] uppercase text-navy/50 mb-4">
          Contact
        </p>
        <h2 className="font-instrument-serif text-5xl md:text-7xl text-navy leading-tight">
          Let&apos;s work
          <br />
          together.
          TODO: Make the contact form cooler almost like a letter being opened or smt
        </h2>
      </motion.div>

      {/* Divider — wipes in from the left */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        style={{ originX: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.25, 0, 0, 1] }}
        className="h-px w-full bg-navy/10 my-12"
      />

      {/* Two-column grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {/* Left column — intro + direct contact */}
        <motion.div variants={columnVariants} className="flex flex-col gap-8">
          <div>
            <p className="font-poppins text-xs tracking-[0.25em] uppercase text-navy/40 mb-3">
              Get in touch
            </p>
            <p className="font-lora text-base text-navy/70 leading-relaxed">
              Whether you have a project in mind, a question, or just want to
              say hello — I&apos;d love to hear from you. I&apos;ll get back to
              you as soon as I can.
            </p>
          </div>

          <div>
            <p className="font-poppins text-xs tracking-[0.25em] uppercase text-navy/40 mb-3">
              Or reach out directly
            </p>
            <CopyEmailCard />
          </div>
        </motion.div>

        {/* Right column — form */}
        <motion.form variants={columnVariants} onSubmit={handleSubmit}>
          <motion.div
            variants={fieldsContainerVariants}
            className="flex flex-col gap-6"
          >
            <FloatingField
              id={nameId}
              label="Name"
              type="text"
              value={formData.name}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, name: val }))
              }
              required
            />
            <FloatingField
              id={emailId}
              label="Email"
              type="email"
              value={formData.email}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, email: val }))
              }
              required
            />
            <FloatingField
              id={messageId}
              label="Message"
              type="textarea"
              value={formData.message}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, message: val }))
              }
              required
              rows={5}
            />

            {/* Submit — last stagger child */}
            <motion.div
              variants={fieldVariants}
              className="flex justify-end pt-2"
            >
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="min-w-[160px] flex items-center justify-center bg-navy text-cream font-poppins text-sm tracking-wider rounded-full px-8 py-3 transition-all duration-300 hover:bg-navy/80 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
              >
                <AnimatePresence mode="wait">
                  {status === "idle" && (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      Send message
                      {/* Arrow right */}
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </motion.span>
                  )}

                  {status === "loading" && (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {/* Spinner */}
                      <svg
                        className="animate-spin"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          opacity="0.3"
                        />
                        <path
                          d="M12 2a10 10 0 0 1 10 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </motion.span>
                  )}

                  {status === "success" && (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      {/* Checkmark */}
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Sent!
                    </motion.span>
                  )}

                  {status === "error" && (
                    <motion.span
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      Try again
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState } from "react";

const CONTACT_EMAIL = "stevenphan@outlook.com.au";
const MAX_MESSAGE = 600;
const EASE = [0.25, 0, 0, 1] as [number, number, number, number];

type FormStatus = "idle" | "loading" | "success" | "error";

const INPUT_CLASS =
  "bg-transparent border-0 border-b border-navy/20 focus:border-navy/60 focus:outline-none text-navy font-lora text-lg py-3 w-full placeholder:text-navy/20 transition-colors duration-300 caret-navy";

function CopyEmailCard() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  function handleCopy() {
    navigator.clipboard?.writeText(CONTACT_EMAIL).then(() => setCopied(true));
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group flex items-center justify-between w-full border border-navy/15 rounded-xl px-4 py-3 hover:border-navy/30 transition-colors duration-300 cursor-pointer"
    >
      <span className="font-poppins text-sm text-navy truncate">
        {CONTACT_EMAIL}
      </span>
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="font-poppins text-xs text-navy/60 flex-shrink-0 ml-3 flex items-center gap-1"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="font-poppins text-xs text-navy/25 group-hover:text-navy/50 flex-shrink-0 ml-3 transition-colors duration-200"
          >
            Copy
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

type FieldBlockProps = {
  id: string;
  label: string;
  index: number;
  charLimit?: number;
  charCount?: number;
  children: React.ReactNode;
};

function FieldBlock({ id, label, index, charLimit, charCount, children }: FieldBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: EASE, delay: index * 0.13 }}
    >
      <label
        htmlFor={id}
        className="block font-instrument-serif text-3xl text-navy leading-none mb-4"
      >
        {label}
      </label>
      {children}
      {charLimit !== undefined && charCount !== undefined && (
        <div className="flex justify-end mt-2">
          <span className="font-poppins text-xs text-navy/25 tabular-nums">
            {charCount} / {charLimit}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export function ContactSection() {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
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
      if (!res.ok) throw res;
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <div className="grid grid-cols-12 gap-8 md:gap-16 items-start">

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="col-span-12 md:col-span-4 relative overflow-hidden md:sticky md:top-28 md:self-start"
        >
          <div
            className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none select-none"
            aria-hidden="true"
          >
            <span
              className="font-instrument-serif text-navy/[0.04] whitespace-nowrap"
              style={{ fontSize: "clamp(60px, 8vw, 100px)", writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              CONTACT
            </span>
          </div>

          <div className="hidden md:block absolute right-0 top-0 h-full w-px bg-navy/10" />

          <div className="relative z-10 flex flex-col gap-10 pb-8 md:pr-10">
            <div>
              <p className="font-poppins text-xs tracking-[0.3em] uppercase text-navy/35 mb-5">
                Contact
              </p>
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ clipPath: "inset(0 0 100% 0)" }}
                  whileInView={{ clipPath: "inset(0 0 0% 0)" }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
                  className="font-instrument-serif text-5xl text-navy leading-[1.05]"
                >
                  Get in<br />touch.
                </motion.h2>
              </div>
            </div>

            <p className="font-lora text-base text-navy/55 leading-relaxed">
              Whether you have a project in mind, a question, or just want to
              say hello — I&apos;d love to hear from you.
            </p>

            <div className="h-px w-full bg-navy/10" />

            <div>
              <p className="font-poppins text-xs tracking-[0.25em] uppercase text-navy/35 mb-3">
                Or reach out directly
              </p>
              <CopyEmailCard />
            </div>
          </div>
        </motion.div>

        <div className="col-span-12 md:col-span-8">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="flex flex-col items-start justify-center py-20"
              >
                <p className="font-poppins text-xs tracking-[0.3em] uppercase text-navy/35 mb-6">
                  Sent
                </p>
                <p className="font-instrument-serif text-5xl md:text-7xl text-navy mb-5 leading-tight">
                  Thank you.
                </p>
                <p className="font-lora text-navy/55 text-lg leading-relaxed">
                  I&apos;ll get back to you at{" "}
                  <span className="text-navy">{formData.email}</span> soon.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-10"
              >
                <FieldBlock id={nameId} label="Name" index={0}>
                  <input
                    id={nameId}
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    placeholder="Your full name"
                    className={INPUT_CLASS}
                  />
                </FieldBlock>

                <FieldBlock id={emailId} label="Email" index={1}>
                  <input
                    id={emailId}
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                    placeholder="your@email.com"
                    className={INPUT_CLASS}
                  />
                </FieldBlock>

                <FieldBlock
                  id={messageId}
                  label="Message"
                  index={2}
                  charLimit={MAX_MESSAGE}
                  charCount={formData.message.length}
                >
                  <textarea
                    id={messageId}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        message: e.target.value.slice(0, MAX_MESSAGE),
                      }))
                    }
                    required
                    rows={6}
                    placeholder="Tell me about your project, timeline, or just say hello..."
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </FieldBlock>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
                  className="flex justify-end pt-2"
                >
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group flex items-center gap-3 bg-navy text-cream font-poppins text-sm tracking-wider rounded-full px-8 py-3 transition-all duration-300 hover:bg-navy/80 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <AnimatePresence mode="wait">
                      {status === "loading" ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-2"
                        >
                          Sending
                          <svg
                            className="animate-spin"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </motion.span>
                      ) : status === "error" ? (
                        <motion.span
                          key="error"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          Try again
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-2"
                        >
                          Send message
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
                          >
                            <path d="M22 2L11 13" />
                            <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                          </svg>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

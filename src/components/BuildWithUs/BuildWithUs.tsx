"use client";

import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── Project type options ────────────────────────────────────
const PROJECT_TYPES = [
  "Web Development",
  "App Development",
  "AI Integration",
  "Data Pipeline",
  "End-to-End Product",
  "Something Else",
];

// ─── Form input field ────────────────────────────────────────
function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  delay,
  isInView,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  delay: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-2"
    >
      <label className="text-white/40 text-xs tracking-[0.2em] uppercase">
        {label}
        {required && <span className="text-white/30 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input-infinity-border bg-transparent text-white text-sm py-3.5 px-0 placeholder:text-white/20 focus:placeholder:text-white/10 transition-all duration-300"
        style={{ borderLeft: "none", borderRight: "none", borderTop: "none" }}
      />
    </motion.div>
  );
}

// ─── Main contact section ────────────────────────────────────
export default function BuildWithUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const titleInView = useInView(titleRef, { once: true, margin: "-10%" });
  const formInView = useInView(formRef, { once: true, margin: "-5%" });

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="build-with-us"
      ref={sectionRef}
      className="relative py-28 md:py-48 bg-black overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 80%, rgba(255,255,255,0.025) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          ref={titleRef}
          className="mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">
            Contact
          </p>
          <h2 className="display-text text-white text-[clamp(2rem,5vw,3.8rem)] mb-5">
            Build With Us
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm">
            Have an idea, a problem, or just want to explore? We&apos;d love to
            hear about it. Tell us what you&apos;re building.
          </p>
        </motion.div>

        {/* Form / Success */}
        <div ref={formRef}>
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-9"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Name */}
                <FormField
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange as unknown as (e: ChangeEvent<HTMLInputElement>) => void}
                  placeholder="Your name"
                  required
                  delay={0.1}
                  isInView={formInView}
                />

                {/* Email */}
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange as unknown as (e: ChangeEvent<HTMLInputElement>) => void}
                  placeholder="you@example.com"
                  required
                  delay={0.2}
                  isInView={formInView}
                />

                {/* Project Type */}
                <motion.div
                  className="flex flex-col gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <label className="text-white/40 text-xs tracking-[0.2em] uppercase">
                    Project Type
                  </label>
                  <select
                    name="projectType"
                    value={form.projectType}
                    onChange={handleChange}
                    className="input-infinity-border bg-transparent text-white text-sm py-3.5 appearance-none cursor-pointer transition-all duration-300"
                    style={{
                      borderLeft: "none",
                      borderRight: "none",
                      borderTop: "none",
                    }}
                  >
                    <option value="" className="bg-black text-white/40">
                      Select a type
                    </option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-black text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Message */}
                <motion.div
                  className="flex flex-col gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <label className="text-white/40 text-xs tracking-[0.2em] uppercase">
                    Message <span className="text-white/30 ml-1">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    rows={5}
                    required
                    className="input-infinity-border bg-transparent text-white text-sm py-3.5 px-0 placeholder:text-white/20 resize-none transition-all duration-300"
                    style={{
                      borderLeft: "none",
                      borderRight: "none",
                      borderTop: "none",
                    }}
                  />
                </motion.div>

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400/80 text-xs tracking-wide"
                  >
                    {error}
                  </motion.p>
                )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative group w-full md:w-auto px-10 py-4 text-sm tracking-wider text-white border border-white/20 hover:border-white/60 transition-all duration-500 overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]" />
                    <span className="relative z-10 group-hover:text-black transition-colors duration-300 flex items-center gap-2 justify-center">
                      {loading ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="inline-block w-3 h-3 border border-white/60 border-t-white rounded-full"
                          />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </span>
                  </button>
                </motion.div>
              </motion.form>
            ) : (
              // Success state
              <motion.div
                key="success"
                className="flex flex-col items-center text-center py-16 gap-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Infinity draw on success */}
                <svg width="80" height="36" viewBox="-4 -2 8 4" fill="none" aria-hidden="true">
                  <path
                    d={"M 3.5,0 C 3.5,1.45 0.55,1.45 0,0 C -0.55,-1.45 -3.5,-1.45 -3.5,0 C -3.5,1.45 -0.55,1.45 0,0 C 0.55,-1.45 3.5,-1.45 3.5,0"}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="0.12"
                    strokeLinecap="round"
                  />
                  <motion.path
                    d={"M 3.5,0 C 3.5,1.45 0.55,1.45 0,0 C -0.55,-1.45 -3.5,-1.45 -3.5,0 C -3.5,1.45 -0.55,1.45 0,0 C 0.55,-1.45 3.5,-1.45 3.5,0"}
                    stroke="white"
                    strokeWidth="0.13"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ filter: "drop-shadow(0 0 0.06px white)" }}
                  />
                </svg>
                <h3 className="text-white text-2xl font-semibold">
                  Message received.
                </h3>
                <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                  We&apos;ll be in touch within 24 hours. The universe is
                  already aware of your idea.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer strip */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/06">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs tracking-wider">
            © {new Date().getFullYear()} CosmicLabs. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Crafted with ∞ precision.
          </p>
        </div>
      </div>
    </section>
  );
}

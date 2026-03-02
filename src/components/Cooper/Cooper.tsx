"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import cooperImg from "@/app/assets/cooper.png";

const SUGGESTIONS = [
  "What does CosmicLabs do?",
  "How do I start a project?",
  "What technologies do you use?",
  "How can I contact the team?",
];

export default function Cooper() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } =
    useChat({ api: "/api/chat" });

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setHasOpened(true);
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  const sendSuggestion = (text: string) => {
    setInput(text);
    setTimeout(() => {
      const form = document.getElementById("cooper-form") as HTMLFormElement;
      form?.requestSubmit();
    }, 50);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-[340px] sm:w-[380px] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: "rgba(8,8,8,0.97)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
              height: "480px",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 bg-white/5">
                <Image src={cooperImg} alt="Cooper" fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold leading-tight">Cooper</p>
                <p className="text-white/30 text-[11px] leading-tight">CosmicLabs AI · always here</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/30 hover:text-white/70 transition-colors p-1"
                aria-label="Close chat"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scrollbar-thin">
              {/* Welcome */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex gap-2.5 items-start">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 bg-white/5 mt-0.5">
                      <Image src={cooperImg} alt="Cooper" fill className="object-cover" />
                    </div>
                    <div
                      className="text-white/80 text-[13px] leading-relaxed px-3.5 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%]"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      Hey! I&apos;m <span className="text-white font-medium">Cooper</span> 👋
                      <br />Ask me anything about CosmicLabs or how we can help build your next idea.
                    </div>
                  </div>

                  {/* Suggestion chips */}
                  {!hasOpened || messages.length === 0 ? (
                    <div className="flex flex-wrap gap-2 pl-9">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => sendSuggestion(s)}
                          className="text-[11px] text-white/40 hover:text-white/80 border border-white/10 hover:border-white/30 rounded-full px-3 py-1 transition-all duration-200"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              )}

              {/* Message thread */}
              {messages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-2.5 items-start ${isUser ? "flex-row-reverse" : ""}`}
                  >
                    {!isUser && (
                      <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 bg-white/5 mt-0.5">
                        <Image src={cooperImg} alt="Cooper" fill className="object-cover" />
                      </div>
                    )}
                    <div
                      className={`text-[13px] leading-relaxed px-3.5 py-2.5 rounded-2xl max-w-[85%] ${
                        isUser
                          ? "text-black bg-white rounded-tr-sm font-medium"
                          : "text-white/80 rounded-tl-sm"
                      }`}
                      style={!isUser ? { background: "rgba(255,255,255,0.06)" } : {}}
                    >
                      {m.content}
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5 items-start"
                >
                  <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 bg-white/5">
                    <Image src={cooperImg} alt="Cooper" fill className="object-cover" />
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-white/40 block"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              id="cooper-form"
              onSubmit={handleSubmit}
              className="px-3 pb-3 pt-2 shrink-0 flex items-center gap-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Ask Cooper anything..."
                autoComplete="off"
                className="flex-1 bg-white/5 text-white text-[13px] placeholder:text-white/25 rounded-xl px-3.5 py-2.5 outline-none border border-transparent focus:border-white/15 transition-all duration-200"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shrink-0"
                aria-label="Send"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Launcher button ── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open Cooper chat"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full overflow-hidden shadow-2xl border border-white/10 bg-black"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)" }}
      >
        <Image src={cooperImg} alt="Cooper" fill className="object-cover" />

        {/* Pulse ring when closed */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full border border-white/20"
            animate={{ scale: [1, 1.35], opacity: [0.4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </motion.button>
    </div>
  );
}

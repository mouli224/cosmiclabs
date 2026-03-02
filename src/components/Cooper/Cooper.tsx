"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const COOPER_IMG = "/cooper.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What does CosmicLabs do?",
  "How do I start a project?",
  "What technologies do you use?",
  "How can I contact the team?",
];

export default function Cooper() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // intro: "hidden" → "visible" (show card) → "collapsing" (shrink to button) → "done"
  const [introPhase, setIntroPhase] = useState<"hidden" | "visible" | "collapsing" | "done">("hidden");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Intro popup sequence
  useEffect(() => {
    const showTimer = setTimeout(() => setIntroPhase("visible"), 2500);
    const collapseTimer = setTimeout(() => setIntroPhase("collapsing"), 7000);
    const doneTimer = setTimeout(() => setIntroPhase("done"), 7800);
    return () => { clearTimeout(showTimer); clearTimeout(collapseTimer); clearTimeout(doneTimer); };
  }, []);

  // Auto-scroll on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 350);
  }, [open]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("Failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, something went wrong. Please try again." }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIntroPhase("done");
    setOpen((v) => !v);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      {/* ── Intro popup card ── */}
      <AnimatePresence>
        {(introPhase === "visible" || introPhase === "collapsing") && !open && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={
              introPhase === "collapsing"
                ? { opacity: 0, y: 40, scale: 0.4 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={{ opacity: 0, y: 40, scale: 0.4 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-end gap-3"
          >
            {/* Speech bubble */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="relative px-4 py-3 rounded-2xl rounded-br-sm max-w-[200px]"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-white text-[13px] font-medium leading-snug">Hey there! 👋</p>
              <p className="text-white/50 text-[12px] leading-snug mt-0.5">
                I&apos;m <span className="text-white/80">Cooper</span>, CosmicLabs AI agent.
                <br />Ask me anything!
              </p>
              <span
                className="absolute bottom-2 -right-1.5 w-3 h-3 rotate-45"
                style={{ background: "rgba(255,255,255,0.07)", borderRight: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              />
            </motion.div>

            {/* Avatar */}
            <motion.button
              onClick={handleOpen}
              aria-label="Open Cooper"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="shrink-0 rounded-full overflow-hidden border border-white/10 bg-black"
              style={{ width: 56, height: 56, boxShadow: "0 8px 32px rgba(0,0,0,0.6)", position: "relative" }}
            >
              <Image src={COOPER_IMG} alt="" width={56} height={56} className="object-cover w-full h-full" />
              <motion.span
                className="absolute inset-0 rounded-full border border-white/30"
                animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-white/5">
                <Image src={COOPER_IMG} alt="" width={36} height={36} className="object-cover w-full h-full" />
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
                    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-white/5 mt-0.5">
                      <Image src={COOPER_IMG} alt="" width={28} height={28} className="object-cover w-full h-full" />
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
                  <div className="flex flex-wrap gap-2 pl-9">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-[11px] text-white/40 hover:text-white/80 border border-white/10 hover:border-white/30 rounded-full px-3 py-1 transition-all duration-200"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
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
                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-white/5 mt-0.5">
                        <Image src={COOPER_IMG} alt="" width={28} height={28} className="object-cover w-full h-full" />
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
                      {m.content || (
                        <span className="flex gap-1.5 items-center py-0.5">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-white/40 block"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="px-3 pb-3 pt-2 shrink-0 flex items-center gap-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
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

      {/* ── Launcher button (shown after intro collapses) ── */}
      {(introPhase === "done" || open) && (
        <motion.button
          onClick={handleOpen}
          aria-label="Open Cooper chat"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="shrink-0 rounded-full overflow-hidden border border-white/10 bg-black"
          style={{ width: 56, height: 56, boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)", position: "relative" }}
        >
          <Image src={COOPER_IMG} alt="" width={56} height={56} className="object-cover w-full h-full" />
          {!open && (
            <motion.span
              className="absolute inset-0 rounded-full border border-white/20"
              animate={{ scale: [1, 1.35], opacity: [0.4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </motion.button>
      )}
    </div>
  );
}

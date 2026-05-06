import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME = "مرحباً بك في سلاسة القابضة 👋 أنا مساعدك الذكي. أتحدث معك بأي لغة تختارها — كيف يمكنني مساعدتك اليوم؟";

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next }),
      });

      if (!resp.ok || !resp.body) {
        const errText = resp.status === 429 ? "الخدمة مزدحمة حالياً، حاول بعد لحظات." :
          resp.status === 402 ? "تم استنفاد الرصيد، يرجى التواصل عبر واتساب." : "تعذّر الرد، حاول لاحقاً.";
        setMessages((m) => [...m, { role: "assistant", content: errText }]);
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let assistantText = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const p = JSON.parse(json);
            const c = p.choices?.[0]?.delta?.content;
            if (c) {
              assistantText += c;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: assistantText };
                return copy;
              });
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      setMessages((m) => [...m, { role: "assistant", content: "حدث خطأ في الاتصال." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 pl-4 pr-3 py-3 rounded-full bg-gradient-to-br from-accent to-accent/80 text-deep font-bold shadow-2xl shadow-accent/40 hover:scale-105 transition"
          aria-label="افتح المحادثة"
        >
          <span className="w-9 h-9 rounded-full bg-deep text-accent flex items-center justify-center text-lg">🤖</span>
          <span className="text-sm">مساعد سلاسة الذكي</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-[92vw] max-w-[380px] h-[78vh] max-h-[560px] bg-deep border border-accent/30 rounded-3xl shadow-2xl shadow-black/40 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-l from-deep-2 to-deep border-b border-accent/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent text-deep flex items-center justify-center text-lg">🤖</div>
              <div>
                <div className="text-cream font-bold text-sm">مساعد سلاسة</div>
                <div className="text-accent/80 text-[10px]">مدعوم بالذكاء الاصطناعي • أي لغة</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-cream/60 hover:text-cream w-8 h-8 rounded-lg hover:bg-cream/10 flex items-center justify-center" aria-label="إغلاق">
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-accent text-deep rounded-bl-sm"
                    : "bg-cream/10 text-cream border border-cream/10 rounded-br-sm"
                }`}>
                  {m.content || (loading && i === messages.length - 1 ? "..." : "")}
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-end">
                <div className="bg-cream/10 text-cream/60 rounded-2xl px-4 py-2.5 text-sm">يكتب...</div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-accent/20 bg-deep-2">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="اكتب بأي لغة..."
                className="flex-1 bg-cream/5 text-cream placeholder:text-cream/40 border border-cream/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50"
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="px-4 rounded-xl bg-accent text-deep font-bold text-sm disabled:opacity-40 hover:brightness-110 transition"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

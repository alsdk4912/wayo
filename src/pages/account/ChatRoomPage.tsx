import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { listMessages, listThreads, sendMessage } from "../../data/chats";
import Icon from "../../components/ui/Icon";
import { textLang, translateText, type Lang } from "../../utils/translate";

export default function ChatRoomPage() {
  const { threadId } = useParams();
  const { user } = useAuth();
  const en = user?.role === "tutor";
  const [tick, setTick] = useState(0);
  const [draft, setDraft] = useState("");
  const thread = user ? listThreads(user).find((item) => item.id === threadId) : undefined;
  const messages = thread ? listMessages(thread.id) : [];
  const back = en ? "/tutor/chats" : "/parent/chats";
  const preferred: Lang = en ? "en" : "ko";
  const other: Lang = preferred === "ko" ? "en" : "ko";
  const [translated, setTranslated] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const started = useRef(new Set<string>());
  const failedRef = useRef(failed);
  failedRef.current = failed;
  const starters = en
    ? [{ label: "Activity", text: "Activity: " }, { label: "Caution", text: "Caution: " }]
    : [{ label: "이번 활동", text: "이번 활동: " }, { label: "주의사항", text: "주의사항: " }];

  const translate = (id: string, body: string, target: Lang) => {
    const key = `${id}:${target}`;
    if (started.current.has(key)) return;
    started.current.add(key);
    setBusy((prev) => ({ ...prev, [key]: true }));
    setFailed((prev) => ({ ...prev, [key]: false }));
    translateText(body, target)
      .then((text) => setTranslated((prev) => ({ ...prev, [key]: text })))
      .catch(() => {
        started.current.delete(key);
        setFailed((prev) => ({ ...prev, [key]: true }));
      })
      .finally(() => setBusy((prev) => ({ ...prev, [key]: false })));
  };

  useEffect(() => {
    const timer = window.setInterval(() => setTick((n) => n + 1), 2000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!thread) return;
    for (const item of listMessages(thread.id)) {
      if (textLang(item.body) === preferred) continue;
      if (failedRef.current[`${item.id}:${preferred}`]) continue;
      translate(item.id, item.body, preferred);
    }
    // translate is stable enough for this room: started.current blocks repeat calls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, thread?.id, preferred]);

  if (!user) return null;

  if (!thread) {
    return (
      <div className="card p-6 text-center">
        <p className="text-sm text-muted">{en ? "This room opens after the lesson is confirmed." : "수업이 확정된 뒤에 대화할 수 있습니다."}</p>
        <Link to={back} className="inline-block text-sm font-semibold text-primary mt-3">{en ? "Back" : "목록"}</Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = sendMessage(thread, user, draft);
    if (result.ok) {
      setDraft("");
      setTick((n) => n + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-[70dvh]">
      <Link to={back} className="inline-flex items-center gap-1 text-xs font-semibold text-muted mb-3">
        <Icon name="chevron-left" size={14} />
        {en ? "Chats" : "채팅"}
      </Link>
      <section className="mb-3">
        <h1 className="text-lg font-bold text-foreground">{thread.title}</h1>
        <p className="text-xs text-muted mt-0.5">{en ? "Confirmed lesson" : "확정된 수업"} · {thread.kind === "group" ? (en ? "Group" : "그룹") : (en ? "Visit" : "방문")}</p>
        <p className="text-[11px] text-muted mt-1">{en ? "The other language is translated automatically. Use Translate to flip your own message." : "상대 언어는 자동으로 번역됩니다. 내 메시지는 번역 버튼으로 볼 수 있습니다."}</p>
      </section>
      <div className="flex-1 space-y-2">
        {messages.length === 0 && tick >= 0 && (
          <p className="text-sm text-muted text-center py-8">{en ? "Write the activity or a caution." : "활동이나 주의사항을 남겨 주세요."}</p>
        )}
        {messages.map((item) => {
          const mine = item.senderId === user.id;
          const foreign = textLang(item.body) !== preferred;
          const target = foreign ? preferred : other;
          const key = `${item.id}:${target}`;
          const line = translated[key];
          const label = busy[key]
            ? (en ? "Translating" : "번역 중")
            : failed[key]
              ? (en ? "Retry translation" : "다시 번역")
              : (en ? "Translate" : "번역");
          return (
            <div key={item.id} className={`max-w-[85%] ${mine ? "ml-auto" : ""}`}>
              <p className={`text-[10px] text-muted mb-1 ${mine ? "text-right" : ""}`}>{item.senderName}</p>
              <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${mine ? "bg-primary text-white" : "bg-white border border-border text-foreground"}`}>
                <p>{item.body}</p>
                {line && (
                  <p className={`mt-1.5 pt-1.5 text-[12px] border-t ${mine ? "border-white/30 text-white/90" : "border-border text-muted"}`}>{line}</p>
                )}
              </div>
              {!line && (
                <button
                  type="button"
                  disabled={Boolean(busy[key])}
                  onClick={() => translate(item.id, item.body, target)}
                  className={`mt-1 text-[10px] font-semibold text-primary disabled:opacity-60 ${mine ? "block ml-auto" : ""}`}
                >
                  {label}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <form onSubmit={submit} className="sticky bottom-20 mt-4 card p-3 space-y-2">
        <div className="flex gap-2">
          {starters.map((item) => (
            <button key={item.label} type="button" onClick={() => setDraft(item.text)} className="text-[11px] font-semibold text-primary bg-primary-50 rounded-full px-3 py-1.5">
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} className="flex-1 border border-border rounded-full px-3 py-2.5 text-sm" placeholder={en ? "Message" : "메시지"} />
          <button type="submit" className="btn-primary px-4 text-sm">{en ? "Send" : "보내기"}</button>
        </div>
      </form>
    </div>
  );
}

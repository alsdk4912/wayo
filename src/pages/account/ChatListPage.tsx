import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { listThreads } from "../../data/chats";

export default function ChatListPage() {
  const { user } = useAuth();
  const en = user?.role === "tutor";
  const threads = user ? listThreads(user) : [];
  const base = en ? "/tutor/chats" : "/parent/chats";

  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-lg font-bold text-foreground">{en ? "Chats" : "채팅"}</h1>
        <p className="text-sm text-muted mt-1">
          {en ? "Only confirmed lessons open a room. Agree the activity and share cautions here." : "수락된 수업만 방이 열립니다. 활동과 주의사항을 여기서 정합니다."}
        </p>
      </section>
      {threads.length === 0 ? (
        <p className="card px-4 py-8 text-center text-sm text-muted">
          {en ? "No confirmed lessons yet." : "확정된 수업이 없습니다."}
        </p>
      ) : (
        <div className="space-y-2">
          {threads.map((thread) => (
            <Link key={thread.id} to={`${base}/${thread.id}`} className="card p-4 block">
              <p className="text-sm font-semibold text-foreground">{thread.title}</p>
              <p className="text-xs text-muted mt-1 line-clamp-2">{thread.subtitle}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

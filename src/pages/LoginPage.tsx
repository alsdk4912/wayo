import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, getRoleHome } from "../context/AuthContext";
import { listDemoAccounts } from "../data/users";
import AuthNav from "../components/AuthNav";
import StatusBadge from "../components/ui/StatusBadge";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const accounts = listDemoAccounts();
  const quickAccounts = accounts.filter((a) => a.password === "wayo1234");

  if (user) {
    navigate(getRoleHome(user.role), { replace: true });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      const account = accounts.find((a) => a.email === email);
      if (account) navigate(getRoleHome(account.role), { replace: true });
    } else {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const quickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("wayo1234");
    if (login(demoEmail, "wayo1234")) {
      const account = accounts.find((a) => a.email === demoEmail);
      if (account) navigate(getRoleHome(account.role), { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthNav active="login" />
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">로그인</h1>
          <p className="text-sm text-muted mt-1">신원 검증된 원어민과 우리 집에서 영어 놀이를 시작하세요.</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted mb-1.5 block">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                placeholder="email@wayo.kr"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted mb-1.5 block">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                placeholder="비밀번호"
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" className="w-full btn-primary py-3.5 text-sm">
              로그인
            </button>
          </form>

          <p className="text-xs text-muted text-center mt-4">
            아직 계정이 없으신가요?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              회원가입
            </Link>
          </p>
        </div>

        <div className="card p-5 mt-4">
          <p className="text-xs font-semibold text-muted mb-3">데모 계정 (원클릭 로그인)</p>
          <div className="space-y-2">
            {quickAccounts.map((a) => (
              <button
                key={a.id}
                onClick={() => quickLogin(a.email)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary-50/30 transition-colors text-left"
              >
                <img src={a.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{a.name}</p>
                  <p className="text-xs text-muted truncate">{a.email}</p>
                </div>
                <StatusBadge
                  variant={a.role === "parent" ? "basic" : a.role === "tutor" ? "premium" : "confirmed"}
                  label={a.role === "parent" ? "학부모" : a.role === "tutor" ? "강사" : "관리자"}
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-muted text-center mt-3">공통 비밀번호: wayo1234</p>
        </div>
      </div>
    </div>
  );
}

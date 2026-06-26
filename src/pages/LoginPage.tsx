import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, getRoleHome } from "../context/AuthContext";
import { listDemoAccounts } from "../data/users";

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            와요<span className="text-amber-300">Wayo</span>
          </h1>
          <p className="text-blue-100 text-sm">우리집 유학 · 신원 검증된 원어민 영어 놀이</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-2xl">
          <h2 className="font-black text-slate-900 text-lg mb-5">로그인</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="email@wayo.kr"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="비밀번호"
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              로그인
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">데모 계정 (원클릭 로그인)</p>
            <div className="space-y-2">
              {quickAccounts.map((a) => (
                <button
                  key={a.id}
                  onClick={() => quickLogin(a.email)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors text-left"
                >
                  <img src={a.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800">{a.name}</p>
                    <p className="text-xs text-slate-400 truncate">{a.email}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    a.role === "parent" ? "bg-blue-100 text-blue-700" :
                    a.role === "tutor" ? "bg-amber-100 text-amber-700" :
                    "bg-slate-800 text-white"
                  }`}>
                    {a.role === "parent" ? "학부모" : a.role === "tutor" ? "강사" : "관리자"}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 text-center mt-3">공통 비밀번호: wayo1234</p>
            <p className="text-xs text-slate-500 text-center mt-2">
              회원이 아니신가요?{" "}
              <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

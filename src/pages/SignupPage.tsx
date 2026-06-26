import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, getRoleHome } from "../context/AuthContext";
import AuthNav from "../components/AuthNav";

type SignupRole = "parent" | "tutor";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [role, setRole] = useState<SignupRole>("parent");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [children, setChildren] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("비밀번호는 6자 이상 입력해주세요.");
      return;
    }
    const result = signup({ role, name, email, password, children });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate(getRoleHome(role), { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500">
      <AuthNav active="signup" />
      <div className="flex items-center justify-center p-4 pt-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl">
        <h1 className="font-black text-slate-900 text-xl mb-1">회원가입</h1>
        <p className="text-sm text-slate-500 mb-5">학부모 또는 원어민 강사로 가입할 수 있습니다.</p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => setRole("parent")}
            className={`py-2.5 rounded-xl text-sm font-bold ${role === "parent" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
          >
            학부모 가입
          </button>
          <button
            type="button"
            onClick={() => setRole("tutor")}
            className={`py-2.5 rounded-xl text-sm font-bold ${role === "tutor" ? "bg-amber-500 text-slate-900" : "bg-slate-100 text-slate-600"}`}
          >
            원어민 가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
            placeholder={role === "parent" ? "학부모 이름" : "원어민 이름"}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
            placeholder="email@example.com"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
            placeholder="비밀번호 (6자 이상)"
          />
          {role === "parent" && (
            <input
              value={children}
              onChange={(e) => setChildren(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
              placeholder="자녀 정보 (예: 7세·5세)"
            />
          )}
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            className={`w-full font-black py-3 rounded-xl ${role === "parent" ? "bg-blue-600 text-white" : "bg-amber-400 text-slate-900"}`}
          >
            회원가입 완료
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-4">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            로그인
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}


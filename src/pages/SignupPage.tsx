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

  const inputClass = "w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white";

  return (
    <div className="min-h-screen bg-background">
      <AuthNav active="signup" />
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">회원가입</h1>
          <p className="text-sm text-muted mt-1">학부모 또는 원어민 강사로 가입할 수 있습니다.</p>
        </div>

        <div className="card p-6">
          <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-surface-muted rounded-lg">
            <button
              type="button"
              onClick={() => setRole("parent")}
              className={`py-2.5 rounded-md text-sm font-semibold transition-colors ${
                role === "parent" ? "bg-white text-primary shadow-sm" : "text-muted"
              }`}
            >
              학부모
            </button>
            <button
              type="button"
              onClick={() => setRole("tutor")}
              className={`py-2.5 rounded-md text-sm font-semibold transition-colors ${
                role === "tutor" ? "bg-white text-accent shadow-sm" : "text-muted"
              }`}
            >
              원어민 강사
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder={role === "parent" ? "학부모 이름" : "원어민 이름"} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="email@example.com" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="비밀번호 (6자 이상)" />
            {role === "parent" && (
              <input value={children} onChange={(e) => setChildren(e.target.value)} className={inputClass} placeholder="자녀 정보 (예: 7세·5세)" />
            )}
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" className="w-full btn-primary py-3.5 text-sm mt-1">
              가입 완료
            </button>
          </form>

          <p className="text-xs text-muted text-center mt-4">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

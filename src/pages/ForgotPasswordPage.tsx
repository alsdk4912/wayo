import { useState } from "react";
import { Link } from "react-router-dom";
import AuthNav from "../components/AuthNav";
import { resetPassword } from "../data/users";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const inputClass = "w-full border border-border rounded-lg px-4 py-3 text-sm bg-white";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nextPassword !== confirm) {
      setOk(false);
      setMessage("새 비밀번호가 서로 다릅니다.");
      return;
    }
    const result = resetPassword(email, phone, nextPassword);
    setOk(result.ok);
    setMessage(result.message);
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthNav active="login" />
      <div className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-foreground">비밀번호 찾기</h1>
        <p className="text-sm text-muted mt-1 leading-relaxed">가입할 때 적은 이메일과 휴대폰 번호가 맞으면 새 비밀번호를 설정합니다.</p>
        <form onSubmit={submit} className="card p-6 mt-6 space-y-3">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="이메일" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="휴대폰 번호" />
          <input type="password" value={nextPassword} onChange={(e) => setNextPassword(e.target.value)} className={inputClass} placeholder="새 비밀번호 (6자 이상)" />
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} placeholder="새 비밀번호 확인" />
          {message && <p className={`text-xs font-medium ${ok ? "text-primary" : "text-red-500"}`}>{message}</p>}
          <button type="submit" className="w-full btn-primary py-3.5 text-sm">비밀번호 재설정</button>
        </form>
        <p className="text-xs text-center mt-4">
          <Link to="/login" className="text-primary font-semibold">로그인</Link>
        </p>
      </div>
    </div>
  );
}

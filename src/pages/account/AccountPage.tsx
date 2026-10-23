import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PLACES } from "../../data/places";
import { changePassword, updateAccount } from "../../data/users";

export default function AccountPage() {
  const { user, refreshUser } = useAuth();
  const en = user?.role === "tutor";
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [birthDate, setBirthDate] = useState(user?.birthDate ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [areaId, setAreaId] = useState(user?.areaId ?? "hapjeong");
  const [children, setChildren] = useState(user?.children ?? "");
  const [profileMessage, setProfileMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  if (!user) return null;

  const inputClass = "mt-1 w-full border border-border rounded-2xl px-3 py-2.5 text-sm bg-white";

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !birthDate || !address.trim() || !areaId) {
      setProfileMessage(en ? "Fill in every field." : "모든 항목을 입력해 주세요.");
      return;
    }
    const next = updateAccount(user.id, {
      name: name.trim(),
      phone: phone.trim(),
      birthDate,
      address: address.trim(),
      areaId,
      children: user.role === "parent" ? children.trim() : undefined,
    });
    if (!next) {
      setProfileMessage(en ? "Could not save." : "저장하지 못했습니다.");
      return;
    }
    refreshUser(next);
    setProfileMessage(en ? "Saved." : "개인정보를 저장했습니다.");
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const result = changePassword(user.id, currentPassword, nextPassword);
    setPasswordMessage(en && result.ok ? "Password updated." : en && !result.ok ? "Check the current password. New password needs 6 or more characters." : result.message);
    if (result.ok) {
      setCurrentPassword("");
      setNextPassword("");
    }
  };

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary to-accent text-white p-5">
        <p className="text-[11px] font-semibold tracking-wide text-white/75">{en ? "ACCOUNT" : "MY"}</p>
        <h1 className="text-[22px] font-bold mt-1">{en ? "My page" : "마이페이지"}</h1>
        <p className="text-sm text-white/80 mt-1">{user.email}</p>
      </section>

      <Link to={en ? "/tutor/chats" : "/parent/chats"} className="card p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{en ? "Matched chats" : "매칭 채팅"}</p>
          <p className="text-xs text-muted mt-0.5">{en ? "Plan the activity and share cautions." : "활동과 주의사항을 주고받습니다."}</p>
        </div>
        <span className="text-xs font-semibold text-primary">{en ? "Open" : "열기"}</span>
      </Link>

      <form onSubmit={saveProfile} className="card p-4 space-y-3">
        <h2 className="text-sm font-semibold text-foreground">{en ? "Profile" : "개인정보"}</h2>
        <label className="block text-[11px] font-semibold text-muted">
          {en ? "Name" : "이름"}
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-[11px] font-semibold text-muted">
          {en ? "Email" : "이메일"}
          <input value={user.email} readOnly className={`${inputClass} text-muted`} />
        </label>
        <label className="block text-[11px] font-semibold text-muted">
          {en ? "Phone" : "휴대폰 번호"}
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-[11px] font-semibold text-muted">
          {en ? "Birth date" : "생년월일"}
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-[11px] font-semibold text-muted">
          {en ? "Address" : "주소"}
          <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-[11px] font-semibold text-muted">
          {en ? "Neighborhood" : "동네"}
          <select value={areaId} onChange={(e) => setAreaId(e.target.value)} className={inputClass}>
            {PLACES.map((place) => (
              <option key={place.id} value={place.id}>{place.district} {place.label}</option>
            ))}
          </select>
        </label>
        {user.role === "parent" && (
          <label className="block text-[11px] font-semibold text-muted">
            자녀 정보
            <input value={children} onChange={(e) => setChildren(e.target.value)} className={inputClass} />
          </label>
        )}
        {profileMessage && <p className="text-xs font-medium text-primary">{profileMessage}</p>}
        <button type="submit" className="btn-primary w-full py-3 text-sm">{en ? "Save profile" : "개인정보 저장"}</button>
      </form>

      <form onSubmit={savePassword} className="card p-4 space-y-3">
        <h2 className="text-sm font-semibold text-foreground">{en ? "Password" : "비밀번호 변경"}</h2>
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full border border-border rounded-2xl px-3 py-2.5 text-sm" placeholder={en ? "Current password" : "현재 비밀번호"} />
        <input type="password" value={nextPassword} onChange={(e) => setNextPassword(e.target.value)} className="w-full border border-border rounded-2xl px-3 py-2.5 text-sm" placeholder={en ? "New password, 6+ characters" : "새 비밀번호 (6자 이상)"} />
        {passwordMessage && <p className="text-xs font-medium text-primary">{passwordMessage}</p>}
        <button type="submit" className="w-full py-3 rounded-full border border-primary/30 text-primary text-sm font-semibold">{en ? "Update password" : "비밀번호 변경"}</button>
      </form>
    </div>
  );
}

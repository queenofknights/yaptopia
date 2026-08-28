import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { registerUser, type Role } from "../app/auth";

/* ── Animations ── */
const STYLES = `
  @keyframes su-drift {
    0%,100% { transform: translateY(0px);  }
    50%      { transform: translateY(-6px); }
  }
  @keyframes su-card-in {
    from { opacity:0; transform: translateY(18px) scale(0.97); }
    to   { opacity:1; transform: translateY(0)    scale(1);    }
  }
  @keyframes su-shimmer {
    0%,100% { opacity: 0.04; }
    50%     { opacity: 0.11; }
  }
  @keyframes su-bottle-drift {
    0%,100% { transform: translateY(0px) rotate(-4deg); }
    50%     { transform: translateY(-10px) rotate(2deg); }
  }
  @keyframes su-success-in {
    from { opacity:0; transform: scale(0.88); }
    to   { opacity:1; transform: scale(1);    }
  }
  .su-card-in     { animation: su-card-in     0.38s cubic-bezier(.22,1,.36,1) forwards; }
  .su-drift       { animation: su-drift       5.5s  ease-in-out               infinite; }
  .su-shim-a      { animation: su-shimmer     4.2s  ease-in-out               infinite; }
  .su-shim-b      { animation: su-shimmer     5.8s  ease-in-out 1.4s          infinite; }
  .su-shim-c      { animation: su-shimmer     3.9s  ease-in-out 2.8s          infinite; }
  .su-bottle-drift{ animation: su-bottle-drift 3.6s ease-in-out               infinite; }
  .su-success-in  { animation: su-success-in  0.42s cubic-bezier(.22,1,.36,1) forwards; }
`;

/* ── Deep ocean background ── */
function OceanBg() {
  return (
    <svg viewBox="0 0 1440 900" className="fixed inset-0 w-full h-full"
         preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="su-ocean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0B4F6C" />
          <stop offset="38%"  stopColor="#086080" />
          <stop offset="70%"  stopColor="#00B4D8" stopOpacity="0.80" />
          <stop offset="100%" stopColor="#0B4F6C" />
        </linearGradient>
        <radialGradient id="su-glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%"   stopColor="#00B4D8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#00B4D8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="su-sun" cx="50%" cy="12%" r="42%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.12" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id="su-blur-sm"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <rect width="1440" height="900" fill="url(#su-ocean)" />
      <rect width="1440" height="900" fill="url(#su-glow)" />
      <rect width="1440" height="900" fill="url(#su-sun)" />
      <path d="M 620 0 L 820 0 L 960 900 L 480 900 Z" fill="white" fillOpacity="0.032" />
      {[130,240,360,480,590,700,810].map((y,i) => (
        <path key={i}
          className={["su-shim-a","su-shim-b","su-shim-c"][i%3]}
          d={`M 0 ${y} C 240 ${y-14},480 ${y+18},720 ${y-10} C 960 ${y-20},1200 ${y+14},1440 ${y}`}
          stroke="white" fill="none" strokeWidth="1.4" />
      ))}
      {([
        [360,200,52,14],[720,310,44,12],[1080,240,40,11],
        [240,440,36,10],[900,480,42,11],[540,600,34,9],
        [1200,560,30,8],[680,720,28,7],[420,780,24,6],
      ] as [number,number,number,number][]).map(([cx,cy,rx,ry],i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
                 fill="white" fillOpacity="0.046" filter="url(#su-blur-sm)" />
      ))}
      {([
        [210,180,3.2],[560,140,2.4],[980,190,3.0],[1300,160,2.2],
        [120,380,2.8],[780,340,2.0],[1150,400,2.6],[440,520,2.2],
        [860,580,2.8],[1360,500,2.0],[320,680,2.4],[700,740,2.0],
      ] as [number,number,number][]).map(([cx,cy,r],i) => (
        <circle key={i} cx={cx} cy={cy} r={r}
                fill="white" fillOpacity={0.08 + (i%4)*0.04} />
      ))}
      <rect x="0" y="760" width="1440" height="140" fill="#052E46" fillOpacity="0.30" />
    </svg>
  );
}

/* ── Bottle icon ── */
function BottleCardIcon() {
  return (
    <svg width="28" height="44" viewBox="-10 -16 20 44" fill="none">
      <path d="M -6 28 Q -7 22 -7 17 L -7 4 Q -7 1 -4 -1 L -2.5 -2.5 L -2.5 -10 Q -2.5 -12 0 -12 Q 2.5 -12 2.5 -10 L 2.5 -2.5 L 4 -1 Q 7 1 7 4 L 7 17 Q 7 22 6 28 Z"
            fill="rgba(88,196,180,0.52)" stroke="#3AA898" strokeWidth="1" />
      <rect x="-2.5" y="-14" width="5" height="4" rx="1.2" fill="#C68642" />
      <rect x="-4.5" y="2" width="9" height="16" rx="1.5" fill="#F0F8EC" fillOpacity="0.88" />
      <line x1="-3" y1="6"  x2="3" y2="6"  stroke="#3AA898" strokeWidth="0.6" opacity="0.5" />
      <line x1="-3" y1="10" x2="3" y2="10" stroke="#3AA898" strokeWidth="0.6" opacity="0.5" />
      <line x1="-3" y1="14" x2="1" y2="14" stroke="#3AA898" strokeWidth="0.6" opacity="0.5" />
      <path d="M -6 25 Q -7.5 14 -6 0" stroke="white" strokeWidth="1.5"
            strokeOpacity="0.22" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ── Compass icon ── */
function CompassIcon() {
  return (
    <svg width="32" height="32" viewBox="-16 -16 32 32" fill="none">
      <circle r="14" fill="rgba(248,199,53,0.18)" stroke="#F8C735" strokeWidth="1.2" />
      <circle r="2.5" fill="#F8C735" />
      <path d="M 0 0 L -3 -10 L 0 -8 L 3 -10 Z" fill="#C23838" />
      <path d="M 0 0 L -2.5 10 L 0 8 L 2.5 10 Z" fill="#FDFBF7" fillOpacity="0.7" />
      <text x="0" y="-13.5" textAnchor="middle" fontSize="3.2" fill="#F8C735"
            fontFamily="'DM Sans', sans-serif" fontWeight="700">N</text>
      <text x="0" y="16" textAnchor="middle" fontSize="3.2" fill="#F8C735"
            fontFamily="'DM Sans', sans-serif" fontWeight="700">S</text>
      <text x="13.5" y="1.2" textAnchor="middle" fontSize="3.2" fill="#F8C735"
            fontFamily="'DM Sans', sans-serif" fontWeight="700">E</text>
      <text x="-13.5" y="1.2" textAnchor="middle" fontSize="3.2" fill="#F8C735"
            fontFamily="'DM Sans', sans-serif" fontWeight="700">W</text>
    </svg>
  );
}

/* ── Large drifting bottle for success state ── */
function BigBottle() {
  return (
    <svg width="68" height="106" viewBox="-18 -30 36 106" fill="none" className="su-bottle-drift">
      <path d="M -14 76 Q -16 62 -16 48 L -16 10 Q -16 3 -10 -1 L -6.5 -4 L -6.5 -24 Q -6.5 -28 0 -28 Q 6.5 -28 6.5 -24 L 6.5 -4 L 10 -1 Q 16 3 16 10 L 16 48 Q 16 62 14 76 Z"
            fill="rgba(88,196,180,0.58)" stroke="#3AA898" strokeWidth="1.4" />
      <rect x="-6" y="-30" width="12" height="10" rx="3" fill="#C68642" stroke="#9A5020" strokeWidth="0.8" />
      <rect x="-11" y="6" width="22" height="42" rx="3.5" fill="#F0F8F5" fillOpacity="0.92" />
      <ellipse cx="0" cy="6"  rx="11" ry="3.5" fill="#E0F0E8" />
      <ellipse cx="0" cy="48" rx="11" ry="3.5" fill="#E0F0E8" />
      <line x1="-8" y1="15" x2="8"  y2="15" stroke="#3AA898" strokeWidth="0.9" opacity="0.45" />
      <line x1="-8" y1="22" x2="8"  y2="22" stroke="#3AA898" strokeWidth="0.9" opacity="0.45" />
      <line x1="-8" y1="29" x2="5"  y2="29" stroke="#3AA898" strokeWidth="0.9" opacity="0.45" />
      <line x1="-8" y1="36" x2="8"  y2="36" stroke="#3AA898" strokeWidth="0.9" opacity="0.45" />
      <circle cx="0" cy="41" r="5" fill="#C23838" opacity="0.62" />
      <path d="M -13 68 Q -16 46 -13 8" stroke="white" strokeWidth="3.5"
            strokeOpacity="0.20" fill="none" strokeLinecap="round" />
      <ellipse cx="-12" cy="-4" rx="3.5" ry="7" fill="white" fillOpacity="0.14" />
    </svg>
  );
}

/* ── Success view ── */
function SuccessView({ name, role, onContinue }: { name: string; role: Role; onContinue: () => void }) {
  const roleLabel = role === "castaway" ? "Castaway" : "Navigator";
  const roleLine  = role === "castaway"
    ? "Cast your first bottle whenever you're ready."
    : "The ocean has plenty of stories waiting for your compass.";

  return (
    <div className="su-success-in flex flex-col items-center text-center py-2">
      {/* Animated bottle */}
      <div className="mb-5">
        <BigBottle />
      </div>

      <h2
        className="text-[26px] font-black text-[#1D2D44] leading-tight mb-3"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        Welcome to the island, {name}.
      </h2>

      <p className="text-[14px] text-[#4A6680] leading-relaxed mb-1" style={{ maxWidth: 320 }}>
        Your spot is claimed as a {roleLabel}. {roleLine}
      </p>
      <p
        className="text-[12px] font-semibold mb-8"
        style={{ color: "#3AA898" }}
      >
        Head to the dock and sign in to begin.
      </p>

      <button
        onClick={onContinue}
        className="w-full py-[14px] rounded-full font-bold text-[15px] text-[#1D2D44] transition-all hover:scale-[1.02] active:scale-[0.97]"
        style={{
          background: "#F8C735",
          boxShadow: "0 6px 32px rgba(248,199,53,0.62), 0 2px 10px rgba(248,199,53,0.30)",
        }}
      >
        Head to the dock →
      </button>

      <p className="text-[12px] text-[#9AABB8] mt-4">
        (sign in with the coordinates you just set)
      </p>
    </div>
  );
}

/* ── Sign Up page ── */
export default function SignUp() {
  const navigate = useNavigate();
  const [showPw,   setShowPw]   = useState(false);
  const [role,     setRole]     = useState<Role | null>(null);
  const [form,     setForm]     = useState({ name: "", email: "", password: "" });
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState(false);

  const fieldsReady = !!(form.name.trim() && form.email.trim() && form.password.length >= 6);
  const canSubmit   = fieldsReady && !!role;

  const attemptRegister = (selectedRole: Role) => {
    const err = registerUser(form.name.trim(), form.email.trim(), form.password, selectedRole);
    if (err) {
      setError(err);
    } else {
      setError(null);
      setSuccess(true);
    }
  };

  /* Clicking a role card = select + auto-submit when fields are ready */
  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setError(null);
    if (fieldsReady) {
      attemptRegister(selectedRole);
    }
  };

  /* Fallback: explicit submit when role was picked before fields were filled */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !role) return;
    attemptRegister(role);
  };

  return (
    <div className="relative w-screen min-h-screen overflow-y-auto flex items-center justify-center py-12"
         style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{STYLES}</style>
      <OceanBg />

      {/* Back */}
      <button onClick={() => navigate("/")}
              className="fixed top-6 left-7 z-20 flex items-center gap-2 text-white text-[13px] font-medium hover:opacity-60 transition-opacity"
              style={{ opacity: 0.72 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="white" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Yaptopia
      </button>

      {/* Card */}
      <div className="su-card-in relative z-10 w-full" style={{ maxWidth: 520 }}>
        <div className="su-drift mx-4 rounded-[32px] px-10 py-10"
             style={{
               background: "#FDFBF7",
               boxShadow: "0 32px 80px rgba(5,30,50,0.55), 0 8px 32px rgba(5,30,50,0.30), inset 0 1.5px 0 rgba(255,255,255,0.95)",
             }}>

          {success ? (
            <SuccessView
              name={form.name.trim()}
              role={role!}
              onContinue={() => navigate("/login")}
            />
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <svg width="38" height="38" viewBox="0 0 50 46" fill="none">
                    <ellipse cx="25" cy="41" rx="21"   ry="3"   fill="#00B4D8" fillOpacity="0.25" />
                    <ellipse cx="25" cy="36" rx="14.5" ry="4.5" fill="#C4852A" />
                    <ellipse cx="25" cy="34.5" rx="12" ry="3.5" fill="#E8A93D" />
                    <ellipse cx="22" cy="33"  rx="5.5" ry="1.5" fill="#F5CE5E" fillOpacity="0.85" />
                    <path d="M25 34 Q28.5 24 22 13"  stroke="#7B4D1F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path d="M22 13 Q12 7.5 10 2"    stroke="#33691E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                    <path d="M22 13 Q17.5 6.5 20 1"  stroke="#388E3C" strokeWidth="2.1" fill="none" strokeLinecap="round" />
                    <path d="M22 13 Q27.5 6.5 27 1"  stroke="#33691E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                    <path d="M22 13 Q31 9.5 34 5"    stroke="#388E3C" strokeWidth="2.1" fill="none" strokeLinecap="round" />
                    <circle cx="22" cy="13" r="2.2" fill="#6B3E1A" />
                  </svg>
                </div>
                <h1 className="text-[32px] font-black text-[#1D2D44] leading-tight"
                    style={{ fontFamily: "'Fraunces', serif" }}>
                  Chart your course
                </h1>
                <p className="text-[14px] text-[#4A6680] mt-1.5">Your story starts here.</p>
              </div>

              {/* Inputs */}
              <div className="space-y-3.5 mb-7">
                <div>
                  <label className="block text-[11px] font-bold text-[#4A6680] uppercase tracking-widest mb-1.5">
                    Display Name
                  </label>
                  <input type="text" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="How the ocean will know you"
                    className="w-full px-4 py-3.5 rounded-2xl text-[14px] text-[#1D2D44] placeholder-[#B0C4D0] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40 transition-all"
                    style={{ background: "rgba(11,79,108,0.05)", border: "1.5px solid rgba(0,180,216,0.18)" }} />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4A6680] uppercase tracking-widest mb-1.5">
                    Email Address
                  </label>
                  <input type="email" value={form.email}
                    onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError(null); }}
                    placeholder="you@somewhere.sea"
                    className="w-full px-4 py-3.5 rounded-2xl text-[14px] text-[#1D2D44] placeholder-[#B0C4D0] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40 transition-all"
                    style={{
                      background: "rgba(11,79,108,0.05)",
                      border: error ? "1.5px solid rgba(194,56,56,0.55)" : "1.5px solid rgba(0,180,216,0.18)",
                    }} />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4A6680] uppercase tracking-widest mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-3.5 pr-12 rounded-2xl text-[14px] text-[#1D2D44] placeholder-[#B0C4D0] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40 transition-all"
                      style={{ background: "rgba(11,79,108,0.05)", border: "1.5px solid rgba(0,180,216,0.18)" }} />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9AABB8] hover:text-[#0B4F6C] transition-colors">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-[12px] font-semibold text-[#C23838] mb-4 text-center">
                  ⚠ {error}
                </p>
              )}

              {/* Role selector — final step */}
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[11px] font-bold text-[#4A6680] uppercase tracking-widest">
                    How will you start?
                  </p>
                  {fieldsReady && (
                    <span className="text-[10px] font-semibold text-[#3AA898] ml-auto">
                      ← tap to cast off
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#9AABB8] mb-3">
                  {fieldsReady
                    ? "Your crew is ready. Pick your role to join the island."
                    : "Fill in your details above, then choose your path."}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => handleRoleSelect("castaway")}
                    className="flex flex-col items-center gap-3 px-4 py-5 rounded-2xl transition-all active:scale-[0.97]"
                    style={{
                      background: role === "castaway" ? "rgba(0,180,216,0.10)" : "rgba(11,79,108,0.04)",
                      border:     role === "castaway" ? "2px solid #00B4D8"    : "1.5px solid rgba(0,180,216,0.18)",
                      boxShadow:  role === "castaway" ? "0 0 0 4px rgba(0,180,216,0.10)" : "none",
                      opacity:    1,
                      cursor:     fieldsReady ? "pointer" : "not-allowed",
                    }}>
                    <BottleCardIcon />
                    <div>
                      <p className="font-bold text-[#1D2D44] text-[13px] text-center leading-snug">Castaway</p>
                      <p className="text-[11px] text-[#4A6680] text-center mt-0.5 leading-snug">I need inspiration</p>
                    </div>
                  </button>

                  <button type="button" onClick={() => handleRoleSelect("navigator")}
                    className="flex flex-col items-center gap-3 px-4 py-5 rounded-2xl transition-all active:scale-[0.97]"
                    style={{
                      background: role === "navigator" ? "rgba(248,199,53,0.10)" : "rgba(11,79,108,0.04)",
                      border:     role === "navigator" ? "2px solid #F8C735"     : "1.5px solid rgba(0,180,216,0.18)",
                      boxShadow:  role === "navigator" ? "0 0 0 4px rgba(248,199,53,0.12)" : "none",
                      opacity:    1,
                      cursor:     fieldsReady ? "pointer" : "not-allowed",
                    }}>
                    <CompassIcon />
                    <div>
                      <p className="font-bold text-[#1D2D44] text-[13px] text-center leading-snug">Navigator</p>
                      <p className="text-[11px] text-[#4A6680] text-center mt-0.5 leading-snug">I want to help</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Fallback submit — visible only when role was pre-selected before filling fields */}
              {role && !fieldsReady && (
                <button type="submit" disabled={!canSubmit}
                  className="w-full py-[15px] rounded-full font-bold text-[16px] text-[#1D2D44] transition-all hover:scale-[1.02] active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: "#F8C735",
                    boxShadow: "none",
                  }}>
                  Join the Island
                </button>
              )}

              <p className="text-center text-[13px] text-[#4A6680] mt-5">
                Already have an account?{" "}
                <button type="button" onClick={() => navigate("/login")}
                        className="font-semibold text-[#0B4F6C] hover:underline">
                  Sign in
                </button>
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

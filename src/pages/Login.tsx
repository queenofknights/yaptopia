import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../app/auth";

/* ── Animations ── */
const STYLES = `
  @keyframes li-card-in {
    from { opacity:0; transform: translateY(20px) scale(0.97); }
    to   { opacity:1; transform: translateY(0)    scale(1);    }
  }
  @keyframes li-drift {
    0%,100% { transform: translateY(0px);  }
    50%      { transform: translateY(-7px); }
  }
  @keyframes li-shim-a { 0%,100% { opacity:0.042; } 50% { opacity:0.11; } }
  @keyframes li-shim-b { 0%,100% { opacity:0.036; } 50% { opacity:0.09; } }
  @keyframes li-shim-c { 0%,100% { opacity:0.048; } 50% { opacity:0.12; } }
  .li-card-in { animation: li-card-in 0.40s cubic-bezier(.22,1,.36,1) forwards; }
  .li-drift   { animation: li-drift   6.0s ease-in-out             infinite; }
  .li-shim-a  { animation: li-shim-a  4.4s ease-in-out             infinite; }
  .li-shim-b  { animation: li-shim-b  6.0s ease-in-out 1.6s        infinite; }
  .li-shim-c  { animation: li-shim-c  3.8s ease-in-out 3.0s        infinite; }
`;

/* ── Deep ocean background ── */
function OceanBg() {
  return (
    <svg
      viewBox="0 0 1440 900"
      className="fixed inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="li-ocean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#063A52" />
          <stop offset="32%"  stopColor="#0B4F6C" />
          <stop offset="68%"  stopColor="#0A7090" />
          <stop offset="100%" stopColor="#052E46" />
        </linearGradient>
        <radialGradient id="li-glow-c" cx="50%" cy="38%" r="52%">
          <stop offset="0%"   stopColor="#00B4D8" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#00B4D8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="li-glow-tl" cx="12%" cy="22%" r="38%">
          <stop offset="0%"   stopColor="#00B4D8" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#00B4D8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="li-glow-br" cx="88%" cy="80%" r="38%">
          <stop offset="0%"   stopColor="#0B4F6C" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#0B4F6C" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="li-sun" cx="50%" cy="10%" r="44%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.10" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id="li-blur-md"><feGaussianBlur stdDeviation="7" /></filter>
        <filter id="li-blur-sm"><feGaussianBlur stdDeviation="3.5" /></filter>
      </defs>

      {/* Base */}
      <rect width="1440" height="900" fill="url(#li-ocean)" />

      {/* Ambient glows */}
      <rect width="1440" height="900" fill="url(#li-glow-c)" />
      <rect width="1440" height="900" fill="url(#li-glow-tl)" />
      <rect width="1440" height="900" fill="url(#li-glow-br)" />
      <rect width="1440" height="900" fill="url(#li-sun)" />

      {/* Sun reflection column */}
      <path d="M 640 0 L 800 0 L 980 900 L 460 900 Z"
            fill="white" fillOpacity="0.028" />
      <path d="M 700 0 L 740 0 L 820 900 L 620 900 Z"
            fill="white" fillOpacity="0.022" />

      {/* Animated wave ripple lines */}
      {[110, 205, 300, 400, 500, 610, 720, 830].map((y, i) => (
        <path
          key={i}
          className={["li-shim-a","li-shim-b","li-shim-c"][i % 3]}
          d={`M 0 ${y} C 200 ${y-16},440 ${y+20},720 ${y-12} C 980 ${y-22},1220 ${y+16},1440 ${y}`}
          stroke="white" fill="none" strokeWidth={1.2 + (i % 3) * 0.3}
        />
      ))}

      {/* Caustic light patches */}
      {([
        [200,160,56,14],[580,280,48,12],[1020,200,42,11],
        [380,420,38,10],[820,380,44,11],[1240,340,34,9],
        [140,580,32,8],[660,620,38,10],[1100,600,30,8],
        [420,760,28,7],[800,800,34,9],[1300,720,26,7],
      ] as [number,number,number,number][]).map(([cx,cy,rx,ry],i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
                 fill="white" fillOpacity="0.044" filter="url(#li-blur-sm)" />
      ))}

      {/* Light sparkle dots */}
      {([
        [180,140,3.0],[520,110,2.2],[960,170,2.8],[1320,130,2.0],
        [90,340,2.6],[700,310,1.8],[1160,360,2.4],[350,490,2.0],
        [820,530,2.8],[1380,460,1.8],[260,660,2.2],[680,700,1.8],
        [1060,680,2.6],[440,800,1.6],[900,840,2.0],[1240,790,1.8],
      ] as [number,number,number][]).map(([cx,cy,r],i) => (
        <circle key={i} cx={cx} cy={cy} r={r}
                fill="white" fillOpacity={0.07 + (i % 4) * 0.035} />
      ))}

      {/* Depth gradient at bottom */}
      <rect x="0" y="720" width="1440" height="180"
            fill="#031E2E" fillOpacity="0.38" />
    </svg>
  );
}

/* ── Login page ── */
export default function Login() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [form,   setForm]   = useState({ email: "", password: "" });
  const [error,  setError]  = useState<string | null>(null);

  const canSubmit = form.email.trim() && form.password.length >= 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const user = loginUser(form.email.trim(), form.password);
    if (user) {
      navigate(user.role === "navigator" ? "/navigator-dashboard" : "/dashboard");
    } else {
      setError("The tides don't recognize these coordinates. Check your email or password.");
    }
  };

  return (
    <div
      className="relative w-screen min-h-screen overflow-y-auto flex items-center justify-center py-12"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{STYLES}</style>
      <OceanBg />

      {/* Back to landing */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-6 left-7 z-20 flex items-center gap-2 text-white text-[13px] font-medium hover:opacity-60 transition-opacity"
        style={{ opacity: 0.68 }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="white" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Yaptopia
      </button>

      {/* Parchment card */}
      <form
        onSubmit={handleSubmit}
        className="li-card-in relative z-10 w-full"
        style={{ maxWidth: 500 }}
      >
        <div
          className="li-drift mx-4 rounded-[32px] px-11 py-11"
          style={{
            background: "#FDFBF7",
            boxShadow:
              "0 40px 100px rgba(3,20,35,0.60), 0 12px 40px rgba(3,20,35,0.32), 0 2px 0 rgba(255,255,255,0.90) inset",
          }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <svg width="42" height="38" viewBox="0 0 50 46" fill="none">
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

          {/* Header */}
          <div className="text-center mb-9">
            <h1
              className="text-[30px] font-black text-[#1D2D44] leading-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Welcome back to the island
            </h1>
            <p className="text-[14px] text-[#4A6680] mt-2" style={{ opacity: 0.80 }}>
              The ocean missed you.
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-4 mb-6">

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-[#4A6680] uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError(null); }}
                placeholder="you@somewhere.sea"
                className="w-full px-4 py-3.5 rounded-2xl text-[14px] text-[#1D2D44] placeholder-[#B0C4D0] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40 transition-all"
                style={{
                  background: "rgba(11,79,108,0.05)",
                  border: "1.5px solid rgba(0,180,216,0.20)",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-[#4A6680] uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] font-semibold text-[#00B4D8] hover:text-[#0B4F6C] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(null); }}
                  placeholder="Your secret key"
                  className="w-full px-4 py-3.5 pr-12 rounded-2xl text-[14px] text-[#1D2D44] placeholder-[#B0C4D0] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40 transition-all"
                  style={{
                    background: "rgba(11,79,108,0.05)",
                    border: "1.5px solid rgba(0,180,216,0.20)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9AABB8] hover:text-[#0B4F6C] transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-[12px] font-semibold text-[#C23838] mb-5 text-center leading-snug">
              ⚠ {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-[15px] rounded-full font-bold text-[16px] text-[#1D2D44] transition-all hover:scale-[1.02] active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
            style={{
              background: "#F8C735",
              boxShadow: canSubmit
                ? "0 6px 36px rgba(248,199,53,0.65), 0 2px 12px rgba(248,199,53,0.32)"
                : "none",
            }}
          >
            Log In
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: "rgba(0,180,216,0.15)" }} />
            <span className="text-[11px] text-[#9AABB8] font-medium tracking-wide">or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(0,180,216,0.15)" }} />
          </div>

          {/* Sign up link */}
          <p className="text-center text-[13px] text-[#4A6680]">
            {"Don't have an account? "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold text-[#0B4F6C] hover:underline"
            >
              Chart a new course.
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

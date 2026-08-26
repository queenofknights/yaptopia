import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Compass, BookOpen, Users, Star, LogOut, Bell, MessageSquare, Anchor } from "lucide-react";
import { getCurrentUser, logoutUser } from "../app/auth";

/* ── Animations ── */
const STYLES = `
  @keyframes nav-bottle {
    0%,100% { transform: translateY(0px) rotate(-2deg); }
    50%     { transform: translateY(-14px) rotate(2deg); }
  }
  @keyframes nav-banner {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-6px); }
  }
  @keyframes nav-pulse {
    0%,100% { opacity: 0.5; transform: scale(1); }
    50%     { opacity: 1;   transform: scale(1.08); }
  }
  @keyframes nav-ripple {
    0%   { opacity: 0.22; transform: scale(0.88); }
    60%  { opacity: 0.08; transform: scale(1.18); }
    100% { opacity: 0;    transform: scale(1.30); }
  }
  @keyframes nav-shimmer {
    0%,100% { opacity: 0.06; }
    50%     { opacity: 0.14; }
  }
  @keyframes nav-card-in {
    from { opacity:0; transform: translateY(14px) scale(0.97); }
    to   { opacity:1; transform: none; }
  }
  .nav-bottle  { animation: nav-bottle  5.2s ease-in-out infinite; }
  .nav-banner  { animation: nav-banner  4.0s ease-in-out 0.6s infinite; }
  .nav-pulse   { animation: nav-pulse   2.2s ease-in-out infinite; }
  .nav-ripple  { animation: nav-ripple  2.8s ease-in-out infinite; }
  .nav-card-in { animation: nav-card-in 0.42s cubic-bezier(.22,1,.36,1) forwards; }
  .nav-shim-a  { animation: nav-shimmer 4.0s ease-in-out infinite; }
  .nav-shim-b  { animation: nav-shimmer 5.5s ease-in-out 1.4s infinite; }
  .nav-shim-c  { animation: nav-shimmer 3.6s ease-in-out 2.8s infinite; }
`;

/* ── Ocean Background SVG ── */
function OceanBg() {
  return (
    <svg
      viewBox="0 0 1440 900"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="no-ocean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#063A52" />
          <stop offset="30%"  stopColor="#0B4F6C" />
          <stop offset="65%"  stopColor="#0A7090" />
          <stop offset="100%" stopColor="#052038" />
        </linearGradient>
        <radialGradient id="no-glow-c" cx="50%" cy="42%" r="55%">
          <stop offset="0%"   stopColor="#00B4D8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#00B4D8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="no-glow-tl" cx="15%" cy="18%" r="40%">
          <stop offset="0%"   stopColor="#00B4D8" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#00B4D8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="no-sun" cx="50%" cy="8%" r="42%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.10" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id="no-blur-sm"><feGaussianBlur stdDeviation="3.5" /></filter>
        <filter id="no-blur-md"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>

      <rect width="1440" height="900" fill="url(#no-ocean)" />
      <rect width="1440" height="900" fill="url(#no-glow-c)" />
      <rect width="1440" height="900" fill="url(#no-glow-tl)" />
      <rect width="1440" height="900" fill="url(#no-sun)" />

      {/* Sun column */}
      <path d="M 640 0 L 800 0 L 980 900 L 460 900 Z" fill="white" fillOpacity="0.025" />
      <path d="M 700 0 L 740 0 L 820 900 L 620 900 Z" fill="white" fillOpacity="0.020" />

      {/* Wave ripples */}
      {[120, 230, 345, 460, 575, 690, 800].map((y, i) => (
        <path
          key={i}
          className={["nav-shim-a","nav-shim-b","nav-shim-c"][i % 3]}
          d={`M 0 ${y} C 220 ${y-18},460 ${y+22},720 ${y-14} C 980 ${y-24},1220 ${y+18},1440 ${y}`}
          stroke="white" fill="none" strokeWidth={1.0 + (i % 3) * 0.35}
        />
      ))}

      {/* Caustic ellipses */}
      {([
        [220,170,52,13],[600,290,44,11],[1080,210,40,10],
        [380,430,36,9],[840,390,42,10],[1260,360,32,8],
        [160,610,30,8],[700,640,36,9],[1140,620,28,7],
        [440,770,26,7],[820,810,32,8],[1320,740,24,6],
      ] as [number,number,number,number][]).map(([cx,cy,rx,ry],i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
                 fill="white" fillOpacity="0.042" filter="url(#no-blur-sm)" />
      ))}

      {/* Sparkle dots */}
      {([
        [200,150,2.8],[560,120,2.0],[1000,180,2.6],[1360,140,1.8],
        [100,360,2.4],[720,320,1.6],[1200,370,2.2],[360,500,1.8],
        [840,540,2.6],[1400,470,1.6],[280,670,2.0],[700,710,1.7],
        [1080,690,2.4],[460,810,1.5],[920,850,1.9],[1260,800,1.7],
      ] as [number,number,number][]).map(([cx,cy,r],i) => (
        <circle key={i} cx={cx} cy={cy} r={r}
                fill="white" fillOpacity={0.065 + (i % 4) * 0.032} />
      ))}

      {/* Depth vignette */}
      <rect x="0" y="740" width="1440" height="160" fill="#031828" fillOpacity="0.35" />
    </svg>
  );
}

/* ── Floating Bottle SVG (center stage) ── */
function FloatingBottle({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
         style={{ paddingLeft: 260 }}>

      {/* Notification Banner */}
      <div
        className="nav-banner pointer-events-auto cursor-pointer mb-8 flex items-center gap-3 px-5 py-3.5 rounded-2xl select-none"
        onClick={onClick}
        style={{
          background: "#FDFBF7",
          boxShadow: "0 8px 40px rgba(3,24,40,0.45), 0 2px 12px rgba(3,24,40,0.22), 0 1px 0 rgba(255,255,255,0.9) inset",
          border: "1.5px solid rgba(0,180,216,0.18)",
          maxWidth: 340,
        }}
      >
        {/* Pulse dot */}
        <span className="relative flex-shrink-0">
          <span className="nav-pulse block w-2.5 h-2.5 rounded-full bg-[#F8C735]" />
          <span className="nav-ripple absolute inset-0 rounded-full bg-[#F8C735]" />
        </span>
        <p className="text-[13px] font-semibold text-[#1D2D44] leading-snug">
          A Castaway needs your compass!{" "}
          <span className="text-[#0B4F6C] underline underline-offset-2">Click to open.</span>
        </p>
      </div>

      {/* Bottle */}
      <div className="nav-bottle pointer-events-auto cursor-pointer" onClick={onClick}>
        <svg width="160" height="310" viewBox="0 0 160 310" fill="none">
          <defs>
            <linearGradient id="nb-body" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#2A9EA0" stopOpacity="0.45" />
              <stop offset="22%"  stopColor="#7ADEDC" stopOpacity="0.80" />
              <stop offset="50%"  stopColor="#2A9EA0" stopOpacity="0.52" />
              <stop offset="78%"  stopColor="#68CECE" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#2A9EA0" stopOpacity="0.42" />
            </linearGradient>
            <linearGradient id="nb-neck" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#1E8A8C" stopOpacity="0.50" />
              <stop offset="40%"  stopColor="#6ACECE" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#1E8A8C" stopOpacity="0.44" />
            </linearGradient>
            <linearGradient id="nb-parchment" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#F5ECD5" />
              <stop offset="100%" stopColor="#E8D9BA" />
            </linearGradient>
            <radialGradient id="nb-glow" cx="50%" cy="60%" r="55%">
              <stop offset="0%"   stopColor="#00D4D8" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#00D4D8" stopOpacity="0" />
            </radialGradient>
            <filter id="nb-blur"><feGaussianBlur stdDeviation="6" /></filter>
          </defs>

          {/* Water glow beneath */}
          <ellipse cx="80" cy="295" rx="62" ry="14" fill="#00B4D8" fillOpacity="0.28" filter="url(#nb-blur)" />

          {/* Cork */}
          <rect x="63" y="52" width="34" height="14" rx="4" fill="#C8922A" />
          <rect x="66" y="50" width="28" height="8"  rx="3" fill="#E0A83A" />
          <rect x="68" y="50" width="10" height="6"  rx="2" fill="#EEC050" fillOpacity="0.7" />

          {/* Neck */}
          <path d="M 63 66 Q 58 82 55 104 L 105 104 Q 102 82 97 66 Z" fill="url(#nb-neck)" />
          {/* Neck highlight */}
          <path d="M 70 70 Q 68 84 67 100" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.40" />

          {/* Shoulder curve */}
          <path d="M 55 104 Q 36 118 32 148 L 128 148 Q 124 118 105 104 Z" fill="url(#nb-body)" />

          {/* Body */}
          <rect x="32" y="148" width="96" height="134" rx="4" fill="url(#nb-body)" />

          {/* Bottom curve */}
          <path d="M 32 282 Q 32 300 80 300 Q 128 300 128 282 Z" fill="url(#nb-body)" />

          {/* Glass body glow */}
          <rect x="32" y="148" width="96" height="148" rx="4" fill="url(#nb-glow)" />

          {/* Parchment inside */}
          <g clipPath="url(#nb-paper-clip)">
            <rect x="44" y="138" width="72" height="148" rx="3" fill="url(#nb-parchment)" fillOpacity="0.88" />
            {/* Rolled top of parchment */}
            <ellipse cx="80" cy="138" rx="36" ry="7" fill="#EFE0C4" />
            {/* Text lines on parchment */}
            <rect x="53" y="158" width="52" height="3.5" rx="1.5" fill="#8B6914" fillOpacity="0.40" />
            <rect x="53" y="167" width="44" height="3"   rx="1.5" fill="#8B6914" fillOpacity="0.32" />
            <rect x="53" y="175" width="50" height="3"   rx="1.5" fill="#8B6914" fillOpacity="0.35" />
            <rect x="53" y="183" width="38" height="3"   rx="1.5" fill="#8B6914" fillOpacity="0.28" />
            <rect x="53" y="191" width="48" height="3"   rx="1.5" fill="#8B6914" fillOpacity="0.32" />
            <rect x="53" y="199" width="42" height="3"   rx="1.5" fill="#8B6914" fillOpacity="0.28" />
            {/* Wax seal */}
            <circle cx="80" cy="230" r="12" fill="#C23838" fillOpacity="0.82" />
            <circle cx="80" cy="230" r="9"  fill="#D94040" fillOpacity="0.60" />
            <text x="80" y="234" textAnchor="middle" fontSize="9" fill="white" fillOpacity="0.90"
                  fontFamily="serif" fontWeight="bold">Y</text>
          </g>
          <defs>
            <clipPath id="nb-paper-clip">
              <rect x="32" y="130" width="96" height="168" rx="4" />
            </clipPath>
          </defs>

          {/* Glass highlights */}
          <path d="M 42 128 Q 39 180 40 255" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.28" />
          <path d="M 50 120 Q 48 155 49 200" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.18" />
          {/* Right edge glint */}
          <path d="M 118 148 Q 120 200 118 270" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.16" />

          {/* Waterline reflection */}
          <ellipse cx="80" cy="300" rx="50" ry="6" fill="#7ADEDC" fillOpacity="0.22" />
        </svg>
      </div>
    </div>
  );
}

/* ── Sidebar ── */
type SidebarItem = { icon: React.ReactNode; label: string; active?: boolean };

function Sidebar({ user, onLogout }: { user: { name: string }; onLogout: () => void }) {
  const [active, setActive] = useState("Compass");
  const navigate = useNavigate();

  const navItems: SidebarItem[] = [
    { icon: <Compass size={18} />,      label: "Compass"   },
    { icon: <BookOpen size={18} />,     label: "Open Seas" },
    { icon: <MessageSquare size={18} />,label: "Sessions"  },
    { icon: <Users size={18} />,        label: "Community" },
    { icon: <Star size={18} />,         label: "Saved"     },
  ];

  return (
    <div
      className="absolute left-0 top-0 h-full flex flex-col py-7 px-5 z-20"
      style={{
        width: 240,
        background: "rgba(5, 46, 70, 0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(0,180,216,0.18)",
        boxShadow: "4px 0 32px rgba(3,20,35,0.30)",
      }}
    >
      {/* Logo */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2.5 mb-10 hover:opacity-80 transition-opacity"
      >
        <svg width="28" height="26" viewBox="0 0 50 46" fill="none">
          <ellipse cx="25" cy="41" rx="21"   ry="3"   fill="#00B4D8" fillOpacity="0.30" />
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
        <span className="font-black text-[17px] text-white tracking-tight"
              style={{ fontFamily: "'Fraunces', serif" }}>
          Yaptopia
        </span>
      </button>

      {/* Role badge */}
      <div className="flex items-center gap-2 mb-8 px-3 py-2 rounded-xl"
           style={{ background: "rgba(0,180,216,0.12)", border: "1px solid rgba(0,180,216,0.20)" }}>
        <Anchor size={13} className="text-[#00B4D8] flex-shrink-0" />
        <div>
          <p className="text-[10px] font-bold text-[#00B4D8] uppercase tracking-widest leading-none">Navigator</p>
          <p className="text-[12px] font-semibold text-white mt-0.5 truncate">{user.name}</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item => (
          <button
            key={item.label}
            onClick={() => setActive(item.label)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left"
            style={{
              color: active === item.label ? "#FDFBF7" : "rgba(253,251,247,0.52)",
              background: active === item.label
                ? "rgba(0,180,216,0.20)"
                : "transparent",
              borderLeft: active === item.label
                ? "2px solid #00B4D8"
                : "2px solid transparent",
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-opacity hover:opacity-80"
        style={{ color: "rgba(253,251,247,0.40)" }}
      >
        <LogOut size={16} />
        Leave the water
      </button>
    </div>
  );
}

/* ── Session Modal ── */
function SessionModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    setTimeout(() => navigate("/session"), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
         style={{ background: "rgba(3,20,35,0.72)", backdropFilter: "blur(6px)" }}>
      <div
        className="nav-card-in relative rounded-[28px] px-10 py-9 w-full"
        style={{
          maxWidth: 480,
          background: "#FDFBF7",
          boxShadow: "0 40px 100px rgba(3,20,35,0.65), 0 12px 40px rgba(3,20,35,0.32)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/8 transition-colors"
          style={{ color: "#9AABB8" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Compass icon */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
               style={{ background: "rgba(11,79,108,0.08)" }}>
            <Compass size={28} className="text-[#0B4F6C]" />
          </div>
        </div>

        <h2 className="text-[22px] font-black text-[#1D2D44] text-center mb-2"
            style={{ fontFamily: "'Fraunces', serif" }}>
          A castaway is adrift.
        </h2>
        <p className="text-[13px] text-[#4A6680] text-center mb-1 leading-relaxed">
          They need a navigator to help chart their story's course.
        </p>
        <p className="text-[12px] text-[#9AABB8] text-center mb-8">
          A pirate story is waiting for your compass.
        </p>

        {/* Story preview */}
        <div className="rounded-2xl p-4 mb-7"
             style={{ background: "rgba(11,79,108,0.05)", border: "1.5px solid rgba(0,180,216,0.15)" }}>
          <p className="text-[11px] font-bold text-[#0B4F6C] uppercase tracking-widest mb-2">Bottle Contents</p>
          <p className="text-[13px] text-[#1D2D44] leading-relaxed" style={{ opacity: 0.80 }}>
            "Captain Marisol had sailed the Crimson Sea for forty years, but she had never seen
            a fog that moved against the wind. Something was wrong..."
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[11px] font-semibold text-[#9AABB8]">Genre: Adventure · 340 words in</span>
          </div>
        </div>

        {/* Actions */}
        {!accepted ? (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-full text-[14px] font-semibold text-[#4A6680] transition-colors hover:bg-black/5"
              style={{ border: "1.5px solid rgba(0,180,216,0.20)" }}
            >
              Not now
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 py-3.5 rounded-full text-[14px] font-bold text-[#1D2D44] transition-all hover:scale-[1.02] active:scale-[0.97]"
              style={{
                background: "#F8C735",
                boxShadow: "0 6px 32px rgba(248,199,53,0.55)",
              }}
            >
              Take the helm
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 py-3.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center"
                 style={{ background: "#00B4D8" }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[14px] font-semibold text-[#0B4F6C]">Heading to the session…</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Navigator Dashboard ── */
export default function NavigatorDashboard() {
  const navigate   = useNavigate();
  const user       = getCurrentUser();
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{STYLES}</style>

      {/* Ocean background */}
      <OceanBg />

      {/* Sidebar */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Bottle + banner — centred in remaining space */}
      <FloatingBottle onClick={() => setModalOpen(true)} />

      {/* Top-right: notification bell */}
      <div className="absolute top-6 right-7 z-20 flex items-center gap-3">
        <button
          className="relative w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ border: "1px solid rgba(255,255,255,0.14)" }}
          onClick={() => setModalOpen(true)}
        >
          <Bell size={17} className="text-white" style={{ opacity: 0.80 }} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F8C735]" />
        </button>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-[#1D2D44]"
             style={{ background: "#F8C735" }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Bottom hint */}
      <p
        className="absolute bottom-6 text-[12px] font-medium text-white"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          paddingLeft: 240,
          opacity: 0.32,
          letterSpacing: "0.04em",
        }}
      >
        Click the bottle to open the session
      </p>

      {/* Session modal */}
      {modalOpen && <SessionModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Globe, Users, ArrowRight, X, ChevronLeft, Send, Check, Bell,
} from "lucide-react";

/* ── Keyframes & animation classes ── */
const STYLES = `
  @keyframes yap-db1 {
    0%,100% { transform: translate(-50%,-50%) translateY(0px)   rotate(-3deg);   }
    55%     { transform: translate(-50%,-50%) translateY(-11px)  rotate(1.5deg);  }
  }
  @keyframes yap-db2 {
    0%,100% { transform: translate(-50%,-50%) translateY(0px)   rotate(4deg);    }
    50%     { transform: translate(-50%,-50%) translateY(-13px)  rotate(-1deg);   }
  }
  @keyframes yap-db3 {
    0%,100% { transform: translate(-50%,-50%) translateY(0px)   rotate(-5deg);   }
    45%     { transform: translate(-50%,-50%) translateY(-9px)   rotate(-1.5deg); }
  }
  @keyframes yap-card-in {
    from { opacity:0; transform: translateY(10px) scale(0.96); }
    to   { opacity:1; transform: translateY(0)    scale(1);    }
  }
  @keyframes yap-ok {
    from { opacity:0; transform: scale(0.85); }
    to   { opacity:1; transform: scale(1);    }
  }
  @keyframes yap-ripple {
    0%,100% { opacity: 0.038; }
    50%     { opacity: 0.100; }
  }
  .yap-db1 { animation: yap-db1 4.6s ease-in-out         infinite both; }
  .yap-db2 { animation: yap-db2 5.9s ease-in-out 1.05s   infinite both; }
  .yap-db3 { animation: yap-db3 4.3s ease-in-out 2.10s   infinite both; }
  .yap-card-in { animation: yap-card-in 0.22s cubic-bezier(.22,1,.36,1) forwards; }
  .yap-ok      { animation: yap-ok      0.30s cubic-bezier(.22,1,.36,1) forwards; }
  .yap-wa { animation: yap-ripple 4.2s ease-in-out        infinite; }
  .yap-wb { animation: yap-ripple 5.8s ease-in-out 1.5s   infinite; }
`;

/* ── Shoreline bezier (viewBox 0 0 1440 900) ── */
const SC = "C 596,75 558,150 578,225 C 598,300 562,375 582,450 C 602,525 560,600 578,675 C 596,750 558,825 572,900";

/* ── Types ── */
type SendMode  = "global" | "direct";
type PanelView = "main" | "compose" | "success";

/* ── Bottle notification data ── */
const BOTTLES = [
  {
    id: 1, from: "Mira K.", init: "MK",
    subject: "2 replies on your pirate story",
    body: "The compass that shows regret instead of direction — I'm obsessed. Have you thought about what happens when your protagonist finally stops carrying it?",
    count: 2, xPct: 59, yPct: 28,
    glass: "rgba(88,196,180,0.54)", stroke: "#3AA898", badge: "#F8C735", anim: "yap-db1",
  },
  {
    id: 2, from: "The Ocean", init: "🌊",
    subject: "3 co-writers want in on your haiku",
    body: "Your Monday morning haiku reached 14 readers. Three of them want to extend it into a longer series. The community has spoken.",
    count: 3, xPct: 79, yPct: 51,
    glass: "rgba(48,162,196,0.54)", stroke: "#2892B0", badge: "#00B4D8", anim: "yap-db2",
  },
  {
    id: 3, from: "Dev P.", init: "DP",
    subject: "Your lighthouse bottle was found!",
    body: "Dev opened your short story prompt and left a message. Looks like the ocean delivered exactly where it needed to go.",
    count: 1, xPct: 67, yPct: 71,
    glass: "rgba(102,182,212,0.54)", stroke: "#3498B8", badge: "#F8C735", anim: "yap-db3",
  },
] as const;

type Bottle = typeof BOTTLES[number];

/* ────────────────────────────────────────────────
   SVG DECORATION HELPERS
──────────────────────────────────────────────── */
function PalmTree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx="5" cy="6" rx="30" ry="24" fill="rgba(0,0,0,0.09)" />
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a, i) => (
        <path key={i} transform={`rotate(${a})`}
          d="M 0 0 Q 7 -14 2 -30 Q 0 -34 -2 -30 Q -7 -14 0 0"
          fill={i % 2 === 0 ? "#2E7D32" : "#43A047"} />
      ))}
      <circle r="6"   fill="#8B5E3C" />
      <circle r="3.2" fill="#A07040" />
    </g>
  );
}

function Shell({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${r})`}>
      <ellipse cx="0" cy="-10" rx="10" ry="14" fill="#E8C890" stroke="#C4A060" strokeWidth="0.8" />
      <path d="M 0 -3 Q 5 -9 4 -18 Q 0 -22 -4 -18 Q -5 -9 0 -3"
            fill="none" stroke="#C4A060" strokeWidth="0.7" opacity="0.5" />
      <path d="M 0 -3 Q 7 -7 9 -16"   fill="none" stroke="#C4A060" strokeWidth="0.5" opacity="0.4" />
      <path d="M 0 -3 Q -7 -7 -9 -16" fill="none" stroke="#C4A060" strokeWidth="0.5" opacity="0.4" />
      <ellipse cx="0" cy="-3" rx="2.5" ry="2" fill="#DBA84C" />
    </g>
  );
}

/* ────────────────────────────────────────────────
   TOP-DOWN BOTTLE ICON
──────────────────────────────────────────────── */
function BottleIcon({ b, active }: { b: Bottle; active: boolean }) {
  return (
    <svg width="58" height="88" viewBox="-29 -44 58 88" fill="none">
      {active && (
        <ellipse cx="0" cy="12" rx="34" ry="48"
                 fill={b.glass} opacity="0.75"
                 style={{ filter: "blur(16px)" }} />
      )}
      <ellipse cx="4" cy="15" rx="22" ry="36" fill="rgba(0,0,0,0.16)" />
      <path d="M -18 -18 Q -19 -26 0 -28 Q 19 -26 18 -18 L 18 29 Q 18 42 0 42 Q -18 42 -18 29 Z"
            fill={b.glass} stroke={b.stroke} strokeWidth="1.5" />
      <path d="M -9 -28 Q -9 -37 0 -39 Q 9 -37 9 -28"
            fill={b.glass} fillOpacity="0.72" stroke={b.stroke} strokeWidth="1.5" />
      <ellipse cx="0" cy="-42" rx="8"   ry="5.5" fill="#C68642" />
      <ellipse cx="0" cy="-42" rx="8"   ry="5.5" fill="none" stroke="#9A5020" strokeWidth="0.7" />
      <rect x="-10.5" y="-9" width="21" height="30" rx="3.5" fill="#F5EDD6" fillOpacity="0.9" />
      <ellipse cx="0" cy="-9" rx="10.5" ry="3.5" fill="#E8D9B5" />
      <ellipse cx="0" cy="21" rx="10.5" ry="3.5" fill="#E8D9B5" />
      <line x1="-7"  y1="-2"  x2="7"  y2="-2"  stroke="#C4A050" strokeWidth="0.85" opacity="0.45" />
      <line x1="-7"  y1="4.5" x2="7"  y2="4.5" stroke="#C4A050" strokeWidth="0.85" opacity="0.45" />
      <line x1="-7"  y1="11"  x2="4"  y2="11"  stroke="#C4A050" strokeWidth="0.85" opacity="0.45" />
      <circle cx="2" cy="14" r="3.5" fill="#C23838" opacity="0.60" />
      <path d="M -16 37 Q -23 11 -14 -22"
            stroke="white" strokeWidth="4" strokeOpacity="0.22" fill="none" strokeLinecap="round" />
      <ellipse cx="-12" cy="-20" rx="3" ry="5" fill="white" fillOpacity="0.14" />
      <circle cx="19" cy="-37" r="12"
              fill={b.badge}
              style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.22))" }} />
      <text x="19" y="-33" textAnchor="middle"
            fill="#1D2D44" fontSize="11" fontWeight="700"
            fontFamily="'DM Sans', sans-serif">
        {b.count}
      </text>
    </svg>
  );
}

/* ────────────────────────────────────────────────
   NOTIFICATION DETAIL CARD
──────────────────────────────────────────────── */
function NotifCard({ b, onClose }: { b: Bottle; onClose: () => void }) {
  const navigate = useNavigate();
  const toRight = b.xPct < 73;
  return (
    <div
      className="yap-card-in fixed z-40 pointer-events-auto"
      style={{
        width: 288,
        right: "4%",
        top: "50%",
        transform: "translateY(-50%)",
        backdropFilter: "blur(28px) saturate(1.4)",
        background: "rgba(255,253,247,0.90)",
        border: "1px solid rgba(255,255,255,0.80)",
        borderRadius: "22px",
        boxShadow:
          "0 16px 52px rgba(11,79,108,0.22), 0 4px 16px rgba(11,79,108,0.10), inset 0 1.5px 0 rgba(255,255,255,0.95)",
      }}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded-full text-[11px] font-bold text-white flex-shrink-0"
              style={{ width: 32, height: 32, background: "linear-gradient(135deg,#00B4D8,#0B4F6C)" }}
            >
              {b.init}
            </div>
            <div>
              <p className="font-semibold text-[#1D2D44] text-[13px] leading-none">{b.from}</p>
              <p className="text-[10px] text-[#4A6680] mt-0.5">Just now</p>
            </div>
          </div>
          <button onClick={onClose}
                  className="text-[#9AABB8] hover:text-[#1D2D44] transition-colors p-1 -mr-1 -mt-0.5">
            <X size={14} />
          </button>
        </div>
        <p className="font-bold text-[#1D2D44] text-[14px] mb-2 leading-snug"
           style={{ fontFamily: "'Fraunces', serif" }}>
          {b.subject}
        </p>
        <p className="text-[12px] text-[#1D2D44] leading-relaxed" style={{ opacity: 0.72 }}>
          {b.body}
        </p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigate("/session")}
            className="flex-1 py-2.5 rounded-full text-[#1D2D44] text-[12px] font-semibold transition-all hover:brightness-105 active:scale-95"
            style={{ background: "#F8C735", boxShadow: "0 3px 14px rgba(248,199,53,0.45)" }}
          >
            Open bottle
          </button>
          <button onClick={onClose}
                  className="py-2.5 px-4 rounded-full text-[#0B4F6C] text-[12px] font-semibold transition-colors hover:bg-[#00B4D8]/10"
                  style={{ border: "1px solid rgba(0,180,216,0.38)" }}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Send-mode segment control ── */
function ModeSelector({ mode, setMode }: { mode: SendMode; setMode: (m: SendMode) => void }) {
  return (
    <div className="mt-5">
      <p className="text-[10px] font-bold text-[#4A6680] uppercase tracking-widest mb-2.5">Send to</p>
      <div className="flex gap-1.5 p-1 rounded-2xl" style={{ background: "rgba(11,79,108,0.07)" }}>
        {(["global", "direct"] as SendMode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-200"
            style={{
              background: mode === m ? "#0B4F6C" : "transparent",
              color:      mode === m ? "white"   : "#4A6680",
              boxShadow:  mode === m ? "0 2px 8px rgba(11,79,108,0.28)" : "none",
            }}>
            {m === "global" ? <><Globe size={13} /> Ocean</> : <><Users size={13} /> Friends</>}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-[#4A6680] mt-1.5 text-center" style={{ opacity: 0.70 }}>
        {mode === "global" ? "Visible to anyone on Yaptopia" : "Only visible to your connections"}
      </p>
    </div>
  );
}

/* ── Glass panel ── */
function GlassPanel({ mode, setMode, collapsed, onToggle }: {
  mode: SendMode; setMode: (m: SendMode) => void;
  collapsed: boolean; onToggle: () => void;
}) {
  const [view, setView] = useState<PanelView>("main");
  const [msg,  setMsg]  = useState("");
  const total = BOTTLES.reduce((s, b) => s + b.count, 0);

  const handleSend = () => {
    if (!msg.trim()) return;
    setView("success");
    setTimeout(() => { setView("main"); setMsg(""); }, 2600);
  };

  /* Collapsed state: just a small pill to reopen */
  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-3 rounded-2xl transition-all hover:scale-[1.03] active:scale-[0.97]"
        style={{
          backdropFilter: "blur(20px) saturate(1.4)",
          background: "rgba(255,253,247,0.80)",
          border: "1px solid rgba(255,255,255,0.82)",
          boxShadow: "0 8px 32px rgba(11,79,108,0.18), inset 0 1px 0 rgba(255,255,255,0.95)",
        }}
      >
        <svg width="16" height="22" viewBox="-8 -11 16 22" fill="none">
          <path d="M -6 -3 Q -6 -9 0 -10 Q 6 -9 6 -3 L 6 9 Q 6 12 0 12 Q -6 12 -6 9 Z"
                fill="rgba(88,196,180,0.70)" stroke="#3AA898" strokeWidth="1" />
          <ellipse cx="0" cy="-11" rx="2.5" ry="1.8" fill="#C68642" />
        </svg>
        <span className="text-[13px] font-semibold text-[#1D2D44]">Open dock</span>
        {total > 0 && (
          <span className="text-[10px] font-black rounded-full px-2 py-0.5 text-[#1D2D44]"
                style={{ background: "#F8C735" }}>
            {total}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      style={{
        backdropFilter: "blur(32px) saturate(1.4)",
        background: "rgba(255,253,247,0.74)",
        border: "1px solid rgba(255,255,255,0.82)",
        borderRadius: "28px",
        boxShadow:
          "0 24px 64px rgba(11,79,108,0.16), 0 4px 20px rgba(11,79,108,0.10), inset 0 1.5px 0 rgba(255,255,255,0.95)",
      }}
    >
      <div className="p-7">

        {view === "success" && (
          <div className="yap-ok flex flex-col items-center py-10 text-center">
            <div className="flex items-center justify-center rounded-full mb-5"
                 style={{ width: 72, height: 72, background: "#F8C735", boxShadow: "0 8px 30px rgba(248,199,53,0.55)" }}>
              <Check size={32} strokeWidth={2.5} color="#1D2D44" />
            </div>
            <p className="font-black text-[#1D2D44] text-[22px]"
               style={{ fontFamily: "'Fraunces', serif" }}>
              Bottle cast!
            </p>
            <p className="text-[#1D2D44] text-[13px] mt-2 leading-relaxed max-w-[210px]" style={{ opacity: 0.62 }}>
              {mode === "global"
                ? "Set adrift in the ocean for the world to find…"
                : "Sent directly to your friends…"}
            </p>
          </div>
        )}

        {view === "compose" && (
          <>
            <button onClick={() => setView("main")}
                    className="flex items-center gap-1.5 text-[#0B4F6C] text-[13px] font-semibold mb-5 hover:opacity-70 transition-opacity">
              <ChevronLeft size={15} /> Back
            </button>
            <p className="font-black text-[#1D2D44] text-[20px] mb-4"
               style={{ fontFamily: "'Fraunces', serif" }}>
              Write your message
            </p>
            <textarea
              value={msg} onChange={e => setMsg(e.target.value)} autoFocus
              className="w-full h-[116px] text-[13px] text-[#1D2D44] leading-relaxed resize-none rounded-[18px] p-4 placeholder-[#9AABB8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30"
              style={{ background: "rgba(255,255,255,0.62)", border: "1px solid rgba(0,180,216,0.22)" }}
              placeholder="An idea, a question, a first line — write anything."
            />
            <ModeSelector mode={mode} setMode={setMode} />
            <button onClick={handleSend} disabled={!msg.trim()}
                    className="mt-4 w-full py-[14px] rounded-full font-semibold text-[15px] text-[#1D2D44] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.97] disabled:opacity-35 disabled:cursor-not-allowed"
                    style={{
                      background: "#F8C735",
                      boxShadow: msg.trim() ? "0 6px 28px rgba(248,199,53,0.55)" : "none",
                    }}>
              <Send size={15} />
              Cast into {mode === "global" ? "the Ocean" : "Direct"}
            </button>
          </>
        )}

        {view === "main" && (
          <>
            <div className="flex items-center gap-2 mb-7">
              <svg width="18" height="26" viewBox="-9 -13 18 26" fill="none">
                <path d="M -7 -4 Q -7 -10 0 -11 Q 7 -10 7 -4 L 7 11 Q 7 15 0 15 Q -7 15 -7 11 Z"
                      fill="rgba(88,196,180,0.62)" stroke="#3AA898" strokeWidth="1" />
                <ellipse cx="0" cy="-13" rx="3" ry="2" fill="#C68642" />
              </svg>
              <span className="text-[11px] font-bold text-[#0B4F6C] tracking-[0.12em] uppercase">Yaptopia</span>
              <span className="text-[10px] font-black rounded-full px-2.5 py-0.5 text-[#1D2D44]"
                    style={{ background: "#F8C735" }}>
                {total} new
              </span>
              <button
                onClick={onToggle}
                className="ml-auto w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/8 transition-colors flex-shrink-0"
                title="Hide dock"
                style={{ color: "#9AABB8" }}
              >
                <ChevronLeft size={15} />
              </button>
            </div>
            <p className="font-black text-[#1D2D44] text-[28px] leading-tight mb-1"
               style={{ fontFamily: "'Fraunces', serif" }}>
              Good morning.
            </p>
            <p className="text-[13px] text-[#1D2D44] mb-7" style={{ opacity: 0.62 }}>
              {total} bottles are waiting in the ocean.
            </p>
            <button onClick={() => setView("compose")}
                    className="w-full py-[15px] rounded-full font-semibold text-[16px] text-[#1D2D44] flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.97]"
                    style={{
                      background: "#F8C735",
                      boxShadow: "0 6px 28px rgba(248,199,53,0.55), 0 2px 8px rgba(248,199,53,0.28)",
                    }}>
              Cast a New Bottle <ArrowRight size={17} strokeWidth={2.5} />
            </button>
            <ModeSelector mode={mode} setMode={setMode} />
            <div className="mt-6">
              <p className="text-[10px] font-bold text-[#4A6680] uppercase tracking-widest mb-3">In the ocean</p>
              <div className="space-y-3">
                {BOTTLES.map(b => (
                  <div key={b.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center rounded-full text-[11px] font-bold"
                         style={{
                           width: 32, height: 32,
                           background: b.glass.replace("0.54", "0.26"),
                           color: "#1D2D44",
                           border: `1.5px solid ${b.stroke}55`,
                         }}>
                      {b.init}
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[12px] font-semibold text-[#1D2D44] leading-snug truncate">{b.subject}</p>
                      <p className="text-[11px] text-[#4A6680] mt-0.5">from {b.from}</p>
                    </div>
                    <span className="text-[11px] font-bold text-[#0B4F6C] flex-shrink-0 pt-0.5" style={{ opacity: 0.70 }}>
                      {b.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

/* ── Background illustration ── */
function Background() {
  return (
    <svg viewBox="0 0 1440 900" className="absolute inset-0 w-full h-full"
         preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="d-ocean" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#56C8DE" />
          <stop offset="14%"  stopColor="#00B4D8" />
          <stop offset="40%"  stopColor="#0892B2" />
          <stop offset="70%"  stopColor="#0A527A" />
          <stop offset="100%" stopColor="#06283E" />
        </linearGradient>
        <linearGradient id="d-beach" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#F5E2A0" />
          <stop offset="62%"  stopColor="#EBCA7A" />
          <stop offset="100%" stopColor="#D8A840" />
        </linearGradient>
        <linearGradient id="d-shallow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#A2E8F8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#56C8DE"  stopOpacity="0" />
        </linearGradient>
        <radialGradient id="d-sun" cx="80%" cy="20%" r="55%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.18" />
          <stop offset="55%"  stopColor="white" stopOpacity="0.06" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id="d-sm"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>

      <rect width="1440" height="900" fill="url(#d-ocean)" />
      <path d={`M 0 0 L 582 0 ${SC} L 0 900 Z`} fill="url(#d-beach)" />
      <path d={`M 478 0 L 582 0 ${SC} L 478 900 Z`} fill="#C09030" fillOpacity="0.20" />
      <path d={`M 582 0 ${SC} L 572 900 L 768 900 L 768 0 Z`} fill="url(#d-shallow)" fillOpacity="0.54" />
      <path d={`M 582 0 ${SC}`} stroke="white" strokeWidth="5" strokeOpacity="0.50" fill="none" />
      <path d={`M 582 0 ${SC}`} stroke="white" strokeWidth="14" strokeOpacity="0.11" fill="none" filter="url(#d-sm)" />

      {[82, 174, 264, 352, 440, 530, 618, 708, 796, 884].map((y, i) => (
        <path key={i} className={i % 2 === 0 ? "yap-wa" : "yap-wb"}
          d={`M 582 ${y} C 700 ${y - 10},900 ${y + 12},1100 ${y - 8} C 1240 ${y + 6},1360 ${y - 5},1440 ${y}`}
          stroke="white" fill="none" strokeWidth="1.5" />
      ))}

      <rect x="570" y="0" width="870" height="900" fill="url(#d-sun)" />
      <path d="M 895 0 L 962 0 L 1218 900 L 1092 900 Z" fill="white" fillOpacity="0.038" />

      {([
        [792,178,38,13],[1042,318,34,11],[1298,196,28,10],
        [922,578,36,12],[1188,674,30,10],[734,762,26,9],[1382,494,24,8],
      ] as [number,number,number,number][]).map(([cx,cy,rx,ry],i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
                 fill="white" fillOpacity="0.042" filter="url(#d-sm)" />
      ))}

      {([
        [76,120],[196,80],[316,140],[150,278],[420,198],[80,380],[284,320],
        [388,442],[124,520],[254,480],[444,358],[352,600],[184,640],[100,720],
        [304,762],[428,700],[240,820],[82,860],[384,860],[168,160],[432,522],
        [300,202],[108,462],[460,280],[140,400],
      ] as [number,number][]).map(([bx,by],i) => (
        <circle key={i} cx={bx} cy={by} r={2 + i % 3} fill="#C09028" fillOpacity="0.16" />
      ))}

      <PalmTree x={114} y={150} s={1.05} />
      <PalmTree x={84}  y={738} s={0.90} />
      <Shell x={374} y={274} r={28}  />
      <Shell x={186} y={568} r={-42} />
      <Shell x={452} y={642} r={64}  />

      <g transform="translate(314, 720)">
        {[0, 72, 144, 216, 288].map((a, i) => (
          <path key={i} transform={`rotate(${a})`}
                d="M 0 0 L 2.5 -8 L 0 -16 L -2.5 -8 Z"
                fill="#E8A462" opacity="0.82" />
        ))}
        <circle r="4" fill="#D8944A" />
      </g>

      {Array.from({ length: 8 }, (_, i) => {
        const fx = 308 + i * 16 + (i % 2) * 6;
        const fy = 490 - i * 15;
        return (
          <ellipse key={i} cx={fx} cy={fy} rx="4.5" ry="7"
                   transform={`rotate(${i % 2 === 0 ? 16 : -13},${fx},${fy})`}
                   fill="#C09028" fillOpacity="0.24" />
        );
      })}
    </svg>
  );
}

/* ── Nav bar ── */
function NavBar({ total, onLogoClick }: { total: number; onLogoClick: () => void }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-5"
         style={{
           backdropFilter: "blur(20px) saturate(1.3)",
           background: "rgba(255,253,247,0.72)",
           borderBottom: "1px solid rgba(255,255,255,0.56)",
           boxShadow: "0 1px 20px rgba(11,79,108,0.09)",
         }}>
      <button
        onClick={onLogoClick}
        className="flex items-center gap-3 hover:opacity-75 transition-opacity"
      >
        <svg width="34" height="30" viewBox="0 0 50 46" fill="none">
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
        <span className="font-black text-[18px] text-[#1D2D44] tracking-tight"
              style={{ fontFamily: "'Fraunces', serif" }}>
          Yaptopia
        </span>
        <span className="text-[#4A6680] text-[13px] font-medium ml-1" style={{ opacity: 0.65 }}>
          Dashboard
        </span>
      </button>

      <div className="flex items-center gap-5">
        <div className="relative cursor-pointer">
          <Bell size={18} color="#1D2D44" strokeWidth={1.8} opacity={0.72} />
          {total > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full text-[9px] font-black text-[#1D2D44] leading-none"
                  style={{ width: 16, height: 16, background: "#F8C735" }}>
              {total}
            </span>
          )}
        </div>
        <div className="flex items-center justify-center rounded-full text-white text-[11px] font-black cursor-pointer"
             style={{
               width: 32, height: 32,
               background: "linear-gradient(135deg,#00B4D8,#0B4F6C)",
               boxShadow: "0 2px 8px rgba(11,79,108,0.30)",
             }}>
          YP
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard page ── */
export default function Dashboard() {
  const navigate = useNavigate();
  const [active,    setActive]    = useState<number | null>(null);
  const [mode,      setMode]      = useState<SendMode>("global");
  const [collapsed, setCollapsed] = useState(false);
  const total = BOTTLES.reduce((s, b) => s + b.count, 0);

  return (
    <div
      className="w-screen overflow-y-auto"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{STYLES}</style>

      {/* Fixed nav */}
      <NavBar total={total} onLogoClick={() => navigate("/")} />

      {/* Tall scrollable scene */}
      <div
        className="relative flex"
        style={{ marginTop: 72, minHeight: "calc(170vh - 72px)" }}
      >
        {/* Background fills the whole scene */}
        <Background />

        {/* Sticky glass panel — stays in view while ocean scrolls */}
        <div
          className="sticky flex-shrink-0 z-20"
          style={{
            top: 24,
            alignSelf: "flex-start",
            width: 352,
            margin: "28px 0 28px 3%",
          }}
        >
          <GlassPanel
            mode={mode}
            setMode={setMode}
            collapsed={collapsed}
            onToggle={() => setCollapsed(v => !v)}
          />
        </div>

        {/* Bottles: absolute in the scene */}
        {BOTTLES.map(b => (
          <button key={b.id}
            className={`${b.anim} absolute cursor-pointer focus-visible:outline-none`}
            style={{
              left: `${b.xPct}%`, top: `${b.yPct}%`,
              filter: active === b.id
                ? "drop-shadow(0 0 14px rgba(248,199,53,0.78))"
                : "drop-shadow(0 4px 12px rgba(11,79,108,0.30))",
              transition: "filter 0.2s ease",
            }}
            onClick={() => setActive(active === b.id ? null : b.id)}
            aria-label={`Notification: ${b.subject}`}>
            <BottleIcon b={b} active={active === b.id} />
          </button>
        ))}
      </div>

      {/* Notification card: fixed so it doesn't jump when scrolling */}
      {active !== null && (() => {
        const b = BOTTLES.find(x => x.id === active)!;
        return <NotifCard key={active} b={b} onClose={() => setActive(null)} />;
      })()}
    </div>
  );
}

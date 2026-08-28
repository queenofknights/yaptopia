import React from "react";
import { useNavigate } from "react-router";

/* ── Animation keyframes ── */
const STYLES = `
  @keyframes yap-bob1 {
    0%,100% { transform: translateY(0px)   rotate(-7deg);  }
    55%     { transform: translateY(-18px)  rotate(3.5deg); }
  }
  @keyframes yap-bob2 {
    0%,100% { transform: translateY(0px)   rotate(6deg);   }
    50%     { transform: translateY(-22px)  rotate(-2deg);  }
  }
  @keyframes yap-bob3 {
    0%,100% { transform: translateY(0px)   rotate(-5deg);  }
    45%     { transform: translateY(-14px)  rotate(3deg);   }
  }
  @keyframes yap-bob4 {
    0%,100% { transform: translateY(0px)   rotate(8deg);   }
    60%     { transform: translateY(-20px)  rotate(-2.5deg);}
  }
  @keyframes foam-pulse {
    0%,100% { opacity: 0.52; }
    50%     { opacity: 0.20; }
  }
  .yap-b1 {
    animation: yap-bob1 4.8s ease-in-out         infinite both;
    transform-box: fill-box; transform-origin: center 80%;
  }
  .yap-b2 {
    animation: yap-bob2 6.0s ease-in-out 1.15s   infinite both;
    transform-box: fill-box; transform-origin: center 80%;
  }
  .yap-b3 {
    animation: yap-bob3 5.2s ease-in-out 0.60s   infinite both;
    transform-box: fill-box; transform-origin: center 80%;
  }
  .yap-b4 {
    animation: yap-bob4 7.0s ease-in-out 1.90s   infinite both;
    transform-box: fill-box; transform-origin: center 80%;
  }
  .foam-a { animation: foam-pulse 3.2s ease-in-out       infinite; }
  .foam-b { animation: foam-pulse 4.1s ease-in-out 0.8s  infinite; }
  .foam-c { animation: foam-pulse 3.7s ease-in-out 1.6s  infinite; }
`;

/* ── Island logo SVG ── */
function IslandLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.88} viewBox="0 0 50 46" fill="none">
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
  );
}

/* ── Side-view glass bottle (partially submerged) ── */
function MessageBottle({
  glassId, strokeColor, paperColor, paperTint,
}: {
  glassId: string; strokeColor: string; paperColor: string; paperTint: string;
}) {
  return (
    <>
      {/* Body */}
      <path
        d="M -12 62 Q -14 52 -14 40 L -14 8 Q -14 2 -9 -2 L -5.5 -5 L -5.5 -20 Q -5.5 -24 0 -24 Q 5.5 -24 5.5 -20 L 5.5 -5 L 9 -2 Q 14 2 14 8 L 14 40 Q 14 52 12 62 Z"
        fill={`url(#${glassId})`} stroke={strokeColor} strokeWidth="1.2"
      />
      {/* Cork */}
      <rect x="-5" y="-28" width="10" height="8" rx="2.2"
            fill="#C68642" stroke="#9A5020" strokeWidth="0.7" />
      {/* Paper scroll */}
      <rect x="-9.5" y="3" width="19" height="35" rx="2.5"
            fill={paperColor} fillOpacity="0.92" />
      {/* Paper lines */}
      {[10, 17, 24, 31].map((ly, i) => (
        <line key={i} x1={-7} y1={ly} x2={i === 2 ? 4 : 7} y2={ly}
              stroke={paperTint} strokeWidth="0.85" opacity="0.48" />
      ))}
      {/* Wax seal */}
      <circle cx="0" cy="34" r="4.2" fill="#C23838" opacity="0.64" />
      <text x="0" y="37.5" textAnchor="middle" fontSize="4.5" fill="white" opacity="0.8"
            fontFamily="serif">✦</text>
      {/* Glass highlight (left edge catch-light) */}
      <path d="M -10 54 Q -13.5 38 -11 5"
            stroke="white" strokeWidth="3.2" strokeOpacity="0.24"
            fill="none" strokeLinecap="round" />
      {/* Secondary highlight sheen */}
      <ellipse cx="-11" cy="-8" rx="2.8" ry="6" fill="white" fillOpacity="0.16" />
    </>
  );
}

/* ── Ocean + 4 bottles SVG ── */
function OceanScene() {
  return (
    <svg
      viewBox="0 0 1440 520"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        {/* Horizon blend: fully transparent for top 17% so the overlap region is invisible */}
        <linearGradient id="yap-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#00B4D8" stopOpacity="0" />
          <stop offset="17%"  stopColor="#00B4D8" stopOpacity="0" />
          <stop offset="38%"  stopColor="#00B4D8" stopOpacity="0.58" />
          <stop offset="65%"  stopColor="#0B6A8A" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#063B56" stopOpacity="1" />
        </linearGradient>

        {/* Clip: nothing renders in the top 90px (the blending overlap zone) */}
        <clipPath id="yap-ocean-clip">
          <rect x="0" y="90" width="1440" height="430" />
        </clipPath>

        {/* Atmosphere halo — starts at 22% so it never touches the seam */}
        <radialGradient id="yap-halo" cx="50%" cy="22%" r="55%">
          <stop offset="0%"   stopColor="#7DDEEE" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#7DDEEE" stopOpacity="0" />
        </radialGradient>

        {/* Sun reflection path */}
        <linearGradient id="yap-sunpath" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="white" stopOpacity="0.38" />
          <stop offset="100%" stopColor="white" stopOpacity="0.04" />
        </linearGradient>

        {/* Glass gradients — horizontal cylinder illusion per bottle */}
        <linearGradient id="yap-g1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#3AA898" stopOpacity="0.52" />
          <stop offset="28%"  stopColor="#88DDD0" stopOpacity="0.82" />
          <stop offset="54%"  stopColor="#3AA898" stopOpacity="0.58" />
          <stop offset="80%"  stopColor="#7DCCC0" stopOpacity="0.74" />
          <stop offset="100%" stopColor="#3AA898" stopOpacity="0.50" />
        </linearGradient>
        <linearGradient id="yap-g2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#C08830" stopOpacity="0.50" />
          <stop offset="28%"  stopColor="#EAB84A" stopOpacity="0.80" />
          <stop offset="54%"  stopColor="#C08830" stopOpacity="0.56" />
          <stop offset="80%"  stopColor="#D8A43A" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#C08830" stopOpacity="0.48" />
        </linearGradient>
        <linearGradient id="yap-g3" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#2878C0" stopOpacity="0.52" />
          <stop offset="28%"  stopColor="#72C0E8" stopOpacity="0.82" />
          <stop offset="54%"  stopColor="#2878C0" stopOpacity="0.58" />
          <stop offset="80%"  stopColor="#60ACD8" stopOpacity="0.74" />
          <stop offset="100%" stopColor="#2878C0" stopOpacity="0.50" />
        </linearGradient>
        <linearGradient id="yap-g4" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#289898" stopOpacity="0.52" />
          <stop offset="28%"  stopColor="#60C8C8" stopOpacity="0.82" />
          <stop offset="54%"  stopColor="#289898" stopOpacity="0.58" />
          <stop offset="80%"  stopColor="#50BCBC" stopOpacity="0.74" />
          <stop offset="100%" stopColor="#289898" stopOpacity="0.50" />
        </linearGradient>

        {/* Water glow radials per bottle */}
        <radialGradient id="yap-wg1" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#3AA898" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#3AA898" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="yap-wg2" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#EAB84A" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#EAB84A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="yap-wg3" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#72C0E8" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#72C0E8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="yap-wg4" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#60C8C8" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#60C8C8" stopOpacity="0" />
        </radialGradient>

        <filter id="yap-blur-sm"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id="yap-blur-hz"><feGaussianBlur stdDeviation="1.5" /></filter>
      </defs>

      {/* 1. Base ocean gradient — transparent in the overlap zone, no clip needed */}
      <rect width="1440" height="520" fill="url(#yap-base)" />

      {/* Everything else is clipped: no colour bleeds into the top 90px blend zone */}
      <g clipPath="url(#yap-ocean-clip)">

      {/* 2. Horizon atmosphere halo */}
      <rect width="1440" height="520" fill="url(#yap-halo)" />

      {/* 3. Sun reflection column */}
      <path d="M 640 0 L 800 0 L 920 520 L 520 520 Z"
            fill="url(#yap-sunpath)" opacity="0.55" />

      {/* 4. Back wave layers */}
      <path d="M 0 148 Q 180 138 360 152 Q 540 166 720 148 Q 900 130 1080 148 Q 1260 166 1440 148 L 1440 0 L 0 0 Z"
            fill="#00B4D8" fillOpacity="0.22" />
      {/* Foam lip on back wave */}
      <path d="M 0 148 Q 180 138 360 152 Q 540 166 720 148 Q 900 130 1080 148 Q 1260 166 1440 148"
            className="foam-a"
            stroke="white" strokeWidth="2.8" fill="none" strokeOpacity="0.60" />

      <path d="M 0 178 Q 200 165 400 181 Q 600 197 800 178 Q 1000 159 1200 178 Q 1320 191 1440 180 L 1440 0 L 0 0 Z"
            fill="#0B6A8A" fillOpacity="0.18" />

      {/* 5. Water glow ellipses behind bottles */}
      <ellipse cx="310" cy="225" rx="58" ry="30" fill="url(#yap-wg1)" />
      <ellipse cx="560" cy="228" rx="52" ry="26" fill="url(#yap-wg2)" />
      <ellipse cx="820" cy="220" rx="62" ry="32" fill="url(#yap-wg3)" />
      <ellipse cx="1100" cy="224" rx="54" ry="28" fill="url(#yap-wg4)" />

      {/* 6. Ripple rings at waterline */}
      {[
        { cx: 310,  r1: 28, r2: 44, r3: 60 },
        { cx: 560,  r1: 24, r2: 38, r3: 52 },
        { cx: 820,  r1: 30, r2: 48, r3: 66 },
        { cx: 1100, r1: 26, r2: 40, r3: 56 },
      ].map(({ cx, r1, r2, r3 }, i) => (
        <g key={i} opacity="0.28">
          <ellipse cx={cx} cy={228} rx={r1} ry={r1 * 0.30} stroke="white" strokeWidth="1" fill="none" />
          <ellipse cx={cx} cy={228} rx={r2} ry={r2 * 0.28} stroke="white" strokeWidth="0.7" fill="none" />
          <ellipse cx={cx} cy={228} rx={r3} ry={r3 * 0.25} stroke="white" strokeWidth="0.5" fill="none" />
        </g>
      ))}

      {/* 7. Four bottles — positioned so waterline (body y≈40) aligns with wave surface y≈228 */}
      {/* translateY = wave_y − scale × 40  →  228 − 50=178, 228−36=192, 228−52=176, 228−38.8=189 */}
      <g transform="translate(310, 178) scale(1.25)"><g className="yap-b1"><MessageBottle glassId="yap-g1" strokeColor="#3AA898" paperColor="#F0F8EC" paperTint="#3AA898" /></g></g>
      <g transform="translate(560, 192) scale(0.90)"><g className="yap-b2"><MessageBottle glassId="yap-g2" strokeColor="#C08830" paperColor="#FDF5E0" paperTint="#C08830" /></g></g>
      <g transform="translate(820, 176) scale(1.30)"><g className="yap-b3"><MessageBottle glassId="yap-g3" strokeColor="#2878C0" paperColor="#EEF6FD" paperTint="#2878C0" /></g></g>
      <g transform="translate(1100, 189) scale(0.97)"><g className="yap-b4"><MessageBottle glassId="yap-g4" strokeColor="#289898" paperColor="#E8FAFA" paperTint="#289898" /></g></g>

      {/* 8. Foreground waves — cover bottle bottoms */}
      <path d="M 0 222 Q 180 210 360 226 Q 540 242 720 222 Q 900 202 1080 220 Q 1260 238 1440 222 L 1440 520 L 0 520 Z"
            fill="#094C6E" fillOpacity="0.72" />
      {/* Foam crest */}
      <path d="M 0 222 Q 180 210 360 226 Q 540 242 720 222 Q 900 202 1080 220 Q 1260 238 1440 222"
            className="foam-b"
            stroke="white" strokeWidth="3.5" fill="none" strokeOpacity="0.65" />

      <path d="M 0 252 Q 240 238 480 256 Q 720 274 960 252 Q 1200 230 1440 252 L 1440 520 L 0 520 Z"
            fill="#074060" fillOpacity="0.55" />
      <path d="M 0 252 Q 240 238 480 256 Q 720 274 960 252 Q 1200 230 1440 252"
            className="foam-c"
            stroke="white" strokeWidth="2.5" fill="none" strokeOpacity="0.45" />

      <path d="M 0 292 Q 300 275 600 294 Q 900 313 1200 290 Q 1340 280 1440 292 L 1440 520 L 0 520 Z"
            fill="#052E46" fillOpacity="0.65" />

      {/* 9. Foam sparkle dots */}
      {([
        [142,222,2.4],[228,218,1.8],[390,228,2.0],[472,222,1.6],
        [634,222,2.2],[718,216,1.9],[892,222,2.1],[976,218,1.7],
        [1042,224,2.3],[1148,220,1.8],[1228,224,2.0],[1312,218,1.6],
        [308,252,1.5],[742,248,1.7],
      ] as [number,number,number][]).map(([fx,fy,fr],i) => (
        <circle key={i} cx={fx} cy={fy} r={fr}
                fill="white" fillOpacity={0.38 + (i % 3) * 0.08} />
      ))}

      {/* 10. Shimmer lines */}
      {[
        { y: 320, x1: 580, x2: 860, op: 0.10 },
        { y: 350, x1: 660, x2: 780, op: 0.07 },
        { y: 390, x1: 620, x2: 820, op: 0.08 },
        { y: 430, x1: 640, x2: 800, op: 0.06 },
      ].map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y} x2={s.x2} y2={s.y}
              stroke="white" strokeWidth="1.5" opacity={s.op} />
      ))}

      {/* 11. Caustic light patches */}
      {([
        [720,310,42,10],[580,380,34,8],[860,360,30,7],
        [480,420,24,6],[980,410,28,7],[650,460,20,5],[790,450,18,5],
        [560,490,16,4],
      ] as [number,number,number,number][]).map(([cx,cy,rx,ry],i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
                 fill="white" fillOpacity="0.048" filter="url(#yap-blur-sm)" />
      ))}
      </g>
    </svg>
  );
}

/* ── Landing page ── */
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #FDFBF7 0%, #EAF8FC 48%, #56C8D8 78%, #00B4D8 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{STYLES}</style>

      {/* ── Sky section: nav + hero ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Nav */}
        <nav className="flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3">
            <IslandLogo size={36} />
            <span
              className="font-black text-[20px] text-[#1D2D44] tracking-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Yaptopia
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-[14px] font-medium text-[#1D2D44] hover:opacity-60 transition-opacity"
              style={{ opacity: 0.65 }}
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-[#0B4F6C] border-2 border-[#00B4D8] hover:bg-[#00B4D8]/10 transition-colors"
            >
              Join the ocean
            </button>
          </div>
        </nav>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-8">

          {/* Eyebrow text */}
          <p
            className="mb-8 text-[13px] font-semibold text-[#0B4F6C] tracking-widest uppercase"
            style={{ opacity: 0.72 }}
          >
            Multiplayer creative crafting
          </p>

          {/* Headline */}
          <h1
            className="text-[#1D2D44] leading-[1.08] tracking-tight mb-5"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(44px, 7vw, 82px)",
              fontWeight: 900,
              maxWidth: 760,
            }}
          >
            The multiplayer cure<br />for a blank page.
          </h1>

          {/* Sub-headline */}
          <p
            className="text-[#1D2D44] mb-10 leading-relaxed"
            style={{
              fontSize: "clamp(15px, 1.8vw, 19px)",
              maxWidth: 500,
              opacity: 0.62,
            }}
          >
            You are already creative. Cast your messy ideas into the ocean
            and let our community help you build them to the finish line.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2.5 px-8 py-[15px] rounded-full font-semibold text-[16px] text-[#1D2D44] transition-all hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: "#F8C735",
                boxShadow: "0 6px 32px rgba(248,199,53,0.60), 0 2px 10px rgba(248,199,53,0.30)",
              }}
            >
              Cast a Bottle
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-[13px] rounded-full font-semibold text-[16px] text-[#0B4F6C] border-2 border-[#00B4D8] hover:bg-[#00B4D8]/10 transition-colors"
            >
              Guide a Creator
            </button>
          </div>

          {/* Social proof */}
          <p
            className="mt-8 text-[13px] text-[#1D2D44]"
            style={{ opacity: 0.42 }}
          >
            Joined by 300+ crafters in the last 30 days
          </p>
        </main>
      </div>

      {/* ── Ocean ── */}
      <div style={{
        height: "42vh",
        flexShrink: 0,
        marginTop: "-20px",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%)",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 18%)",
      }}>
        <OceanScene />
      </div>

      {/* ── Footer ── */}
      <footer
        className="flex items-center justify-between px-8 py-4"
        style={{ background: "#052E46", borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <IslandLogo size={22} />
          <span className="text-[12px] font-semibold text-white" style={{ opacity: 0.52 }}>
            © 2026 Yaptopia
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          {["About", "How it Works", "Community", "Creators"].map(link => (
            <button key={link}
              className="text-[12px] font-medium text-white transition-opacity hover:opacity-100"
              style={{ opacity: 0.48 }}>
              {link}
            </button>
          ))}
        </div>

        {/* Tagline */}
        <p className="text-[12px] text-white" style={{ opacity: 0.34 }}>
          Made for creators who wander
        </p>
      </footer>
    </div>
  );
}

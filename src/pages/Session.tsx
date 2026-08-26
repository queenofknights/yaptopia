import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Mic, Paperclip, Send, FileText, Clock, X, Zap, Square, Play, Pause } from "lucide-react";

const STYLES = `
  @keyframes sess-rec-pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%     { opacity: 0.4; transform: scale(0.88); }
  }
  .sess-rec-dot { animation: sess-rec-pulse 1.0s ease-in-out infinite; }
  @keyframes sess-in {
    from { opacity:0; transform: scale(0.96) translateY(12px); }
    to   { opacity:1; transform: scale(1)    translateY(0);    }
  }
  @keyframes sess-shim {
    0%,100% { opacity:0.040; }
    50%     { opacity:0.095; }
  }
  @keyframes sess-bubble-l {
    from { opacity:0; transform: translateX(-10px); }
    to   { opacity:1; transform: translateX(0); }
  }
  @keyframes sess-bubble-r {
    from { opacity:0; transform: translateX(10px); }
    to   { opacity:1; transform: translateX(0); }
  }
  @keyframes sess-timer-pulse {
    0%,100% { opacity:1; }
    50%     { opacity:0.60; }
  }
  .sess-in      { animation: sess-in      0.40s cubic-bezier(.22,1,.36,1) forwards; }
  .sess-shim-a  { animation: sess-shim    4.8s  ease-in-out               infinite; }
  .sess-shim-b  { animation: sess-shim    6.2s  ease-in-out 1.8s          infinite; }
  .sess-shim-c  { animation: sess-shim    5.4s  ease-in-out 3.2s          infinite; }
  .sess-bubble-l{ animation: sess-bubble-l 0.28s cubic-bezier(.22,1,.36,1) both; }
  .sess-bubble-r{ animation: sess-bubble-r 0.28s cubic-bezier(.22,1,.36,1) both; }
  .sess-dot     { animation: sess-timer-pulse 2s ease-in-out infinite; }
`;

/* ── Blurred ocean background ── */
function OceanBg() {
  return (
    <svg viewBox="0 0 1440 900" className="fixed inset-0 w-full h-full"
         preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sess-ocean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#063A52" />
          <stop offset="40%"  stopColor="#0B4F6C" />
          <stop offset="75%"  stopColor="#0A7090" />
          <stop offset="100%" stopColor="#052E46" />
        </linearGradient>
        <radialGradient id="sess-glow" cx="50%" cy="42%" r="54%">
          <stop offset="0%"   stopColor="#00B4D8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#00B4D8" stopOpacity="0" />
        </radialGradient>
        <filter id="sess-blur"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <rect width="1440" height="900" fill="url(#sess-ocean)" />
      <rect width="1440" height="900" fill="url(#sess-glow)" />
      <path d="M 600 0 L 840 0 L 1020 900 L 420 900 Z" fill="white" fillOpacity="0.028" />
      {[120,230,345,460,575,690,805].map((y,i) => (
        <path key={i}
          className={["sess-shim-a","sess-shim-b","sess-shim-c"][i%3]}
          d={`M 0 ${y} C 200 ${y-14},460 ${y+18},720 ${y-10} C 980 ${y-20},1220 ${y+16},1440 ${y}`}
          stroke="white" fill="none" strokeWidth="1.3" />
      ))}
      {([
        [280,180,50,13],[700,290,44,11],[1160,210,38,10],
        [180,430,36,10],[860,470,42,11],[520,610,32,9],[1280,540,28,8],
        [420,740,26,7],[940,790,30,8],
      ] as [number,number,number,number][]).map(([cx,cy,rx,ry],i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
                 fill="white" fillOpacity="0.042" filter="url(#sess-blur)" />
      ))}
    </svg>
  );
}

/* ── Chat message types ── */
type Sender = "me" | "them";

interface TextMsg  { type:"text";  id:number; sender:Sender; text:string; time:string; }
interface FileMsg  { type:"file";  id:number; sender:Sender; name:string; ext:string; size:string; time:string; }
interface VoiceMsg { type:"voice"; id:number; sender:Sender; url:string; duration:number; time:string; }
type Message = TextMsg | FileMsg | VoiceMsg;

const INITIAL_MESSAGES: Message[] = [
  { type:"text", id:1, sender:"them", time:"2d ago",
    text:"Hey! I just read your pirate story prompt — the compass that shows regret instead of direction is such a striking idea. I haven't been able to stop thinking about it." },
  { type:"text", id:2, sender:"me", time:"2d ago",
    text:"I'm glad it landed! Honestly I've been stuck on where to take it. Do you think the protagonist should actually find the treasure, or is the journey enough?" },
  { type:"text", id:3, sender:"them", time:"2d ago",
    text:"Definitely the journey — but with a twist. What if finding the treasure *activates* a new regret, so the compass never stops? Here, I sketched a rough story structure:" },
  { type:"file",  id:4, sender:"them", name:"Figma Design File", ext:"fig", size:"2.4 MB", time:"2d ago" },
  { type:"text", id:5, sender:"me", time:"1d ago",
    text:"This is exactly the kind of visual map I needed. The three-act breakdown with the compass shifting at each turn is perfect. You've basically solved my second act." },
  { type:"text", id:6, sender:"them", time:"1d ago",
    text:"What if in act three the compass starts showing *future* regrets instead of past ones? Stakes completely change — now the protagonist is running from something that hasn't happened yet." },
  { type:"text", id:7, sender:"me", time:"4h ago",
    text:"That's the line. That single idea reframes everything. I know exactly how to end it now." },
  { type:"text", id:8, sender:"them", time:"4h ago",
    text:"Write it. I'll be here if you need a second pair of eyes on any draft. No rush — the ocean's patient." },
];

/* ── Avatar ── */
function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center rounded-full text-[11px] font-bold text-white"
         style={{ width:32, height:32, background:color, boxShadow:"0 2px 8px rgba(0,0,0,0.18)" }}>
      {initials}
    </div>
  );
}

/* ── File attachment bubble ── */
function FileAttachment({ msg, isMe }: { msg:FileMsg; isMe:boolean }) {
  const extColor = msg.ext === "fig" ? "#A259FF" : "#00B4D8";
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
         style={{
           background: isMe ? "rgba(11,79,108,0.10)" : "rgba(255,253,247,0.95)",
           border: `1.5px solid ${extColor}30`,
           minWidth: 240,
         }}>
      {/* File icon */}
      <div className="flex items-center justify-center rounded-xl flex-shrink-0"
           style={{ width:40, height:40, background:`${extColor}18`, border:`1.5px solid ${extColor}40` }}>
        <FileText size={18} color={extColor} strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-[#1D2D44] text-[13px] leading-tight truncate">
          {msg.name}.{msg.ext}
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: "#9AABB8" }}>{msg.size}</p>
      </div>
      <div className="flex-shrink-0 ml-2 px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer hover:opacity-80 transition-opacity"
           style={{ background:`${extColor}18`, color:extColor }}>
        Open
      </div>
    </div>
  );
}

/* ── Voice message player ── */
function VoicePlayer({ msg, isMe }: { msg: VoiceMsg; isMe: boolean }) {
  const [playing,  setPlaying]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [current,  setCurrent]  = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const fmtSecs = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(Math.round(s) % 60).padStart(2,"0")}`;

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else         { a.play(); setPlaying(true); }
  };

  const handleTimeUpdate = () => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    setProgress(a.currentTime / a.duration);
    setCurrent(a.currentTime);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    a.currentTime = ratio * a.duration;
  };

  const accent = isMe ? "rgba(255,255,255,0.85)" : "#0B4F6C";
  const trackBg = isMe ? "rgba(255,255,255,0.25)" : "rgba(11,79,108,0.15)";
  const fillBg  = isMe ? "rgba(255,255,255,0.90)" : "#00B4D8";

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{
        background: isMe ? "#0B4F6C" : "#FDFBF7",
        minWidth: 220,
        borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
      }}
    >
      <audio
        ref={audioRef}
        src={msg.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrent(0); }}
      />

      {/* Play / Pause */}
      <button
        onClick={toggle}
        className="flex-shrink-0 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
        style={{ width: 34, height: 34, background: isMe ? "rgba(255,255,255,0.18)" : "rgba(11,79,108,0.10)" }}
      >
        {playing
          ? <Pause  size={15} color={accent} fill={accent} />
          : <Play   size={15} color={accent} fill={accent} />}
      </button>

      {/* Waveform / progress */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {/* Scrubber */}
        <div
          className="relative h-1.5 rounded-full cursor-pointer"
          style={{ background: trackBg }}
          onClick={handleSeek}
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all"
            style={{ width: `${progress * 100}%`, background: fillBg }}
          />
        </div>
        {/* Timing */}
        <div className="flex justify-between">
          <span className="text-[10px] font-semibold" style={{ color: isMe ? "rgba(255,255,255,0.60)" : "#9AABB8" }}>
            {fmtSecs(current)}
          </span>
          <span className="text-[10px] font-semibold" style={{ color: isMe ? "rgba(255,255,255,0.60)" : "#9AABB8" }}>
            {fmtSecs(msg.duration)}
          </span>
        </div>
      </div>

      {/* Mic icon */}
      <Mic size={13} color={isMe ? "rgba(255,255,255,0.45)" : "#9AABB8"} strokeWidth={1.8} className="flex-shrink-0" />
    </div>
  );
}

/* ── Single message row ── */
function MessageRow({ msg, delay }: { msg:Message; delay:number }) {
  const isMe = msg.sender === "me";
  return (
    <div
      className={`flex items-end gap-2.5 ${isMe ? "flex-row-reverse sess-bubble-r" : "sess-bubble-l"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Avatar
        initials={isMe ? "YP" : "MK"}
        color={isMe
          ? "linear-gradient(135deg,#00B4D8,#0B4F6C)"
          : "linear-gradient(135deg,#3AA898,#0B6A5A)"}
      />
      <div className={`flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}
           style={{ maxWidth: "68%" }}>
        {msg.type === "text" ? (
          <div className="px-4 py-3 rounded-2xl text-[14px] leading-relaxed"
               style={{
                 background: isMe ? "#0B4F6C" : "#FDFBF7",
                 color:      isMe ? "#F0F8FC" : "#1D2D44",
                 borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                 boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
               }}>
            {msg.text}
          </div>
        ) : msg.type === "voice" ? (
          <VoicePlayer msg={msg} isMe={isMe} />
        ) : (
          <div style={{ borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", overflow:"hidden" }}>
            <FileAttachment msg={msg} isMe={isMe} />
          </div>
        )}
        <p className="text-[10px] px-1" style={{ color: "#9AABB8" }}>{msg.time}</p>
      </div>
    </div>
  );
}

/* ── Session page ── */
export default function Session() {
  const navigate  = useNavigate();
  const [input,    setInput]    = useState("");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [ending,   setEnding]   = useState(false);
  const [recording, setRecording] = useState(false);
  const [recSecs,   setRecSecs]   = useState(0);
  const recTimer      = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks   = useRef<Blob[]>([]);
  const recSecsRef    = useRef(0);
  const fileRef   = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const next: TextMsg = {
      type: "text", id: Date.now(), sender: "me",
      text, time: "Just now",
    };
    setMessages(m => [...m, next]);
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleEndSession = () => {
    setEnding(true);
    setTimeout(() => navigate("/dashboard"), 1800);
  };

  const fmtSecs = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;

  const toggleRecording = async () => {
    if (recording) {
      /* Stop — MediaRecorder.onstop will fire and send the message */
      clearInterval(recTimer.current!);
      mediaRecorder.current?.stop();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunks.current = [];
        const mr = new MediaRecorder(stream);
        mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.current.push(e.data); };
        mr.onstop = () => {
          const duration = recSecsRef.current;
          recSecsRef.current = 0;
          const blob = new Blob(audioChunks.current, { type: mr.mimeType || "audio/webm" });
          const url  = URL.createObjectURL(blob);
          const voiceMsg: VoiceMsg = {
            type: "voice", id: Date.now(), sender: "me",
            url, duration, time: "Just now",
          };
          setMessages(m => [...m, voiceMsg]);
          stream.getTracks().forEach(t => t.stop());
          setRecording(false);
          setRecSecs(0);
        };
        mr.start();
        mediaRecorder.current = mr;
        setRecording(true);
        setRecSecs(0);
        recSecsRef.current = 0;
        recTimer.current = setInterval(() => {
          recSecsRef.current += 1;
          setRecSecs(recSecsRef.current);
        }, 1000);
      } catch {
        /* Mic permission denied — show a text placeholder instead */
        const voiceMsg: TextMsg = {
          type: "text", id: Date.now(), sender: "me",
          text: "🎙 Voice note (mic access denied)",
          time: "Just now",
        };
        setMessages(m => [...m, voiceMsg]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext  = file.name.split(".").pop()?.toUpperCase() ?? "FILE";
    const size = file.size > 1024 * 1024
      ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;
    const fileMsg: FileMsg = {
      type: "file", id: Date.now(), sender: "me",
      name: file.name, ext, size, time: "Just now",
    };
    setMessages(m => [...m, fileMsg]);
    e.target.value = "";
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center"
         style={{ fontFamily:"'DM Sans', sans-serif" }}>
      <style>{STYLES}</style>
      <OceanBg />

      {/* End-session overlay */}
      {ending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
             style={{ background:"rgba(5,25,40,0.82)", backdropFilter:"blur(8px)" }}>
          <div className="sess-in text-center">
            <div className="flex justify-center mb-5">
              <div className="flex items-center justify-center rounded-full"
                   style={{ width:72, height:72, background:"#F8C735",
                            boxShadow:"0 8px 32px rgba(248,199,53,0.55)" }}>
                <Zap size={32} color="#1D2D44" strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-white text-[26px] font-black" style={{ fontFamily:"'Fraunces', serif" }}>
              Spark found.
            </p>
            <p className="text-[15px] mt-2" style={{ color:"rgba(255,255,255,0.62)" }}>
              Your session is sealed. Heading back to the island…
            </p>
          </div>
        </div>
      )}

      {/* Modal */}
      <div className="sess-in relative z-10 flex flex-col"
           style={{
             width:"min(820px, calc(100vw - 48px))",
             height:"min(780px, calc(100vh - 80px))",
             background:"rgba(255,253,247,0.96)",
             borderRadius:28,
             boxShadow:"0 32px 80px rgba(3,20,35,0.58), 0 8px 32px rgba(3,20,35,0.30), inset 0 1.5px 0 rgba(255,255,255,0.95)",
             overflow:"hidden",
           }}>

        {/* ── Header ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b"
             style={{ borderColor:"rgba(0,180,216,0.12)", background:"rgba(255,253,247,0.98)" }}>

          {/* Left: partner info */}
          <div className="flex items-center gap-3">
            <Avatar initials="MK" color="linear-gradient(135deg,#3AA898,#0B6A5A)" />
            <div>
              <p className="font-bold text-[#1D2D44] text-[15px] leading-tight">Mira K.</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="sess-dot inline-block w-1.5 h-1.5 rounded-full" style={{ background:"#3AA898" }} />
                <span className="text-[11px] text-[#4A6680]">Active now</span>
              </div>
            </div>
          </div>

          {/* Center: session timer */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl"
               style={{ background:"rgba(11,79,108,0.07)", border:"1px solid rgba(0,180,216,0.18)" }}>
            <Clock size={14} color="#0B4F6C" strokeWidth={2} style={{ opacity:0.72 }} />
            <span className="text-[12px] font-semibold text-[#0B4F6C]">
              2 Days, 4 Hours active
            </span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {/* Pause — go back without ending */}
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full font-semibold text-[12px] transition-all hover:bg-black/6 active:scale-[0.97]"
              style={{
                color: "#4A6680",
                border: "1.5px solid rgba(0,180,216,0.22)",
              }}
              title="Come back later — session stays open"
            >
              <X size={13} strokeWidth={2.2} />
              Back to dock
            </button>

            {/* End session — done */}
            <button onClick={handleEndSession}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-[13px] text-[#1D2D44] transition-all hover:scale-[1.03] active:scale-[0.97]"
                    style={{
                      background:"#F8C735",
                      boxShadow:"0 4px 20px rgba(248,199,53,0.50), 0 1px 6px rgba(248,199,53,0.28)",
                    }}>
              <Zap size={14} strokeWidth={2.5} />
              I found my spark!
            </button>
          </div>
        </div>

        {/* ── Chat area ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
             style={{ scrollbarWidth:"thin", scrollbarColor:"rgba(0,180,216,0.20) transparent" }}>

          {/* Session start marker */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px" style={{ background:"rgba(0,180,216,0.14)" }} />
            <span className="text-[10px] font-semibold text-[#9AABB8] uppercase tracking-widest whitespace-nowrap">
              Session started · 2 days ago
            </span>
            <div className="flex-1 h-px" style={{ background:"rgba(0,180,216,0.14)" }} />
          </div>

          {messages.map((msg, i) => (
            <MessageRow key={msg.id} msg={msg} delay={i * 40} />
          ))}

          <div ref={bottomRef} />
        </div>

        {/* ── Input bar ── */}
        <div className="flex-shrink-0 px-5 py-4 border-t"
             style={{ borderColor:"rgba(0,180,216,0.12)", background:"rgba(255,253,247,0.98)" }}>
          <div className="flex items-end gap-3">

            {/* Voice note */}
            <button
              onClick={toggleRecording}
              className="flex-shrink-0 flex items-center justify-center rounded-2xl transition-all hover:scale-105 active:scale-95"
              style={{
                width: recording ? "auto" : 44,
                minWidth: 44,
                height: 44,
                paddingLeft: recording ? 12 : 0,
                paddingRight: recording ? 12 : 0,
                background: recording ? "rgba(194,56,56,0.10)" : "rgba(11,79,108,0.07)",
                border: recording ? "1.5px solid rgba(194,56,56,0.40)" : "1.5px solid rgba(0,180,216,0.20)",
              }}
              title={recording ? "Stop recording" : "Record voice note"}
            >
              {recording ? (
                <span className="flex items-center gap-2">
                  <span className="sess-rec-dot w-2.5 h-2.5 rounded-full bg-[#C23838] flex-shrink-0" style={{ display:"block" }} />
                  <span className="text-[12px] font-semibold text-[#C23838]">{fmtSecs(recSecs)}</span>
                  <Square size={13} color="#C23838" strokeWidth={2} fill="#C23838" />
                </span>
              ) : (
                <Mic size={18} color="#0B4F6C" strokeWidth={1.8} />
              )}
            </button>

            {/* Text input */}
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                placeholder="Write your next chapter…"
                className="w-full px-4 py-3 rounded-2xl text-[14px] text-[#1D2D44] placeholder-[#B0C4D0] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/35 transition-all resize-none leading-relaxed"
                style={{
                  background:"rgba(11,79,108,0.05)",
                  border:"1.5px solid rgba(0,180,216,0.20)",
                  maxHeight:120,
                  lineHeight:"1.55",
                }}
              />
            </div>

            {/* Attach file */}
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex-shrink-0 flex items-center justify-center rounded-2xl transition-all hover:scale-105 active:scale-95"
              style={{
                width:44, height:44,
                background:"rgba(11,79,108,0.07)",
                border:"1.5px solid rgba(0,180,216,0.20)",
              }}
              title="Attach file"
            >
              <Paperclip size={18} color="#0B4F6C" strokeWidth={1.8} />
            </button>

            {/* Send */}
            <button onClick={sendMessage} disabled={!input.trim()}
                    className="flex-shrink-0 flex items-center justify-center rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100"
                    style={{
                      width:44, height:44,
                      background: input.trim() ? "#0B4F6C" : "rgba(11,79,108,0.07)",
                      border:"1.5px solid rgba(0,180,216,0.20)",
                      boxShadow: input.trim() ? "0 4px 16px rgba(11,79,108,0.30)" : "none",
                    }}>
              <Send size={16} color={input.trim() ? "white" : "#9AABB8"} strokeWidth={2} />
            </button>
          </div>

          <p className="text-[10px] text-center mt-2.5" style={{ color:"#B0C4D0" }}>
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>

      </div>
    </div>
  );
}

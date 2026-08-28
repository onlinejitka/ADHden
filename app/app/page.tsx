"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Timer,
  Sparkles,
  ListTodo,
  Smile,
  Volume2,
  Users,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Plus,
  Lock,
  VolumeX,
  Heart,
  Upload,
  Music,
  Video as VideoIcon,
  Clock,
  Trash2,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import confetti from "canvas-confetti";
import { soundEngine } from "@/lib/audioGenerator";

type Tab = "timer" | "kouskovac" | "rutiny" | "klid" | "uspechy" | "bodydoubling";

interface RoutineItem {
  id: string;
  text: string;
  done: boolean;
  icon?: string;
}

interface RoutineSection {
  id: string;
  name: string;
  icon: string;
  items: RoutineItem[];
}

interface BodyDoublingSession {
  id: string;
  title: string;
  desc: string;
  time: number;
  type: "timer" | "audio" | "video";
  mediaUrl?: string;
  free: boolean;
}

interface CustomAudio {
  id: string;
  name: string;
  url: string;
}

export default function ADHDApp() {
  const stripeProUrl = "https://buy.stripe.com/28E8wPbPbchCcuZfXC9IQ0t";

  const [activeTab, setActiveTab] = useState<Tab>("timer");
  const [isPro, setIsPro] = useState<boolean>(false);

  // =============================================================
  // 1. TIME TIMER
  // =============================================================
  const [timerMinutes, setTimerMinutes] = useState<number>(15);
  const [secondsLeft, setSecondsLeft] = useState<number>(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerColor, setTimerColor] = useState<string>("#fbbf24");
  const [soundtrack, setSoundtrack] = useState<"brown" | "pink" | "rain" | "none">("brown");
  const [customTimeMinutes, setCustomTimeMinutes] = useState<string>("");
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isProFromUrl = urlParams.get("pro") === "active";

      if (isProFromUrl) {
        setIsPro(true);
        try {
          localStorage.setItem("adhden_pro_access", "true");
        } catch (storageErr) {}

        try {
          confetti({ particleCount: 70, spread: 70 });
        } catch {}

        try {
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch {}
      } else {
        try {
          if (localStorage.getItem("adhden_pro_access") === "true") {
            setIsPro(true);
          }
        } catch (storageErr) {}
      }
    } catch (err) {}
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as Tab;
      const validTabs: Tab[] = ["timer", "kouskovac", "rutiny", "klid", "uspechy", "bodydoubling"];
      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  useEffect(() => {
    async function requestWakeLock() {
      if (typeof window !== "undefined" && "wakeLock" in navigator && isTimerRunning) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
        } catch (err) {}
      } else if (wakeLockRef.current && !isTimerRunning) {
        try {
          wakeLockRef.current.release();
        } catch {}
        wakeLockRef.current = null;
      }
    }
    requestWakeLock();
  }, [isTimerRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      soundEngine?.stopNoise();
      if (typeof (soundEngine as any)?.playGentleTimerChime === "function") {
        (soundEngine as any).playGentleTimerChime();
      } else {
        soundEngine?.playSuccessDing();
      }
      confetti({ particleCount: 60, spread: 70 });
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsLeft]);

  const toggleTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      if (soundtrack === "brown") soundEngine?.playBrownNoise();
      if (soundtrack === "pink" && isPro) soundEngine?.playPinkNoise();
      if (soundtrack === "rain" && isPro) soundEngine?.playRainNoise();
    } else {
      setIsTimerRunning(false);
      soundEngine?.stopNoise();
    }
  };

  const resetTimer = (mins = timerMinutes) => {
    setIsTimerRunning(false);
    soundEngine?.stopNoise();
    setSecondsLeft(mins * 60);
  };

  const setCustomMinutesHandler = () => {
    const val = parseInt(customTimeMinutes, 10);
    if (!isNaN(val) && val > 0 && val <= 180) {
      setTimerMinutes(val);
      resetTimer(val);
      setCustomTimeMinutes("");
    }
  };

  const totalSeconds = timerMinutes * 60;
  const progressRatio = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const pieDegrees = progressRatio * 360;

  // =============================================================
  // 2. TASK CHUNKER
  // =============================================================
  const [rawTask, setRawTask] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customStepCount, setCustomStepCount] = useState(3);

  const handleBreakdown = async (stepsCountToUse = 3) => {
    if (!rawTask.trim()) return;
    setIsLoadingSteps(true);
    setErrorMessage(null);
    setCompletedSteps([]);
    try {
      const res = await fetch("/api/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: rawTask, stepsCount: stepsCountToUse }),
      });
      const data = await res.json();
      if (data.steps && Array.isArray(data.steps)) {
        setSteps(data.steps);
      } else if (data.error) {
        setErrorMessage(data.error);
      }
    } catch (e: any) {
      setErrorMessage("Could not connect to server.");
    } finally {
      setIsLoadingSteps(false);
    }
  };

  const toggleStepDone = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter((i) => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
      soundEngine?.playSuccessDing();
      if (completedSteps.length + 1 === steps.length) {
        confetti({ particleCount: 50, spread: 60 });
      }
    }
  };

  // =============================================================
  // 3. ROUTINES
  // =============================================================
  const [routineAudience, setRoutineAudience] = useState<"adults" | "kids">("adults");

  const [adultSections, setAdultSections] = useState<RoutineSection[]>([
    {
      id: "ad-morning",
      name: "Morning Launch",
      icon: "☀️",
      items: [
        { id: "a1", text: "Drink a tall glass of water", done: false },
        { id: "a2", text: "Take morning meds / vitamins", done: false },
        { id: "a3", text: "Pick 1 primary focus for today", done: false },
      ],
    },
    {
      id: "ad-evening",
      name: "Night Wind-Down",
      icon: "🌙",
      items: [
        { id: "a4", text: "Put phone to charge away from bed", done: false },
        { id: "a5", text: "Lay out clothes for tomorrow", done: false },
        { id: "a6", text: "5 minutes of mindful breathing", done: false },
      ],
    },
    {
      id: "ad-cleaning",
      name: "Quick Reset",
      icon: "🧹",
      items: [
        { id: "a7", text: "Dishes into the dishwasher/sink", done: false },
        { id: "a8", text: "Toss stray trash off the desk", done: false },
        { id: "a9", text: "Fluff pillows and straighten bed", done: false },
      ],
    },
    {
      id: "ad-work",
      name: "Deep Focus",
      icon: "💻",
      items: [
        { id: "a10", text: "Close unnecessary browser tabs", done: false },
        { id: "a11", text: "Pour fresh water or hot tea", done: false },
        { id: "a12", text: "Start a 25-min visual timer", done: false },
      ],
    },
  ]);

  const [kidsSections, setKidsSections] = useState<RoutineSection[]>([
    {
      id: "kd-morning",
      name: "Morning Launch",
      icon: "🎒",
      items: [
        { id: "k1", text: "Brush teeth (2 minutes)", icon: "🪥", done: false },
        { id: "k2", text: "Put on pants and cozy socks", icon: "🧦", done: false },
        { id: "k3", text: "Water bottle in backpack", icon: "💧", done: false },
        { id: "k4", text: "Shoes and jacket at the door", icon: "👟", done: false },
      ],
    },
    {
      id: "kd-playground",
      name: "Heading Outside",
      icon: "⚽",
      items: [
        { id: "k5", text: "Use the bathroom", icon: "🚽", done: false },
        { id: "k6", text: "Grab hat and water bottle", icon: "🧢", done: false },
        { id: "k7", text: "Pick 1 favorite toy to bring", icon: "🧸", done: false },
      ],
    },
    {
      id: "kd-home",
      name: "Back Home",
      icon: "🏡",
      items: [
        { id: "k8", text: "Shoes off and into the rack", icon: "👞", done: false },
        { id: "k9", text: "Wash hands with warm soap", icon: "🧼", done: false },
        { id: "k10", text: "Put snack box into the sink", icon: "🥪", done: false },
      ],
    },
    {
      id: "kd-evening",
      name: "Bedtime & Teeth",
      icon: "✨",
      items: [
        { id: "k11", text: "Put on pajamas", icon: "👕", done: false },
        { id: "k12", text: "Thoroughly brush teeth", icon: "🪥", done: false },
        { id: "k13", text: "Bedtime story & goodnight cuddle", icon: "📖", done: false },
      ],
    },
  ]);

  const [activeSectionId, setActiveSectionId] = useState<string>("ad-morning");
  const [newRoutineText, setNewRoutineText] = useState("");

  const currentSections = routineAudience === "adults" ? adultSections : kidsSections;
  const currentActiveSection =
    currentSections.find((s) => s.id === activeSectionId) || currentSections[0];

  const toggleRoutineItem = (itemId: string) => {
    soundEngine?.playSuccessDing();
    const updateFn = (sections: RoutineSection[]) =>
      sections.map((sec) => ({
        ...sec,
        items: sec.items.map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        ),
      }));

    if (routineAudience === "adults") {
      setAdultSections(updateFn(adultSections));
    } else {
      setKidsSections(updateFn(kidsSections));
      confetti({ particleCount: 35, spread: 60 });
    }
  };

  const addCustomRoutineItem = () => {
    if (!isPro || !newRoutineText.trim()) return;
    const newItem: RoutineItem = {
      id: Date.now().toString(),
      text: newRoutineText,
      icon: routineAudience === "kids" ? "⭐" : undefined,
      done: false,
    };

    const updateFn = (sections: RoutineSection[]) =>
      sections.map((sec) =>
        sec.id === currentActiveSection.id
          ? { ...sec, items: [...sec.items, newItem] }
          : sec
      );

    if (routineAudience === "adults") {
      setAdultSections(updateFn(adultSections));
    } else {
      setKidsSections(updateFn(kidsSections));
    }
    setNewRoutineText("");
  };

  // =============================================================
  // 4. CALM ZONE
  // =============================================================
  const [officialAudios] = useState([
    { id: "oa-brown", name: "Deep Brown Noise", desc: "Soothing neurological grounding", type: "builtin-brown", free: true },
    { id: "oa-rain", name: "Night Raindrops", desc: "Monotonous steady rain focus", type: "builtin-rain", free: true },
  ]);

  const [customAudios, setCustomAudios] = useState<CustomAudio[]>([]);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const [klidTimerMins, setKlidTimerMins] = useState<number | null>(null);
  const [klidSecsLeft, setKlidSecsLeft] = useState<number | null>(null);

  const startKlidTimer = (mins: number) => {
    if (!isPro) return;
    setKlidTimerMins(mins);
    setKlidSecsLeft(mins * 60);
  };

  const cancelKlidTimer = () => {
    setKlidTimerMins(null);
    setKlidSecsLeft(null);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPro && klidSecsLeft !== null && klidSecsLeft > 0 && activeAudioId) {
      interval = setInterval(() => {
        setKlidSecsLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (klidSecsLeft === 0) {
      soundEngine?.stopNoise();
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      setActiveAudioId(null);
      setKlidTimerMins(null);
      setKlidSecsLeft(null);
    }
    return () => clearInterval(interval);
  }, [klidSecsLeft, activeAudioId, isPro]);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPro) return;
    if (customAudios.length >= 3) {
      alert("In PRO mode, you can upload up to 3 custom tracks.");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);
    const newTrack: CustomAudio = {
      id: Date.now().toString(),
      name: file.name.replace(/\.[^/.]+$/, ""),
      url: fileUrl,
    };
    setCustomAudios([...customAudios, newTrack]);
  };

  const deleteCustomAudio = (id: string) => {
    if (activeAudioId === id) {
      audioPlayerRef.current?.pause();
      setActiveAudioId(null);
    }
    setCustomAudios(customAudios.filter((a) => a.id !== id));
  };

  const playAudioTrack = (id: string, type: string, url?: string) => {
    soundEngine?.stopNoise();
    if (audioPlayerRef.current) audioPlayerRef.current.pause();

    if (activeAudioId === id) {
      setActiveAudioId(null);
      cancelKlidTimer();
      return;
    }

    if (type === "builtin-brown") {
      soundEngine?.playBrownNoise(0.6);
      setActiveAudioId(id);
    } else if (type === "builtin-rain") {
      soundEngine?.playRainNoise(0.5);
      setActiveAudioId(id);
    } else if (url && audioPlayerRef.current) {
      audioPlayerRef.current.src = url;
      audioPlayerRef.current.loop = true;
      audioPlayerRef.current.play().catch((err) => {});
      setActiveAudioId(id);
    }
  };

  // =============================================================
  // 5. DAILY WINS
  // =============================================================
  const [wins, setWins] = useState({
    water: false,
    food: false,
    rest: false,
    movement: false,
  });

  const toggleWin = (key: keyof typeof wins) => {
    setWins((prev) => {
      const nextVal = !prev[key];
      if (nextVal) soundEngine?.playSuccessDing();
      return { ...prev, [key]: nextVal };
    });
  };

  // =============================================================
  // 6. BODY DOUBLING
  // =============================================================
  const [sessions] = useState<BodyDoublingSession[]>([
    {
      id: "bd-teeth",
      title: "Brush Teeth With Me",
      desc: "2.5 minutes for clean teeth with upbeat rhythm",
      time: 2.5,
      type: "audio",
      mediaUrl: "/Cisteni-zubu-Sunrise_on_the_Boulevard.mp3",
      free: true,
    },
    {
      id: "bd-desk",
      title: "Desk Surface Quick Reset",
      desc: "5 minutes: dishes out, trash tossed, pens sorted",
      time: 5,
      type: "timer",
      free: true,
    },
    {
      id: "bd-stretch",
      title: "Desk Stretch & Decompress",
      desc: "3 minutes of neck, shoulder, and back relief",
      time: 3,
      type: "video",
      free: true,
    },
    {
      id: "bd-laundry",
      title: "Fold Laundry Without Dread",
      desc: "15 minutes of calm rhythmic folding flow",
      time: 15,
      type: "audio",
      mediaUrl: "/Skladani-pradla-Amber_Hours.mp3",
      free: false,
    },
    {
      id: "bd-mail",
      title: "Inbox Zero Power Sprint",
      desc: "10 minutes of supported email processing",
      time: 10,
      type: "audio",
      mediaUrl: "/Klid-u-pocitace-Where_the_Pencil_Meets_Paper.mp3",
      free: false,
    },
  ]);

  const [activeSession, setActiveSession] = useState<BodyDoublingSession | null>(null);
  const [sessionSecs, setSessionSecs] = useState<number>(0);
  const [isSessionAudioMuted, setIsSessionAudioMuted] = useState<boolean>(false);
  const bodyDoublingAudioRef = useRef<HTMLAudioElement | null>(null);

  const startSession = (session: BodyDoublingSession) => {
    setActiveSession(session);
    setSessionSecs(Math.round(session.time * 60));
    setIsSessionAudioMuted(false);

    if (session.mediaUrl && session.type === "audio") {
      setTimeout(() => {
        if (bodyDoublingAudioRef.current) {
          bodyDoublingAudioRef.current.src = session.mediaUrl!;
          bodyDoublingAudioRef.current.loop = true;
          bodyDoublingAudioRef.current.muted = false;
          bodyDoublingAudioRef.current.play().catch((e) => {});
        }
      }, 50);
    }
  };

  const toggleSessionAudio = () => {
    if (bodyDoublingAudioRef.current) {
      if (bodyDoublingAudioRef.current.paused) {
        bodyDoublingAudioRef.current.play().catch(() => {});
        setIsSessionAudioMuted(false);
      } else {
        bodyDoublingAudioRef.current.pause();
        setIsSessionAudioMuted(true);
      }
    }
  };

  const endSession = () => {
    if (bodyDoublingAudioRef.current) {
      bodyDoublingAudioRef.current.pause();
      bodyDoublingAudioRef.current.currentTime = 0;
    }
    setActiveSession(null);
    setIsSessionAudioMuted(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeSession && sessionSecs > 0) {
      timer = setInterval(() => setSessionSecs((s) => s - 1), 1000);
    } else if (activeSession && sessionSecs === 0) {
      endSession();
      if (typeof (soundEngine as any)?.playGentleTimerChime === "function") {
        (soundEngine as any).playGentleTimerChime();
      } else {
        soundEngine?.playSuccessDing();
      }
      confetti({ particleCount: 70, spread: 80 });
    }
    return () => clearInterval(timer);
  }, [activeSession, sessionSecs]);

  const sessionTotalSecs = (activeSession?.time || 1) * 60;
  const sessionProgress = sessionTotalSecs > 0 ? sessionSecs / sessionTotalSecs : 0;
  const sessionPieDegrees = sessionProgress * 360;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="w-full min-h-screen bg-[#121214] text-zinc-200 flex justify-center font-sans tracking-wide leading-relaxed">
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#18181b] border-x border-zinc-800/80 shadow-2xl relative px-5 pt-4 pb-32">
        <audio ref={audioPlayerRef} className="hidden" />
        <audio ref={bodyDoublingAudioRef} className="hidden" />

        {/* HEADER */}
        <header className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-6 flex-shrink-0">
          <Link href="/" className="flex items-center group">
            <img
              src="/ADHden%20logo.jpg"
              alt="ADHDen logo"
              className="h-9 w-auto rounded-lg object-contain group-hover:opacity-90 transition"
            />
          </Link>

          {isPro ? (
            <span className="bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>★ PRO Active</span>
            </span>
          ) : (
            <a
              href={stripeProUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Try PRO Free</span>
            </a>
          )}
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col justify-center">
          {/* TAB 1: TIME TIMER */}
          {activeTab === "timer" && (
            <div className="flex flex-col items-center space-y-6 my-auto">
              <div className="relative w-56 h-56 rounded-full flex items-center justify-center p-2.5 bg-[#121214] border border-zinc-800 shadow-2xl flex-shrink-0">
                <div
                  className="w-full h-full rounded-full transition-all duration-1000 ease-linear flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `conic-gradient(${timerColor} ${pieDegrees}deg, #27272a 0deg)`,
                  }}
                >
                  <div className="w-36 h-36 rounded-full bg-[#18181b] border border-zinc-700/60 flex flex-col items-center justify-center z-10 text-center px-2 shadow-inner">
                    <span className="text-4xl font-black tracking-tight text-zinc-100">
                      {formatTime(secondsLeft)}
                    </span>
                    <span className="text-xs text-amber-300 font-medium mt-1 leading-tight">
                      {isTimerRunning ? "✨ Be present" : "Paused"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-5 flex-shrink-0 pt-1">
                <button
                  onClick={toggleTimer}
                  className="w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold flex items-center justify-center transition active:scale-95 shadow-lg shadow-amber-400/20"
                >
                  {isTimerRunning ? (
                    <Pause className="w-7 h-7" strokeWidth={2.2} />
                  ) : (
                    <Play className="w-7 h-7 ml-1" strokeWidth={2.2} />
                  )}
                </button>
                <button
                  onClick={() => resetTimer()}
                  className="w-11 h-11 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center active:scale-95 transition border border-zinc-700/70"
                >
                  <RotateCcw className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex gap-2 flex-shrink-0 pt-1">
                {[5, 10, 15, 25, 45].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      setTimerMinutes(mins);
                      resetTimer(mins);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      timerMinutes === mins
                        ? "bg-zinc-800 text-amber-300 border border-amber-400/40 shadow-sm"
                        : "bg-zinc-800/40 text-zinc-400 border border-zinc-800 hover:bg-zinc-800"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              {/* Custom Time */}
              <div className="flex-shrink-0">
                {isPro ? (
                  <div className="flex items-center gap-2.5 bg-zinc-800/50 border border-zinc-800 rounded-2xl px-4 py-1.5">
                    <span className="text-xs text-amber-300 font-medium whitespace-nowrap">
                      ★ Custom (min):
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={customTimeMinutes}
                      onChange={(e) => setCustomTimeMinutes(e.target.value)}
                      placeholder="8"
                      className="w-14 bg-[#121214] border border-zinc-700 rounded-lg px-2 py-1 text-xs text-amber-300 text-center focus:outline-none focus:border-amber-400 font-bold"
                    />
                    <button
                      onClick={setCustomMinutesHandler}
                      disabled={!customTimeMinutes}
                      className="bg-amber-400 hover:bg-amber-300 disabled:opacity-30 text-zinc-950 font-bold px-3 py-1 rounded-lg text-xs transition"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-1">
                    <a
                      href={stripeProUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-300 transition"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Custom timer & sounds in PRO</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Ambient Sound Box */}
              <div className="w-full bg-zinc-800/30 border border-zinc-800 rounded-2xl p-4 space-y-3 flex-shrink-0">
                <div className="flex items-center justify-between text-xs font-medium text-zinc-300">
                  <span className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-teal-400" /> Focus Ambient Sound
                  </span>
                  <div className="flex gap-2 items-center">
                    {["#fbbf24", "#2dd4bf", "#c084fc", "#f87171", "#38bdf8"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setTimerColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-4 h-4 rounded-full transition-all ${
                          timerColor === c ? "ring-2 ring-zinc-100 scale-110" : "opacity-40"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      setSoundtrack("brown");
                      if (isTimerRunning) soundEngine?.playBrownNoise();
                    }}
                    className={`py-2 text-xs rounded-xl transition ${
                      soundtrack === "brown"
                        ? "bg-teal-500/15 text-teal-300 border border-teal-500/40 font-semibold"
                        : "bg-zinc-800/60 text-zinc-400 border border-zinc-800"
                    }`}
                  >
                    Brown
                  </button>
                  <button
                    disabled={!isPro}
                    onClick={() => {
                      setSoundtrack("pink");
                      if (isTimerRunning) soundEngine?.playPinkNoise();
                    }}
                    className={`py-2 text-xs rounded-xl transition ${
                      soundtrack === "pink"
                        ? "bg-teal-500/15 text-teal-300 border border-teal-500/40 font-semibold"
                        : "bg-zinc-800/60 text-zinc-400 border border-zinc-800"
                    } ${!isPro && "opacity-40 cursor-not-allowed"}`}
                  >
                    Pink {!isPro && "🔒"}
                  </button>
                  <button
                    disabled={!isPro}
                    onClick={() => {
                      setSoundtrack("rain");
                      if (isTimerRunning) soundEngine?.playRainNoise();
                    }}
                    className={`py-2 text-xs rounded-xl transition ${
                      soundtrack === "rain"
                        ? "bg-teal-500/15 text-teal-300 border border-teal-500/40 font-semibold"
                        : "bg-zinc-800/60 text-zinc-400 border border-zinc-800"
                    } ${!isPro && "opacity-40 cursor-not-allowed"}`}
                  >
                    Rain {!isPro && "🔒"}
                  </button>
                  <button
                    onClick={() => {
                      setSoundtrack("none");
                      soundEngine?.stopNoise();
                    }}
                    className={`py-2 text-xs rounded-xl transition ${
                      soundtrack === "none"
                        ? "bg-zinc-700 text-zinc-200 border border-zinc-600"
                        : "bg-zinc-800/60 text-zinc-400 border border-zinc-800"
                    }`}
                  >
                    Mute
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHUNKER */}
          {activeTab === "kouskovac" && (
            <div className="space-y-6">
              <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-5 space-y-3.5">
                <h2 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Task Micro-Chunker
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Break down overwhelming tasks into 3 frictionless, physically doable steps.
                </p>

                <textarea
                  value={rawTask}
                  onChange={(e) => setRawTask(e.target.value)}
                  placeholder="Type a task you dread starting (e.g., Clean off my desk)..."
                  rows={3}
                  className="w-full bg-[#121214] border border-zinc-700/80 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-400 resize-none leading-relaxed"
                />

                {errorMessage && (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
                    {errorMessage}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span>Steps:</span>
                    <select
                      value={customStepCount}
                      onChange={(e) => setCustomStepCount(Number(e.target.value))}
                      className="bg-[#121214] border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-purple-300 focus:outline-none"
                    >
                      <option value={3}>3 steps</option>
                      <option value={5}>5 steps</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleBreakdown(customStepCount)}
                    disabled={isLoadingSteps || !rawTask.trim()}
                    className="bg-purple-400 hover:bg-purple-300 disabled:opacity-40 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs transition active:scale-95"
                  >
                    {isLoadingSteps ? "Chunking..." : "Break it down"}
                  </button>
                </div>
              </div>

              {steps.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
                    Your Micro-Steps:
                  </h3>
                  {steps.map((step, idx) => {
                    const isDone = completedSteps.includes(idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStepDone(idx)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isDone
                            ? "bg-teal-950/20 border-teal-500/30 text-teal-300 line-through opacity-70"
                            : "bg-zinc-800/40 border-zinc-700/70 hover:border-purple-400/50 text-zinc-200 shadow-sm"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                        ) : (
                          <Circle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                        )}
                        <span className="text-xs font-medium leading-relaxed">{step}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ROUTINES */}
          {activeTab === "rutiny" && (
            <div className="space-y-5">
              <div className="flex bg-zinc-800/60 p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => {
                    setRoutineAudience("adults");
                    setActiveSectionId("ad-morning");
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                    routineAudience === "adults" ? "bg-zinc-700 text-amber-300 shadow" : "text-zinc-400"
                  }`}
                >
                  For Adults
                </button>
                <button
                  onClick={() => {
                    setRoutineAudience("kids");
                    setActiveSectionId("kd-morning");
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                    routineAudience === "kids" ? "bg-zinc-700 text-teal-300 shadow" : "text-zinc-400"
                  }`}
                >
                  For Kids (Visual)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {currentSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2.5 transition border ${
                      activeSectionId === sec.id
                        ? "bg-zinc-800 text-amber-300 border-amber-400/40 shadow-sm"
                        : "bg-zinc-800/30 text-zinc-400 border-zinc-800 hover:bg-zinc-800/60"
                    }`}
                  >
                    <span className="text-base">{sec.icon}</span>
                    <span className="truncate">{sec.name}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2.5">
                {currentActiveSection.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleRoutineItem(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      item.done
                        ? "bg-teal-950/20 border-teal-500/30 text-teal-300"
                        : "bg-zinc-800/40 border-zinc-800 text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <span className="text-xl">{item.icon}</span>}
                      <span className={`text-xs font-medium ${item.done ? "line-through opacity-60" : ""}`}>
                        {item.text}
                      </span>
                    </div>
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-400" strokeWidth={2} />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-600" strokeWidth={2} />
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-4 space-y-2.5">
                <div className="text-xs text-zinc-400 font-medium">
                  Add step to <b>{currentActiveSection.name}</b>:
                </div>
                {isPro ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRoutineText}
                      onChange={(e) => setNewRoutineText(e.target.value)}
                      placeholder="e.g., Check backpack keys..."
                      className="flex-1 bg-[#121214] border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={addCustomRoutineItem}
                      disabled={!newRoutineText.trim()}
                      className="bg-amber-400 hover:bg-amber-300 disabled:opacity-30 text-zinc-950 px-3.5 py-2 rounded-xl text-xs font-bold transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-zinc-800/50 border border-zinc-700/60 rounded-xl flex items-center justify-between">
                    <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
                      <Lock className="w-3.5 h-3.5 text-amber-400" /> Custom steps in PRO
                    </span>
                    <a
                      href={stripeProUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-300 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>7 days free</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CALM ZONE */}
          {activeTab === "klid" && (
            <div className="space-y-5">
              <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-4 space-y-1">
                <h2 className="text-sm font-semibold text-teal-300 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-teal-400" /> Sensory Calm & White Noise
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Monotonous grounding sounds for nervous system decompression.
                </p>
              </div>

              <div className="space-y-2.5">
                {officialAudios.map((audio) => {
                  const isPlaying = activeAudioId === audio.id;
                  return (
                    <div key={audio.id} className="p-4 bg-zinc-800/40 border border-zinc-800 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-zinc-200">{audio.name}</div>
                        <div className="text-[11px] text-teal-400/80 mt-0.5">{audio.desc}</div>
                      </div>
                      <button
                        onClick={() => playAudioTrack(audio.id, audio.type, (audio as any).url)}
                        className={`px-4 py-2 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition ${
                          isPlaying ? "bg-teal-400 text-zinc-950 font-bold" : "bg-zinc-700 hover:bg-zinc-600 text-zinc-200"
                        }`}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        {isPlaying ? "Playing" : "Play"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Sleep Timer */}
              <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-200 font-semibold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-400" /> Audio Sleep Timer
                  </span>
                  {isPro && klidSecsLeft !== null && (
                    <span className="text-amber-300 font-mono font-bold">
                      turns off in {formatTime(klidSecsLeft)}
                    </span>
                  )}
                </div>

                {isPro ? (
                  <div className="grid grid-cols-4 gap-2">
                    {[15, 30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => startKlidTimer(mins)}
                        className={`py-2 rounded-xl text-xs font-medium transition ${
                          klidTimerMins === mins
                            ? "bg-teal-400 text-zinc-950 font-bold"
                            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60"
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-zinc-400 block text-center py-1">
                    🔒 Audio sleep timer is available in PRO
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  soundEngine?.stopNoise();
                  if (audioPlayerRef.current) audioPlayerRef.current.pause();
                  setActiveAudioId(null);
                  cancelKlidTimer();
                }}
                className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <VolumeX className="w-4 h-4" /> Stop All Audio
              </button>
            </div>
          )}

          {/* TAB 5: WINS */}
          {activeTab === "uspechy" && (
            <div className="space-y-5">
              <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-4 space-y-1">
                <h2 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-amber-400" /> Daily Self-Care Wins
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Zero pressure for perfection. Simply celebrate the small things you nourished today.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "water", label: "Hydrated body", icon: "💧" },
                  { key: "food", label: "Nourished body", icon: "🥪" },
                  { key: "rest", label: "Mindful rest", icon: "🛋️" },
                  { key: "movement", label: "Gentle stretch", icon: "🧘" },
                ].map((item) => {
                  const isChecked = wins[item.key as keyof typeof wins];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleWin(item.key as keyof typeof wins)}
                      className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2.5 transition active:scale-95 ${
                        isChecked
                          ? "bg-amber-400/10 border-amber-400/40 text-amber-300 shadow-sm"
                          : "bg-zinc-800/30 border-zinc-800 text-zinc-400 hover:bg-zinc-800/60"
                      }`}
                    >
                      <span className="text-3xl">{item.icon}</span>
                      <span className="text-xs font-semibold text-center">{item.label}</span>
                      {isChecked && <span className="text-[11px] text-amber-300 font-bold">✓ Got it!</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: BODY DOUBLING */}
          {activeTab === "bodydoubling" && (
            <div className="space-y-5">
              {activeSession ? (
                <div className="bg-zinc-800/50 border border-teal-500/30 rounded-2xl p-5 text-center flex flex-col items-center space-y-5 shadow-xl">
                  <div className="text-xs text-teal-300 font-semibold tracking-wider uppercase">
                    {activeSession.title}
                  </div>

                  <div className="relative w-52 h-52 rounded-full flex items-center justify-center p-2 bg-[#121214] border border-zinc-800">
                    <div
                      className="w-full h-full rounded-full transition-all duration-1000 ease-linear flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: `conic-gradient(#2dd4bf ${sessionPieDegrees}deg, #27272a 0deg)`,
                      }}
                    >
                      <div className="w-32 h-32 rounded-full bg-[#18181b] border border-zinc-700/60 flex flex-col items-center justify-center z-10">
                        <span className="text-3xl font-bold tracking-tight text-zinc-100">
                          {formatTime(sessionSecs)}
                        </span>
                        <span className="text-[10px] text-teal-300 font-medium mt-1">
                          {activeSession.mediaUrl && activeSession.type === "audio"
                            ? isSessionAudioMuted
                              ? "Muted"
                              : "Audio playing"
                            : "Working together"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 max-w-xs">{activeSession.desc}</p>

                  <div className="flex items-center gap-3">
                    {activeSession.mediaUrl && activeSession.type === "audio" && (
                      <button
                        onClick={toggleSessionAudio}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                          isSessionAudioMuted
                            ? "bg-zinc-700 text-amber-300 border border-amber-400/30"
                            : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
                        }`}
                      >
                        {isSessionAudioMuted ? <VolumeX className="w-4 h-4 text-amber-300" /> : <Volume2 className="w-4 h-4 text-teal-300" />}
                        {isSessionAudioMuted ? "Unmute" : "Mute"}
                      </button>
                    )}

                    <button
                      onClick={endSession}
                      className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-xs text-zinc-300 font-semibold transition"
                    >
                      Finish
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-zinc-800/30 border border-zinc-800 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-zinc-200">{item.title}</span>
                          {item.type === "audio" && (
                            <span className="bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[10px] px-2 py-0.5 rounded font-medium">
                              Audio
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">{item.desc}</div>
                      </div>
                      <button
                        disabled={!item.free && !isPro}
                        onClick={() => startSession(item)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                          item.free || isPro
                            ? "bg-teal-400 hover:bg-teal-300 text-zinc-950"
                            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        }`}
                      >
                        {item.free || isPro ? <Play className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        Start
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* BOTTOM NAVIGATION */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#121214]/95 backdrop-blur-md border-t border-zinc-800/90 px-3 py-2.5 flex justify-around items-center z-50 shadow-2xl">
          <button
            onClick={() => setActiveTab("timer")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
              activeTab === "timer" ? "text-amber-300" : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Timer className="w-5 h-5" strokeWidth={activeTab === "timer" ? 2.2 : 1.5} />
            <span className="text-[10px] font-medium">Timer</span>
          </button>

          <button
            onClick={() => setActiveTab("kouskovac")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
              activeTab === "kouskovac" ? "text-purple-300" : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Sparkles className="w-5 h-5" strokeWidth={activeTab === "kouskovac" ? 2.2 : 1.5} />
            <span className="text-[10px] font-medium">Chunker</span>
          </button>

          <button
            onClick={() => setActiveTab("rutiny")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
              activeTab === "rutiny" ? "text-amber-300" : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <ListTodo className="w-5 h-5" strokeWidth={activeTab === "rutiny" ? 2.2 : 1.5} />
            <span className="text-[10px] font-medium">Routines</span>
          </button>

          <button
            onClick={() => setActiveTab("klid")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
              activeTab === "klid" ? "text-teal-300" : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Volume2 className="w-5 h-5" strokeWidth={activeTab === "klid" ? 2.2 : 1.5} />
            <span className="text-[10px] font-medium">Calm</span>
          </button>

          <button
            onClick={() => setActiveTab("uspechy")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
              activeTab === "uspechy" ? "text-amber-300" : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Smile className="w-5 h-5" strokeWidth={activeTab === "uspechy" ? 2.2 : 1.5} />
            <span className="text-[10px] font-medium">Wins</span>
          </button>

          <button
            onClick={() => setActiveTab("bodydoubling")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
              activeTab === "bodydoubling" ? "text-teal-300" : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Users className="w-5 h-5" strokeWidth={activeTab === "bodydoubling" ? 2.2 : 1.5} />
            <span className="text-[10px] font-medium">Partner</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

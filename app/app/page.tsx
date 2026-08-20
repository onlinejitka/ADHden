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
  AlertCircle
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
  const [activeTab, setActiveTab] = useState<Tab>("timer");
  const [isPro, setIsPro] = useState<boolean>(true);

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
    async function requestWakeLock() {
      if (typeof window !== "undefined" && "wakeLock" in navigator && isTimerRunning) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
        } catch (err) {
          console.log("WakeLock:", err);
        }
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
      soundEngine?.playSuccessDing();
      confetti({ particleCount: 70, spread: 80 });
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
  // 2. KOUSKOVAČ ÚKOLŮ
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
      console.error(e);
      setErrorMessage("Nepodařilo se spojit se serverem.");
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
  // 3. RUTINY
  // =============================================================
  const [routineAudience, setRoutineAudience] = useState<"adults" | "kids">("adults");

  const [adultSections, setAdultSections] = useState<RoutineSection[]>([
    {
      id: "ad-morning",
      name: "Ranní start",
      icon: "☀️",
      items: [
        { id: "a1", text: "Vypít sklenici čisté vody", done: false },
        { id: "a2", text: "Vzít léky / ranní vitamíny", done: false },
        { id: "a3", text: "Zkontrolovat 1 hlavní cíl dne", done: false },
      ],
    },
    {
      id: "ad-evening",
      name: "Večerní klid",
      icon: "🌙",
      items: [
        { id: "a4", text: "Dát telefon nabíjet mimo postel", done: false },
        { id: "a5", text: "Připravit oblečení na zítra", done: false },
        { id: "a6", text: "5 minut klidného dýchání", done: false },
      ],
    },
    {
      id: "ad-cleaning",
      name: "Rychlý úklid",
      icon: "🧹",
      items: [
        { id: "a7", text: "Odnést hrnky a talíře do myčky", done: false },
        { id: "a8", text: "Vyhodit obaly a odpadky ze stolu", done: false },
        { id: "a9", text: "Srovnat polštáře a deku", done: false },
      ],
    },
    {
      id: "ad-work",
      name: "Pracovní fokus",
      icon: "💻",
      items: [
        { id: "a10", text: "Zavřít nepotřebné záložky", done: false },
        { id: "a11", text: "Nalít si čerstvý čaj / vodu", done: false },
        { id: "a12", text: "Spustit Time Timer na 25 min", done: false },
      ],
    },
  ]);

  const [kidsSections, setKidsSections] = useState<RoutineSection[]>([
    {
      id: "kd-morning",
      name: "Ranní odchod",
      icon: "🎒",
      items: [
        { id: "k1", text: "Vyčistit zoubky (2 minuty)", icon: "🪥", done: false },
        { id: "k2", text: "Obléknout kalhoty a ponožky", icon: "🧦", done: false },
        { id: "k3", text: "Dát lahvičku s pitím do batůžku", icon: "💧", done: false },
        { id: "k4", text: "Obout botičky u dveří", icon: "👟", done: false },
      ],
    },
    {
      id: "kd-playground",
      name: "Jdeme na hřiště",
      icon: "⚽",
      items: [
        { id: "k5", text: "Dojít si na záchod", icon: "🚽", done: false },
        { id: "k6", text: "Vzít čepici a pitíčko", icon: "🧢", done: false },
        { id: "k7", text: "Vybrat 1 hračku s sebou", icon: "🧸", done: false },
      ],
    },
    {
      id: "kd-home",
      name: "Návrat domů",
      icon: "🏡",
      items: [
        { id: "k8", text: "Zout boty a uklidit do botníku", icon: "👞", done: false },
        { id: "k9", text: "Čistě si umýt ruce mýdlem", icon: "🧼", done: false },
        { id: "k10", text: "Dát krabičku od svačiny do dřezu", icon: "🥪", done: false },
      ],
    },
    {
      id: "kd-evening",
      name: "Večerka & Zoubky",
      icon: "✨",
      items: [
        { id: "k11", text: "Obléknout pyžámko", icon: "👕", done: false },
        { id: "k12", text: "Důkladně vyčistit zoubky", icon: "🪥", done: false },
        { id: "k13", text: "Pohádka na dobrou noc", icon: "📖", done: false },
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
  // 4. KLIDOVÁ ZÓNA
  // =============================================================
  const [officialAudios] = useState([
    { id: "oa-brown", name: "Hnědý šum (Brown Noise)", desc: "Zklidnění nervové soustavy", type: "builtin-brown", free: true },
    { id: "oa-rain", name: "Klidný noční déšť", desc: "Monotónní zvuk kapek", type: "builtin-rain", free: true },
  ]);

  const [customAudios, setCustomAudios] = useState<CustomAudio[]>([]);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPro) return;
    if (customAudios.length >= 3) {
      alert("V PRO verzi můžete mít nahrané maximálně 3 vlastní skladby.");
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
      audioPlayerRef.current.play().catch((err) => console.log("Audio play error:", err));
      setActiveAudioId(id);
    }
  };

  // =============================================================
  // 5. DNEŠNÍ ÚSPĚCHY
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
      title: "Čištění zubů se mnou",
      desc: "2,5 minuty pro čisté zoubky s rytmickým doprovodem",
      time: 2.5,
      type: "audio",
      mediaUrl: "/Cisteni-zubu-Sunrise_on_the_Boulevard.mp3",
      free: true,
    },
    {
      id: "bd-desk",
      title: "Rychlý reset stolu",
      desc: "5 minut: odnést nádobí, vyhodit papíry, uklidit tužky",
      time: 5,
      type: "timer",
      free: true,
    },
    {
      id: "bd-stretch",
      title: "Společné protažení u stolu",
      desc: "3 minuty cviků na uvolnění krku a zad",
      time: 3,
      type: "video",
      free: true,
    },
    {
      id: "bd-laundry",
      title: "Skládání prádla bez odkládání",
      desc: "15 minut fokus se zklidňujícím rytmem",
      time: 15,
      type: "audio",
      mediaUrl: "/Skladani-pradla-Amber_Hours.mp3",
      free: false,
    },
    {
      id: "bd-mail",
      title: "Vyřízení 3 e-mailů",
      desc: "10 minut soustředěné práce",
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
          bodyDoublingAudioRef.current.play().catch((e) => console.log("Autoplay audio error:", e));
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
      soundEngine?.playSuccessDing();
      confetti({ particleCount: 80, spread: 90 });
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
    <div className="w-full min-h-screen bg-[#121214] text-zinc-200 flex justify-center tracking-wide font-sans leading-relaxed">
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#18181b] border-x border-zinc-800/80 shadow-2xl relative pb-28 p-6 space-y-6">
        {/* Skryté přehrávače */}
        <audio ref={audioPlayerRef} className="hidden" />
        <audio ref={bodyDoublingAudioRef} className="hidden" />

        {/* Hlavička aplikace s proklikem na úvod */}
        <header className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <Link href="/" className="group flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold tracking-wider text-amber-300 group-hover:text-amber-200 transition">
                ADHDen
              </h1>
              <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1 py-0.2 rounded font-mono">
                cz
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">Laskavý průvodce pro klidnou mysl</p>
          </Link>

          <button
            onClick={() => setIsPro(!isPro)}
            className={`text-[11px] px-3 py-1 rounded-full font-medium transition-all ${
              isPro
                ? "bg-amber-400/10 text-amber-300 border border-amber-400/30"
                : "bg-zinc-800 text-zinc-400 border border-zinc-700"
            }`}
          >
            {isPro ? "★ PRO Aktivní" : "FREE Režim"}
          </button>
        </header>

        {/* HLAVNÍ OBSAH */}
        <div className="flex-1 space-y-6">
          {/* ========================================================= */}
          {/* TAB 1: TIME TIMER */}
          {/* ========================================================= */}
          {activeTab === "timer" && (
            <div className="flex flex-col items-center justify-center space-y-6 py-2">
              <div className="relative w-64 h-64 rounded-full flex items-center justify-center p-2 bg-[#121214] border border-zinc-800">
                <div
                  className="w-full h-full rounded-full transition-all duration-1000 ease-linear flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `conic-gradient(${timerColor} ${pieDegrees}deg, #27272a 0deg)`,
                  }}
                >
                  <div className="w-36 h-36 rounded-full bg-[#18181b] border border-zinc-700/60 flex flex-col items-center justify-center z-10 text-center px-2">
                    <span className="text-4xl font-extrabold tracking-tight text-zinc-100">
                      {formatTime(secondsLeft)}
                    </span>
                    <span className="text-[11px] text-amber-300 font-medium mt-1.5 leading-tight">
                      {isTimerRunning ? "✨ Vnímej přítomnost" : "Pauza"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <button
                  onClick={toggleTimer}
                  className="w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold flex items-center justify-center transition active:scale-95 shadow-md shadow-amber-400/10"
                >
                  {isTimerRunning ? (
                    <Pause className="w-7 h-7" strokeWidth={1.75} />
                  ) : (
                    <Play className="w-7 h-7 ml-1" strokeWidth={1.75} />
                  )}
                </button>
                <button
                  onClick={() => resetTimer()}
                  className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center active:scale-95 transition border border-zinc-700/60"
                >
                  <RotateCcw className="w-5 h-5" strokeWidth={1.75} />
                </button>
              </div>

              <div className="flex gap-2">
                {[5, 10, 15, 25, 45].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      setTimerMinutes(mins);
                      resetTimer(mins);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      timerMinutes === mins
                        ? "bg-zinc-800 text-amber-300 border border-amber-400/40"
                        : "bg-zinc-800/40 text-zinc-400 border border-zinc-800 hover:bg-zinc-800"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              {/* VLASTNÍ ČAS */}
              {isPro ? (
                <div className="flex items-center gap-2 bg-zinc-800/40 border border-zinc-800 rounded-xl px-3.5 py-2">
                  <span className="text-xs text-amber-300 font-medium whitespace-nowrap">
                    ★ Vlastní čas (min):
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={customTimeMinutes}
                    onChange={(e) => setCustomTimeMinutes(e.target.value)}
                    placeholder="8"
                    className="w-14 bg-[#121214] border border-zinc-700 rounded px-2 py-1 text-xs text-amber-300 text-center focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={setCustomMinutesHandler}
                    disabled={!customTimeMinutes}
                    className="bg-amber-400 hover:bg-amber-300 disabled:opacity-30 text-zinc-950 font-bold px-2.5 py-1 rounded text-xs transition"
                  >
                    Uložit
                  </button>
                </div>
              ) : (
                <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" strokeWidth={1.75} /> Vlastní čas je v PRO
                </div>
              )}

              {/* ZVUKY V TIMERU */}
              <div className="w-full bg-zinc-800/30 border border-zinc-800 rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center justify-between text-xs font-medium text-zinc-300">
                  <span className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-teal-400" strokeWidth={1.75} /> Kulisa při odpočtu
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      setSoundtrack("brown");
                      if (isTimerRunning) soundEngine?.playBrownNoise();
                    }}
                    className={`py-2 text-xs rounded-lg transition ${
                      soundtrack === "brown"
                        ? "bg-teal-500/15 text-teal-300 border border-teal-500/40"
                        : "bg-zinc-800/60 text-zinc-400 border border-zinc-800"
                    }`}
                  >
                    Hnědý
                  </button>
                  <button
                    disabled={!isPro}
                    onClick={() => {
                      setSoundtrack("pink");
                      if (isTimerRunning) soundEngine?.playPinkNoise();
                    }}
                    className={`py-2 text-xs rounded-lg transition ${
                      soundtrack === "pink"
                        ? "bg-teal-500/15 text-teal-300 border border-teal-500/40"
                        : "bg-zinc-800/60 text-zinc-400 border border-zinc-800"
                    } ${!isPro && "opacity-40 cursor-not-allowed"}`}
                  >
                    Růžový
                  </button>
                  <button
                    disabled={!isPro}
                    onClick={() => {
                      setSoundtrack("rain");
                      if (isTimerRunning) soundEngine?.playRainNoise();
                    }}
                    className={`py-2 text-xs rounded-lg transition ${
                      soundtrack === "rain"
                        ? "bg-teal-500/15 text-teal-300 border border-teal-500/40"
                        : "bg-zinc-800/60 text-zinc-400 border border-zinc-800"
                    } ${!isPro && "opacity-40 cursor-not-allowed"}`}
                  >
                    Déšť
                  </button>
                  <button
                    onClick={() => {
                      setSoundtrack("none");
                      soundEngine?.stopNoise();
                    }}
                    className={`py-2 text-xs rounded-lg transition ${
                      soundtrack === "none"
                        ? "bg-zinc-700 text-zinc-200 border border-zinc-600"
                        : "bg-zinc-800/60 text-zinc-400 border border-zinc-800"
                    }`}
                  >
                    Ticho
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-zinc-400">Barva časovače:</span>
                  <div className="flex gap-2.5">
                    {["#fbbf24", "#2dd4bf", "#c084fc", "#f87171", "#38bdf8"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setTimerColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-5 h-5 rounded-full transition-all ${
                          timerColor === c ? "ring-2 ring-zinc-100 scale-110" : "opacity-50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: KOUSKOVAČ ÚKOLŮ */}
          {/* ========================================================= */}
          {activeTab === "kouskovac" && (
            <div className="space-y-5 py-1">
              <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <h2 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" strokeWidth={1.75} />
                  Kouskovač velkých úkolů
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Máte před sebou velký úkol, který vyvolává stres? Rozkouskujeme ho na malé, zvládnutelné kroky.
                </p>

                <textarea
                  value={rawTask}
                  onChange={(e) => setRawTask(e.target.value)}
                  placeholder="Napište úkol (např. Uklidit pracovní stůl)..."
                  rows={3}
                  className="w-full bg-[#121214] border border-zinc-700/80 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-400 resize-none"
                />

                {errorMessage && (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-xs text-rose-300">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span>Počet kroků:</span>
                    <select
                      value={customStepCount}
                      onChange={(e) => setCustomStepCount(Number(e.target.value))}
                      className="bg-[#121214] border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-purple-300 focus:outline-none"
                    >
                      <option value={3}>3 kroky</option>
                      <option value={5}>5 kroků</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleBreakdown(customStepCount)}
                    disabled={isLoadingSteps || !rawTask.trim()}
                    className="bg-purple-400 hover:bg-purple-300 disabled:opacity-40 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    {isLoadingSteps ? "Rozkládám..." : "Rozkouskovat"}
                  </button>
                </div>
              </div>

              {steps.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider px-1">
                    Jednotlivé kroky:
                  </h3>
                  {steps.map((step, idx) => {
                    const isDone = completedSteps.includes(idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStepDone(idx)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isDone
                            ? "bg-teal-950/20 border-teal-500/30 text-teal-300 line-through opacity-70"
                            : "bg-zinc-800/40 border-zinc-700/70 hover:border-purple-400/50 text-zinc-200"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                        ) : (
                          <Circle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                        )}
                        <span className="text-xs leading-relaxed font-medium">{step}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: RUTINY */}
          {/* ========================================================= */}
          {activeTab === "rutiny" && (
            <div className="space-y-4 py-1">
              <div className="flex bg-zinc-800/60 p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => {
                    setRoutineAudience("adults");
                    setActiveSectionId("ad-morning");
                  }}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition ${
                    routineAudience === "adults" ? "bg-zinc-700 text-amber-300" : "text-zinc-400"
                  }`}
                >
                  Pro dospělé
                </button>
                <button
                  onClick={() => {
                    setRoutineAudience("kids");
                    setActiveSectionId("kd-morning");
                  }}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition ${
                    routineAudience === "kids" ? "bg-zinc-700 text-teal-300" : "text-zinc-400"
                  }`}
                >
                  Pro děti (s ikonami)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {currentSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2.5 transition border ${
                      activeSectionId === sec.id
                        ? "bg-zinc-800 text-amber-300 border-amber-400/40"
                        : "bg-zinc-800/30 text-zinc-400 border-zinc-800 hover:bg-zinc-800/60"
                    }`}
                  >
                    <span className="text-base">{sec.icon}</span>
                    <span className="truncate">{sec.name}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2.5 pt-1">
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
                      <CheckCircle2 className="w-5 h-5 text-teal-400" strokeWidth={1.75} />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-600" strokeWidth={1.75} />
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Prvek do sekce <b>{currentActiveSection.name}</b>:</span>
                </div>

                {isPro ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRoutineText}
                      onChange={(e) => setNewRoutineText(e.target.value)}
                      placeholder="Přidat vlastní krok..."
                      className="flex-1 bg-[#121214] border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={addCustomRoutineItem}
                      disabled={!newRoutineText.trim()}
                      className="bg-amber-400 hover:bg-amber-300 disabled:opacity-30 text-zinc-950 px-3 py-2 rounded-xl text-xs font-bold transition"
                    >
                      <Plus className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-500 py-1">
                    🔒 Vlastní kroky jsou dostupné v členství PRO.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: KLIDOVÁ ZÓNA */}
          {/* ========================================================= */}
          {activeTab === "klid" && (
            <div className="space-y-4 py-1">
              <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-4 space-y-1">
                <h2 className="text-sm font-semibold text-teal-300 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-teal-400" strokeWidth={1.75} /> Zklidnění & Senzorické zvuky
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Monotónní zvuky pro úlevu od přetížení smyslů.
                </p>
              </div>

              <div className="space-y-2.5">
                {officialAudios.map((audio) => {
                  const isPlaying = activeAudioId === audio.id;
                  return (
                    <div key={audio.id} className="p-3.5 bg-zinc-800/40 border border-zinc-800 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-zinc-200">{audio.name}</div>
                        <div className="text-[11px] text-teal-400/80 mt-0.5">{audio.desc}</div>
                      </div>
                      <button
                        onClick={() => playAudioTrack(audio.id, audio.type, (audio as any).url)}
                        className={`px-3.5 py-1.5 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition ${
                          isPlaying ? "bg-teal-400 text-zinc-950" : "bg-zinc-700 hover:bg-zinc-600 text-zinc-200"
                        }`}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" strokeWidth={1.75} /> : <Play className="w-3.5 h-3.5" strokeWidth={1.75} />}
                        {isPlaying ? "Hraje" : "Přehrát"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* VLASTNÍ MP3 */}
              <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                      <Music className="w-4 h-4 text-teal-400" strokeWidth={1.75} /> Moje MP3 audia
                    </span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">
                      {isPro ? `Nahráno ${customAudios.length}/3 skladeb` : "🔒 Pouze v PRO"}
                    </span>
                  </div>

                  {isPro && (
                    <label
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                        customAudios.length >= 3
                          ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                          : "cursor-pointer bg-zinc-700 hover:bg-zinc-600 text-zinc-200"
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" strokeWidth={1.75} /> Nahrát
                      {customAudios.length < 3 && (
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioUpload}
                          className="hidden"
                        />
                      )}
                    </label>
                  )}
                </div>

                {customAudios.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-2">
                    Zatím nemáte uložena žádná vlastní MP3 audia.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {customAudios.map((track) => {
                      const isPlaying = activeAudioId === track.id;
                      return (
                        <div
                          key={track.id}
                          className="p-2.5 bg-[#121214] border border-zinc-800 rounded-lg flex items-center justify-between"
                        >
                          <span className="text-xs text-zinc-300 truncate max-w-[160px]">
                            🎵 {track.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => playAudioTrack(track.id, "custom", track.url)}
                              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                                isPlaying ? "bg-teal-400 text-zinc-950" : "bg-zinc-800 text-zinc-300"
                              }`}
                            >
                              {isPlaying ? <Pause className="w-3 h-3" strokeWidth={1.75} /> : <Play className="w-3 h-3" strokeWidth={1.75} />}
                            </button>
                            <button
                              onClick={() => deleteCustomAudio(track.id)}
                              className="p-1 text-zinc-500 hover:text-rose-400 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  soundEngine?.stopNoise();
                  if (audioPlayerRef.current) audioPlayerRef.current.pause();
                  setActiveAudioId(null);
                }}
                className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition"
              >
                <VolumeX className="w-4 h-4" strokeWidth={1.75} /> Zastavit přehrávání
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: DNEŠNÍ ÚSPĚCHY */}
          {/* ========================================================= */}
          {activeTab === "uspechy" && (
            <div className="space-y-4 py-1">
              <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-4 space-y-1">
                <h2 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-amber-400" strokeWidth={1.75} /> Dnešní laskavost k sobě
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Žádný tlak na výkon. Zaznamenejte si i ty nejmenší kroky, které jste dnes zvládli.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "water", label: "Dostatek vody", icon: "💧" },
                  { key: "food", label: "Výživné jídlo", icon: "🥪" },
                  { key: "rest", label: "Krátký odpočinek", icon: "🛋️" },
                  { key: "movement", label: "Protažení těla", icon: "🧘" },
                ].map((item) => {
                  const isChecked = wins[item.key as keyof typeof wins];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleWin(item.key as keyof typeof wins)}
                      className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition active:scale-95 ${
                        isChecked
                          ? "bg-amber-400/10 border-amber-400/40 text-amber-300"
                          : "bg-zinc-800/30 border-zinc-800 text-zinc-400 hover:bg-zinc-800/60"
                      }`}
                    >
                      <span className="text-3xl">{item.icon}</span>
                      <span className="text-xs font-medium text-center">{item.label}</span>
                      {isChecked && <span className="text-[10px] text-amber-300 font-bold">✓ Mám!</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: BODY DOUBLING */}
          {/* ========================================================= */}
          {activeTab === "bodydoubling" && (
            <div className="space-y-4 py-1">
              <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-4 space-y-1">
                <h2 className="text-sm font-semibold text-teal-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-400" strokeWidth={1.75} /> Tichý parťák
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Sdílený prostor pro soustředění bez mluvení a rozptylování.
                </p>
              </div>

              {activeSession ? (
                <div className="bg-zinc-800/50 border border-teal-500/30 rounded-2xl p-5 text-center flex flex-col items-center space-y-5">
                  <div className="text-xs text-teal-300 font-semibold tracking-wider uppercase">
                    {activeSession.title}
                  </div>

                  {activeSession.mediaUrl && activeSession.type === "video" && (
                    <video
                      src={activeSession.mediaUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full rounded-xl max-h-48 bg-black"
                    />
                  )}

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
                              ? "Ztlumeno"
                              : "Audio hraje"
                            : "Společně v akci"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 max-w-xs">{activeSession.desc}</p>

                  <div className="flex items-center gap-2.5">
                    {activeSession.mediaUrl && activeSession.type === "audio" && (
                      <button
                        onClick={toggleSessionAudio}
                        className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition ${
                          isSessionAudioMuted
                            ? "bg-zinc-700 text-amber-300 border border-amber-400/30"
                            : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
                        }`}
                      >
                        {isSessionAudioMuted ? <VolumeX className="w-4 h-4 text-amber-300" strokeWidth={1.75} /> : <Volume2 className="w-4 h-4 text-teal-300" strokeWidth={1.75} />}
                        {isSessionAudioMuted ? "Zapnout hudbu" : "Ztlumit"}
                      </button>
                    )}

                    <button
                      onClick={endSession}
                      className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-xs text-zinc-300 font-medium transition"
                    >
                      Ukončit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sessions.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-zinc-800/30 border border-zinc-800 rounded-xl flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-zinc-200">{item.title}</span>
                          {item.type === "audio" && (
                            <span className="bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[10px] px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                              <Music className="w-2.5 h-2.5" strokeWidth={1.75} /> Audio
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400">{item.desc}</div>
                      </div>
                      <button
                        disabled={!item.free && !isPro}
                        onClick={() => startSession(item)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                          item.free || isPro
                            ? "bg-teal-400 hover:bg-teal-300 text-zinc-950"
                            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        }`}
                      >
                        {item.free || isPro ? <Play className="w-3 h-3" strokeWidth={1.75} /> : <Lock className="w-3 h-3" strokeWidth={1.75} />}
                        Start
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* SPODNÍ NAVIGAČNÍ PANEL */}
        {/* ========================================================= */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#121214]/95 backdrop-blur-md border-t border-zinc-800/80 px-3 py-2.5 flex justify-around items-center z-50">
          <button
            onClick={() => setActiveTab("timer")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
              activeTab === "timer" ? "text-amber-300" : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Timer className="w-5 h-5" strokeWidth={activeTab === "timer" ? 2 : 1.5} />
            <span className="text-[10px] font-medium">Timer</span>
          </button>

          <button
            onClick={() => setActiveTab("kouskovac")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
              activeTab === "kouskovac" ? "text-purple-300" : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Sparkles className="w-5 h-5" strokeWidth={activeTab === "kouskovac" ? 2 : 1.5} />
            <span className="text-[10px] font-medium">Kouskovač</span>
          </button>

          <button
            onClick={() => setActiveTab("rutiny")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
              activeTab === "rutiny" ? "text-amber-300" : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <ListTodo className="w-5 h-5" strokeWidth={activeTab === "rutiny" ? 2 : 1.5} />
            <span className="text-[10px] font-medium">Rutiny</span>
          </button>

          <button
            onClick={() => setActiveTab("klid")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
              activeTab === "klid" ? "text-teal-300" : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Volume2 className="w-5 h-5" strokeWidth={activeTab === "klid" ? 2 : 1.5} />
            <span className="text-[10px] font-medium">Klid</span>
          </button>

          <button
            onClick={() => setActiveTab("uspechy")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
              activeTab === "uspechy" ? "text-amber-300" : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Smile className="w-5 h-5" strokeWidth={activeTab === "uspechy" ? 2 : 1.5} />
            <span className="text-[10px] font-medium">Úspěchy</span>
          </button>

          <button
            onClick={() => setActiveTab("bodydoubling")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition ${
              activeTab === "bodydoubling" ? "text-teal-300" : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Users className="w-5 h-5" strokeWidth={activeTab === "bodydoubling" ? 2 : 1.5} />
            <span className="text-[10px] font-medium">Parťák</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

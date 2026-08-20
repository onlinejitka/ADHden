"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Trash2
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
  time: number; // v minutách
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
  const [isPro, setIsPro] = useState<boolean>(true); // Výchozí pro testování všech funkcí

  // =============================================================
  // 1. VIZUÁLNÍ KOLÁČOVÝ TIME TIMER (Pie Chart) + BROWN NOISE
  // =============================================================
  const [timerMinutes, setTimerMinutes] = useState<number>(15);
  const [secondsLeft, setSecondsLeft] = useState<number>(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerColor, setTimerColor] = useState<string>("#F59E0B"); // Výchozí teplá oranžová
  const [soundtrack, setSoundtrack] = useState<"brown" | "pink" | "rain" | "none">("brown");
  const wakeLockRef = useRef<any>(null);

  // Screen Wake Lock API
  useEffect(() => {
    async function requestWakeLock() {
      if (typeof window !== "undefined" && "wakeLock" in navigator && isTimerRunning) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
        } catch (err) {
          console.log("WakeLock error:", err);
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
      if (soundtrack === "pink") soundEngine?.playPinkNoise();
      if (soundtrack === "rain") soundEngine?.playRainNoise();
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

  // Výpočet stupňů pro koláčový graf (0 až 360 deg)
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
  const [customStepCount, setCustomStepCount] = useState(3);

  const handleBreakdown = async (stepsCountToUse = 3) => {
    if (!rawTask.trim()) return;
    setIsLoadingSteps(true);
    setCompletedSteps([]);
    try {
      const res = await fetch("/api/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: rawTask, stepsCount: stepsCountToUse }),
      });
      const data = await res.json();
      if (data.steps) {
        setSteps(data.steps);
      }
    } catch (e) {
      console.error(e);
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
  // 3. RUTINY ROZDĚLENÉ DO SEKCÍ (Dospělí i Děti)
  // =============================================================
  const [routineAudience, setRoutineAudience] = useState<"adults" | "kids">("kids");

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
      name: "Večerní zklidnění",
      icon: "🌙",
      items: [
        { id: "a4", text: "Dát telefon nabíjet mimo postel", done: false },
        { id: "a5", text: "Připravit oblečení a klíče na zítra", done: false },
        { id: "a6", text: "5 minut klidného dýchání nebo čtení", done: false },
      ],
    },
    {
      id: "ad-cleaning",
      name: "Rychlý úklid & reset",
      icon: "🧹",
      items: [
        { id: "a7", text: "Odnést hrnky a talíře do myčky", done: false },
        { id: "a8", text: "Vyhodit odpadky a obaly ze stolu", done: false },
        { id: "a9", text: "Ustlat postel nebo srovnat polštáře", done: false },
      ],
    },
    {
      id: "ad-work",
      name: "Pracovní fokus",
      icon: "💻",
      items: [
        { id: "a10", text: "Zavřít zbytečné záložky v prohlížeči", done: false },
        { id: "a11", text: "Nalít si čerstvý čaj / vodu k práci", done: false },
        { id: "a12", text: "Spustit Time Timer na prvních 25 minut", done: false },
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
        { id: "k4", text: "Obout botičky a bundu u dveří", icon: "👟", done: false },
      ],
    },
    {
      id: "kd-playground",
      name: "Jdeme na hřiště / ven",
      icon: "⚽",
      items: [
        { id: "k5", text: "Dojít si na záchod", icon: "🚽", done: false },
        { id: "k6", text: "Vzít čepici / kšiltovku a pití", icon: "🧢", done: false },
        { id: "k7", text: "Vybrat 1 oblíbenou hračku s sebou", icon: "🧸", done: false },
      ],
    },
    {
      id: "kd-home",
      name: "Návrat domů",
      icon: "🏡",
      items: [
        { id: "k8", text: "Zout botičky a uklidit do botníku", icon: "👞", done: false },
        { id: "k9", text: "Uplně čistě si umýt ruce mýdlem", icon: "🧼", done: false },
        { id: "k10", text: "Vyndat krabičku od svačiny do dřezu", icon: "🥪", done: false },
      ],
    },
    {
      id: "kd-evening",
      name: "Večerka & Zoubky",
      icon: "✨",
      items: [
        { id: "k11", text: "Obléknout pyžámko", icon: "👕", done: false },
        { id: "k12", text: "Důkladně vyčistit zoubky", icon: "🪥", done: false },
        { id: "k13", text: "Pohádka na dobrou noc v postýlce", icon: "📖", done: false },
      ],
    },
  ]);

  const [activeSectionId, setActiveSectionId] = useState<string>("kd-morning");
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
    if (!newRoutineText.trim()) return;
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
  // 4. KLIDOVÁ ZÓNA + VLASTNÍ NAHRÁVKY
  // =============================================================
  const [customAudios, setCustomAudios] = useState<CustomAudio[]>([]);
  const [activeCustomAudio, setActiveCustomAudio] = useState<string | null>(null);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const playCustomAudio = (track: CustomAudio) => {
    soundEngine?.stopNoise();
    if (activeCustomAudio === track.id) {
      customAudioRef.current?.pause();
      setActiveCustomAudio(null);
    } else {
      if (customAudioRef.current) {
        customAudioRef.current.src = track.url;
        customAudioRef.current.loop = true;
        customAudioRef.current.play();
      }
      setActiveCustomAudio(track.id);
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
  // 6. BODY DOUBLING (S možností Audio / Video / Vlastních souborů)
  // =============================================================
  const [sessions, setSessions] = useState<BodyDoublingSession[]>([
    {
      id: "bd-teeth",
      title: "Čištění zubů se mnou",
      desc: "2 minuty pro čisté zoubky s rytmickým doprovodem",
      time: 2,
      type: "audio",
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
      desc: "15 minut fokus se zklidňujícím hlasem",
      time: 15,
      type: "audio",
      free: false,
    },
  ]);

  const [activeSession, setActiveSession] = useState<BodyDoublingSession | null>(null);
  const [sessionSecs, setSessionSecs] = useState<number>(0);
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [newSessionTime, setNewSessionTime] = useState(5);
  const [newSessionType, setNewSessionType] = useState<"timer" | "audio" | "video">("timer");
  const [newSessionMediaUrl, setNewSessionMediaUrl] = useState<string | undefined>(undefined);
  const sessionMediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);

  const startSession = (session: BodyDoublingSession) => {
    setActiveSession(session);
    setSessionSecs(session.time * 60);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeSession && sessionSecs > 0) {
      timer = setInterval(() => setSessionSecs((s) => s - 1), 1000);
    } else if (activeSession && sessionSecs === 0) {
      setActiveSession(null);
      soundEngine?.playSuccessDing();
      confetti({ particleCount: 80, spread: 90 });
    }
    return () => clearInterval(timer);
  }, [activeSession, sessionSecs]);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setNewSessionMediaUrl(url);
  };

  const addCustomSession = () => {
    if (!newSessionTitle.trim()) return;
    const newSess: BodyDoublingSession = {
      id: Date.now().toString(),
      title: newSessionTitle,
      desc: `Vlastní aktivita (${newSessionTime} min)`,
      time: newSessionTime,
      type: newSessionType,
      mediaUrl: newSessionMediaUrl,
      free: true,
    };
    setSessions([...sessions, newSess]);
    setNewSessionTitle("");
    setNewSessionMediaUrl(undefined);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="flex-1 flex flex-col p-4">
      {/* Audio element pro vlastní nahrávky */}
      <audio ref={customAudioRef} className="hidden" />

      {/* Hlavička */}
      <header className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
            Denní Knihovna
          </h1>
          <p className="text-xs text-slate-400">Laskavý systém pro klidný den</p>
        </div>
        <button
          onClick={() => setIsPro(!isPro)}
          className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 transition ${
            isPro
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "bg-slate-800 text-slate-400 border border-slate-700"
          }`}
        >
          {isPro ? "★ PRO Aktivní" : "FREE Režim"}
        </button>
      </header>

      {/* HLAVNÍ OBSAH */}
      <div className="flex-1">
        {/* ========================================================= */}
        {/* TAB 1: PLNOTUČNÝ KOLÁČOVÝ TIME TIMER */}
        {/* ========================================================= */}
        {activeTab === "timer" && (
          <div className="flex flex-col items-center justify-center space-y-6 py-3">
            {/* Vizuální disk (Koláčový ubývající diagram) */}
            <div className="relative w-64 h-64 rounded-full flex items-center justify-center shadow-2xl p-2 bg-slate-950 border border-slate-800">
              {/* Koláčový conic-gradient představující mizící čas */}
              <div
                className="w-full h-full rounded-full transition-all duration-1000 ease-linear flex items-center justify-center relative overflow-hidden"
                style={{
                  background: `conic-gradient(${timerColor} ${pieDegrees}deg, #1E293B 0deg)`,
                }}
              >
                {/* Vnitřní ciferník s časem */}
                <div className="w-36 h-36 rounded-full bg-slate-900/95 backdrop-blur-sm border border-slate-700/60 flex flex-col items-center justify-center shadow-inner z-10">
                  <span className="text-4xl font-extrabold tracking-tighter text-white">
                    {formatTime(secondsLeft)}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    {isTimerRunning ? "✨ Neusíná" : "Pauza"}
                  </span>
                </div>
              </div>
            </div>

            {/* Tlačítka Start / Reset */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTimer}
                className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-amber-500/20 active:scale-95 transition"
              >
                {isTimerRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </button>
              <button
                onClick={() => resetTimer()}
                className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center active:scale-95 transition"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Rychlé předvolby času */}
            <div className="flex gap-2">
              {[5, 10, 15, 25, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setTimerMinutes(mins);
                    resetTimer(mins);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    timerMinutes === mins
                      ? "bg-slate-700 text-amber-400 border border-amber-500/40"
                      : "bg-slate-800/60 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>

            {/* Zvukový podkres & Barva disku */}
            <div className="w-full bg-slate-800/40 border border-slate-800 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-amber-400" /> Zvukový šum během odpočtu
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => {
                    setSoundtrack("brown");
                    if (isTimerRunning) soundEngine?.playBrownNoise();
                  }}
                  className={`py-1.5 text-xs rounded-lg ${soundtrack === "brown" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-slate-800 text-slate-400"}`}
                >
                  Hnědý
                </button>
                <button
                  onClick={() => {
                    setSoundtrack("pink");
                    if (isTimerRunning) soundEngine?.playPinkNoise();
                  }}
                  className={`py-1.5 text-xs rounded-lg ${soundtrack === "pink" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-slate-800 text-slate-400"}`}
                >
                  Růžový
                </button>
                <button
                  onClick={() => {
                    setSoundtrack("rain");
                    if (isTimerRunning) soundEngine?.playRainNoise();
                  }}
                  className={`py-1.5 text-xs rounded-lg ${soundtrack === "rain" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-slate-800 text-slate-400"}`}
                >
                  Déšť
                </button>
                <button
                  onClick={() => {
                    setSoundtrack("none");
                    soundEngine?.stopNoise();
                  }}
                  className={`py-1.5 text-xs rounded-lg ${soundtrack === "none" ? "bg-slate-700 text-slate-200" : "bg-slate-800 text-slate-400"}`}
                >
                  Ticho
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">Barva disku:</span>
                <div className="flex gap-2">
                  {["#F59E0B", "#EF4444", "#38BDF8", "#10B981", "#A855F7"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setTimerColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-5 h-5 rounded-full transition ${timerColor === c ? "ring-2 ring-white scale-110" : "opacity-60"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CHYTRÝ KOUSKOVAČ ÚKOLŮ */}
        {/* ========================================================= */}
        {activeTab === "kouskovac" && (
          <div className="space-y-4 py-2">
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Rozpad úkolu na 3 hmatatelné mikro-kroky
              </h2>
              <p className="text-xs text-slate-400 mb-3">
                Zadejte cokoliv (např. *„dcera si musí uklidit stůl“*, *„musím napsat e-mail šéfovi“*).
              </p>

              <textarea
                value={rawTask}
                onChange={(e) => setRawTask(e.target.value)}
                placeholder="Napište úkol, se kterým je těžké začít..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-xs text-slate-300">
                  <span>Počet kroků:</span>
                  <select
                    value={customStepCount}
                    onChange={(e) => setCustomStepCount(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-amber-400"
                  >
                    <option value={3}>3 kroky</option>
                    <option value={5}>5 kroků</option>
                  </select>
                </div>

                <button
                  onClick={() => handleBreakdown(customStepCount)}
                  disabled={isLoadingSteps || !rawTask.trim()}
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 hover:opacity-90 disabled:opacity-50 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition"
                >
                  {isLoadingSteps ? "Rozpadám..." : "Rozkouskovat"}
                </button>
              </div>
            </div>

            {steps.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                  Konkrétní mikro-kroky:
                </h3>
                {steps.map((step, idx) => {
                  const isDone = completedSteps.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStepDone(idx)}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                        isDone
                          ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300 line-through opacity-75"
                          : "bg-slate-800/80 border-slate-700 hover:border-amber-500/50 text-slate-200"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
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
        {/* TAB 3: RUTINY ROZDĚLENÉ DO SEKCÍ */}
        {/* ========================================================= */}
        {activeTab === "rutiny" && (
          <div className="space-y-3 py-2">
            {/* Přepínač Pro dospělé / Pro děti */}
            <div className="flex bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => {
                  setRoutineAudience("kids");
                  setActiveSectionId("kd-morning");
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  routineAudience === "kids" ? "bg-slate-700 text-emerald-400 shadow" : "text-slate-400"
                }`}
              >
                Pro děti (Obrázky & Ikony)
              </button>
              <button
                onClick={() => {
                  setRoutineAudience("adults");
                  setActiveSectionId("ad-morning");
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  routineAudience === "adults" ? "bg-slate-700 text-sky-400 shadow" : "text-slate-400"
                }`}
              >
                Pro dospělé
              </button>
            </div>

            {/* Horizontální výběr sekcí/kategorií */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {currentSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition ${
                    activeSectionId === sec.id
                      ? "bg-slate-700 text-white border border-slate-600 shadow"
                      : "bg-slate-800/60 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <span>{sec.icon}</span>
                  <span>{sec.name}</span>
                </button>
              ))}
            </div>

            {/* Položky aktivní sekce */}
            <div className="space-y-2">
              {currentActiveSection.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleRoutineItem(item.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    item.done
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                      : "bg-slate-800/80 border-slate-700/80 text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <span className="text-2xl">{item.icon}</span>}
                    <span className={`text-xs font-medium ${item.done ? "line-through opacity-70" : ""}`}>
                      {item.text}
                    </span>
                  </div>
                  {item.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600" />
                  )}
                </div>
              ))}
            </div>

            {/* Přidání nového kroku do aktuální sekce */}
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="text-xs text-slate-300">
                Přidat krok do sekce <b>{currentActiveSection.name}</b>:
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRoutineText}
                  onChange={(e) => setNewRoutineText(e.target.value)}
                  placeholder="Např. Zkontrolovat bačkory..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                />
                <button
                  onClick={addCustomRoutineItem}
                  disabled={!newRoutineText.trim()}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: KLIDOVÁ ZÓNA + VLASTNÍ AUDIO NAHRÁVKY */}
        {/* ========================================================= */}
        {activeTab === "klid" && (
          <div className="space-y-4 py-2">
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-slate-200 mb-1 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-sky-400" /> Klidová zóna & Vlastní audio
              </h2>
              <p className="text-xs text-slate-400">
                Šumy generované přímo v mobilu + možnost nahrát si vlastní oblíbené MP3 soubory.
              </p>
            </div>

            {/* Zabudované šumy */}
            <div className="space-y-2">
              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">Hnědý šum (Brown Noise)</div>
                  <div className="text-[11px] text-emerald-400">Hluboké zklidnění mozku</div>
                </div>
                <button
                  onClick={() => soundEngine?.playBrownNoise(0.6)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" /> Přehrát
                </button>
              </div>

              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">Klidný noční déšť</div>
                  <div className="text-[11px] text-slate-400">Zvuk dešťových kapek</div>
                </div>
                <button
                  onClick={() => soundEngine?.playRainNoise(0.5)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg text-xs flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" /> Přehrát
                </button>
              </div>
            </div>

            {/* VLASTNÍ NAHRANÉ AUDIO */}
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-emerald-400" /> Moje vlastní nahrávky (MP3)
                </span>
                <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 px-2.5 py-1 rounded-lg text-[11px] text-slate-200 font-medium flex items-center gap-1">
                  <Upload className="w-3 h-3" /> Nahrát MP3
                  <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
                </label>
              </div>

              {customAudios.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-2">
                  Zatím jste nenahráli žádné vlastní audio. Klikněte na „Nahrát MP3“.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {customAudios.map((track) => (
                    <div
                      key={track.id}
                      className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between"
                    >
                      <span className="text-xs text-slate-300 truncate max-w-[180px]">
                        🎵 {track.name}
                      </span>
                      <button
                        onClick={() => playCustomAudio(track)}
                        className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                          activeCustomAudio === track.id
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {activeCustomAudio === track.id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        {activeCustomAudio === track.id ? "Hraje" : "Přehrát"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                soundEngine?.stopNoise();
                if (customAudioRef.current) customAudioRef.current.pause();
                setActiveCustomAudio(null);
              }}
              className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <VolumeX className="w-4 h-4" /> Zastavit veškerý zvuk
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: DNEŠNÍ ÚSPĚCHY */}
        {/* ========================================================= */}
        {activeTab === "uspechy" && (
          <div className="space-y-4 py-2">
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-slate-200 mb-1 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" /> Dnešní úspěchy
              </h2>
              <p className="text-xs text-slate-400">
                Bez výčitek a bez počítání. Jen radost z toho, co se povedlo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "water", label: "Pil/a jsem vodu", icon: "💧" },
                { key: "food", label: "Něco jsem snědl/a", icon: "🥪" },
                { key: "rest", label: "Odpočíval/a jsem", icon: "🛋️" },
                { key: "movement", label: "Trochu jsem se protáhl/a", icon: "🧘" },
              ].map((item) => {
                const isChecked = wins[item.key as keyof typeof wins];
                return (
                  <button
                    key={item.key}
                    onClick={() => toggleWin(item.key as keyof typeof wins)}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition active:scale-95 ${
                      isChecked
                        ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-300"
                    }`}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-xs font-semibold text-center">{item.label}</span>
                    {isChecked && <span className="text-[10px] text-emerald-400 font-bold">✓ Skvěle!</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: SPOLEČNÝ PARŤÁK (Body Doubling s Audio / Video štítky) */}
        {/* ========================================================= */}
        {activeTab === "bodydoubling" && (
          <div className="space-y-4 py-2">
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-slate-200 mb-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" /> Společný parťák (Body Doubling)
              </h2>
              <p className="text-xs text-slate-400">
                Pusťte si parťáka a dělejte činnost společně s ním.
              </p>
            </div>

            {activeSession ? (
              <div className="bg-slate-800 border border-emerald-500/40 rounded-2xl p-5 text-center space-y-4">
                <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  {activeSession.title}
                </div>

                {/* Přehrávač videa / audia pokud je přiloženo */}
                {activeSession.mediaUrl && activeSession.type === "video" && (
                  <video
                    src={activeSession.mediaUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full rounded-xl max-h-48 bg-black"
                  />
                )}
                {activeSession.mediaUrl && activeSession.type === "audio" && (
                  <audio
                    src={activeSession.mediaUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full mt-2"
                  />
                )}

                <div className="text-5xl font-extrabold text-white tracking-tight">
                  {formatTime(sessionSecs)}
                </div>
                <p className="text-xs text-slate-300">{activeSession.desc}</p>
                <button
                  onClick={() => setActiveSession(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs text-slate-300 font-medium"
                >
                  Ukončit aktivitu
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {sessions.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{item.title}</span>
                        {/* ŠTÍTKY (AUDIO / VIDEO / ČASOVAČ) */}
                        {item.type === "audio" && (
                          <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                            <Music className="w-2.5 h-2.5" /> Audio
                          </span>
                        )}
                        {item.type === "video" && (
                          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                            <VideoIcon className="w-2.5 h-2.5" /> Video
                          </span>
                        )}
                        {item.type === "timer" && (
                          <span className="bg-slate-700 text-slate-300 text-[10px] px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> Časovač
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => startSession(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                    >
                      <Play className="w-3 h-3" /> Start
                    </button>
                  </div>
                ))}

                {/* PŘIDÁNÍ VLASTNÍHO PARŤÁKA (S audiem/videem) */}
                <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3.5 space-y-2.5 mt-4">
                  <span className="text-xs font-semibold text-slate-200">
                    + Přidat vlastní aktivitu parťáka:
                  </span>
                  <input
                    type="text"
                    value={newSessionTitle}
                    onChange={(e) => setNewSessionTitle(e.target.value)}
                    placeholder="Název (např. Čtení knížky...)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newSessionTime}
                      onChange={(e) => setNewSessionTime(Number(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200"
                    >
                      <option value={2}>2 min</option>
                      <option value={5}>5 min</option>
                      <option value={10}>10 min</option>
                      <option value={15}>15 min</option>
                      <option value={25}>25 min</option>
                    </select>

                    <select
                      value={newSessionType}
                      onChange={(e) => setNewSessionType(e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200"
                    >
                      <option value="timer">Pouze časovač</option>
                      <option value="audio">Audio parťák</option>
                      <option value="video">Video parťák</option>
                    </select>

                    {newSessionType !== "timer" && (
                      <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded-lg text-xs text-slate-200 flex items-center gap-1">
                        <Upload className="w-3 h-3" /> Soubor
                        <input
                          type="file"
                          accept={newSessionType === "video" ? "video/*" : "audio/*"}
                          onChange={handleMediaUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <button
                    onClick={addCustomSession}
                    disabled={!newSessionTitle.trim()}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold py-1.5 rounded-lg text-xs transition"
                  >
                    Uložit nového parťáka
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SPODNÍ NAVIGAČNÍ PANEL */}
      {/* ========================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-2 py-2 flex justify-around items-center z-50">
        <button
          onClick={() => setActiveTab("timer")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === "timer" ? "text-amber-400" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Timer className="w-5 h-5" />
          <span className="text-[10px] font-medium">Timer</span>
        </button>

        <button
          onClick={() => setActiveTab("kouskovac")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === "kouskovac" ? "text-amber-400" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-medium">Kouskovač</span>
        </button>

        <button
          onClick={() => setActiveTab("rutiny")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === "rutiny" ? "text-amber-400" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <ListTodo className="w-5 h-5" />
          <span className="text-[10px] font-medium">Rutiny</span>
        </button>

        <button
          onClick={() => setActiveTab("klid")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === "klid" ? "text-amber-400" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-[10px] font-medium">Klid</span>
        </button>

        <button
          onClick={() => setActiveTab("uspechy")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === "uspechy" ? "text-amber-400" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Smile className="w-5 h-5" />
          <span className="text-[10px] font-medium">Úspěchy</span>
        </button>

        <button
          onClick={() => setActiveTab("bodydoubling")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === "bodydoubling" ? "text-amber-400" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium">Parťák</span>
        </button>
      </nav>
    </div>
  );
}

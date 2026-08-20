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
  Flame,
  VolumeX,
  Heart
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

export default function ADHDApp() {
  const [activeTab, setActiveTab] = useState<Tab>("timer");
  const [isPro, setIsPro] = useState<boolean>(false);

  // -------------------------------------------------------------
  // 1. TIME TIMER + BROWN NOISE + SCREEN WAKE LOCK
  // -------------------------------------------------------------
  const [timerMinutes, setTimerMinutes] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerColor, setTimerColor] = useState<string>("#38BDF8"); // Azurová, Oranžová, Zelená
  const [soundtrack, setSoundtrack] = useState<"brown" | "pink" | "rain" | "none">("brown");
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Žádost o udržení rozsvíceného displeje (Screen Wake Lock)
  useEffect(() => {
    async function requestWakeLock() {
      if ("wakeLock" in navigator && isTimerRunning) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        } catch (err) {
          console.log("WakeLock error:", err);
        }
      } else if (wakeLockRef.current && !isTimerRunning) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    }
    requestWakeLock();
  }, [isTimerRunning]);

  // Logika odpočtu a spuštění zvuku
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
      confetti({ particleCount: 60, spread: 70 });
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

  // -------------------------------------------------------------
  // 2. KOUSKOVAČ ÚKOLŮ (AI Task Breakdown)
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // 3. RUTINY PRO DOSPĚLÉ A DĚTI
  // -------------------------------------------------------------
  const [routineMode, setRoutineMode] = useState<"adults" | "kids">("adults");
  const [adultRoutines, setAdultRoutines] = useState<RoutineItem[]>([
    { id: "1", text: "Vypít sklenici čisté vody", done: false },
    { id: "2", text: "Zkontrolovat léky / vitamíny", done: false },
    { id: "3", text: "Zapsat 1 hlavní cíl dne", done: false },
    { id: "4", text: "Připravit klíče a telefon k odchodu", done: false },
  ]);

  const [kidsRoutines, setKidsRoutines] = useState<RoutineItem[]>([
    { id: "k1", text: "Vyčistit zoubky (2 minuty)", icon: "🪥", done: false },
    { id: "k2", text: "Obléknout ponožky a kalhoty", icon: "🧦", done: false },
    { id: "k3", text: "Dát lahvičku s pitím do batůžku", icon: "🎒", done: false },
    { id: "k4", text: "Obout botičky u dveří", icon: "👟", done: false },
  ]);

  const [newRoutineText, setNewRoutineText] = useState("");

  const toggleRoutine = (id: string, mode: "adults" | "kids") => {
    soundEngine?.playSuccessDing();
    if (mode === "adults") {
      setAdultRoutines(
        adultRoutines.map((r) => (r.id === id ? { ...r, done: !r.done } : r))
      );
    } else {
      setKidsRoutines(
        kidsRoutines.map((r) => (r.id === id ? { ...r, done: !r.done } : r))
      );
      confetti({ particleCount: 30, spread: 50 });
    }
  };

  const addCustomRoutine = () => {
    if (!newRoutineText.trim()) return;
    if (routineMode === "adults") {
      setAdultRoutines([
        ...adultRoutines,
        { id: Date.now().toString(), text: newRoutineText, done: false },
      ]);
    } else {
      setKidsRoutines([
        ...kidsRoutines,
        { id: Date.now().toString(), text: newRoutineText, icon: "⭐", done: false },
      ]);
    }
    setNewRoutineText("");
  };

  // -------------------------------------------------------------
  // 4. DNEŠNÍ ÚSPĚCHY (Shame-Free Tracker)
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // 5. BODY DOUBLING (Předtočení virtuální parťáci)
  // -------------------------------------------------------------
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionSecs, setSessionSecs] = useState<number>(0);

  const startBodyDoubling = (id: string, durationMin: number) => {
    setActiveSession(id);
    setSessionSecs(durationMin * 60);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeSession && sessionSecs > 0) {
      timer = setInterval(() => setSessionSecs((s) => s - 1), 1000);
    } else if (activeSession && sessionSecs === 0) {
      setActiveSession(null);
      soundEngine?.playSuccessDing();
      confetti({ particleCount: 70, spread: 80 });
    }
    return () => clearInterval(timer);
  }, [activeSession, sessionSecs]);

  // Formátovač času mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="flex-1 flex flex-col p-4">
      {/* Horní hlavička s přepínačem PRO režimu pro testování */}
      <header className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
            ADHD Focus & Flow
          </h1>
          <p className="text-xs text-slate-400">Laskavý systém bez pocitu viny</p>
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

      {/* HLAVNÍ OBSAH DLE ZÁLOŽEK */}
      <div className="flex-1">
        {/* ========================================================= */}
        {/* TAB 1: TIME TIMER + BROWN NOISE */}
        {/* ========================================================= */}
        {activeTab === "timer" && (
          <div className="flex flex-col items-center justify-center space-y-6 py-4">
            {/* Vizuální kruhový časovač */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  className="stroke-slate-800"
                  strokeWidth="16"
                  fill="transparent"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke={timerColor}
                  strokeWidth="16"
                  strokeDasharray={2 * Math.PI * 110}
                  strokeDashoffset={
                    2 * Math.PI * 110 * (1 - secondsLeft / (timerMinutes * 60))
                  }
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-extrabold tracking-tighter text-white">
                  {formatTime(secondsLeft)}
                </span>
                <span className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  {isTimerRunning ? "✨ Displej zůstane svítit" : "Připraven k akci"}
                </span>
              </div>
            </div>

            {/* Ovládání spuštění */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTimer}
                className="w-16 h-16 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-sky-500/20 active:scale-95 transition"
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

            {/* Předvolby času */}
            <div className="flex gap-2">
              {[5, 15, 25, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setTimerMinutes(mins);
                    resetTimer(mins);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    timerMinutes === mins
                      ? "bg-slate-700 text-sky-400 border border-sky-500/30"
                      : "bg-slate-800/60 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>

            {/* Placené nastavení: Změna barvy a zvukového podkresu */}
            <div className="w-full bg-slate-800/40 border border-slate-800 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-sky-400" /> Zvukový podkres při práci
                </span>
                {!isPro && <span className="text-[10px] text-amber-400 flex items-center gap-1"><Lock className="w-3 h-3" /> PRO rozšíření</span>}
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => {
                    setSoundtrack("brown");
                    if (isTimerRunning) soundEngine?.playBrownNoise();
                  }}
                  className={`py-1.5 text-xs rounded-lg ${soundtrack === "brown" ? "bg-sky-500/20 text-sky-300 border border-sky-500/40" : "bg-slate-800 text-slate-400"}`}
                >
                  Hnědý
                </button>
                <button
                  disabled={!isPro}
                  onClick={() => {
                    setSoundtrack("pink");
                    if (isTimerRunning) soundEngine?.playPinkNoise();
                  }}
                  className={`py-1.5 text-xs rounded-lg relative ${soundtrack === "pink" ? "bg-sky-500/20 text-sky-300 border border-sky-500/40" : "bg-slate-800 text-slate-400"} ${!isPro && "opacity-50"}`}
                >
                  Růžový {!isPro && "🔒"}
                </button>
                <button
                  disabled={!isPro}
                  onClick={() => {
                    setSoundtrack("rain");
                    if (isTimerRunning) soundEngine?.playRainNoise();
                  }}
                  className={`py-1.5 text-xs rounded-lg relative ${soundtrack === "rain" ? "bg-sky-500/20 text-sky-300 border border-sky-500/40" : "bg-slate-800 text-slate-400"} ${!isPro && "opacity-50"}`}
                >
                  Déšť {!isPro && "🔒"}
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

              {/* Barva timeru */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">Barva timeru:</span>
                <div className="flex gap-2">
                  {["#38BDF8", "#F59E0B", "#10B981"].map((c) => (
                    <button
                      key={c}
                      disabled={!isPro && c !== "#38BDF8"}
                      onClick={() => setTimerColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-5 h-5 rounded-full transition ${timerColor === c ? "ring-2 ring-white scale-110" : ""} ${!isPro && c !== "#38BDF8" ? "opacity-30 cursor-not-allowed" : ""}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: AI KOUSKOVAČ ÚKOLŮ */}
        {/* ========================================================= */}
        {activeTab === "kouskovac" && (
          <div className="space-y-4 py-2">
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Rozpad velkého úkolu na mikro-kroky
              </h2>
              <p className="text-xs text-slate-400 mb-3">
                Cítíš paralýzu? Napiš sem úkol a AI z něj udělá 3 snadné kroky.
              </p>

              <textarea
                value={rawTask}
                onChange={(e) => setRawTask(e.target.value)}
                placeholder="Např. Musím uklidit celý obývák a nevím kde začít..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 resize-none"
              />

              <div className="flex items-center justify-between mt-3">
                {isPro ? (
                  <div className="flex items-center gap-1 text-xs text-slate-300">
                    <span>Počet kroků:</span>
                    <select
                      value={customStepCount}
                      onChange={(e) => setCustomStepCount(Number(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-sky-400"
                    >
                      <option value={3}>3 kroky</option>
                      <option value={5}>5 kroků</option>
                      <option value={7}>7 kroků</option>
                    </select>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500">Free verze: fixně 3 kroky</span>
                )}

                <button
                  onClick={() => handleBreakdown(isPro ? customStepCount : 3)}
                  disabled={isLoadingSteps || !rawTask.trim()}
                  className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:opacity-90 disabled:opacity-50 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition"
                >
                  {isLoadingSteps ? "Kouskuji..." : "Rozkouskovat"}
                </button>
              </div>
            </div>

            {/* Zobrazení vygenerovaných kroků */}
            {steps.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                  Tvé 3 jednoduché kroky:
                </h3>
                {steps.map((step, idx) => {
                  const isDone = completedSteps.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStepDone(idx)}
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                        isDone
                          ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300 line-through opacity-75"
                          : "bg-slate-800/80 border-slate-700 hover:border-sky-500/50 text-slate-200"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-xs leading-relaxed">{step}</span>
                    </div>
                  );
                })}

                {isPro && (
                  <button
                    onClick={() => handleBreakdown(5)}
                    className="w-full py-2 border border-slate-700 hover:border-slate-600 rounded-lg text-xs text-sky-400 font-medium transition mt-2"
                  >
                    🔍 Rozkouskovat ještě víc do detailu (PRO)
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: RUTINY PRO DOSPĚLÉ A DĚTI */}
        {/* ========================================================= */}
        {activeTab === "rutiny" && (
          <div className="space-y-4 py-2">
            {/* Přepínač Dospělí / Děti */}
            <div className="flex bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setRoutineMode("adults")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  routineMode === "adults"
                    ? "bg-slate-700 text-sky-400 shadow"
                    : "text-slate-400"
                }`}
              >
                Pro dospělé (Text + checklist)
              </button>
              <button
                onClick={() => setRoutineMode("kids")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  routineMode === "kids"
                    ? "bg-slate-700 text-emerald-400 shadow"
                    : "text-slate-400"
                }`}
              >
                Pro děti (Obrázky + zvuk)
              </button>
            </div>

            {/* Seznam rutin */}
            <div className="space-y-2">
              {(routineMode === "adults" ? adultRoutines : kidsRoutines).map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleRoutine(item.id, routineMode)}
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

            {/* Tvorba vlastních rutin (Placená funkce) */}
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Přidat vlastní krok rutiny:</span>
                {!isPro && <span className="text-[10px] text-amber-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Pouze v PRO</span>}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  disabled={!isPro}
                  value={newRoutineText}
                  onChange={(e) => setNewRoutineText(e.target.value)}
                  placeholder={isPro ? "Např. Zkontrolovat svačinu..." : "Odemkněte pro vlastní rutiny"}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 disabled:opacity-50"
                />
                <button
                  disabled={!isPro || !newRoutineText.trim()}
                  onClick={addCustomRoutine}
                  className="bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: KLIDOVÁ ZÓNA (Audio) */}
        {/* ========================================================= */}
        {activeTab === "klid" && (
          <div className="space-y-4 py-2">
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-slate-200 mb-1 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-sky-400" /> Klidová zóna (Audio ve smyčce)
              </h2>
              <p className="text-xs text-slate-400">
                Funguje na pozadí i při vypnutém displeji. Šetří data.
              </p>
            </div>

            <div className="space-y-2">
              {/* Hnědý šum - ZDARMA */}
              <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">Hnědý šum (Brown Noise)</div>
                  <div className="text-[11px] text-emerald-400 font-medium">Zdarma • Bezešvá smyčka</div>
                </div>
                <button
                  onClick={() => soundEngine?.playBrownNoise(0.6)}
                  className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" /> Přehrát
                </button>
              </div>

              {/* Růžový šum - PRO */}
              <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">Růžový šum (Pink Noise)</div>
                  <div className="text-[11px] text-amber-400 font-medium">{isPro ? "Aktivní v PRO" : "🔒 Vyžaduje PRO"}</div>
                </div>
                <button
                  disabled={!isPro}
                  onClick={() => soundEngine?.playPinkNoise(0.5)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 font-bold rounded-lg text-xs flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" /> Přehrát
                </button>
              </div>

              {/* Dlouhé uklidňující 4h nahrávky - PRO */}
              <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">Noční déšť & Klid (4 hodiny)</div>
                  <div className="text-[11px] text-amber-400 font-medium">{isPro ? "Aktivní v PRO" : "🔒 Vyžaduje PRO"}</div>
                </div>
                <button
                  disabled={!isPro}
                  onClick={() => soundEngine?.playRainNoise(0.5)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 font-bold rounded-lg text-xs flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" /> Přehrát
                </button>
              </div>

              {/* Zastavení audia */}
              <button
                onClick={() => soundEngine?.stopNoise()}
                className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition mt-4"
              >
                <VolumeX className="w-4 h-4" /> Vypnout veškerý zvuk
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: DNEŠNÍ ÚSPĚCHY (Nízkotlaký tracker) */}
        {/* ========================================================= */}
        {activeTab === "uspechy" && (
          <div className="space-y-4 py-2">
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-slate-200 mb-1 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" /> Dnešní úspěchy (Bez výčitek)
              </h2>
              <p className="text-xs text-slate-400">
                Žádné počítání sklenic ani tresty za vynechání. Jen oslava toho, co se povedlo.
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
                    disabled={!isPro}
                    onClick={() => toggleWin(item.key as keyof typeof wins)}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition active:scale-95 ${
                      isChecked
                        ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-300"
                    } ${!isPro && "opacity-50 cursor-not-allowed"}`}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-xs font-semibold text-center">{item.label}</span>
                    {isChecked && <span className="text-[10px] text-emerald-400 font-bold">✓ Skvěle!</span>}
                  </button>
                );
              })}
            </div>

            {!isPro && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
                <p className="text-xs text-amber-300 font-medium">
                  🔒 Sledování úspěchů je součástí placené verze.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: BODY DOUBLING (Předtočení parťáci) */}
        {/* ========================================================= */}
        {activeTab === "bodydoubling" && (
          <div className="space-y-4 py-2">
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-slate-200 mb-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" /> Virtuální Body Doubling
              </h2>
              <p className="text-xs text-slate-400">
                Dělej to se mnou. Spustíme čas a zvládneme to společně.
              </p>
            </div>

            {activeSession ? (
              <div className="bg-slate-800 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-4">
                <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  Probíhá společná aktivita
                </div>
                <div className="text-5xl font-extrabold text-white">
                  {formatTime(sessionSecs)}
                </div>
                <p className="text-xs text-slate-300">
                  Soustřeď se pouze na tuto jednu věc. Jsem v tom s tebou.
                </p>
                <button
                  onClick={() => setActiveSession(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs text-slate-300 font-medium"
                >
                  Ukončit aktivitu
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {[
                  { id: "teeth", title: "Čištění zubů (2 min)", desc: "Společně od horních stoliček po přední", time: 2, free: true },
                  { id: "desk", title: "Rychlý úklid stolu (5 min)", desc: "Dát pryč hrnky, papíry a vytvořit prostor", time: 5, free: true },
                  { id: "stretch", title: "Protáhni se (3 min)", desc: "Uvolnění krku a ramen od sezení", time: 3, free: true },
                  { id: "laundry", title: "Skládání prádla (15 min)", desc: "Společné skládání bez odkládání", time: 15, free: false },
                  { id: "inbox", title: "Vyčištění e-mailů (10 min)", desc: "Odpovědět na 3 nejdůležitější zprávy", time: 10, free: false },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">{item.title}</div>
                      <div className="text-[11px] text-slate-400">{item.desc}</div>
                    </div>
                    <button
                      disabled={!item.free && !isPro}
                      onClick={() => startBodyDoubling(item.id, item.time)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                        item.free || isPro
                          ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                          : "bg-slate-700 text-slate-400 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {item.free || isPro ? <Play className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
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
      {/* SPODNÍ NAVIGAČNÍ PANEL (Fixed Bottom Bar) */}
      {/* ========================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-2 py-2 flex justify-around items-center z-50">
        <button
          onClick={() => setActiveTab("timer")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === "timer" ? "text-sky-400" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Timer className="w-5 h-5" />
          <span className="text-[10px] font-medium">Timer</span>
        </button>

        <button
          onClick={() => setActiveTab("kouskovac")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === "kouskovac" ? "text-sky-400" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-medium">Kouskovač</span>
        </button>

        <button
          onClick={() => setActiveTab("rutiny")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === "rutiny" ? "text-sky-400" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <ListTodo className="w-5 h-5" />
          <span className="text-[10px] font-medium">Rutiny</span>
        </button>

        <button
          onClick={() => setActiveTab("klid")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === "klid" ? "text-sky-400" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-[10px] font-medium">Klid</span>
        </button>

        <button
          onClick={() => setActiveTab("uspechy")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === "uspechy" ? "text-sky-400" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Smile className="w-5 h-5" />
          <span className="text-[10px] font-medium">Úspěchy</span>
        </button>

        <button
          onClick={() => setActiveTab("bodydoubling")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === "bodydoubling" ? "text-sky-400" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium">Parťák</span>
        </button>
      </nav>
    </div>
  );
}

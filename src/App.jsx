import { useMemo, useState, useEffect, useRef } from "react";
import movementKnowledge from "../knowledge/figure_skating_knowledge.json";
import pageBackground from "../abstract-wave-trendy-geometric-abstract-background-with-white-and-blue-gradient-vector.jpg";
import brandLogo from "../skatesync-logo-Photoroom.png";
import landingFigure from "../skatesync-landing.png";
import { 
  dbRegister, 
  dbLogin, 
  dbLogout, 
  subscribeToAuth, 
  dbUpdateProfile, 
  dbSaveMusicAnalysis, 
  dbGetMusicAnalyses, 
  dbSaveVideoAnalysis, 
  dbGetVideoAnalyses,
  isFirebaseConfigured
} from "./firebase";


const movementPreview = ["Axel", "Sit Spin", "Camel Spin", "Spiral", "Final Pose"];

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 flex-none">
      <path
        fill="#4285F4"
        d="M21.81 12.23c0-.72-.06-1.25-.19-1.8H12.2v3.56h5.53c-.11.88-.7 2.2-2.01 3.09l-.02.12 2.84 2.2.2.02c1.85-1.71 2.91-4.22 2.91-7.19Z"
      />
      <path
        fill="#34A853"
        d="M12.2 22c2.71 0 4.98-.89 6.64-2.41l-3.02-2.34c-.81.57-1.89.96-3.62.96-2.65 0-4.9-1.75-5.7-4.16l-.12.01-2.95 2.29-.04.11A10.03 10.03 0 0 0 12.2 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.5 14.05a6.06 6.06 0 0 1-.33-2.01c0-.7.12-1.37.32-2.01l-.01-.13-2.99-2.32-.1.05A9.98 9.98 0 0 0 2.3 12c0 1.6.38 3.11 1.09 4.46l3.11-2.41Z"
      />
      <path
        fill="#EA4335"
        d="M12.2 5.79c2.18 0 3.65.94 4.48 1.73l3.27-3.19C17.17 1.74 14.91 1 12.2 1a9.98 9.98 0 0 0-8.81 5.53L6.5 8.94c.81-2.41 3.06-4.15 5.7-4.15Z"
      />
    </svg>
  );
}

function PasswordIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-slate-500">
      <path
        d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function LogoMark({ theme = "light" }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center sm:h-[5.5rem] sm:w-[5.5rem]">
        <img
          src={brandLogo}
          alt="SkateSync AI logo"
          className="h-full w-full object-contain object-center scale-[2.8] drop-shadow-sm"
        />
      </div>
      <div className="min-w-0">
        <p className={`font-display text-[1.55rem] font-semibold leading-none sm:text-[1.8rem] ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
          SkateSync AI
        </p>
        <p className={`mt-2 text-[0.68rem] uppercase tracking-[0.42em] sm:text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-400"}`}>
          Precision in Motion
        </p>
      </div>
    </div>
  );
}

function TopBar({ onNavigate, theme = "light", activeUser, onLogout }) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
      <LogoMark theme={theme} />
      <div className="flex items-center gap-3">
        {activeUser ? (
          <>
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border ${
              theme === "dark"
                ? "border-slate-700 bg-slate-800/50 text-slate-300"
                : "border-sky-100 bg-sky-50/50 text-slate-700"
            }`}>
              <div className="h-6.5 w-6.5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold">
                {activeUser.displayName ? activeUser.displayName[0].toUpperCase() : "S"}
              </div>
              <span className="text-xs font-semibold">{activeUser.displayName || "Sporcu"}</span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className={`inline-flex h-11 items-center justify-center rounded-2xl border px-5 text-sm font-semibold transition ${
                theme === "dark"
                  ? "border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              Çıkış
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className={`inline-flex h-11 items-center justify-center rounded-2xl border px-5 text-sm font-semibold transition ${
                theme === "dark"
                  ? "border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-sky-50"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => onNavigate("overview")}
              className={`inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition ${
                theme === "dark"
                  ? "bg-slate-100 text-slate-900 hover:bg-white"
                  : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </header>
  );
}


function LoginPanel({ onSuccess, activeUser, setActiveUser }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [skateChoice, setSkateChoice] = useState("edea");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          throw new Error("Lütfen bir sporcu adı girin.");
        }
        const user = await dbRegister(email, password, displayName, skateChoice);
        setActiveUser(user);
      } else {
        const user = await dbLogin(email, password);
        setActiveUser(user);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      let errMsg = "İşlem sırasında hata oluştu.";
      if (err.message === "auth/email-already-in-use" || err.code === "auth/email-already-in-use") {
        errMsg = "Bu e-posta adresi zaten kullanımda.";
      } else if (err.message === "auth/wrong-password-or-user-not-found" || err.code === "auth/wrong-password") {
        errMsg = "E-posta veya şifre hatalı.";
      } else if (err.code === "auth/invalid-email") {
        errMsg = "Geçersiz e-posta adresi.";
      } else if (err.code === "auth/weak-password") {
        errMsg = "Şifre en az 6 karakter olmalıdır.";
      } else {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-3 text-center lg:text-left">
        <h1 className="font-display text-[2rem] font-semibold tracking-tight text-slate-900">
          {isSignUp ? "Rostere Katıl" : "SkateSync AI Giriş"}
        </h1>
        <p className="max-w-sm text-base leading-7 text-slate-500">
          {isSignUp 
            ? "Kendi hareket dağarcığınızı kaydedin ve otonom koç feedback raporlarına erişin" 
            : "Müzik algılamalı koreografi planlayıcı ve yapay zeka destekli paten antrenörü"}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600 animate-rise">
          ⚠️ {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {isSignUp && (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-500">Sporcu Adı Soyadı</span>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Örn: Derin Yıldız"
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-base text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </label>
          )}

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-500">E-Posta Adresi</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@skatesync.ai"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-base text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
            />
          </label>

          {isSignUp && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500 block">Buz Pateni Seçimi</label>
              <select
                value={skateChoice}
                onChange={(e) => setSkateChoice(e.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
              >
                <option value="edea">Edeal Ice Fly + Gold Seal</option>
                <option value="jackson">Jackson Premiere + MK Pro</option>
                <option value="riedell">Riedell Royal + Eclipse Titanium</option>
              </select>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-slate-500">Şifre</label>
              {!isSignUp && (
                <button type="button" className="text-sm font-medium text-teal-600 transition hover:text-teal-500">
                  Şifremi Unuttum?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 pr-14 text-base text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <PasswordIcon />
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`flex h-16 w-full items-center justify-center rounded-2xl bg-slate-800 text-[1.05rem] font-semibold text-white transition hover:bg-slate-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Lütfen bekleyin..." : (isSignUp ? "Kaydol & Giriş Yap" : "Giriş Yap")}
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm font-medium text-slate-400">VEYA</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-lg font-medium text-slate-900 transition hover:bg-slate-50"
          >
            <GoogleMark />
            Google ile devam et
          </button>
        </div>
      </form>

      <div className="pt-6 text-center">
        <p className="text-base text-slate-500">
          {isSignUp ? "Zaten bir hesabınız var mı? " : "Henüz bir hesabınız yok mu? "}
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-semibold text-teal-600 transition hover:text-teal-500"
          >
            {isSignUp ? "Giriş Yap" : "Rostere Katıl"}
          </button>
        </p>
      </div>
    </div>
  );
}

function LoginScreen({ onNavigate, activeUser, setActiveUser }) {
  return (
    <div
      className="min-h-screen bg-[#fbfbfb] bg-cover bg-center px-4 py-4 sm:px-6 sm:py-6"
      style={{
        backgroundImage: `linear-gradient(rgba(251,251,251,0.92), rgba(248,251,253,0.95)), url("${pageBackground}")`,
      }}
    >
      <div className="mx-auto grid min-h-[700px] w-full max-w-[1560px] overflow-hidden rounded-[28px] bg-white shadow-[0_28px_80px_rgba(15,23,42,0.12)] lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-[#f8fbfc] lg:block">
          <img
            src="/login-background.png"
            alt="Figure and flow abstract graphic"
            className="absolute inset-0 h-full w-full object-cover opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent" />
          <div className="absolute bottom-12 left-12">
            <p className="text-[2rem] font-semibold tracking-[0.35em] text-slate-400/70">
              PRECISION IN MOTION
            </p>
          </div>
        </div>

        <div className="relative flex flex-col justify-center bg-white px-8 py-14 sm:px-10 lg:px-24">
          <button
            type="button"
            onClick={() => onNavigate("landing")}
            className="absolute left-6 top-6 inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-slate-700"
          >
            Back
          </button>
          <LoginPanel onSuccess={() => onNavigate("overview")} activeUser={activeUser} setActiveUser={setActiveUser} />
          <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-teal-50" />
        </div>
      </div>

      <div className="pt-8 text-center text-sm text-slate-300">
        © 2024 SKATESYNC AI. PRECISION IN MOTION.
      </div>
    </div>
  );
}


function LandingScreen({ onNavigate, activeUser, handleLogout }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(246,250,252,0.95) 100%), url("${pageBackground}")`,
      }}
    >
      <TopBar onNavigate={onNavigate} activeUser={activeUser} onLogout={handleLogout} />


      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-14 pt-4 sm:px-6 lg:gap-14 lg:pb-20 lg:pt-8">
        <section className="grid items-center gap-8 rounded-[32px] border border-slate-100 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
          <div className="relative min-h-[320px] overflow-hidden rounded-[28px] border border-sky-100/80 bg-[linear-gradient(145deg,_#eef8fc_0%,_#f8fcfe_48%,_#e7f4fb_100%)] sm:min-h-[380px]">
            <div className="absolute left-[-10%] top-[-15%] h-44 w-44 rounded-full bg-sky-200/45 blur-3xl" />
            <div className="absolute bottom-[-20%] right-[-5%] h-52 w-52 rounded-full bg-cyan-200/40 blur-3xl" />
            <img
              src="/login-background.png"
              alt="SkateSync AI abstract motion background"
              className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-screen"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,_rgba(255,255,255,0.96)_0%,_rgba(255,255,255,0.68)_38%,_rgba(240,249,255,0.18)_100%)]" />
            <div className="absolute inset-y-0 right-0 w-[58%] bg-gradient-to-l from-sky-100/35 to-transparent" />

            <div className="absolute inset-x-6 top-6 z-30 flex items-start justify-between">
              <div className="rounded-full border border-white/80 bg-white/65 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-sky-700/80 shadow-[0_10px_24px_rgba(56,189,248,0.1)] backdrop-blur">
                Precision in motion
              </div>
            </div>
            
            <div className="absolute inset-0 z-10 flex items-center justify-start pt-8">
              <img
                src={landingFigure}
                alt="Figure skater in motion"
                className="h-[94%] max-h-[460px] w-auto object-contain -translate-x-8 sm:-translate-x-16 drop-shadow-[0_24px_40px_rgba(14,116,144,0.22)]"
              />
            </div>
            
            <div className="absolute bottom-6 right-[6%] z-30 flex w-[48%] max-w-[260px] flex-col justify-end">
              <div className="hidden w-full rounded-[26px] border border-white/75 bg-white/52 px-5 py-4 shadow-[0_20px_40px_rgba(14,116,144,0.08)] backdrop-blur-md sm:block mb-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Figure study
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Elegant balance, clean lines, and a lighter visual rhythm.
                </p>
              </div>
              <h2 className="font-display text-[2.75rem] font-bold leading-[1.05] tracking-tight text-slate-900 drop-shadow-sm sm:text-[3rem]">
                Figure &<br />Flow
              </h2>
            </div>
          </div>

          <div className="px-1 py-2 sm:px-4">
            <p className="text-sm font-medium uppercase tracking-[0.26em] text-slate-400">
              SkateSync AI
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              A simple AI assistant for music-first skating practice.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-500">
              Plan your routine around the music, keep movement names consistent, and
              review training sessions without a complicated interface.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate("overview")}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-800 px-6 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Get Started
              </button>
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
              >
                Login
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Music planning", "AI reads the shape of the track."],
                ["Clear vocabulary", "Athletes see familiar movement names."],
                ["Simple review", "Fast feedback after each session."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Upload music",
              text: "Start with the track you already train with.",
            },
            {
              title: "Get a plan",
              text: "See a clean movement route matched to musical moments.",
            },
            {
              title: "Review the skate",
              text: "Compare the session video against the planned timing.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
              <p className="text-lg font-semibold text-slate-900">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-500">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[32px] border border-slate-100 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-slate-900">Simple, transparent pricing</h2>
            <p className="mt-3 text-base text-slate-500">Pick a plan that fits your training volume.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                desc: "Basic movement catalog & daily plan.",
                features: ["Up to 3 plans/month", "Standard timing feedback", "Movement catalog access"],
                btnText: "Start for free",
                btnStyle: "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              },
              {
                name: "Standard",
                price: "$20",
                desc: "Perfect for daily routines.",
                features: ["Unlimited fast reviews", "Low latency scoring", "Basic voice coaching"],
                btnText: "Get Standard",
                btnStyle: "bg-slate-800 text-white hover:bg-slate-700",
                highlight: true
              },
              {
                name: "Pro Coach",
                price: "$50",
                desc: "Detailed, high-quality analysis.",
                features: ["Detailed coach-style reviews", "High quality (more frames)", "Scrolling lyrics sync"],
                btnText: "Get Pro",
                btnStyle: "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }
            ].map((plan) => (
              <div key={plan.name} className={`flex flex-col rounded-[24px] p-6 ${plan.highlight ? 'border-2 border-slate-800 bg-slate-50/50' : 'border border-slate-100 bg-white shadow-sm'}`}>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{plan.name}</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">{plan.price}</span>
                  <span className="text-sm font-medium text-slate-500">/month</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-500">{plan.desc}</p>
                <ul className="mt-6 flex-1 space-y-4 text-sm text-slate-600">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="mt-[2px] h-4 w-4 text-slate-800 shrink-0"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button type="button" className={`mt-8 w-full h-12 rounded-2xl px-4 text-sm font-semibold transition ${plan.btnStyle}`}>
                  {plan.btnText}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function OverviewScreen({ onNavigate, activeUser, handleLogout }) {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile States
  const [athleteName, setAthleteName] = useState(activeUser?.displayName || "Derin Yıldız");
  const [selectedMovements, setSelectedMovements] = useState(activeUser?.selectedMovements || ["Axel", "Salchow", "Camel Spin", "Spiral", "Twizzle", "Final Pose"]);
  const [skateChoice, setSkateChoice] = useState(activeUser?.skateChoice || "edea");
  const [showProfileToast, setShowProfileToast] = useState(false);

  // History States
  const [musicHistory, setMusicHistory] = useState([]);
  const [videoHistory, setVideoHistory] = useState([]);

  // Music States
  const [isMusicUploading, setIsMusicUploading] = useState(false);
  const [isMusicUploaded, setIsMusicUploaded] = useState(false);
  const [uploadedMusicName, setUploadedMusicName] = useState("");
  const [targetScore, setTargetScore] = useState(80);
  const [isPlanGenerating, setIsPlanGenerating] = useState(false);
  const [isPlanGenerated, setIsPlanGenerated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const [checkedMovements, setCheckedMovements] = useState({
    "Axel": true, "Salchow": true, "Loop": true, "Toe Loop": true, "Flip": false, "Lutz": false,
    "Sit Spin": true, "Camel Spin": true, "Upright Spin": true, "Scratch Spin": false, "Layback Spin": false, "Biellmann": false,
    "Three Turns": true, "Bracket": false, "Rocker and Counter": false, "Mohawk": true, "Twizzle": true,
    "Spiral": true, "Ina Bauer": true, "Spread Eagle": false, "Lunge": true, "Cantilever": false, "Final Pose": true
  });

  // Video States
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [reviewMode, setReviewMode] = useState("Fast");
  const [detailedCommentary, setDetailedCommentary] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisFinished, setIsAnalysisFinished] = useState(false);

  // Sync active user details on change
  useEffect(() => {
    if (activeUser) {
      setAthleteName(activeUser.displayName || "Derin Yıldız");
      setSkateChoice(activeUser.skateChoice || "edea");
      const movements = activeUser.selectedMovements || ["Axel", "Salchow", "Camel Spin", "Spiral", "Twizzle", "Final Pose"];
      setSelectedMovements(movements);
      
      // Update checkmarks to match
      setCheckedMovements((prev) => {
        const nextChecked = { ...prev };
        Object.keys(nextChecked).forEach((k) => {
          nextChecked[k] = movements.includes(k);
        });
        return nextChecked;
      });

      // Load histories
      dbGetMusicAnalyses(activeUser.uid).then(setMusicHistory).catch(console.error);
      dbGetVideoAnalyses(activeUser.uid).then(setVideoHistory).catch(console.error);
    }
  }, [activeUser]);

  // Playback timer for wave player & scrolling sync cues
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayTime((prev) => {
          if (prev >= 110) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 500); // 1 tick = ~1 second (simulated faster playback)
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle Profile Save
  const handleSaveProfile = async () => {
    if (activeUser) {
      try {
        await dbUpdateProfile(activeUser.uid, {
          displayName: athleteName,
          skateChoice: skateChoice,
          selectedMovements: selectedMovements
        });
        setShowProfileToast(true);
        setTimeout(() => setShowProfileToast(false), 3000);
      } catch (err) {
        console.error("Profile save error:", err);
      }
    } else {
      setShowProfileToast(true);
      setTimeout(() => setShowProfileToast(false), 3000);
    }
  };

  // Handle Music Upload Simulation
  const handleMusicUploadSimulate = () => {
    setIsMusicUploading(true);
    setTimeout(() => {
      setIsMusicUploading(false);
      setIsMusicUploaded(true);
      setUploadedMusicName("swan_lake_climax_edit.mp3");
    }, 1500);
  };

  // Handle Plan Generation Simulation
  const handleGeneratePlanSimulate = async () => {
    setIsPlanGenerating(true);
    setTimeout(async () => {
      setIsPlanGenerating(false);
      setIsPlanGenerated(true);
      
      if (activeUser) {
        try {
          const newChoreo = {
            title: uploadedMusicName ? uploadedMusicName.replace(".mp3", "") : "swan_lake_climax_edit",
            bpm: "128 BPM",
            elCount: `${selectedMovements.length} hareket`,
            movements: selectedMovements
          };
          const saved = await dbSaveMusicAnalysis(activeUser.uid, newChoreo);
          setMusicHistory((prev) => [saved, ...prev]);
        } catch (err) {
          console.error("Error persisting generated program:", err);
        }
      }
    }, 1500);
  };

  // Handle Video Upload Simulation
  const handleVideoUploadSimulate = () => {
    setIsVideoUploading(true);
    setTimeout(() => {
      setIsVideoUploading(false);
      setIsVideoUploaded(true);
    }, 1800);
  };

  // Handle Video Analysis Simulation
  const handleStartAnalysisSimulate = async () => {
    setIsAnalyzing(true);
    setTimeout(async () => {
      setIsAnalyzing(false);
      setIsAnalysisFinished(true);
      
      if (activeUser) {
        try {
          const newAnalysis = {
            date: new Date().toLocaleDateString("tr-TR"),
            track: uploadedMusicName ? uploadedMusicName.replace(".mp3", "") : "Swan Lake Climax",
            score: "94%",
            grade: "A"
          };
          const saved = await dbSaveVideoAnalysis(activeUser.uid, newAnalysis);
          setVideoHistory((prev) => [saved, ...prev]);
        } catch (err) {
          console.error("Error persisting video analysis:", err);
        }
      }
    }, 2000);
  };


  // Mock catalog data
  const movementCategories = [
    { 
      name: "Jumps", 
      items: [
        { name: "Axel", desc: "Edge jump starting forward, extra half rotation in the air." },
        { name: "Salchow", desc: "Takeoff from back inside edge of one foot, land on back outside of the other." },
        { name: "Loop", desc: "Takeoff from back outside edge, landing on back outside edge." },
        { name: "Toe Loop", desc: "Toe-assisted jump taking off from back outside edge." },
        { name: "Flip", desc: "Toe-assisted jump from back inside edge with outer edge entry." },
        { name: "Lutz", desc: "Counter-rotated toe jump taking off from back outside edge." }
      ] 
    },
    { 
      name: "Spins", 
      items: [
        { name: "Sit Spin", desc: "Spin performed in a deep squat position with free leg extended." },
        { name: "Camel Spin", desc: "Spin performed with the body in an airplane (spiral) posture." },
        { name: "Upright Spin", desc: "Classic vertical spin, includes variations like layback." },
        { name: "Scratch Spin", desc: "Fast upright spin crossing the free leg in front." },
        { name: "Layback Spin", desc: "Upright spin where head and shoulders lean backward." },
        { name: "Biellmann", desc: "Exquisite spin grabbing the blade and pulling it overhead." }
      ] 
    },
    { 
      name: "Step & Turn", 
      items: [
        { name: "Three Turns", desc: "One-foot turn changing edge and direction, resembling a '3'." },
        { name: "Bracket", desc: "Difficult one-foot turn with the cusp pointing outward." },
        { name: "Rocker & Counter", desc: "Body rotation turn maintaining or reversing circular trajectory." },
        { name: "Mohawk", desc: "Two-foot turn changing foot but maintaining the edge style." },
        { name: "Twizzle", desc: "Multi-rotational traveling turn on one foot." }
      ] 
    },
    { 
      name: "Transitions & Choreography", 
      items: [
        { name: "Spiral", desc: "Sailing posture holding the free leg high above hip level." },
        { name: "Ina Bauer", desc: "Two-foot gliding transition with knees bent, tracking parallel lines." },
        { name: "Spread Eagle", desc: "Gliding on both feet with toes turned out 180 degrees." },
        { name: "Lunge", desc: "Deep forward flex glide dragging the back knee on the ice." },
        { name: "Cantilever", desc: "Low-altitude glide bending back parallel to the ice surface." },
        { name: "Final Pose", desc: "Choreographic ending posture locked to the final beat of music." }
      ] 
    }
  ];

  // Energy-aware planned program
  const plannedProgram = [
    { time: 5, name: "Spiral", zone: "Sakin Giriş", cue: "Dış kenarını koru, süzül." },
    { time: 22, name: "Salchow", zone: "İlk Yükseliş", cue: "Ritime odaklan... Sıçra!" },
    { time: 54, name: "Twizzle", zone: "Ritmik Bölüm", cue: "Dönüş hızını koru... Ritimle ak." },
    { time: 82, name: "Camel Spin", zone: "Climax (Peak)", cue: "Climax! Vücudunu gergin tut, merkezi koru." },
    { time: 105, name: "Final Pose", zone: "Final Vurgusu", cue: "Harika bitiriş! Duruşunu sabitle ve gülümse." }
  ];

  // Active cue index based on current playback time
  const getActiveCueIndex = () => {
    let activeIdx = 0;
    for (let i = 0; i < plannedProgram.length; i++) {
      if (playTime >= plannedProgram[i].time) {
        activeIdx = i;
      }
    }
    return activeIdx;
  };
  const activeCueIdx = getActiveCueIndex();
  const currentCue = plannedProgram[activeCueIdx];

  // Map boot choice to full name
  const bootNames = {
    edea: "Edea Ice Fly + John Wilson Gold Seal",
    jackson: "Jackson Premiere + MK Professional",
    riedell: "Riedell Royal + Eclipse Titanium"
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-slate-800 transition-all duration-300"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(248,250,252,0.92) 0%, rgba(255,255,255,0.96) 100%), url("${pageBackground}")`,
      }}
    >
      <TopBar onNavigate={onNavigate} theme="light" activeUser={activeUser} onLogout={handleLogout} />


      {/* Profile Saved Toast notification */}
      {showProfileToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-teal-50 border border-teal-200 px-5 py-4 shadow-xl animate-rise">
          <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-semibold text-teal-800">Sporcu profili başarıyla güncellendi!</p>
        </div>
      )}

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-14 pt-4 sm:px-6 lg:pb-20">
        
        {/* Navigation & Tab Bar */}
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-[28px] border border-slate-100 bg-white/70 backdrop-blur-md p-5 sm:p-6 shadow-lg">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
              SkateSync AI Dashboard
            </h2>
            <p className="mt-1 text-sm text-slate-500 font-medium">
              Otonom Koreografi Planlama ve Görüntü İşleme Analizi
            </p>
          </div>
          
          <div className="flex bg-slate-100/80 rounded-2xl p-1.5 border border-slate-200/50 shadow-inner">
            {[
              { id: "profile", label: "Profil & Geçmiş" },
              { id: "music", label: "Müzik & Planlama" },
              { id: "video", label: "Video & Analiz" },
              { id: "catalog", label: "Hareket Kataloğu" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-white text-sky-600 shadow-md border border-slate-200/30 scale-[1.02]" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Tab 1: Profile & History */}
        {activeTab === "profile" && (
          <section className="grid gap-6 md:grid-cols-[1.1fr_1.9fr] animate-rise">
            {/* Profile editor */}
            <div className="rounded-[28px] border border-slate-100 bg-white/60 backdrop-blur-md p-6 shadow-md flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Sporcu Profili</h3>
                <p className="text-slate-500 text-xs mt-1">Antrenman planlarını şekillendirecek fiziksel ve teknik seviye ayarları.</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sporcu Adı</label>
                  <input
                    type="text"
                    value={athleteName}
                    onChange={(e) => setAthleteName(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white/80 px-4 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
                  />

                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Seçilen Hareketler ({selectedMovements.length})</label>
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50 max-h-[140px] overflow-y-auto">
                    {selectedMovements.length === 0 ? (
                      <span className="text-xs text-slate-400 font-medium">Henüz hareket seçilmedi.</span>
                    ) : (
                      selectedMovements.map((mv) => (
                        <span key={mv} className="text-[10px] font-bold text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          ✓ {mv}
                        </span>
                      ))
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("catalog")}
                    className="w-full h-10 rounded-xl text-xs font-bold text-sky-600 bg-sky-50/50 hover:bg-sky-50 border border-sky-100/50 hover:border-sky-200 transition flex items-center justify-center gap-1.5 mt-2"
                  >
                    📖 Kataloğu Ziyaret Et & Hareketlerini Seç
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Buz Pateni Seçimi</label>
                  <select
                    value={skateChoice}
                    onChange={(e) => setSkateChoice(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white/80 px-4 text-sm text-slate-700 outline-none focus:border-sky-400 transition"
                  >
                    <option value="edea">Edea Ice Fly + Gold Seal</option>
                    <option value="jackson">Jackson Premiere + MK Pro</option>
                    <option value="riedell">Riedell Royal + Eclipse Titanium</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition shadow-sm mt-2"
                >
                  Profili Kaydet
                </button>
              </div>
            </div>

            {/* Previous history lists */}
            <div className="rounded-[28px] border border-slate-100 bg-white/60 backdrop-blur-md p-6 shadow-md flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Analiz &amp; Koreografi Geçmişi</h3>
                <p className="text-slate-500 text-xs mt-1">Daha önce sistem tarafından kaydedilmiş çalışmalar ve koç analiz raporları.</p>
              </div>

              <div className="space-y-5">
                {/* Previous Video Analyses */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Daha Önceki Analiz Geçmişi</h4>
                  <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white/80 shadow-sm">
                    <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-slate-500">Tarih</th>
                          <th className="px-4 py-3 font-semibold text-slate-500">Koreografi</th>
                          <th className="px-4 py-3 font-semibold text-slate-500">Uyum Skoru</th>
                          <th className="px-4 py-3 font-semibold text-slate-500">Derece</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(videoHistory.length > 0 ? videoHistory : [
                          { date: "10.05.2026", track: "Swan Lake Climax", score: "92%", grade: "A" },
                          { date: "05.05.2026", track: "Riverdance Upbeat", score: "86%", grade: "B+" },
                          { date: "28.04.2026", track: "Moonlight Sonata Act 1", score: "78%", grade: "B-" }
                        ]).map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-medium text-slate-600">{row.date}</td>
                            <td className="px-4 py-3 font-semibold text-slate-800">{row.track}</td>
                            <td className="px-4 py-3 font-semibold text-sky-600">{row.score}</td>
                            <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-bold border border-sky-100">{row.grade}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Previous Choreographies & Coach Reports */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Önceki Müzikli Koreografiler</h4>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {(musicHistory.length > 0 ? musicHistory : [
                        { title: "Swan Lake Cinematic", bpm: "120 BPM", elCount: "12 hareket" },
                        { title: "Riverdance Mix", bpm: "132 BPM", elCount: "15 hareket" }
                      ]).map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-white/80 flex justify-between items-center shadow-xs">
                          <div>
                            <p className="text-xs font-bold text-slate-800">{item.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.bpm} • {item.elCount}</p>
                          </div>
                          <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-sky-50 text-sky-500">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Önceki Coach Feedback Raporları</h4>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {(videoHistory.length > 0 
                        ? videoHistory.map(h => `${h.track} antrenman analizi tamamlandı. Hareket uyum skorun ${h.score} olarak ölçüldü!`)
                        : [
                            "Double axel sıçrama ritmi harika, oturma dönüşünde kalçayı biraz daha aşağıda tutmaya odaklan.",
                            "Adım dizilerinde stabilite ve dış kenarı tutuş süren belirgin şekilde iyileşmiş."
                          ]
                      ).map((report, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-white/80 shadow-xs">
                          <p className="text-[11px] leading-5 text-slate-500 font-medium italic">"{report}"</p>
                          <p className="text-[9px] text-sky-500 font-bold uppercase tracking-wider mt-1 text-right">— Elena (AI Coach)</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </section>
        )}

        {/* Tab 2: Music & Planning */}
        {activeTab === "music" && (
          <section className="rounded-[28px] border border-slate-100 bg-white/60 backdrop-blur-md p-6 sm:p-8 shadow-md flex flex-col gap-6 animate-rise">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Müzik Yükleme &amp; AI Koreografi Planlama</h3>
                <p className="text-slate-500 text-xs mt-1">
                  Yüklenen müziğin BPM ve enerji değişimlerini analiz ederek otonom koreografi rotası oluşturun.
                </p>
              </div>

              {!isMusicUploaded ? (
                <button
                  onClick={handleMusicUploadSimulate}
                  disabled={isMusicUploading}
                  className="rounded-2xl bg-sky-600 hover:bg-sky-500 disabled:bg-sky-400 text-white px-5 py-3 text-sm font-semibold transition shadow-sm flex items-center gap-2"
                >
                  {isMusicUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      BPM Hesaplanıyor...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Simüle Müzik Yükle
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 px-4 py-2.5 rounded-2xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">{uploadedMusicName}</span>
                </div>
              )}
            </div>

            {/* If music is not uploaded, show a gorgeous upload zone */}
            {!isMusicUploaded && (
              <div className="border-2 border-dashed border-sky-200 bg-sky-50/20 rounded-[24px] p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[260px] transition hover:bg-sky-50/30">
                <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 border border-sky-100 shadow-xs">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Antrenman Müziğinizi Sürükleyin ve Bırakın</p>
                  <p className="text-xs text-slate-400 mt-1">Desteklenen formatlar: MP3, WAV, AAC (Maks 10MB)</p>
                </div>
                <button
                  onClick={handleMusicUploadSimulate}
                  className="rounded-xl border border-sky-200 bg-white hover:bg-sky-50 text-sky-600 text-xs font-bold px-4 py-2 transition"
                >
                  Dosya Seçin
                </button>
              </div>
            )}

            {/* If uploaded, show planning parameters, interactive timeline and generate action */}
            {isMusicUploaded && (
              <div className="grid gap-6 lg:grid-cols-[1.8fr_1.2fr]">
                <div className="flex flex-col gap-6">
                  {/* Music metrics display */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "BPM Ritim Skoru", val: "118 BPM", color: "text-sky-600 bg-sky-50" },
                      { label: "Toplam Vuruş", val: "142 Vuruş", color: "text-purple-600 bg-purple-50" },
                      { label: "Enerji Profili", val: "Dinamik Yüksek", color: "text-pink-600 bg-pink-50" },
                      { label: "Climax / Zirve", val: "74.8s / 104.6s", color: "text-amber-600 bg-amber-50" }
                    ].map((item, idx) => (
                      <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{item.label}</span>
                        <span className={`text-base font-extrabold ${item.color} px-2.5 py-1 rounded-xl self-start mt-1`}>{item.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Energy Timeline Bar */}
                  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex flex-col gap-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">İnteraktif Enerji Dağılımı ve Hareket Önerileri</h4>
                    
                    <div className="h-10 w-full rounded-xl overflow-hidden flex font-bold text-[10px] text-white">
                      <div className="w-[15%] bg-sky-400 flex items-center justify-center px-1 shadow-inner" title="Sakin Giriş">0-15s Sakin</div>
                      <div className="w-[23%] bg-sky-500 flex items-center justify-center px-1 shadow-inner" title="İlk Yükseliş">15-40s Yükseliş</div>
                      <div className="w-[32%] bg-purple-500 flex items-center justify-center px-1 shadow-inner" title="Ritmik Bölüm">40-75s Ritim</div>
                      <div className="w-[20%] bg-pink-500 flex items-center justify-center px-1 shadow-inner" title="Climax">75-100s Climax</div>
                      <div className="w-[10%] bg-violet-600 flex items-center justify-center px-1 shadow-inner" title="Final">100s+ Final</div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-50">
                      <div>
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block mr-1"></span>
                        <strong>Sakin Giriş:</strong>
                        <p className="text-[10px] text-slate-400 mt-0.5">Öneri: Spiral / Geçiş</p>
                      </div>
                      <div>
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block mr-1"></span>
                        <strong>İlk Yükseliş:</strong>
                        <p className="text-[10px] text-slate-400 mt-0.5">Öneri: Salchow / Jump</p>
                      </div>
                      <div>
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block mr-1"></span>
                        <strong>Ritmik Bölüm:</strong>
                        <p className="text-[10px] text-slate-400 mt-0.5">Öneri: Adım Dizisi</p>
                      </div>
                      <div>
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block mr-1"></span>
                        <strong>Climax:</strong>
                        <p className="text-[10px] text-slate-400 mt-0.5">Öneri: Camel Spin</p>
                      </div>
                      <div>
                        <span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block mr-1"></span>
                        <strong>Final:</strong>
                        <p className="text-[10px] text-slate-400 mt-0.5">Öneri: Final Pose</p>
                      </div>
                    </div>
                  </div>

                  {/* Planning generation settings */}
                  {!isPlanGenerated && (
                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex flex-col gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">AI Koreografi Hazırlığı</h4>
                        <p className="text-slate-500 text-xs mt-0.5">Yapay zekanın koreografide kullanmasını istediğiniz parametreler ve hareketler.</p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                            <span>Hedef Zorluk Puanı</span>
                            <span className="text-sky-600 font-bold">{targetScore} Puan</span>
                          </div>
                          <input 
                            type="range" 
                            min="40" 
                            max="100" 
                            value={targetScore} 
                            onChange={(e) => setTargetScore(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                          />
                        </div>

                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-slate-500 block">Program Seviyesi</span>
                          <span className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg inline-block w-full">
                            {selectedMovements.length <= 3 ? "Başlangıç (Novice)" : selectedMovements.length <= 6 ? "Orta (Junior)" : "İleri (Senior)"} Seviyesi ({selectedMovements.length} Hareket Aktif)
                          </span>
                        </div>
                      </div>

                      {/* Doable movements selection from movement dictionary */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-500">Planlama İçin Seçilen Hareketler</span>
                          <button 
                            type="button" 
                            onClick={() => setActiveTab("catalog")}
                            className="text-[10px] font-bold text-sky-600 hover:underline"
                          >
                            Kataloğu Düzenle ↗
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50 max-h-[100px] overflow-y-auto pr-1">
                          {selectedMovements.length === 0 ? (
                            <span className="text-xs text-slate-400 font-medium w-full text-center py-2">Henüz katalogdan hareket seçmediniz. Kataloğa gidip hareketleri seçin!</span>
                          ) : (
                            selectedMovements.map((mName) => (
                              <span
                                key={mName}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-50 border border-purple-100 text-purple-600"
                              >
                                {mName}
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      <button
                        onClick={handleGeneratePlanSimulate}
                        disabled={isPlanGenerating}
                        className="h-12 w-full rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-purple-400 text-white text-sm font-bold transition shadow-md mt-2 flex items-center justify-center gap-2"
                      >
                        {isPlanGenerating ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Plan Hazırlanıyor...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Otonom AI Planı Oluştur
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* If plan generated, show scrolling sync visualizer */}
                  {isPlanGenerated && (
                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                        <h4 className="text-sm font-bold text-slate-900">Müzik Senkronize Sesli Komutlar ve Akış</h4>
                        <div className="flex items-center gap-2">
                          <button className="text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition">
                            PDF Dışa Aktar
                          </button>
                        </div>
                      </div>

                      {/* Visual animation and lyrics wrapper */}
                      <div className="grid md:grid-cols-[1fr_1.3fr] gap-4">
                        {/* Skeleton looping athlete model animation */}
                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 flex flex-col items-center justify-center gap-4 relative overflow-hidden min-h-[220px]">
                          <div className="absolute inset-0 bg-radial-gradient from-sky-100/10 via-transparent to-transparent"></div>
                          
                          {/* Skater posture graphic simulator */}
                          <div className="w-28 h-28 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 relative transition-transform duration-700">
                            {isPlaying ? (
                              <div className="absolute inset-0 rounded-full border border-sky-500/20 animate-ping"></div>
                            ) : null}
                            
                            {/* Adaptive SVG for 5 skater movements */}
                            {currentCue.name === "Spiral" && (
                              <svg className="w-14 h-14 text-sky-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                            )}
                            {currentCue.name === "Salchow" && (
                              <svg className="w-14 h-14 text-purple-500 animate-spin" style={{ animationDuration: "3s" }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17m-.5 15v-5h-.581m0 0a8.003 8.003 0 11-15.357-2H5" /></svg>
                            )}
                            {currentCue.name === "Twizzle" && (
                              <svg className="w-14 h-14 text-teal-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            )}
                            {currentCue.name === "Camel Spin" && (
                              <svg className="w-14 h-14 text-pink-500 animate-spin" style={{ animationDuration: "1s" }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                            )}
                            {currentCue.name === "Final Pose" && (
                              <svg className="w-14 h-14 text-violet-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.475 3.475 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.475 3.475 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.475 3.475 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.475 3.475 0 013.138-3.138z" /></svg>
                            )}
                          </div>
                          
                          <div className="text-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Aktif Hareket</span>
                            <p className="text-sm font-extrabold text-slate-800 mt-0.5">{currentCue.name}</p>
                          </div>
                        </div>

                        {/* Ticker scrolling cues */}
                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 flex flex-col justify-center relative overflow-hidden min-h-[220px]">
                          <div className="absolute top-3 left-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Scrolling Lyrics Sync</div>
                          
                          <div className="flex flex-col gap-5 relative z-10 transition-transform duration-500">
                            {plannedProgram.map((item, idx) => {
                              const isCueActive = idx === activeCueIdx;
                              const isCuePast = idx < activeCueIdx;
                              return (
                                <div 
                                  key={idx} 
                                  className={`flex items-start gap-4 transition-all duration-300 ${
                                    isCueActive 
                                      ? "opacity-100 scale-102 font-semibold" 
                                      : isCuePast 
                                        ? "opacity-30 line-through" 
                                        : "opacity-40"
                                  }`}
                                >
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 border ${
                                    isCueActive ? "bg-purple-100 border-purple-200 text-purple-600" : "bg-slate-100 border-slate-200 text-slate-500"
                                  }`}>
                                    {item.time}s
                                  </span>
                                  <div>
                                    <p className={`text-xs font-bold ${isCueActive ? "text-purple-600" : "text-slate-700"}`}>
                                      {item.name}
                                    </p>
                                    <p className={`text-[13px] mt-0.5 ${isCueActive ? "text-slate-900 font-medium" : "text-slate-500"}`}>
                                      "{item.cue}"
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Custom Audio Player Widget */}
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-sky-600 hover:bg-sky-500 text-white transition shadow-md"
                          >
                            {isPlaying ? (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                            )}
                          </button>
                          
                          {/* Pulsating Visual Wave */}
                          <div className="flex-1 mx-6 flex items-center gap-1.5 h-10 overflow-hidden relative">
                            {Array.from({ length: 42 }).map((_, waveIdx) => {
                              // Dynamic wave height based on play status and time
                              const randomWaveH = isPlaying ? Math.floor(Math.sin((waveIdx + playTime) * 0.5) * 16) + 20 : 12;
                              const isWavePast = (waveIdx / 42) * 110 < playTime;
                              return (
                                <span
                                  key={waveIdx}
                                  className={`w-1 rounded-full transition-all duration-300 ${
                                    isWavePast ? "bg-sky-500" : "bg-slate-200"
                                  }`}
                                  style={{ height: `${randomWaveH}px` }}
                                ></span>
                              );
                            })}
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-xs font-bold text-slate-700">
                              {Math.floor(playTime / 60)}:{(playTime % 60).toString().padStart(2, "0")}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">/ 01:50</p>
                          </div>
                        </div>

                        {/* Visual progression track */}
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-1.5 text-xs flex rounded-full bg-slate-200">
                            <div
                              style={{ width: `${(playTime / 110) * 100}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-sky-400 to-purple-500 transition-all duration-500"
                            ></div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </div>

                {/* Planned items timeline sidebar */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs overflow-y-auto max-h-[500px]">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Program Koreografi Rotası</h4>
                  
                  {isPlanGenerated ? (
                    <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-slate-200 mt-2">
                      {plannedProgram.map((item, idx) => {
                        const isCueActive = idx === activeCueIdx;
                        return (
                          <div key={idx} className="relative pl-8 animate-rise" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white z-10 transition-all duration-300 shadow-sm ${
                              isCueActive ? 'bg-sky-500 scale-110 ring-4 ring-sky-100' : 'bg-slate-300'
                            }`}></div>
                            <span className="text-[9px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100 uppercase tracking-wider">{item.zone}</span>
                            <p className={`font-bold text-sm mt-1.5 transition-colors ${isCueActive ? 'text-sky-600' : 'text-slate-800'}`}>{item.name}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{item.time}s • {item.cue}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10 flex flex-col items-center justify-center gap-3">
                      <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <p className="text-xs font-semibold text-slate-400 leading-5">Plan hazırlamak için yukarıdan "Simüle Müzik Yükle" yaptıktan sonra otonom plan butonuna tıklayın.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Tab 3: Video & Review */}
        {activeTab === "video" && (
          <section className="rounded-[28px] border border-slate-100 bg-white/60 backdrop-blur-md p-6 sm:p-8 shadow-md flex flex-col gap-6 animate-rise">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Vision Görüntü Analizi &amp; Skorlama</h3>
                <p className="text-slate-500 text-xs mt-1">
                  Antrenman videonuzu yükleyerek planlanan timeline ile ritim ve stabilite karşılaştırmasını yapın.
                </p>
              </div>

              {!isVideoUploaded ? (
                <button
                  onClick={handleVideoUploadSimulate}
                  disabled={isVideoUploading}
                  className="rounded-2xl bg-sky-600 hover:bg-sky-500 disabled:bg-sky-400 text-white px-5 py-3 text-sm font-semibold transition shadow-sm flex items-center gap-2"
                >
                  {isVideoUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Video Yükleniyor...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      Simüle Video Yükle
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 px-4 py-2.5 rounded-2xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">practice_session_video.mp4</span>
                </div>
              )}
            </div>

            {/* If video is not uploaded, show a gorgeous upload zone */}
            {!isVideoUploaded && (
              <div className="border-2 border-dashed border-sky-200 bg-sky-50/20 rounded-[24px] p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[260px] transition hover:bg-sky-50/30">
                <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 border border-sky-100 shadow-xs">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Antrenman Videosunu Sürükleyin ve Bırakın</p>
                  <p className="text-xs text-slate-400 mt-1">Desteklenen formatlar: MP4, MOV, AVI (Maks 50MB)</p>
                </div>
                <button
                  onClick={handleVideoUploadSimulate}
                  className="rounded-xl border border-sky-200 bg-white hover:bg-sky-50 text-sky-600 text-xs font-bold px-4 py-2 transition"
                >
                  Dosya Seçin
                </button>
              </div>
            )}

            {/* If uploaded, show analysis quality options and analysis button */}
            {isVideoUploaded && !isAnalysisFinished && (
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs flex flex-col gap-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Analiz Profili Ayarları</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Maliyet ve hız kontrolü için görüntü işleme derinliğini seçin.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { id: "Fast", title: "Fast Review (Low Quality)", desc: "Günlük hızlı antrenman kontrolleri için daha az kare analizi yapan ucuz ve hızlı mod." },
                    { id: "Detailed", title: "Detailed Review (High Quality)", desc: "Resmi program provaları için yüksek çözünürlüklü ve detaylı koç seviyesi analiz modudur." }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setReviewMode(mode.id)}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                        reviewMode === mode.id
                          ? "bg-sky-50 border-sky-300 shadow-md scale-[1.01]"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-xl self-start ${
                        reviewMode === mode.id ? "bg-sky-100 text-sky-600" : "bg-slate-100 text-slate-500"
                      }`}>
                        {mode.id === "Fast" ? "HIZLI VE UCUZ" : "DETAYLI PRO"}
                      </span>
                      <p className="text-sm font-bold text-slate-800 mt-1">{mode.title}</p>
                      <p className="text-xs text-slate-500 leading-5">{mode.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Additional detailed commentary toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-700">Detaylı Yapay Zeka Koç Yorumu</span>
                    <span className="text-[10px] text-slate-400 font-medium">Bireysel teknik hatalar ve duruş ipuçlarını içeren koç metin raporu üretilir.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={detailedCommentary} 
                      onChange={() => setDetailedCommentary(!detailedCommentary)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                  </label>
                </div>

                <button
                  onClick={handleStartAnalysisSimulate}
                  disabled={isAnalyzing}
                  className="h-12 w-full rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-purple-400 text-white text-sm font-bold transition shadow-md flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Video Analiz Ediliyor (MediaPipe + VLM)...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.475 3.475 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.475 3.475 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.475 3.475 0 01-3.138-3.138z" /></svg>
                      Görüntü İşleme Analizini Başlat
                    </>
                  )}
                </button>
              </div>
            )}

            {/* If analysis finished, show visual scores, planned vs actual grid and coach comment */}
            {isAnalysisFinished && (
              <div className="flex flex-col gap-6 animate-rise">
                
                {/* Scoring cards dashboard */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Müzikal Ritim Uyumu", score: "88%", desc: "Beat Vurgusu Senkronu", color: "text-sky-600 bg-sky-50 border-sky-100" },
                    { label: "Denge & Stabilite", score: "92%", desc: "Landmark Sapma Payı", color: "text-purple-600 bg-purple-50 border-purple-100" },
                    { label: "Programa Sadakat", score: "85%", desc: "Plan Karşılaştırma", color: "text-pink-600 bg-pink-50 border-pink-100" },
                    { label: "Genel Değerlendirme", score: "A-", desc: "Coach Pro Puanı", color: "text-slate-800 bg-slate-50 border-slate-200" }
                  ].map((scoreCard, idx) => (
                    <div key={idx} className={`rounded-2xl border p-5 flex flex-col items-center justify-center text-center shadow-xs ${scoreCard.color}`}>
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">{scoreCard.label}</span>
                      <span className="text-3xl font-extrabold tracking-tight mt-2.5 mb-1">{scoreCard.score}</span>
                      <span className="text-[10px] font-semibold opacity-50">{scoreCard.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Planned vs Actual Grid Table */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-2">Planlanan Zamanlama vs Gerçekleşen Uyum</h4>
                  
                  <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xs">
                    <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3.5 font-bold text-slate-500">Hareket Adı</th>
                          <th className="px-4 py-3.5 font-bold text-slate-500">Plan Zamanı</th>
                          <th className="px-4 py-3.5 font-bold text-slate-500">Gerçekleşen</th>
                          <th className="px-4 py-3.5 font-bold text-slate-500">Zamanlama Durumu</th>
                          <th className="px-4 py-3.5 font-bold text-slate-500">Milisecond Offset</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {[
                          { name: "Spiral", plan: "5.0s", act: "5.2s", badge: "bg-teal-50 text-teal-600 border-teal-100", status: "On Time", offset: "+200ms" },
                          { name: "Salchow", plan: "22.0s", act: "20.1s", badge: "bg-purple-50 text-purple-600 border-purple-100", status: "Early", offset: "-1900ms" },
                          { name: "Twizzle", plan: "54.0s", act: "57.5s", badge: "bg-amber-50 text-amber-600 border-amber-100", status: "Late", offset: "+3500ms" },
                          { name: "Camel Spin", plan: "82.0s", act: "82.2s", badge: "bg-teal-50 text-teal-600 border-teal-100", status: "On Time", offset: "+200ms" },
                          { name: "Final Pose", plan: "105.0s", act: "105.1s", badge: "bg-teal-50 text-teal-600 border-teal-100", status: "On Time", offset: "+100ms" }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3.5 font-bold text-slate-800">{row.name}</td>
                            <td className="px-4 py-3.5 font-medium text-slate-500">{row.plan}</td>
                            <td className="px-4 py-3.5 font-bold text-slate-600">{row.act}</td>
                            <td className="px-4 py-3.5">
                              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase border ${row.badge}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-slate-400 font-medium">{row.offset}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Natural Language AI Coach Commentary */}
                {detailedCommentary && (
                  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex flex-col gap-4">
                    <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
                      <div className="relative">
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                        <span className="w-10 h-10 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 font-bold text-sm">E</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Elena (AI Coach) Yorumu</h4>
                        <p className="text-[10px] text-slate-400 font-medium">Bireysel ve sanatsal performans geri bildirimi</p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-sky-50/30 border border-sky-100/50 p-4 leading-7 text-sm text-slate-600 font-medium shadow-inner">
                      <p>
                        "Harika bir antrenman çıkardın Derin! <strong>Swan Lake</strong> ritmine uyumun genel olarak mükemmel. Özellikle final pozunu tam bitiş vurgusuyla saniyelik senkronize etmen tek kelimeyle göz kamaştırıcı."
                      </p>
                      <p className="mt-3">
                        "Salchow sıçrayışına biraz erken girdin (yaklaşık 1.9s erken), bu da havadaki dönüş ve iniş dengesini biraz etkileyerek stabilite skorunu <strong>%92</strong> seviyesine çekti. Twizzle adım dizisinde de müzik hızına adapte olurken bir miktar geç kaldın. Bir dahaki sefere adım dizisinde dış kenarı daha uzun ve kararlı tutmaya çalış. Tebrikler, program genel hazır duruma çok yaklaşıyor!"
                      </p>
                    </div>

                    {/* Simple exercise guidance cards */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { title: "Salchow Denge Odağı", cue: "Zıplamadan önce kollarını daha yakın tut, takeoff ritmini koru." },
                        { title: "Twizzle Adım Çalışması", cue: "Dönüş esnasında bakışını tek bir noktaya sabitle, hızı koru." },
                        { title: "Final Vurgusu Kontrolü", cue: "Kolları uzatırken başını kaldır, hakemlere doğru odaklan." }
                      ].map((card, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 shadow-xs">
                          <p className="text-xs font-bold text-slate-800">{card.title}</p>
                          <p className="text-[11px] text-slate-500 mt-1.5 leading-5 font-medium">{card.cue}</p>
                        </div>
                      ))}
                    </div>

                    {/* Çıktı Bilgi Notu */}
                    <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 shadow-sm flex gap-3 text-xs text-amber-700 leading-relaxed font-semibold">
                      <div className="text-base">ℹ️</div>
                      <div>
                        <h5 className="font-bold text-amber-900 uppercase tracking-wider mb-1">Önemli Çıktı Bilgi Notu</h5>
                        <p className="font-medium text-[11px] leading-relaxed">
                          Bu video analizi çıktısı ve zamanlama değerleri, SkateSync AI motorunun Librosa tabanlı tempo eşleme algoritmaları ve MediaPipe 3D iskelet landmark tespiti kullanılarak otomatik olarak hesaplanmıştır. Önerilen zamanlama düzeltmeleri (offset) ve kararlılık puanları eğitim/antrenman geliştirme amaçlı tavsiyelerdir ve resmi ISU (International Skating Union) hakem kararlarının yerine geçmez. Performansınızı zenginleştirmek için birer destekçi rehber olarak değerlendirilmelidir.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </section>
        )}

        {/* Tab 4: Movement Catalog */}
        {activeTab === "catalog" && (
          <section className="rounded-[28px] border border-slate-100 bg-white/60 backdrop-blur-md p-6 sm:p-8 shadow-md flex flex-col gap-6 animate-rise">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Hareket Kataloğu (Movement Dictionary)</h3>
              <p className="text-slate-500 text-xs mt-1">
                SkateSync AI uses this movement dictionary to generate plans, analyze video, and provide feedback.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {movementCategories.map((cat) => (
                <div key={cat.name} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col gap-3">
                  <h4 className="text-sm font-extrabold text-sky-600 uppercase tracking-widest border-b border-slate-50 pb-2">{cat.name}</h4>
                  
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {cat.items.map((item) => {
                      const isSelected = selectedMovements.includes(item.name);
                      return (
                        <div 
                          key={item.name} 
                          onClick={() => {
                            setSelectedMovements(prev => 
                              prev.includes(item.name) 
                                ? prev.filter(x => x !== item.name) 
                                : [...prev, item.name]
                            );
                          }}
                          className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all duration-200 ${
                            isSelected 
                              ? "bg-teal-50/60 border-teal-200 hover:bg-teal-50" 
                              : "bg-slate-50 border-slate-100/50 hover:bg-slate-100/30"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className={`text-xs font-bold ${isSelected ? "text-teal-800" : "text-slate-800"}`}>{item.name}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border transition ${
                              isSelected 
                                ? "text-teal-600 bg-teal-50 border-teal-100" 
                                : "text-slate-400 bg-slate-50 border-slate-100"
                            }`}>
                              {isSelected ? "✓ Seçildi" : "Katalogda"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-5 mt-1 font-medium">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    return authStateListener((user) => {
      setActiveUser(user);
      if (user) {
        if (screen === "landing" || screen === "login") {
          setScreen("overview");
        }
      } else {
        if (screen === "overview") {
          setScreen("landing");
        }
      }
    });
  }, [screen]);

  const handleLogout = async () => {
    try {
      await authSignOut();
      setScreen("landing");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (screen === "login") {
    return <LoginScreen onNavigate={setScreen} />;
  }

  if (screen === "overview") {
    return <OverviewScreen onNavigate={setScreen} activeUser={activeUser} handleLogout={handleLogout} />;
  }

  return <LandingScreen onNavigate={setScreen} activeUser={activeUser} handleLogout={handleLogout} />;
}


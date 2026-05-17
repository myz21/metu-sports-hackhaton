import { useMemo, useState } from "react";
import movementKnowledge from "../knowledge/figure_skating_knowledge.json";

const movementPreview = ["Axel", "Sit Spin", "Camel Spin", "Spiral", "Final Pose"];
const pageBackground = new URL(
  "../abstract-wave-trendy-geometric-abstract-background-with-white-and-blue-gradient-vector.jpg",
  import.meta.url,
).href;
const brandLogo = new URL("../skatesync-logo-Photoroom.png", import.meta.url).href;
const landingFigure = new URL("../skatesync-landing.png", import.meta.url).href;

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

function LogoMark() {
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
        <p className="font-display text-[1.55rem] font-semibold leading-none text-slate-900 sm:text-[1.8rem]">
          SkateSync AI
        </p>
        <p className="mt-2 text-[0.68rem] uppercase tracking-[0.42em] text-slate-400 sm:text-xs">
          Precision in Motion
        </p>
      </div>
    </div>
  );
}

function TopBar({ onNavigate }) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
      <LogoMark />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate("login")}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => onNavigate("overview")}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-800 px-5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Get Started
        </button>
      </div>
    </header>
  );
}

function LoginPanel({ onSuccess }) {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-3 text-center lg:text-left">
        <h1 className="font-display text-[2rem] font-semibold tracking-tight text-slate-900">
          SkateSync AI
        </h1>
        <p className="max-w-sm text-base leading-7 text-slate-500">
          Music-aware choreography planner for figure skating and artistic roller skating
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          onSuccess();
        }}
      >
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-500">Email Address</span>
            <input
              type="email"
              placeholder="name@skatesync.ai"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-base text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-slate-500">Password</label>
              <button type="button" className="text-sm font-medium text-teal-600 transition hover:text-teal-500">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
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
            className="flex h-16 w-full items-center justify-center rounded-2xl bg-slate-800 text-[1.05rem] font-semibold text-white transition hover:bg-slate-700"
          >
            Sign In
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm font-medium text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-lg font-medium text-slate-900 transition hover:bg-slate-50"
          >
            <GoogleMark />
            Continue with Google
          </button>
        </div>
      </form>

      <div className="pt-8 text-center">
        <p className="text-base text-slate-500">
          Don&apos;t have an account?{" "}
          <button type="button" className="font-semibold text-teal-600 transition hover:text-teal-500">
            Join the roster
          </button>
        </p>
      </div>
    </div>
  );
}

function LoginScreen({ onNavigate }) {
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
          <LoginPanel onSuccess={() => onNavigate("overview")} />
          <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-teal-50" />
        </div>
      </div>

      <div className="pt-8 text-center text-sm text-slate-300">
        © 2024 SKATESYNC AI. PRECISION IN MOTION.
      </div>
    </div>
  );
}

function LandingScreen({ onNavigate }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(246,250,252,0.95) 100%), url("${pageBackground}")`,
      }}
    >
      <TopBar onNavigate={onNavigate} />

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
      </main>
    </div>
  );
}

function OverviewScreen({ onNavigate }) {
  const knownMovements = useMemo(
    () => movementPreview.filter((name) => movementKnowledge.some((item) => item.title === name)),
    [],
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,251,253,0.96) 100%), url("${pageBackground}")`,
      }}
    >
      <TopBar onNavigate={onNavigate} />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-14 pt-4 sm:px-6 lg:pb-20">
        <section className="rounded-[32px] border border-slate-100 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Get Started</p>
          <h2 className="mt-3 font-display text-4xl font-bold text-slate-900">
            A calmer first look at the product
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">
            This page keeps things light: what the app does, which movement language it
            understands, and the two main review modes.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[28px] border border-slate-100 bg-white p-6">
            <p className="text-lg font-semibold text-slate-900">What you can do</p>
            <div className="mt-4 space-y-3">
              {[
                "Upload one practice track",
                "Preview a clean planned timeline",
                "Upload one training video for review",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-100 bg-white p-6">
            <p className="text-lg font-semibold text-slate-900">Review modes</p>
            <div className="mt-4 space-y-3">
              {[
                ["Fast Review", "Quick daily feedback with lower processing cost."],
                ["Detailed Review", "Coach-style notes with stronger analysis depth."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-100 bg-white p-6">
          <p className="text-lg font-semibold text-slate-900">Known movements</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {knownMovements.map((item) => (
              <div
                key={item}
                className="rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm font-medium text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            These names stay consistent between planning and video review.
          </p>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");

  if (screen === "login") {
    return <LoginScreen onNavigate={setScreen} />;
  }

  if (screen === "overview") {
    return <OverviewScreen onNavigate={setScreen} />;
  }

  return <LandingScreen onNavigate={setScreen} />;
}

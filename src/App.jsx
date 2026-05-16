const previewTags = [
  "Beat-aware mapping",
  "Program notes",
  "Routine timelines",
];

function InputField({ label, type, placeholder }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold tracking-wide text-slate-600">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-[15px] text-navy outline-none transition duration-200 placeholder:text-slate-400 focus:border-ice-400 focus:ring-4 focus:ring-ice-100"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 flex-none"
    >
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

function IcyWaveArtwork() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-ice-200/80 blur-3xl animate-drift" />
      <div className="absolute bottom-[-18%] right-[-2%] h-80 w-80 rounded-full bg-cyan-100/80 blur-3xl animate-drift-delayed" />

      <svg
        viewBox="0 0 900 900"
        className="absolute inset-0 h-full w-full scale-[1.08] opacity-95"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="panel" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#ddf2ff" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#c7e9fb" stopOpacity="0.14" />
          </linearGradient>
          <linearGradient id="ribbonA" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#b5e3fb" stopOpacity="0.84" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.32" />
          </linearGradient>
          <linearGradient id="ribbonB" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="55%" stopColor="#d7f3ff" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#edf9ff" stopOpacity="0.38" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#d9f0ff" stopOpacity="0" />
          </radialGradient>
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>

        <ellipse
          cx="660"
          cy="210"
          rx="170"
          ry="120"
          fill="url(#glow)"
          filter="url(#softBlur)"
          opacity="0.7"
        />
        <path
          d="M54 675C173 508 320 445 484 459C620 471 739 583 851 594V852H54Z"
          fill="url(#ribbonA)"
          opacity="0.88"
        />
        <path
          d="M30 553C174 439 319 409 450 434C593 461 714 562 870 527"
          fill="none"
          stroke="url(#ribbonB)"
          strokeWidth="66"
          strokeLinecap="round"
          opacity="0.78"
        />
        <path
          d="M85 414C243 348 360 342 496 383C624 421 700 500 833 486"
          fill="none"
          stroke="url(#ribbonA)"
          strokeWidth="42"
          strokeLinecap="round"
          opacity="0.78"
        />
        <path
          d="M126 296C247 248 365 246 503 281C607 307 694 359 777 356"
          fill="none"
          stroke="url(#ribbonB)"
          strokeWidth="26"
          strokeLinecap="round"
          opacity="0.72"
        />
        <path
          d="M164 204C263 176 361 177 470 206C541 225 614 258 702 262"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.8"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M480 154C552 152 614 173 674 213C734 254 781 309 822 394"
          fill="none"
          stroke="#bfe7fb"
          strokeOpacity="0.62"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <rect
          x="92"
          y="114"
          width="532"
          height="592"
          rx="64"
          fill="url(#panel)"
          stroke="#ffffff"
          strokeOpacity="0.7"
          strokeWidth="2"
          transform="rotate(-7 358 410)"
          opacity="0.86"
        />
        <rect
          x="206"
          y="168"
          width="438"
          height="488"
          rx="56"
          fill="url(#panel)"
          stroke="#ffffff"
          strokeOpacity="0.62"
          strokeWidth="2"
          transform="rotate(9 425 412)"
          opacity="0.65"
        />
      </svg>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-[100dvh] bg-[var(--page)] px-4 py-4 sm:px-5 sm:py-5">
      <div className="mx-auto grid min-h-[calc(100dvh-2rem)] max-w-7xl overflow-hidden rounded-[36px] border border-white/70 bg-white/80 shadow-frost backdrop-blur lg:h-[calc(100dvh-2.5rem)] lg:max-h-[920px] lg:min-h-0 lg:grid-cols-[1.18fr_0.82fr]">
        <section className="relative isolate overflow-hidden border-b border-white/60 bg-[linear-gradient(135deg,_#f9fdff_0%,_#eef8ff_38%,_#f7fbff_100%)] px-6 py-8 sm:px-8 sm:py-9 lg:border-b-0 lg:border-r lg:px-12 lg:py-12 xl:px-14">
          <IcyWaveArtwork />

          <div className="relative z-10 flex h-full flex-col justify-center gap-8 lg:gap-10 xl:max-w-2xl">
            <div className="max-w-xl space-y-5 animate-rise lg:max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 shadow-[0_12px_30px_rgba(108,160,196,0.12)] backdrop-blur">
                Premium planning flow
              </span>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.36em] text-sky-700/60">
                  SkateSync AI
                </p>
                <h1 className="max-w-lg font-display text-5xl leading-none text-navy sm:text-6xl xl:max-w-xl xl:text-[4.6rem]">
                  Glide from soundtrack to sequence.
                </h1>
                <p className="max-w-md text-base leading-7 text-slate-600 sm:text-lg">
                  Music-aware choreography planner for figure skating and
                  artistic roller skating.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:max-w-xl sm:grid-cols-3">
              {previewTags.map((tag, index) => (
                <div
                  key={tag}
                  className="rounded-[24px] border border-white/70 bg-white/50 px-4 py-4 text-sm font-medium text-slate-700 shadow-[0_16px_34px_rgba(108,160,196,0.12)] backdrop-blur animate-rise"
                  style={{ animationDelay: `${0.15 + index * 0.08}s` }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center bg-white/60 px-5 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-8 xl:px-12">
          <div className="mx-auto flex w-full max-w-md items-center lg:min-h-full">
            <div className="w-full rounded-[30px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_24px_70px_rgba(13,27,63,0.08)] backdrop-blur animate-rise sm:p-8">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-700/50">
                  Welcome back
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-navy sm:text-[2rem]">
                  SkateSync AI
                </h2>
                <p className="text-sm leading-6 text-slate-500 sm:text-[15px]">
                  Music-aware choreography planner for figure skating and
                  artistic roller skating
                </p>
              </div>

              <form className="mt-7 space-y-4">
                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="coach@skatesync.ai"
                />
                <InputField
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-center rounded-2xl bg-navy px-4 text-sm font-semibold text-white transition duration-200 hover:bg-[#12275a]"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition duration-200 hover:border-ice-300 hover:bg-ice-50"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">New to the rink?</span>
                <a
                  href="#"
                  className="font-semibold text-sky-800 transition hover:text-sky-600"
                >
                  Join the roster
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;

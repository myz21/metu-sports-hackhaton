import { GlassPanel, Tag, WaveAccent } from "../components/ui";

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

export default function LandingPage({ onSignIn, onJoinRoster }) {
  return (
    <div className="min-h-[calc(100dvh-2rem)] rounded-[28px] bg-[linear-gradient(180deg,_#f8fcff_0%,_#f3f9fd_100%)] p-3 sm:p-4">
      <div className="grid min-h-[calc(100dvh-4rem)] overflow-hidden rounded-[32px] border border-white/75 bg-white/72 shadow-[0_24px_80px_rgba(13,27,63,0.08)] backdrop-blur xl:grid-cols-[1.18fr_0.82fr]">
        <section className="relative overflow-hidden border-b border-white/70 bg-[linear-gradient(135deg,_#f9fdff_0%,_#eef8ff_38%,_#f7fbff_100%)] px-6 py-8 sm:px-8 sm:py-10 xl:border-b-0 xl:border-r xl:px-12 xl:py-12">
          <div className="absolute left-[-8%] top-[-8%] h-72 w-72 rounded-full bg-ice-200/75 blur-3xl animate-drift" />
          <div className="absolute bottom-[-18%] right-[-2%] h-80 w-80 rounded-full bg-cyan-100/80 blur-3xl animate-drift-delayed" />
          <WaveAccent className="absolute bottom-[-10%] right-[-8%] h-full w-[88%] opacity-85" />

          <div className="relative z-10 flex h-full flex-col justify-center gap-10 xl:max-w-2xl">
            <div className="space-y-6">
              <Tag tone="bright">Premium planning flow</Tag>
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.36em] text-sky-700/60">
                  SkateSync AI
                </p>
                <h1 className="max-w-xl font-display text-5xl leading-none text-navy sm:text-6xl xl:text-[4.5rem]">
                  Glide from soundtrack to sequence.
                </h1>
                <p className="max-w-md text-base leading-7 text-slate-600 sm:text-lg">
                  Music-aware choreography planner for figure skating and
                  artistic roller skating.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 sm:max-w-2xl">
              {["Beat-aware mapping", "Target score logic", "Video coaching"].map(
                (item, index) => (
                  <GlassPanel
                    key={item}
                    className="animate-rise px-4 py-4 text-sm font-medium text-slate-700"
                    style={{ animationDelay: `${0.12 * index}s` }}
                  >
                    {item}
                  </GlassPanel>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="flex items-center px-5 py-8 sm:px-8 xl:px-10">
          <div className="mx-auto w-full max-w-md">
            <GlassPanel className="p-6 sm:p-8">
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

              <form
                className="mt-7 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  onSignIn?.("home");
                }}
              >
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
                  type="submit"
                  className="flex h-12 w-full items-center justify-center rounded-2xl bg-navy px-4 text-sm font-semibold text-white transition duration-200 hover:bg-[#12275a]"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => onSignIn?.("home")}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition duration-200 hover:border-ice-300 hover:bg-ice-50"
                >
                  <GoogleMark />
                  Continue with Google
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">New to the rink?</span>
                <button
                  type="button"
                  onClick={() => onJoinRoster?.()}
                  className="font-semibold text-sky-800 hover:text-sky-600"
                >
                  Join the roster
                </button>
              </div>
            </GlassPanel>
          </div>
        </section>
      </div>
    </div>
  );
}

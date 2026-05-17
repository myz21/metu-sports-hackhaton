export function FrostBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[-8%] top-[-4%] h-80 w-80 rounded-full bg-ice-400/20 blur-3xl animate-drift" />
      <div className="absolute right-[-10%] top-[8%] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl animate-drift-delayed" />
      <div className="absolute bottom-[-14%] left-[24%] h-72 w-72 rounded-full bg-cyan-200/12 blur-3xl animate-drift" />
    </div>
  );
}

export function GlassPanel({ className = "", style, children }) {
  return (
    <section
      style={style}
      className={`glass-panel glass-highlight rounded-[24px] ${className}`}
    >
      {children}
    </section>
  );
}

export function Tag({ tone = "default", children }) {
  const tones = {
    default: "border-white/10 bg-white/5 text-white/72",
    soft: "border-ice-300/30 bg-ice-300/10 text-ice-100",
    bright: "border-violet-300/30 bg-violet-400/12 text-white",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div>
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/45">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/64">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex-none">{action}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  detail,
  progress,
  accent = "from-sky-300 via-cyan-200 to-white",
  className = "",
  style,
}) {
  return (
    <GlassPanel className={`p-5 sm:p-6 ${className}`} style={style}>
      <div
        className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-950 ${accent}`}
      >
        Metric
      </div>
      <p className="mt-5 text-sm font-semibold tracking-wide text-white/64">
        {label}
      </p>
      <div className="mt-3 flex items-end gap-1">
        <span className="text-4xl font-semibold tracking-tight text-white">
          {value}
        </span>
        {progress !== undefined ? (
          <span className="pb-1 text-sm font-medium text-white/38">/100</span>
        ) : null}
      </div>
      {progress !== undefined ? (
        <div className="mt-4 h-2 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-violet-400 to-ice-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}
      {detail ? (
        <p className="mt-4 text-sm leading-6 text-white/64">{detail}</p>
      ) : null}
    </GlassPanel>
  );
}

export function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[18px] border border-white/8 bg-white/5 px-4 py-3">
      <span className="text-sm text-white/56">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

export function ProgressList({ items }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-white">{item.label}</p>
            <p className="text-sm text-white/40">{item.value}%</p>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-violet-400 to-ice-300"
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function WaveAccent({ className = "" }) {
  return (
    <svg
      viewBox="0 0 900 420"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="waveA" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="55%" stopColor="#ddb7ff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#a2eeff" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="waveB" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="60%" stopColor="#a2eeff" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#ddb7ff" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      <path
        d="M120 315C239 244 345 220 463 236C589 254 685 315 834 288"
        fill="none"
        stroke="url(#waveA)"
        strokeWidth="54"
        strokeLinecap="round"
        opacity="0.88"
      />
      <path
        d="M83 228C201 188 303 182 423 206C559 233 673 298 842 270"
        fill="none"
        stroke="url(#waveB)"
        strokeWidth="32"
        strokeLinecap="round"
        opacity="0.74"
      />
      <path
        d="M167 154C283 133 378 141 480 171C562 194 645 233 739 238"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FrostBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[-8%] top-[-4%] h-80 w-80 rounded-full bg-ice-200/75 blur-3xl animate-drift" />
      <div className="absolute right-[-10%] top-[8%] h-96 w-96 rounded-full bg-cyan-100/80 blur-3xl animate-drift-delayed" />
      <div className="absolute bottom-[-14%] left-[24%] h-72 w-72 rounded-full bg-sky-100/60 blur-3xl animate-drift" />
    </div>
  );
}

export function GlassPanel({ className = "", style, children }) {
  return (
    <section
      style={style}
      className={`rounded-[28px] border border-white/70 bg-white/68 shadow-[0_20px_60px_rgba(13,27,63,0.08)] backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}

export function Tag({ tone = "default", children }) {
  const tones = {
    default: "border-white/75 bg-white/60 text-slate-500",
    soft: "border-ice-200 bg-ice-50/80 text-sky-800",
    bright: "border-white/80 bg-white text-navy",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] ${tones[tone]}`}
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
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700/55">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-navy">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
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
        className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-900/70 ${accent}`}
      >
        Metric
      </div>
      <p className="mt-5 text-sm font-semibold tracking-wide text-slate-500">
        {label}
      </p>
      <div className="mt-3 flex items-end gap-1">
        <span className="text-4xl font-semibold tracking-tight text-navy">
          {value}
        </span>
        {progress !== undefined ? (
          <span className="pb-1 text-sm font-medium text-slate-400">/100</span>
        ) : null}
      </div>
      {progress !== undefined ? (
        <div className="mt-4 h-2 rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-ice-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}
      {detail ? (
        <p className="mt-4 text-sm leading-6 text-slate-500">{detail}</p>
      ) : null}
    </GlassPanel>
  );
}

export function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[18px] border border-white/75 bg-white/52 px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-navy">{value}</span>
    </div>
  );
}

export function ProgressList({ items }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-navy">{item.label}</p>
            <p className="text-sm text-slate-400">{item.value}%</p>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-ice-200"
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
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="55%" stopColor="#b9e3fb" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id="waveB" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#d9f3ff" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
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
        strokeOpacity="0.82"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}

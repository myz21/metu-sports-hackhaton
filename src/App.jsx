import { useEffect, useMemo, useState } from "react";
import movementKnowledge from "../knowledge/figure_skating_knowledge.json";
import { FrostBackdrop, GlassPanel, InfoRow, SectionHeader, Tag } from "./components/ui";

const ambientVideo = new URL(
  "../animation(ortası alınacak, yavaşlatılacak).mp4",
  import.meta.url,
).href;

const clipMap = {
  Axel: "/media/movements/axel.mp4",
  "Camel Spin": "/media/movements/camel-spin.mp4",
  Spiral: "/media/movements/spiral.mp4",
  "One Foot Glide": "/media/movements/one-foot-glide.mp4",
  "Two Foot Glide": "/media/movements/two-foot-glide.mp4",
};

const musicPlan = [
  {
    time: "00:12",
    seconds: 12,
    movement: "Spiral",
    category: "Transition",
    note: "Open the line as the strings widen.",
    timing: "On Time",
  },
  {
    time: "00:34",
    seconds: 34,
    movement: "Toe Loop",
    category: "Jump",
    note: "Snap the pick rhythm into the beat lift.",
    timing: "Early",
  },
  {
    time: "00:58",
    seconds: 58,
    movement: "Camel Spin",
    category: "Spin",
    note: "Show the full line before chasing speed.",
    timing: "On Time",
  },
  {
    time: "01:17",
    seconds: 77,
    movement: "Ina Bauer",
    category: "Transition",
    note: "Use the phrase stretch to create glide length.",
    timing: "Late",
  },
  {
    time: "01:46",
    seconds: 106,
    movement: "Sit Spin",
    category: "Spin",
    note: "Center first, then settle into the lower position.",
    timing: "On Time",
  },
  {
    time: "02:15",
    seconds: 135,
    movement: "Axel",
    category: "Jump",
    note: "Keep the takeoff committed into the musical crest.",
    timing: "On Time",
  },
  {
    time: "02:37",
    seconds: 157,
    movement: "Final Pose",
    category: "Choreography",
    note: "Hold the finish through the last note decay.",
    timing: "On Time",
  },
];

const coachingSequence = [
  {
    movement: "Spiral",
    cue: "Lengthen the free leg and let the phrase breathe.",
    clip: clipMap.Spiral,
  },
  {
    movement: "Camel Spin",
    cue: "Reach the full line, then stabilize the hip level.",
    clip: clipMap["Camel Spin"],
  },
  {
    movement: "One Foot Glide",
    cue: "Stay quiet through the shoulders while the edge settles.",
    clip: clipMap["One Foot Glide"],
  },
  {
    movement: "Axel",
    cue: "Commit forward and keep the landing flow soft.",
    clip: clipMap.Axel,
  },
  {
    movement: "Two Foot Glide",
    cue: "Reset balance and prepare the next phrase calmly.",
    clip: clipMap["Two Foot Glide"],
  },
];

const reviewCards = [
  {
    title: "Execution Match Score",
    value: 88,
    detail: "Most planned elements were performed in the intended order.",
  },
  {
    title: "Start Score",
    value: 81,
    detail: "Openings hit well, but the second accent entered a touch early.",
  },
  {
    title: "Stability Score",
    value: 84,
    detail: "Spin centers were mostly controlled with minor travel on exits.",
  },
  {
    title: "Music Alignment Score",
    value: 92,
    detail: "The main highlight moments stayed close to the music peaks.",
  },
];

const movementCommentary = [
  "Camel Spin - Good stability, center slightly drifts near the end.",
  "Toe Loop - Takeoff rhythm is correct, landing flow was short.",
  "Final Pose - Synced with the music ending and read cleanly.",
];

const statusTone = {
  "On Time": "bg-emerald-400/15 text-emerald-200 border-emerald-300/20",
  Early: "bg-amber-400/15 text-amber-200 border-amber-300/20",
  Late: "bg-rose-400/15 text-rose-200 border-rose-300/20",
};

function categoryLabel(category) {
  const labels = {
    jump: "Jump",
    spin: "Spin",
    step: "Turn",
    transition: "Transition",
    choreography: "Choreography",
  };

  return labels[category] ?? category;
}

function normalizeCategory(item) {
  if (item.category === "step") {
    return "turn";
  }

  return item.category;
}

function percentToStroke(value) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return { radius, circumference, offset };
}

function ScoreRing({ value, label, detail }) {
  const { radius, circumference, offset } = percentToStroke(value);

  return (
    <GlassPanel className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="mt-2 text-sm leading-6 text-white/60">{detail}</p>
        </div>
        <div className="relative h-28 w-28 flex-none">
          <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="url(#scoreGradient)"
              strokeLinecap="round"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DDB7FF" />
                <stop offset="100%" stopColor="#2FD9F4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-white">{value}</span>
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/40">
              score
            </span>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

function PrimaryButton({ children }) {
  return (
    <button
      type="button"
      className="animate-shimmer inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#6f00be_0%,_#ddb7ff_42%,_#2fd9f4_100%)] px-5 text-sm font-semibold text-slate-950 transition duration-200 hover:brightness-110"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children }) {
  return (
    <button
      type="button"
      className="inline-flex h-12 items-center justify-center rounded-2xl border border-ice-300/25 bg-white/5 px-5 text-sm font-semibold text-white transition duration-200 hover:border-ice-200/45 hover:bg-white/10"
    >
      {children}
    </button>
  );
}

export default function App() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [analysisMode, setAnalysisMode] = useState("detailed");
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeCueIndex, setActiveCueIndex] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveCueIndex((current) => (current + 1) % coachingSequence.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const categories = useMemo(
    () => [
      { id: "all", label: "All" },
      { id: "jump", label: "Jump" },
      { id: "spin", label: "Spin" },
      { id: "turn", label: "Turns" },
      { id: "transition", label: "Transition" },
    ],
    [],
  );

  const catalogItems = useMemo(() => {
    const filtered = movementKnowledge.filter((item) => {
      if (activeFilter === "all") {
        return true;
      }

      return normalizeCategory(item) === activeFilter;
    });

    return filtered.slice(0, 12);
  }, [activeFilter]);

  const visibleCue = coachingSequence[activeCueIndex];
  const detailedCommentary = analysisMode === "detailed";

  return (
    <div className="relative overflow-hidden">
      <video
        className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-22"
        src={ambientVideo}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.3),_rgba(15,23,42,0.84)_50%,_#08101d_100%)]" />
      <FrostBackdrop />

      <main className="relative z-10 mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-4 sm:px-6 lg:px-10 lg:py-8">
        <GlassPanel className="rounded-[28px] px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/45">
                SkateSync AI
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                  Music-aware training cockpit
                </h1>
                <Tag tone="bright">Non-technical flow</Tag>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <SecondaryButton>Open Movement Catalog</SecondaryButton>
              <PrimaryButton>Upload and Start</PrimaryButton>
            </div>
          </div>
        </GlassPanel>

        <section className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
          <GlassPanel className="relative overflow-hidden rounded-[32px] p-6 sm:p-8">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(111,0,190,0.16)_0%,_rgba(47,217,244,0.08)_55%,_transparent_100%)]" />
            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <Tag tone="bright">Preparation to review</Tag>
                <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">
                  <span className="gradient-text">
                    From soundtrack to review
                  </span>{" "}
                  in one calm athlete-facing workspace.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
                  Upload music, preview the AI movement dictionary, follow the
                  coaching cues with synchronized visuals, then compare your
                  skate video against the planned timeline.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["Known movements", `${movementKnowledge.length}+ elements`],
                  ["Plan density", "10-15 movement route"],
                  ["Review output", "Scores, timing, coach notes"],
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className="glass-panel glass-highlight animate-rise rounded-[22px] p-4"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">
                      {label}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <GlassPanel className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Music Upload
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/60">
                        `moonlit_edges_v4.wav` analyzed for beat peaks, phrasing,
                        and energy zones.
                      </p>
                    </div>
                    <Tag tone="soft">Ready</Tag>
                  </div>
                  <div className="mt-5 h-2 rounded-full bg-white/10">
                    <div className="h-full w-[91%] rounded-full bg-[linear-gradient(90deg,_#ddb7ff_0%,_#2fd9f4_100%)]" />
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <InfoRow label="Duration" value="2:42" />
                    <InfoRow label="BPM" value="128" />
                    <InfoRow label="Peaks" value="4 accents" />
                  </div>
                </GlassPanel>

                <GlassPanel className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Practice Video
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/60">
                        Match the uploaded run-through with the planned
                        timeline before analysis begins.
                      </p>
                    </div>
                    <Tag tone="default">Waiting</Tag>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[20px] border border-white/8 bg-white/5 p-4">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
                        Analysis Profile
                      </p>
                      <div className="mt-3 flex gap-2">
                        {[
                          ["fast", "Fast Review"],
                          ["detailed", "Detailed Review"],
                        ].map(([id, label]) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setAnalysisMode(id)}
                            className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                              analysisMode === id
                                ? "border-ice-300/40 bg-ice-300/14 text-white"
                                : "border-white/8 bg-white/0 text-white/52 hover:bg-white/5"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[20px] border border-white/8 bg-white/5 p-4">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
                        AI Commentary
                      </p>
                      <p className="mt-3 text-sm font-semibold text-white">
                        {detailedCommentary ? "Coach-level detail on" : "Quick daily notes"}
                      </p>
                      <p className="mt-2 text-sm text-white/56">
                        {detailedCommentary
                          ? "Natural language feedback cards will be included."
                          : "Timing and score signals only for faster review."}
                      </p>
                    </div>
                  </div>
                </GlassPanel>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="rounded-[32px] p-6 sm:p-7">
            <SectionHeader
              eyebrow="Visible Knowledge"
              title="AI-known movement dictionary"
              description="SkateSync AI uses this movement dictionary to generate plans, analyze video, and provide feedback."
            />

            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveFilter(category.id)}
                  className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                    activeFilter === category.id
                      ? "border-violet-300/35 bg-violet-400/14 text-white"
                      : "border-white/8 bg-white/0 text-white/55 hover:bg-white/5"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              {catalogItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[20px] border border-white/8 bg-white/5 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-white">
                      {item.title}
                    </p>
                    <Tag tone="soft">{categoryLabel(item.category)}</Tag>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/62">
                    {item.summary}
                  </p>
                  <div className="mt-4 grid gap-2">
                    {[...item.coaching_cues, ...item.timing_cues]
                      .slice(0, 2)
                      .map((cue) => (
                        <div
                          key={cue}
                          className="rounded-2xl border border-ice-300/12 bg-ice-300/6 px-3 py-2 text-sm text-ice-100/88"
                        >
                          {cue}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <GlassPanel className="rounded-[32px] p-6 sm:p-7">
            <SectionHeader
              eyebrow="Voice Coaching"
              title="Mixed audio and scrolling cue sync"
              description="The player pairs beat-snapped voice coaching with movement visuals so the athlete can simply press play and skate."
            />

            <div className="mt-6 space-y-4">
              <div className="overflow-hidden rounded-[26px] border border-white/8 bg-black/30">
                <video
                  key={visibleCue.clip}
                  src={visibleCue.clip}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-[280px] w-full object-cover"
                />
              </div>

              <div className="rounded-[24px] border border-white/8 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-white/42">
                      Live cue
                    </p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      {visibleCue.movement}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPlaying((current) => !current)}
                    className="rounded-full border border-ice-300/25 bg-ice-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white"
                  >
                    {isPlaying ? "Pause sync" : "Resume sync"}
                  </button>
                </div>
                <p className="mt-4 text-base leading-7 text-white/72">
                  {visibleCue.cue}
                </p>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="animate-pulse-line h-full w-2/3 rounded-full bg-[linear-gradient(90deg,_#ddb7ff_0%,_#2fd9f4_100%)]" />
                </div>
              </div>

              <div className="grid gap-3">
                {coachingSequence.map((cue, index) => (
                  <div
                    key={cue.movement}
                    className={`rounded-[20px] border px-4 py-3 transition ${
                      index === activeCueIndex
                        ? "border-ice-300/25 bg-ice-300/10"
                        : "border-white/8 bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">
                        {cue.movement}
                      </p>
                      <span className="text-[11px] uppercase tracking-[0.28em] text-white/40">
                        cue {index + 1}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/58">
                      {cue.cue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="rounded-[32px] p-6 sm:p-7">
            <SectionHeader
              eyebrow="Autonomous Timeline"
              title="Planned choreography route"
              description="Each pin shows the exact second where the AI plans to trigger a movement, using the same movement names as the visible catalog."
            />

            <div className="mt-8 rounded-[24px] border border-white/8 bg-white/5 px-4 py-6">
              <div className="relative">
                <div className="absolute left-0 right-0 top-4 h-px bg-white/10" />
                <div className="relative grid grid-cols-7 gap-2">
                  {musicPlan.map((item) => (
                    <div key={`${item.time}-${item.movement}`} className="text-center">
                      <div className="mx-auto h-3 w-3 rounded-full bg-[linear-gradient(135deg,_#ddb7ff_0%,_#2fd9f4_100%)] shadow-[0_0_18px_rgba(47,217,244,0.45)]" />
                      <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-white/38">
                        {item.time}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {item.movement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {musicPlan.map((item) => (
                <div
                  key={`${item.seconds}-${item.movement}`}
                  className="rounded-[22px] border border-white/8 bg-white/5 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-white">
                          {item.movement}
                        </p>
                        <Tag tone="default">{item.category}</Tag>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${statusTone[item.timing]}`}
                        >
                          {item.timing}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-white/60">
                        {item.note}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/5 px-3 py-2 text-sm font-semibold text-white">
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-6">
            <GlassPanel className="rounded-[32px] p-6 sm:p-7">
              <SectionHeader
                eyebrow="Vision Review"
                title="Per-element scoring and timing badges"
                description="After training, the uploaded video is compared with the planned timeline to produce stable, easy-to-read feedback."
              />

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {reviewCards.map((card) => (
                  <ScoreRing
                    key={card.title}
                    value={card.value}
                    label={card.title}
                    detail={card.detail}
                  />
                ))}
              </div>
            </GlassPanel>

            <GlassPanel className="rounded-[32px] p-6 sm:p-7">
              <SectionHeader
                eyebrow="Processing State"
                title="Long-running analysis explained simply"
                description="The interface keeps advanced processing in the background and shows only the progress athletes and coaches need."
              />
              <div className="mt-6 space-y-4">
                {[
                  ["Frame selection", 100],
                  ["Plan matching", 88],
                  ["Stability scoring", 74],
                  ["Coach commentary", detailedCommentary ? 62 : 0],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <p className="text-sm text-white/42">
                        {value === 0 ? "Skipped" : `${value}%`}
                      </p>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,_#6f00be_0%,_#ddb7ff_45%,_#2fd9f4_100%)]"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>

          <GlassPanel className="rounded-[32px] p-6 sm:p-7">
            <SectionHeader
              eyebrow="Coach Notes"
              title="Chat-style feedback"
              description="Optional commentary is presented in natural language so the athlete immediately understands what to repeat and what to adjust."
            />

            <div className="mt-6 space-y-3">
              {movementCommentary.map((comment) => (
                <div
                  key={comment}
                  className="rounded-[22px] border border-white/8 bg-white/5 p-4"
                >
                  <p className="text-sm leading-7 text-white/72">{comment}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-violet-300/15 bg-[linear-gradient(135deg,_rgba(111,0,190,0.18)_0%,_rgba(47,217,244,0.08)_100%)] p-5">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/44">
                Session Summary
              </p>
              <p className="mt-3 text-xl font-semibold text-white">
                Strong musical alignment with a few stability moments to clean.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/64">
                The athlete followed the route confidently. The next gain is
                tightening spin center control and protecting landing flow after
                the jump accents.
              </p>
            </div>
          </GlassPanel>
        </section>
      </main>
    </div>
  );
}

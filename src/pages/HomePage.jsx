import { GlassPanel, SectionHeader, StatCard, Tag, WaveAccent } from "../components/ui";
import { recentProgram, scoreCards } from "../data/mockData";

export default function HomePage({ onNavigate }) {
  return (
    <div className="space-y-4 rounded-[28px] p-2">
      <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <GlassPanel className="relative overflow-hidden p-6 sm:p-7 lg:p-8">
          <div className="absolute left-[-8%] top-[-12%] h-44 w-44 rounded-full bg-white/70 blur-3xl" />
          <div className="absolute right-[12%] top-[8%] h-36 w-36 rounded-full bg-cyan-100/70 blur-3xl" />
          <WaveAccent className="absolute bottom-[-8%] right-[-4%] h-full w-[78%] opacity-80" />

          <div className="relative z-10 flex h-full flex-col justify-between gap-8">
            <div className="space-y-5">
              <Tag tone="bright">Welcome back</Tag>
              <div className="space-y-4">
                <h1 className="max-w-2xl font-display text-4xl leading-none text-navy sm:text-5xl xl:text-[4.1rem]">
                  Shape your next program with calm, music-aware structure.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Your draft is trending upward. Refine phrasing, adjust
                  technical timing, and keep the closing sequence elegant.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {["Figure Skating", "Junior Elite", "Season 2026"].map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onNavigate?.("music-analysis")}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-navy px-6 text-sm font-semibold text-white transition duration-200 hover:bg-[#12275a]"
              >
                Create New Program
              </button>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-7">
          <SectionHeader
            eyebrow="Recent Program"
            title={recentProgram.title}
            description={recentProgram.category}
            action={<Tag tone="soft">Live draft</Tag>}
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <GlassPanel className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Duration
              </p>
              <p className="mt-2 text-2xl font-semibold text-navy">
                {recentProgram.duration}
              </p>
            </GlassPanel>
            <GlassPanel className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Updated
              </p>
              <p className="mt-2 text-base font-semibold text-navy">
                {recentProgram.updated}
              </p>
            </GlassPanel>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            {recentProgram.note}
          </p>
        </GlassPanel>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {scoreCards.map((card, index) => (
          <StatCard
            key={card.title}
            label={card.title}
            value={card.value}
            detail={card.detail}
            progress={card.progress}
            accent={card.accent}
            className="animate-rise"
            style={{ animationDelay: `${0.08 * index}s` }}
          />
        ))}
      </div>
    </div>
  );
}

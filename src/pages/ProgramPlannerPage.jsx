import { GlassPanel, SectionHeader, Tag } from "../components/ui";
import { timelineItems } from "../data/mockData";

function TimelineCard({ item, index }) {
  return (
    <div className="grid gap-4 rounded-[24px] border border-white/75 bg-white/60 p-4 sm:p-5 md:grid-cols-[104px_1fr]">
      <div className="flex items-center gap-3 md:flex-col md:items-start">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-ice-200 bg-ice-50 text-sm font-semibold text-sky-800">
          {index + 1}
        </span>
        <div>
          <p className="text-lg font-semibold tracking-tight text-navy">
            {item.time}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Cue time
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-xl font-semibold tracking-tight text-navy">
              {item.title}
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              <Tag tone="soft">{item.zone}</Tag>
              <Tag>Estimated value {item.value}</Tag>
            </div>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-500">{item.note}</p>
      </div>
    </div>
  );
}

export default function ProgramPlannerPage({ onNavigate }) {
  return (
    <div className="space-y-4 rounded-[28px] p-2">
      <div className="grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
        <GlassPanel className="p-6 sm:p-7">
          <SectionHeader
            eyebrow="Program Planner"
            title="Moonlit Edges"
            description="A short program draft with rising orchestral phrasing, lighter transitions, and a cleaner final emotional resolve."
            action={
              <button
                type="button"
                onClick={() => onNavigate?.("video-analysis")}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-navy px-4 text-sm font-semibold text-white transition duration-200 hover:bg-[#12275a]"
              >
                Review Practice Video
              </button>
            }
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {[
              ["Total Duration", "2:42"],
              ["Focus Zone", "Mid-program phrasing"],
              ["Estimated Total", "14.3"],
            ].map(([label, value]) => (
              <GlassPanel key={label} className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-navy">{value}</p>
              </GlassPanel>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-white/75 bg-white/55 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Planner summary
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              The opening stays restrained, the first jump lands on the earliest
              strong accent, and the sit spin remains reserved for the longest
              musical lift.
            </p>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-7">
          <SectionHeader
            eyebrow="Timeline"
            title="Program structure"
            description="Clean mock timeline with music zones, values, and coaching notes."
          />

          <div className="mt-6 space-y-3">
            {timelineItems.map((item, index) => (
              <TimelineCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

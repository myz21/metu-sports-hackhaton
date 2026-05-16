import { GlassPanel, ProgressList, SectionHeader, StatCard } from "../components/ui";
import { coachInsights, feedbackPriorities, scoreCards } from "../data/mockData";

export default function FeedbackPage({ onNavigate }) {
  return (
    <div className="space-y-4 rounded-[28px] p-2">
      <div className="grid gap-4 md:grid-cols-3">
        {scoreCards.map((card) => (
          <StatCard
            key={card.title}
            label={card.title}
            value={card.value}
            detail={card.detail}
            progress={card.progress}
            accent={card.accent}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <GlassPanel className="p-6 sm:p-7">
          <SectionHeader
            eyebrow="AI Feedback"
            title="Coach-style summary"
            description="Readable insight from mock sync, stability, and choreography signals."
            action={
              <button
                type="button"
                onClick={() => onNavigate?.("library")}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-navy px-4 text-sm font-semibold text-white transition duration-200 hover:bg-[#12275a]"
              >
                Open Library
              </button>
            }
          />

          <div className="mt-6 space-y-3">
            {feedbackPriorities.map((item, index) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-white/75 bg-white/55 p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-ice-200 bg-ice-50 text-sm font-semibold text-sky-800">
                    {index + 1}
                  </span>
                  <p className="text-lg font-semibold tracking-tight text-navy">
                    {item.title}
                  </p>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-7">
          <SectionHeader
            eyebrow="Insight Balance"
            title="What improved"
            description="Simple mock breakdown of where the current draft is strongest."
          />

          <div className="mt-6">
            <ProgressList items={coachInsights} />
          </div>

          <div className="mt-6 grid gap-3">
            {[
              "The main spin now lands almost exactly on the strongest musical lift.",
              "The step sequence reads rhythmically but can use quieter upper-body transitions.",
              "The finish is emotionally correct and should be held with more stillness.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/75 bg-white/55 p-4 text-sm leading-6 text-slate-500"
              >
                {item}
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

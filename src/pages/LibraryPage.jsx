import { GlassPanel, SectionHeader } from "../components/ui";
import { librarySections } from "../data/mockData";

export default function LibraryPage() {
  return (
    <div className="space-y-4 rounded-[28px] p-2">
      <GlassPanel className="p-6 sm:p-7">
        <SectionHeader
          eyebrow="Library"
          title="Your saved creative assets"
          description="Keep audio, practice footage, and saved programs in one calm working surface. All items stay mock-only in this prototype."
        />
      </GlassPanel>

      <div className="grid gap-4 xl:grid-cols-3">
        {librarySections.map((section) => (
          <GlassPanel key={section.title} className="p-6 sm:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700/55">
              {section.eyebrow}
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-navy">
              {section.title}
            </h3>

            <div className="mt-6 space-y-3">
              {section.items.map((item) => (
                <div
                  key={item.name}
                  className="rounded-[22px] border border-white/75 bg-white/60 p-4"
                >
                  <p className="text-sm font-semibold text-navy">{item.name}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.meta}
                  </p>
                </div>
              ))}
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}

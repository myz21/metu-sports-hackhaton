import { GlassPanel, SectionHeader, Tag } from "../components/ui";
import { librarySections, movementKnowledgeCatalog } from "../data/mockData";

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

      <GlassPanel className="p-6 sm:p-7">
        <SectionHeader
          eyebrow={movementKnowledgeCatalog.eyebrow}
          title={movementKnowledgeCatalog.title}
          description={movementKnowledgeCatalog.description}
        />

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {movementKnowledgeCatalog.groups.map((group) => (
              <div
                key={group.title}
                className="rounded-[24px] border border-white/75 bg-white/56 p-5"
              >
                <h3 className="text-lg font-semibold tracking-tight text-navy">
                  {group.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {group.detail}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Tag key={item} tone="soft">
                      {item}
                    </Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[24px] border border-white/75 bg-white/56 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700/55">
              Shared sources
            </p>
            <div className="mt-4 space-y-3">
              {movementKnowledgeCatalog.sources.map((source) => (
                <div
                  key={source.path}
                  className="rounded-[18px] border border-white/80 bg-white/72 p-4"
                >
                  <p className="text-sm font-semibold text-navy">
                    {source.label}
                  </p>
                  <p className="mt-2 break-all text-sm leading-6 text-slate-500">
                    {source.path}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[18px] border border-white/80 bg-gradient-to-br from-ice-100/80 via-white to-cyan-50/80 p-4">
              <p className="text-sm font-semibold text-navy">
                Why this matters
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Program naming, library plan selection, and VLM review all work
                from the same movement vocabulary. That keeps coaching feedback
                more consistent across the app.
              </p>
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}

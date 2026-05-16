import { GlassPanel, SectionHeader, Tag } from "../components/ui";
import { availableElements, selectedElements } from "../data/mockData";

function ElementCard({ element, selected = false }) {
  return (
    <GlassPanel className={`p-4 ${selected ? "ring-1 ring-ice-300" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold tracking-tight text-navy">
            {element.name}
          </p>
          <p className="mt-2 text-sm text-slate-500">{element.type}</p>
        </div>
        <Tag tone={selected ? "soft" : "default"}>
          {selected ? "Selected" : element.fit}
        </Tag>
      </div>
      <div className="mt-4 rounded-[18px] border border-white/75 bg-white/55 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          Estimated value
        </p>
        <p className="mt-2 text-lg font-semibold text-navy">{element.value}</p>
      </div>
    </GlassPanel>
  );
}

export default function ElementSelectionPage({ onNavigate }) {
  return (
    <div className="space-y-4 rounded-[28px] p-2">
      <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
        <GlassPanel className="p-6 sm:p-7">
          <SectionHeader
            eyebrow="Selected Elements"
            title="Current planning set"
            description="These elements are available to the planner when building the first draft."
            action={
              <button
                type="button"
                onClick={() => onNavigate?.("program-planner")}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-navy px-4 text-sm font-semibold text-white transition duration-200 hover:bg-[#12275a]"
              >
                Build Program
              </button>
            }
          />

          <div className="mt-6 flex flex-wrap gap-2.5">
            {selectedElements.map((item) => (
              <Tag key={item} tone="soft">
                {item}
              </Tag>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {[
              ["Total selected", `${selectedElements.length} elements`],
              ["Risk balance", "Balanced mix"],
              ["Jump load", "2 low-risk jumps"],
              ["Expression focus", "Spin + transitions"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[20px] border border-white/75 bg-white/55 px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  {label}
                </p>
                <p className="mt-2 text-sm font-semibold text-navy">{value}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-7">
          <SectionHeader
            eyebrow="Element Library"
            title="Available vocabulary"
            description="Choose what the athlete can actually perform before generating structure."
          />

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {availableElements.map((element) => (
              <ElementCard
                key={element.name}
                element={element}
                selected={selectedElements.includes(element.name)}
              />
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

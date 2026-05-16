import { GlassPanel, ProgressList, SectionHeader, Tag } from "../components/ui";
import { analysisFrames, uploadSections } from "../data/mockData";

export default function VideoAnalysisPage({ onNavigate }) {
  return (
    <div className="space-y-4 rounded-[28px] p-2">
      <div className="grid gap-4 xl:grid-cols-[0.84fr_1.16fr]">
        <GlassPanel className="p-6 sm:p-7">
          <SectionHeader
            eyebrow="Video Upload"
            title="Performance analyzer"
            description="Bring in a practice clip and compare it against the planned choreography timeline."
            action={
              <button
                type="button"
                onClick={() => onNavigate?.("feedback")}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-navy px-4 text-sm font-semibold text-white transition duration-200 hover:bg-[#12275a]"
              >
                View AI Feedback
              </button>
            }
          />

          <div className="mt-6 rounded-[26px] border border-dashed border-ice-300 bg-white/55 p-6">
            <p className="text-lg font-semibold text-navy">
              Drop training footage here
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This mock screen represents the upload state, planned sync mode,
              and basic analysis outputs without backend processing.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {uploadSections.map((item) => (
              <div
                key={item.label}
                className="rounded-[22px] border border-white/75 bg-white/55 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-navy">{item.label}</p>
                  <Tag tone={item.status === "Uploaded" ? "soft" : "default"}>
                    {item.status}
                  </Tag>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-7">
          <SectionHeader
            eyebrow="Analysis Preview"
            title="Pose and timing checks"
            description="Mock review of how the uploaded runthrough compares against the planned routine."
          />

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-[24px] border border-white/75 bg-[linear-gradient(180deg,_rgba(255,255,255,0.86)_0%,_rgba(234,247,255,0.84)_100%)] p-5">
              <div className="flex aspect-video items-center justify-center rounded-[20px] border border-white/80 bg-white/40">
                <div className="space-y-3 text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700/55">
                    Practice frame preview
                  </p>
                  <div className="mx-auto h-28 w-28 rounded-full border border-ice-200 bg-ice-50/80" />
                  <p className="text-sm text-slate-500">
                    Simplified placeholder for pose/video surface
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/75 bg-white/55 p-5">
              <ProgressList items={analysisFrames.map((item) => ({ label: item.label, value: item.value }))} />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {analysisFrames.map((item) => (
              <div
                key={item.label}
                className="rounded-[22px] border border-white/75 bg-white/55 p-4"
              >
                <p className="text-sm font-semibold text-navy">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-navy">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

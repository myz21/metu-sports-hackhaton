import { GlassPanel, InfoRow, SectionHeader } from "../components/ui";
import { athleteSetup } from "../data/mockData";

function SetupField({ label, value, helper }) {
  return (
    <div className="rounded-[22px] border border-white/75 bg-white/55 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-navy">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
    </div>
  );
}

export default function AthleteSetupPage({ onNavigate }) {
  return (
    <div className="space-y-4 rounded-[28px] p-2">
      <GlassPanel className="p-6 sm:p-7">
        <SectionHeader
          eyebrow="Athlete Setup"
          title="Planning preferences"
          description="Set the competitive context before the AI suggests a music-aware routine draft."
          action={
            <button
              type="button"
              onClick={() => onNavigate?.("element-selection")}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-navy px-4 text-sm font-semibold text-white transition duration-200 hover:bg-[#12275a]"
            >
              Select Elements
            </button>
          }
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SetupField
            label="Sport Type"
            value={athleteSetup.sport}
            helper="Controls language, program expectations, and style context."
          />
          <SetupField
            label="Athlete Level"
            value={athleteSetup.level}
            helper="Used to keep recommendations realistic for the skater."
          />
          <SetupField
            label="Program Duration"
            value={athleteSetup.duration}
            helper="Defines the usable timeline window for the draft."
          />
          <SetupField
            label="Target Technical Score"
            value={athleteSetup.targetScore}
            helper="Helps balance difficulty against the structure of the music."
          />
        </div>
      </GlassPanel>

      <div className="grid gap-4 xl:grid-cols-[0.86fr_1.14fr]">
        <GlassPanel className="p-6 sm:p-7">
          <SectionHeader
            eyebrow="Planning Mode"
            title="Risk and coaching emphasis"
            description="Guide the planner toward safer or more ambitious routines."
          />

          <div className="mt-6 space-y-3">
            <InfoRow label="Risk profile" value={athleteSetup.risk} />
            <InfoRow label="Primary focus" value="Timing + landing flow" />
            <InfoRow label="Season goal" value="Refined short program for competition" />
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-7">
          <SectionHeader
            eyebrow="Coach Note"
            title="What the planner should optimize"
            description={athleteSetup.focus}
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Preserve strong musical rise at 01:46",
              "Avoid overloading the opening 30 seconds",
              "Leave space for elegant transitions",
              "Close on a stable choreographic finish",
            ].map((note) => (
              <div
                key={note}
                className="rounded-[22px] border border-white/75 bg-white/55 p-4 text-sm leading-6 text-slate-500"
              >
                {note}
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

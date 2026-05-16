import { GlassPanel, SectionHeader, Tag } from "../components/ui";
import { profile } from "../data/mockData";

export default function ProfilePage() {
  return (
    <div className="space-y-4 rounded-[28px] p-2">
      <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
        <GlassPanel className="p-6 sm:p-7">
          <SectionHeader
            eyebrow="Profile"
            title={profile.athleteName}
            description="Saved athlete profile and planning identity for SkateSync AI."
          />

          <div className="mt-6 grid gap-3">
            {[
              ["Athlete level", profile.athleteLevel],
              ["Sport type", profile.sportType],
              ["Target technical score", profile.targetTechnicalScore],
              ["Season goal", profile.seasonGoal],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[22px] border border-white/75 bg-white/60 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  {label}
                </p>
                <p className="mt-2 text-xl font-semibold text-navy">{value}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-7">
          <SectionHeader
            eyebrow="Available Elements"
            title="Technical vocabulary"
            description="Saved set of elements the planner can use when generating program structure."
            action={<Tag tone="bright">{profile.availableElements.length} tags</Tag>}
          />

          <div className="mt-6 flex flex-wrap gap-2.5">
            {profile.availableElements.map((tag) => (
              <Tag key={tag} tone="soft">
                {tag}
              </Tag>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

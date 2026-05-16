import { GlassPanel, InfoRow, ProgressList, SectionHeader, Tag } from "../components/ui";
import { energySegments, musicTrack } from "../data/mockData";

function WaveformCard() {
  const bars = [22, 44, 38, 72, 64, 92, 56, 78, 32, 58, 88, 40, 62, 74, 28, 46];

  return (
    <GlassPanel className="p-6 sm:p-7">
      <SectionHeader
        eyebrow="Energy Graph"
        title="Track intensity map"
        description="Mock waveform blocks and beat density to visualize emotional structure."
      />

      <div className="mt-6 rounded-[24px] border border-white/75 bg-[linear-gradient(180deg,_rgba(255,255,255,0.85)_0%,_rgba(237,248,255,0.8)_100%)] p-5">
        <div className="flex h-44 items-end gap-2">
          {bars.map((bar, index) => (
            <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2">
              <div
                className="w-full rounded-full bg-gradient-to-t from-sky-400 via-cyan-300 to-white"
                style={{ height: `${bar}%` }}
              />
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {musicTrack.peaks.map((peak) => (
            <Tag key={peak} tone="soft">
              Peak {peak}
            </Tag>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}

export default function MusicAnalysisPage({ onNavigate }) {
  return (
    <div className="space-y-4 rounded-[28px] p-2">
      <div className="grid gap-4 xl:grid-cols-[0.86fr_1.14fr]">
        <GlassPanel className="p-6 sm:p-7">
          <SectionHeader
            eyebrow="Music Upload"
            title="Reference track"
            description="Upload or replace the routine soundtrack before generating choreography suggestions."
            action={
              <button
                type="button"
                onClick={() => onNavigate?.("athlete-setup")}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-navy px-4 text-sm font-semibold text-white transition duration-200 hover:bg-[#12275a]"
              >
                Continue to Setup
              </button>
            }
          />

          <div className="mt-6 rounded-[26px] border border-dashed border-ice-300 bg-white/55 p-6">
            <p className="text-lg font-semibold text-navy">{musicTrack.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Drag and drop area for audio files. This screen stays visual-only
              for now, with no upload logic attached.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Tag>{musicTrack.duration}</Tag>
              <Tag>{musicTrack.bpm} BPM</Tag>
              <Tag>{musicTrack.mood}</Tag>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <InfoRow label="Detected tempo" value={`${musicTrack.bpm} BPM`} />
            <InfoRow label="Estimated duration" value={musicTrack.duration} />
            <InfoRow label="Dominant mood" value="Elegant / Cinematic / Rising" />
          </div>
        </GlassPanel>

        <WaveformCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <GlassPanel className="p-6 sm:p-7">
          <SectionHeader
            eyebrow="Detected Zones"
            title="Music section breakdown"
            description="Mock AI segmentation of the soundtrack into planning-friendly zones."
          />

          <div className="mt-6 space-y-3">
            {[
              ["00:00 - 00:20", "Soft intro / edge work"],
              ["00:21 - 00:49", "First rise / jump-ready accent"],
              ["00:50 - 01:20", "Rhythmic bridge / steps"],
              ["01:21 - 02:02", "Main climax / sustained spin zone"],
              ["02:03 - 02:42", "Resolve / finish pose"],
            ].map(([time, note]) => (
              <div
                key={time}
                className="rounded-[22px] border border-white/75 bg-white/55 px-4 py-4"
              >
                <p className="text-sm font-semibold text-navy">{time}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{note}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-7">
          <SectionHeader
            eyebrow="Energy Balance"
            title="Intensity priorities"
            description="Use this quick readout to place technical and expressive elements at the right moments."
          />

          <div className="mt-6">
            <ProgressList items={energySegments} />
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

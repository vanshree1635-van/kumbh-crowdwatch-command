import { createFileRoute } from "@tanstack/react-router";
import { Slider } from "@/components/ui/slider";
import { useDemoStore } from "@/lib/demo-store";
import { PageHeader, Panel, SimulateAlertButton, SimulatedTag } from "@/components/kr/shared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/crowd")({
  head: () => ({
    meta: [
      { title: "Crowd Analytics · KumbhRakshak AI" },
      { name: "description", content: "Crowd-density heatmap illustration with configurable thresholds." },
      { property: "og:title", content: "Crowd Analytics · KumbhRakshak AI" },
      { property: "og:description", content: "Sample crowd-density heatmap and thresholds." },
    ],
  }),
  component: Crowd,
});

function Crowd() {
  const { cameras, thresholds, setThresholds } = useDemoStore();
  const level = (n: number) => (n >= thresholds.critical ? "Critical" : n >= thresholds.warning ? "Warning" : "Normal");
  const tone = { Critical: "text-destructive", Warning: "text-warning", Normal: "text-success" };

  return (
    <>
      <PageHeader title="Crowd Analytics" subtitle="Heatmap is an illustration built from sample counts" action={<SimulateAlertButton />} />
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Density heatmap (illustrative)" className="xl:col-span-2">
          <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-secondary scanlines">
            {cameras.map((c) => {
              const size = 15 + (c.peopleCount / 2500) * 30;
              return (
                <div key={c.id} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full heat-blob" style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${size}%`, aspectRatio: "1", opacity: 0.4 + c.peopleCount / 4000 }} />
              );
            })}
            {cameras.map((c) => (
              <div key={c.id + "l"} className="absolute -translate-x-1/2 font-mono text-[10px]" style={{ left: `${c.x}%`, top: `${c.y + 4}%` }}>{c.id}</div>
            ))}
            <div className="absolute right-2 top-2"><SimulatedTag /></div>
          </div>
        </Panel>
        <Panel title="Density thresholds (people per zone)">
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-sm"><span>Warning</span><span className="font-mono text-warning">{thresholds.warning}</span></div>
              <Slider min={500} max={3000} step={50} value={[thresholds.warning]} onValueChange={([v]) => setThresholds({ warning: Math.min(v, thresholds.critical - 50), critical: thresholds.critical })} />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm"><span>Critical</span><span className="font-mono text-destructive">{thresholds.critical}</span></div>
              <Slider min={600} max={4000} step={50} value={[thresholds.critical]} onValueChange={([v]) => setThresholds({ warning: thresholds.warning, critical: Math.max(v, thresholds.warning + 50) })} />
            </div>
            <p className="text-xs text-muted-foreground">Changing thresholds updates zone levels and dashboard warnings instantly.</p>
          </div>
        </Panel>
      </div>
      <Panel title="Sample people counts" className="mt-6">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground"><tr><th className="py-2">Camera</th><th>Zone</th><th>Count</th><th>Level</th></tr></thead>
          <tbody>
            {cameras.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="py-2 font-mono">{c.id}</td><td>{c.zone}</td><td className="font-mono">{c.peopleCount.toLocaleString()}</td>
                <td className={cn("font-medium", tone[level(c.peopleCount)])}>{level(c.peopleCount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Video, Siren, Users, Activity } from "lucide-react";
import { useDemoStore, isActive, formatTime, type Camera } from "@/lib/demo-store";
import { PageHeader, Panel, SimulateAlertButton, CameraFeed, CameraSheet, SeverityBadge, StatusBadge, camDot } from "@/components/kr/shared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · KumbhRakshak AI" },
      { name: "description", content: "Command-centre overview of cameras, alerts and crowd density (demo data)." },
      { property: "og:title", content: "Dashboard · KumbhRakshak AI" },
      { property: "og:description", content: "Crowd safety command-centre demo for Ardh Kumbh 2027." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { cameras, incidents, thresholds } = useDemoStore();
  const [cam, setCam] = useState<Camera | null>(null);
  const active = incidents.filter(isActive);
  const densityWarnings = cameras.filter((c) => c.peopleCount >= thresholds.warning).length + active.filter((i) => i.type === "Crowd Density").length;
  const online = cameras.filter((c) => c.status === "Online").length;

  const stats = [
    { label: "Cameras", value: cameras.length, sub: `${online} online`, icon: Video, tone: "text-primary" },
    { label: "Active alerts", value: active.length, sub: "unresolved incidents", icon: Siren, tone: "text-destructive" },
    { label: "Density warnings", value: densityWarnings, sub: `threshold ${thresholds.warning.toLocaleString()}`, icon: Users, tone: "text-warning" },
    { label: "Sample people count", value: cameras.reduce((a, c) => a + c.peopleCount, 0).toLocaleString(), sub: "all zones (sample)", icon: Activity, tone: "text-success" },
  ];

  return (
    <>
      <PageHeader title="Command Dashboard" subtitle="Ardh Kumbh 2027 · Haridwar (fictional zones)" action={<SimulateAlertButton />} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Panel key={s.label}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className="mt-1 text-3xl font-semibold" data-testid={s.label}>{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.sub}</div>
              </div>
              <s.icon className={cn("h-6 w-6", s.tone)} />
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="CCTV cameras · click to open" className="xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {cameras.map((c) => (
              <button key={c.id} onClick={() => setCam(c)} className="rounded-md border border-border p-2 text-left transition hover:border-primary hover:glow">
                <CameraFeed cam={c} />
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.zone}</div>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs"><span className={cn("h-2 w-2 rounded-full", camDot(c.status))} />{c.status}</span>
                </div>
              </button>
            ))}
          </div>
        </Panel>
        <Panel title="Active alerts">
          <ul className="space-y-2">
            {active.slice(0, 6).map((i) => (
              <li key={i.id} className="rounded-md border border-border p-3">
                <div className="flex items-center justify-between"><span className="font-mono text-sm">{i.id}</span><SeverityBadge s={i.severity} /></div>
                <div className="mt-1 text-sm">{i.type}</div>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{i.zone} · {formatTime(i.time)}</span><StatusBadge s={i.status} />
                </div>
              </li>
            ))}
            {active.length === 0 && <p className="text-sm text-muted-foreground">No active alerts.</p>}
          </ul>
          <Link to="/incidents" className="mt-3 inline-block text-sm text-primary hover:underline">View all incidents →</Link>
        </Panel>
      </div>
      <CameraSheet cam={cam} onClose={() => setCam(null)} />
    </>
  );
}

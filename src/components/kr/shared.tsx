import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, ShieldAlert, UserSearch, Map, History, Shield, Video, Siren } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useDemoStore, isActive, formatTime, type Camera, type Incident, type IncidentStatus, type Severity } from "@/lib/demo-store";
import { cn } from "@/lib/utils";
import cam01 from "@/assets/cam-01.jpg";
import cam02 from "@/assets/cam-02.jpg";
import cam03 from "@/assets/cam-03.jpg";
import cam04 from "@/assets/cam-04.jpg";

// Simulated CCTV still frames (fictional demo images, not live feeds).
const camFrames: Record<string, string> = { "CAM-01": cam01, "CAM-02": cam02, "CAM-03": cam03, "CAM-04": cam04 };

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/crowd", label: "Crowd Analytics", icon: Users },
  { to: "/weapons", label: "Weapon Detection", icon: ShieldAlert },
  { to: "/poi", label: "Person of Interest", icon: UserSearch },
  { to: "/map", label: "Incident Map", icon: Map },
  { to: "/incidents", label: "Incident History", icon: History },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { incidents } = useDemoStore();
  const active = incidents.filter(isActive).length;
  return (
    <div className="flex min-h-screen w-full bg-background font-sans text-foreground">
      <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:w-60">
        <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4">
          <Shield className="h-7 w-7 shrink-0 text-primary" />
          <div className="hidden md:block">
            <div className="font-semibold leading-tight">KumbhRakshak AI</div>
            <div className="text-xs text-muted-foreground">Ardh Kumbh 2027</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {nav.map((n) => {
            const on = path === n.to;
            return (
              <Link key={n.to} to={n.to} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors", on ? "bg-sidebar-accent text-primary" : "text-sidebar-foreground hover:bg-sidebar-accent")}>
                <n.icon className="h-4 w-4 shrink-0" />
                <span className="hidden md:inline">{n.label}</span>
                {n.to === "/incidents" && active > 0 && (
                  <span className="ml-auto hidden rounded-full bg-destructive px-2 text-xs text-destructive-foreground md:inline">{active}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="hidden border-t border-sidebar-border p-4 text-xs text-muted-foreground md:block">
          Demo prototype · All data fictional · No live feeds
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-warning/40 bg-warning/10 px-6 py-2 text-xs text-warning">
          DEMONSTRATION MODE — cameras, detections and identities shown are simulated sample data, not live CCTV or real AI output.
        </div>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-lg border border-border bg-card p-4", className)}>
      {title && <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">{title}</h2>}
      {children}
    </section>
  );
}

export function SimulatedTag() {
  return <span className="rounded border border-warning/50 px-1.5 py-0.5 font-mono text-[10px] uppercase text-warning">Simulated</span>;
}

const sevClass: Record<Severity, string> = {
  Low: "bg-success/15 text-success",
  Medium: "bg-primary/15 text-primary",
  High: "bg-warning/15 text-warning",
  Critical: "bg-destructive/20 text-destructive",
};
export const SeverityBadge = ({ s }: { s: Severity }) => <span className={cn("rounded px-2 py-0.5 text-xs font-medium", sevClass[s])}>{s}</span>;

const statusClass: Record<IncidentStatus, string> = {
  New: "bg-destructive/20 text-destructive",
  Acknowledged: "bg-warning/15 text-warning",
  "Under Review": "bg-primary/15 text-primary",
  Resolved: "bg-success/15 text-success",
};
export const StatusBadge = ({ s }: { s: IncidentStatus }) => <span className={cn("rounded px-2 py-0.5 text-xs font-medium", statusClass[s])}>{s}</span>;

export const camDot = (s: Camera["status"]) => (s === "Online" ? "bg-success" : s === "Degraded" ? "bg-warning" : "bg-destructive");

export function SimulateAlertButton({ cameraId }: { cameraId?: string }) {
  const { simulateCrowdAlert } = useDemoStore();
  return (
    <Button
      variant="destructive"
      onClick={() => {
        const inc = simulateCrowdAlert(cameraId);
        toast.warning(`${inc.id} created (simulated)`, { description: `Crowd density alert · ${inc.zone}` });
      }}
    >
      <Siren className="h-4 w-4" /> Simulate crowd alert
    </Button>
  );
}

export function IncidentActions({ inc }: { inc: Incident }) {
  const { setStatus } = useDemoStore();
  const act = (s: IncidentStatus) => {
    setStatus(inc.id, s);
    toast.success(`${inc.id} → ${s}`);
  };
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="secondary" disabled={inc.status !== "New"} onClick={() => act("Acknowledged")}>Acknowledge</Button>
      <Button size="sm" variant="secondary" disabled={inc.status === "Under Review" || inc.status === "Resolved"} onClick={() => act("Under Review")}>Review</Button>
      <Button size="sm" disabled={inc.status === "Resolved"} onClick={() => act("Resolved")}>Resolve</Button>
    </div>
  );
}

export function CameraFeed({ cam, className }: { cam: Camera; className?: string }) {
  const frame = camFrames[cam.id];
  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-md bg-secondary", className)}>
      {frame ? (
        <img src={frame} alt={`Simulated CCTV frame · ${cam.name}`} width={1280} height={720} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <Video className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40" />
      )}
      <div className="absolute left-2 top-2 flex items-center gap-1.5 font-mono text-[10px] text-foreground/80">
        <span className={cn("h-2 w-2 rounded-full bg-success", cam.status !== "Online" && (cam.status === "Degraded" ? "bg-warning" : "bg-destructive"))} /> {cam.id}
      </div>
      <div className="absolute bottom-2 left-2 font-mono text-[10px] text-foreground/80">SIMULATED FOOTAGE · NOT LIVE</div>
    </div>
  );
}

export function CameraSheet({ cam, onClose }: { cam: Camera | null; onClose: () => void }) {
  const { incidents, thresholds } = useDemoStore();
  const related = cam ? incidents.filter((i) => i.cameraId === cam.id) : [];
  return (
    <Sheet open={!!cam} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {cam && (
          <>
            <SheetHeader>
              <SheetTitle>{cam.id} · {cam.name}</SheetTitle>
              <SheetDescription>{cam.zone}</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 px-4 pb-6">
              <CameraFeed cam={cam} />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-muted p-3"><div className="text-muted-foreground text-xs">Status</div>{cam.status}</div>
                <div className="rounded-md bg-muted p-3"><div className="text-muted-foreground text-xs">Sample count</div>{cam.peopleCount.toLocaleString()}</div>
              </div>
              <p className="text-xs text-muted-foreground">
                {cam.peopleCount >= thresholds.critical ? "Above critical threshold" : cam.peopleCount >= thresholds.warning ? "Above warning threshold" : "Within normal range"} (sample value).
              </p>
              <SimulateAlertButton cameraId={cam.id} />
              <div>
                <h3 className="mb-2 text-sm font-medium">Incidents from this camera</h3>
                {related.length === 0 && <p className="text-sm text-muted-foreground">None</p>}
                <ul className="space-y-2">
                  {related.map((i) => (
                    <li key={i.id} className="rounded-md border border-border p-2 text-sm">
                      <div className="flex justify-between"><span className="font-mono">{i.id}</span><StatusBadge s={i.status} /></div>
                      <div className="text-xs text-muted-foreground">{i.type} · {formatTime(i.time)}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function SiteMap({ onCamera, selectedIncident, onIncident }: { onCamera?: (c: Camera) => void; selectedIncident?: string | undefined; onIncident?: (i: Incident) => void }) {
  const { cameras, incidents } = useDemoStore();
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border bg-secondary">
      {/* fictional river + zones */}
      <div className="absolute inset-y-0 left-[44%] w-[10%] -skew-x-12 bg-primary/15" />
      <div className="absolute left-[46%] top-2 font-mono text-[10px] text-primary/70">RIVER (illustrative)</div>
      {[[10, 12, "A"], [56, 22, "B"], [8, 56, "C"], [60, 58, "D"]].map(([x, y, z]) => (
        <div key={z} className="absolute h-[34%] w-[32%] rounded-lg border border-dashed border-border" style={{ left: `${x}%`, top: `${y}%` }}>
          <span className="m-1 inline-block font-mono text-[10px] text-muted-foreground">SECTOR {z}</span>
        </div>
      ))}
      {incidents.filter(isActive).map((i) => (
        <button key={i.id} title={`${i.id} ${i.type}`} onClick={() => onIncident?.(i)} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${i.x}%`, top: `${i.y}%` }}>
          <span className={cn("block h-4 w-4 rounded-full bg-destructive ring-4 ring-destructive/30", selectedIncident === i.id && "ring-foreground")} />
          <span className="absolute inset-0 animate-ping rounded-full bg-destructive/50" />
        </button>
      ))}
      {cameras.map((c) => (
        <button key={c.id} onClick={() => onCamera?.(c)} className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded bg-card px-1.5 py-1 font-mono text-[10px] shadow glow hover:bg-accent" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
          <Video className="h-3 w-3 text-primary" /> {c.id}
        </button>
      ))}
    </div>
  );
}

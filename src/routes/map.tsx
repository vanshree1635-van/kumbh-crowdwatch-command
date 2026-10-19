import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useDemoStore, isActive, formatTime, type Camera } from "@/lib/demo-store";
import { PageHeader, Panel, SiteMap, CameraSheet, IncidentActions, SeverityBadge, StatusBadge, SimulateAlertButton } from "@/components/kr/shared";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Incident Map · KumbhRakshak AI" },
      { name: "description", content: "Interactive map of fictional camera markers and incident locations." },
      { property: "og:title", content: "Incident Map · KumbhRakshak AI" },
      { property: "og:description", content: "Fictional camera and incident map." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { incidents } = useDemoStore();
  const [cam, setCam] = useState<Camera | null>(null);
  const [selId, setSelId] = useState<string | undefined>();
  const sel = incidents.find((i) => i.id === selId);
  return (
    <>
      <PageHeader title="Incident Map" subtitle="Fictional layout · click a camera or red incident marker" action={<SimulateAlertButton />} />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2"><SiteMap onCamera={setCam} selectedIncident={selId} onIncident={(i) => setSelId(i.id)} /></div>
        <Panel title="Selected incident">
          {sel ? (
            <div className="space-y-3">
              <div className="flex justify-between"><span className="font-mono">{sel.id}</span><SeverityBadge s={sel.severity} /></div>
              <div>{sel.type}</div>
              <div className="text-xs text-muted-foreground">{sel.zone} · {sel.cameraId} · {formatTime(sel.time)}</div>
              <p className="text-sm">{sel.note}</p>
              <StatusBadge s={sel.status} />
              <IncidentActions inc={sel} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a marker. {incidents.filter(isActive).length} active incidents shown.</p>
          )}
        </Panel>
      </div>
      <CameraSheet cam={cam} onClose={() => setCam(null)} />
    </>
  );
}

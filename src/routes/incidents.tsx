import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDemoStore, formatTime, ZONES, INCIDENT_TYPES, STATUSES } from "@/lib/demo-store";
import { PageHeader, Panel, IncidentActions, SeverityBadge, StatusBadge, SimulateAlertButton } from "@/components/kr/shared";

export const Route = createFileRoute("/incidents")({
  head: () => ({
    meta: [
      { title: "Incident History · KumbhRakshak AI" },
      { name: "description", content: "Filter incidents by type, zone and status; acknowledge, review and resolve." },
      { property: "og:title", content: "Incident History · KumbhRakshak AI" },
      { property: "og:description", content: "Incident log with operator status controls." },
    ],
  }),
  component: Incidents,
});

function Filter({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-52" aria-label={label}><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {label}</SelectItem>
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function Incidents() {
  const { incidents } = useDemoStore();
  const [type, setType] = useState("all");
  const [zone, setZone] = useState("all");
  const [status, setStatus] = useState("all");
  const list = incidents.filter((i) => (type === "all" || i.type === type) && (zone === "all" || i.zone === zone) && (status === "all" || i.status === status));

  return (
    <>
      <PageHeader title="Incident History" subtitle={`${list.length} of ${incidents.length} incidents`} action={<SimulateAlertButton />} />
      <div className="mb-4 flex flex-wrap gap-3">
        <Filter label="types" value={type} options={INCIDENT_TYPES} onChange={setType} />
        <Filter label="zones" value={zone} options={ZONES} onChange={setZone} />
        <Filter label="statuses" value={status} options={STATUSES} onChange={setStatus} />
        <Button variant="ghost" onClick={() => { setType("all"); setZone("all"); setStatus("all"); }}>Clear filters</Button>
      </div>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr><th className="py-2">ID</th><th>Time</th><th>Category</th><th>Zone</th><th>Severity</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {list.map((i) => (
                <tr key={i.id} className="border-t border-border align-middle">
                  <td className="py-3 font-mono">{i.id}</td>
                  <td className="whitespace-nowrap font-mono text-xs">{formatTime(i.time)}</td>
                  <td>{i.type}<div className="text-xs text-muted-foreground">{i.note}</div></td>
                  <td className="text-xs">{i.zone}</td>
                  <td><SeverityBadge s={i.severity} /></td>
                  <td><StatusBadge s={i.status} /></td>
                  <td><IncidentActions inc={i} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No incidents match these filters.</p>}
        </div>
      </Panel>
    </>
  );
}

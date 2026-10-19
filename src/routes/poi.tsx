import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, Panel, SimulatedTag } from "@/components/kr/shared";

export const Route = createFileRoute("/poi")({
  head: () => ({
    meta: [
      { title: "Person of Interest · KumbhRakshak AI" },
      { name: "description", content: "Synthetic identity records for demonstrating candidate review." },
      { property: "og:title", content: "Person of Interest · KumbhRakshak AI" },
      { property: "og:description", content: "Synthetic sample candidate records only." },
    ],
  }),
  component: Poi,
});

// SYNTHETIC identities only — not real people.
const records = [
  { id: "SYN-001", alias: "Test Subject Alpha", reason: "Missing person (sample)", lastSeen: "CAM-01", match: 0.74 },
  { id: "SYN-002", alias: "Test Subject Bravo", reason: "Lost child (sample)", lastSeen: "CAM-03", match: 0.61 },
  { id: "SYN-003", alias: "Test Subject Charlie", reason: "Watchlist drill (sample)", lastSeen: "CAM-02", match: 0.48 },
  { id: "SYN-004", alias: "Test Subject Delta", reason: "Missing elder (sample)", lastSeen: "CAM-04", match: 0.39 },
];

function Poi() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(records[0]);
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const list = records.filter((r) => (r.alias + r.id + r.reason).toLowerCase().includes(q.toLowerCase()));
  const decide = (v: string) => {
    setDecisions({ ...decisions, [sel.id]: v });
    toast.success(`${sel.id}: ${v}`);
  };
  return (
    <>
      <PageHeader title="Person of Interest" subtitle="Synthetic identities for training and demonstration only" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Candidate records" className="lg:col-span-2">
          <Input placeholder="Search synthetic records…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-3" />
          <ul className="space-y-2">
            {list.map((r) => (
              <li key={r.id}>
                <button onClick={() => setSel(r)} className={`flex w-full items-center gap-4 rounded-md border p-3 text-left hover:border-primary ${sel.id === r.id ? "border-primary bg-accent" : "border-border"}`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-mono text-xs">{r.alias.split(" ").pop()![0]}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{r.alias} <span className="font-mono text-xs text-muted-foreground">{r.id}</span></div>
                    <div className="text-xs text-muted-foreground">{r.reason} · last seen {r.lastSeen}</div>
                  </div>
                  <div className="text-right text-xs"><div className="font-mono">{(r.match * 100).toFixed(0)}%</div><div className="text-muted-foreground">{decisions[r.id] ?? "Unreviewed"}</div></div>
                </button>
              </li>
            ))}
            {list.length === 0 && <p className="text-sm text-muted-foreground">No matching records.</p>}
          </ul>
        </Panel>
        <Panel title="Candidate review">
          <div className="space-y-4">
            <div className="flex aspect-square items-center justify-center rounded-md bg-secondary scanlines text-4xl font-semibold text-muted-foreground">{sel.alias.split(" ").pop()![0]}</div>
            <div className="flex items-center justify-between"><div className="font-medium">{sel.alias}</div><SimulatedTag /></div>
            <div className="text-sm text-muted-foreground">{sel.reason}</div>
            <div className="text-sm">Mock similarity: <span className="font-mono">{(sel.match * 100).toFixed(0)}%</span></div>
            <div className="text-sm">Decision: <span className="text-primary">{decisions[sel.id] ?? "Unreviewed"}</span></div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => decide("Possible match")}>Possible match</Button>
              <Button variant="secondary" onClick={() => decide("Not a match")}>Not a match</Button>
            </div>
            <p className="text-xs text-muted-foreground">No real persons, photos or police records are used.</p>
          </div>
        </Panel>
      </div>
    </>
  );
}

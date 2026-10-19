import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, Panel, SimulatedTag } from "@/components/kr/shared";
import sample from "@/assets/detection-sample.jpg";

export const Route = createFileRoute("/weapons")({
  head: () => ({
    meta: [
      { title: "Weapon Detection · KumbhRakshak AI" },
      { name: "description", content: "Sample detection image with confidence display and evidence review." },
      { property: "og:title", content: "Weapon Detection · KumbhRakshak AI" },
      { property: "og:description", content: "Simulated detection review workflow." },
    ],
  }),
  component: Weapons,
});

const detections = [
  { id: "DET-21", label: "Long object (possible)", confidence: 0.82, box: { l: 36, t: 52, w: 7, h: 18 } },
  { id: "DET-22", label: "Bag (unattended?)", confidence: 0.57, box: { l: 66, t: 78, w: 6, h: 10 } },
];

type Verdict = "Pending" | "Confirmed threat" | "False positive" | "Escalated";

function Weapons() {
  const [sel, setSel] = useState(detections[0]!.id);
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({ "DET-21": "Pending", "DET-22": "Pending" });
  const [notes, setNotes] = useState("");
  const d = detections.find((x) => x.id === sel)!;

  const decide = (v: Verdict) => {
    setVerdicts({ ...verdicts, [sel]: v });
    toast.success(`${sel} marked: ${v}`);
  };

  return (
    <>
      <PageHeader title="Weapon Detection" subtitle="Sample still image with mock bounding boxes — not a real AI detection" />
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Sample frame · CAM-02" className="xl:col-span-2">
          <div className="relative overflow-hidden rounded-md">
            <img src={sample} alt="Sample crowd frame used for demo" width={1280} height={720} className="w-full" />
            {detections.map((x) => (
              <button key={x.id} onClick={() => setSel(x.id)} className={`absolute border-2 ${x.id === sel ? "border-destructive" : "border-warning"}`} style={{ left: `${x.box.l}%`, top: `${x.box.t}%`, width: `${x.box.w}%`, height: `${x.box.h}%` }}>
                <span className="absolute -top-5 left-0 whitespace-nowrap bg-destructive px-1 font-mono text-[10px] text-destructive-foreground">{x.id} {(x.confidence * 100).toFixed(0)}%</span>
              </button>
            ))}
            <div className="absolute right-2 top-2"><SimulatedTag /></div>
          </div>
        </Panel>
        <Panel title="Evidence review">
          <div className="space-y-4">
            <div className="flex gap-2">
              {detections.map((x) => (
                <Button key={x.id} size="sm" variant={x.id === sel ? "default" : "secondary"} onClick={() => setSel(x.id)}>{x.id}</Button>
              ))}
            </div>
            <div>
              <div className="text-sm">{d.label}</div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>Mock confidence</span><span className="font-mono">{(d.confidence * 100).toFixed(0)}%</span></div>
              <div className="mt-1 h-2 rounded bg-muted"><div className="h-2 rounded bg-destructive" style={{ width: `${d.confidence * 100}%` }} /></div>
            </div>
            <div className="text-sm">Verdict: <span className="font-medium text-primary">{verdicts[sel]}</span></div>
            <Textarea placeholder="Reviewer notes…" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Button variant="destructive" onClick={() => decide("Confirmed threat")}>Confirm</Button>
              <Button variant="secondary" onClick={() => decide("False positive")}>False positive</Button>
              <Button variant="outline" className="col-span-2" onClick={() => decide("Escalated")}>Escalate to field unit</Button>
            </div>
            <p className="text-xs text-muted-foreground">Human review is always required. Mock scores do not represent a real model.</p>
          </div>
        </Panel>
      </div>
    </>
  );
}

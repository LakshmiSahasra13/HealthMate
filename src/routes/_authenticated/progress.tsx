import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/AppLayout";
import { mondayOf, useCheckins, useSaveCheckin } from "@/hooks/use-healthmate";
import type { StressLevel } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({
    meta: [
      { title: "Weekly Progress – HealthMate" },
      { name: "description", content: "Log a weekly check-in and track your progress." },
    ],
  }),
  component: ProgressPage,
});

const STRESS: StressLevel[] = ["low", "moderate", "high"];

function ProgressPage() {
  const { data: checkins, isLoading } = useCheckins();
  const save = useSaveCheckin();
  const week = mondayOf();

  const [sleep, setSleep] = useState("7");
  const [water, setWater] = useState("2");
  const [sessions, setSessions] = useState("3");
  const [energy, setEnergy] = useState("3");
  const [weight, setWeight] = useState("");
  const [stress, setStress] = useState<StressLevel>("moderate");
  const [notes, setNotes] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sleepN = Number(sleep);
    const waterN = Number(water);
    const sessionsN = Number(sessions);
    const energyN = Number(energy);
    if ([sleepN, waterN, sessionsN, energyN].some((n) => Number.isNaN(n)) || sleepN < 0 || sleepN > 24) {
      toast.error("Please enter valid numbers.");
      return;
    }
    if (energyN < 1 || energyN > 5) {
      toast.error("Energy level must be between 1 and 5.");
      return;
    }
    save.mutate(
      {
        week_start: week,
        sleep_hours: sleepN,
        water_intake: waterN,
        exercise_sessions: sessionsN,
        energy_level: energyN,
        stress_level: stress,
        weight_kg: weight.trim() === "" ? null : Number(weight),
        notes: notes.trim() === "" ? null : notes.trim(),
      },
      {
        onSuccess: () => toast.success("Check-in saved"),
        onError: () => toast.error("Could not save check-in. Try again."),
      },
    );
  }

  const data = (checkins ?? []).map((c) => ({
    week: c.week_start.slice(5),
    Sleep: Number(c.sleep_hours),
    Water: Number(c.water_intake),
    Workouts: c.exercise_sessions,
    Energy: c.energy_level,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Progress"
        subtitle={`Check-in for the week starting ${week}. Saving again this week updates it.`}
      />

      <Card className="card-soft">
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="sleep">Avg sleep (hours)</Label>
              <Input id="sleep" type="number" step="0.5" min="0" max="24" value={sleep} onChange={(e) => setSleep(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="water">Avg water (litres/day)</Label>
              <Input id="water" type="number" step="0.25" min="0" value={water} onChange={(e) => setWater(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sessions">Exercise sessions</Label>
              <Input id="sessions" type="number" step="1" min="0" max="14" value={sessions} onChange={(e) => setSessions(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="energy">Energy (1-5)</Label>
              <Input id="energy" type="number" step="1" min="1" max="5" value={energy} onChange={(e) => setEnergy(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="weight">Weight (kg, optional)</Label>
              <Input id="weight" type="number" step="0.1" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Stress level</Label>
              <div className="flex gap-2">
                {STRESS.map((s) => (
                  <Button
                    key={s}
                    type="button"
                    size="sm"
                    variant={stress === s ? "default" : "outline"}
                    className="rounded-full capitalize"
                    onClick={() => setStress(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5 md:col-span-3">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>
            <div className="md:col-span-3">
              <Button type="submit" className="rounded-full" disabled={save.isPending}>
                {save.isPending && <Loader2 className="size-4 animate-spin" />} Save check-in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardContent className="p-6">
          <h2 className="font-display text-lg font-bold">Your trend</h2>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : data.length < 2 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Save check-ins for two or more weeks to see your trend.
            </p>
          ) : (
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Sleep" stroke="#2f855a" strokeWidth={2} />
                  <Line type="monotone" dataKey="Water" stroke="#3182ce" strokeWidth={2} />
                  <Line type="monotone" dataKey="Workouts" stroke="#dd6b20" strokeWidth={2} />
                  <Line type="monotone" dataKey="Energy" stroke="#805ad5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

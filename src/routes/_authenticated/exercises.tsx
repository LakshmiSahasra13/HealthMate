import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/AppLayout";
import { useHealthProfile } from "@/hooks/use-healthmate";
import { DISCLAIMER, EXERCISE_PLANS } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/exercises")({
  head: () => ({
    meta: [
      { title: "Exercise Plans – HealthMate" },
      { name: "description", content: "Beginner to active exercise plans for adults 20-35." },
    ],
  }),
  component: ExercisesPage,
});

function suggestedLevel(freq: string | undefined): "beginner" | "intermediate" | "active" {
  if (freq === "weekly_3_4" || freq === "daily") return "active";
  if (freq === "weekly_1_2") return "intermediate";
  return "beginner";
}

function ExercisesPage() {
  const { data: hp } = useHealthProfile();
  const suggested = suggestedLevel(hp?.exercise_frequency);
  const [selected, setSelected] = useState<string | null>(null);
  const activeId = selected ?? EXERCISE_PLANS.find((p) => p.level === suggested)?.id ?? EXERCISE_PLANS[0]?.id;
  const plan = EXERCISE_PLANS.find((p) => p.id === activeId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exercise Plans"
        subtitle={
          hp
            ? `Based on your answers we suggest the ${suggested} plan — switch any time.`
            : "Pick the plan that matches where you are today."
        }
      />

      <div className="flex flex-wrap gap-2">
        {EXERCISE_PLANS.map((p) => (
          <Button
            key={p.id}
            size="sm"
            variant={p.id === activeId ? "default" : "outline"}
            className="rounded-full capitalize"
            onClick={() => setSelected(p.id)}
          >
            {p.level}
            {hp && p.level === suggested ? " ★" : ""}
          </Button>
        ))}
      </div>

      {plan && (
        <Card className="card-soft">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold">
              <Dumbbell className="size-5 text-primary" /> {plan.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{plan.who}</p>
            <p className="text-sm font-semibold">{plan.weeks}</p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {plan.days.map((d) => (
                <div key={d.day} className="rounded-xl bg-secondary/50 p-4">
                  <p className="font-bold">
                    {d.day} · {d.focus}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {d.exercises.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <p className="pb-4 text-center text-xs text-muted-foreground">{DISCLAIMER}</p>
    </div>
  );
}

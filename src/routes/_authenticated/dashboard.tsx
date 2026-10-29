import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Droplets,
  Loader2,
  Moon,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/AppLayout";
import { useHealthProfile, useCompletions, useToggleCompletion, todayIso } from "@/hooks/use-healthmate";
import {
  buildRecommendations,
  computeWellnessScore,
  dailyChecklist,
  hydrationTarget,
  weeklyPlan,
} from "@/lib/recommendations";
import { CATEGORY_LABELS } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard – HealthMate" },
      { name: "description", content: "Your personalized wellness dashboard." },
    ],
  }),
  component: DashboardPage,
});

const PRIORITY_STYLES = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-secondary text-secondary-foreground",
  low: "bg-muted text-muted-foreground",
} as const;

function DashboardPage() {
  const navigate = useNavigate();
  const { data: hp, isLoading } = useHealthProfile();
  const { data: completions, isLoading: completionsLoading } = useCompletions();
  const toggleCompletion = useToggleCompletion();

  useEffect(() => {
    if (!isLoading && !hp) navigate({ to: "/categories", replace: true });
  }, [isLoading, hp, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!hp) return null;

  const score = computeWellnessScore(hp);
  const sections = buildRecommendations(hp);
  const checklist = dailyChecklist(hp);
  const plan = weeklyPlan(hp);
  const target = hydrationTarget(hp);
  const today = todayIso();
  const doneToday = new Set(
    (completions ?? []).filter((c) => c.completed_on === today).map((c) => c.item_id),
  );
  const doneCount = checklist.filter((i) => doneToday.has(i.id)).length;
  const waterPct = Math.min(100, Math.round((Number(hp.water_intake) / target) * 100));

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hello${hp ? "" : ""} 👋`}
        subtitle={`${CATEGORY_LABELS[hp.category]} plan · age ${hp.age} · updated to your latest answers`}
      />

      {/* Score + hydration */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="card-soft md:col-span-1">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="gradient-primary flex size-20 shrink-0 items-center justify-center rounded-full">
              <span className="font-display text-2xl font-bold text-primary-foreground">
                {score}
              </span>
            </div>
            <div>
              <p className="flex items-center gap-1.5 font-semibold">
                <Trophy className="size-4 text-primary" /> Wellness score
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Based on your sleep, hydration, activity, stress and habits. Update your
                assessment and watch it move.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardContent className="p-6">
            <p className="flex items-center gap-1.5 font-semibold">
              <Droplets className="size-4 text-primary" /> Hydration today
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              You reported {hp.water_intake} L — your goal is {target} L.
            </p>
            <Progress value={waterPct} className="mt-3 h-3" />
            <p className="mt-2 text-xs text-muted-foreground">
              {waterPct >= 100 ? "Goal met — nice!" : `${Math.max(0, Math.round((target - Number(hp.water_intake)) * 4))} more glasses to go`}
            </p>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardContent className="p-6">
            <p className="flex items-center gap-1.5 font-semibold">
              <CalendarCheck className="size-4 text-primary" /> Today's checklist
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {doneCount} of {checklist.length} done
            </p>
            <Progress
              value={checklist.length ? (doneCount / checklist.length) * 100 : 0}
              className="mt-3 h-3"
            />
            <Button asChild size="sm" variant="outline" className="mt-3 rounded-full">
              <Link to="/progress">Weekly progress</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions */}
      <div className="grid gap-5 lg:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.key} className="card-soft">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-bold">{section.title}</h2>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {section.subtitle}
              </p>
              <ul className="mt-4 space-y-3">
                {section.suggestions.map((s) => (
                  <li key={s.id} className="rounded-xl bg-secondary/50 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Sparkles className="size-3.5 shrink-0 text-primary" />
                      <span className="text-sm font-bold">{s.title}</span>
                      <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${PRIORITY_STYLES[s.priority]}`}>
                        {s.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Checklist + weekly plan */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="card-soft">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-bold">Daily wellness checklist</h2>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Personalized · progress saved automatically
            </p>
            <ul className="mt-4 space-y-2">
              {checklist.map((item) => {
                const done = doneToday.has(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={completionsLoading || toggleCompletion.isPending}
                      className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-secondary/50 disabled:opacity-50"
                      onClick={() =>
                        toggleCompletion.mutate(
                          { itemId: item.id, date: today, done },
                          {
                            onError: () => toast.error("Could not update checklist. Try again."),
                          },
                        )
                      }
                    >
                      {done ? (
                        <CheckCircle2 className="size-5 shrink-0 text-primary" />
                      ) : (
                        <Circle className="size-5 shrink-0 text-muted-foreground" />
                      )}
                      <span className={`text-sm ${done ? "text-muted-foreground line-through" : ""}`}>
                        {item.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-bold">This week's focus plan</h2>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Built from your answers
            </p>
            <ul className="mt-4 space-y-2">
              {plan.map((d) => (
                <li key={d.day} className="rounded-xl bg-secondary/50 p-3">
                  <p className="text-sm font-bold">
                    {d.day} · {d.focus}
                  </p>
                  <p className="text-sm text-muted-foreground">{d.action}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" className="rounded-full">
                <Link to="/exercises">Exercise plans</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <Link to="/reading">Reading corner</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <Link to="/preventive-care">Preventive care</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="pb-4 text-center text-xs text-muted-foreground">
        Suggestions are general health education, not medical advice. See a healthcare
        professional for personal concerns.
      </p>
    </div>
  );
}

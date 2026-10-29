import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/AppLayout";
import { useHealthProfile, useProfile, useSaveHealthProfile } from "@/hooks/use-healthmate";
import {
  CATEGORY_LABELS,
  isCategory,
  type AlcoholLevel,
  type ActivityLevel,
  type Category,
  type EatingHabits,
  type ExerciseFrequency,
  type StressLevel,
} from "@/lib/types";

export const Route = createFileRoute("/_authenticated/assessment")({
  validateSearch: (search: Record<string, unknown>): { category?: Category } => ({
    category: isCategory(search["category"]) ? search["category"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Health Assessment – HealthMate" },
      { name: "description", content: "Share your lifestyle details to personalize your wellness plan." },
    ],
  }),
  component: AssessmentPage,
});

interface FormState {
  age: string;
  sleepHours: number;
  waterIntake: string;
  physicalActivity: ActivityLevel;
  exerciseFrequency: ExerciseFrequency;
  screenTime: string;
  sittingHours: string;
  eatingHabits: EatingHabits;
  stressLevel: StressLevel;
  smoking: boolean;
  alcohol: AlcoholLevel;
  healthConcerns: string;
  symptoms: string;
  goals: string;
}

const DEFAULTS: FormState = {
  age: "",
  sleepHours: 7,
  waterIntake: "2",
  physicalActivity: "light",
  exerciseFrequency: "rarely",
  screenTime: "6",
  sittingHours: "6",
  eatingHabits: "balanced",
  stressLevel: "moderate",
  smoking: false,
  alcohol: "never",
  healthConcerns: "",
  symptoms: "",
  goals: "",
};

function AssessmentPage() {
  const navigate = useNavigate();
  const { category } = Route.useSearch();
  const { data: profile } = useProfile();
  const { data: healthProfile, isLoading } = useHealthProfile();
  const save = useSaveHealthProfile();

  const [form, setForm] = useState<FormState>(DEFAULTS);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!healthProfile) return;
    setForm({
      age: String(healthProfile.age),
      sleepHours: Number(healthProfile.sleep_hours),
      waterIntake: String(Number(healthProfile.water_intake)),
      physicalActivity: (healthProfile.physical_activity || "light") as ActivityLevel,
      exerciseFrequency: (healthProfile.exercise_frequency || "rarely") as ExerciseFrequency,
      screenTime: String(Number(healthProfile.screen_time)),
      sittingHours: String(Number(healthProfile.sitting_hours)),
      eatingHabits: (healthProfile.eating_habits || "balanced") as EatingHabits,
      stressLevel: healthProfile.stress_level,
      smoking: healthProfile.smoking,
      alcohol: healthProfile.alcohol,
      healthConcerns: healthProfile.health_concerns ?? "",
      symptoms: healthProfile.symptoms ?? "",
      goals: healthProfile.goals ?? "",
    });
    setDirty(false);
  }, [healthProfile]);

  const effectiveCategory: Category | undefined =
    (healthProfile?.category as Category) ?? category;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  }

  function validate(): string | null {
    const age = Number(form.age);
    if (!Number.isInteger(age) || age < 20 || age > 35)
      return "Age must be a whole number between 20 and 35.";
    const water = Number(form.waterIntake);
    if (Number.isNaN(water) || water < 0 || water > 20)
      return "Daily water intake must be between 0 and 20 liters.";
    const screen = Number(form.screenTime);
    if (Number.isNaN(screen) || screen < 0 || screen > 24)
      return "Screen time must be between 0 and 24 hours.";
    const sitting = Number(form.sittingHours);
    if (Number.isNaN(sitting) || sitting < 0 || sitting > 24)
      return "Sitting time must be between 0 and 24 hours.";
    return null;
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!effectiveCategory) {
      toast.error("Please choose a category first.");
      return;
    }
    const problem = validate();
    if (problem) {
      toast.error(problem);
      return;
    }
    try {
      await save.mutateAsync({
        category: effectiveCategory,
        age: Number(form.age),
        sleep_hours: form.sleepHours,
        water_intake: Number(form.waterIntake),
        physical_activity: form.physicalActivity,
        exercise_frequency: form.exerciseFrequency,
        screen_time: Number(form.screenTime),
        sitting_hours: Number(form.sittingHours),
        eating_habits: form.eatingHabits,
        stress_level: form.stressLevel,
        smoking: form.smoking,
        alcohol: form.alcohol,
        health_concerns: form.healthConcerns.trim() || null,
        symptoms: form.symptoms.trim() || null,
        goals: form.goals.trim() || null,
      });
      setDirty(false);
      toast.success("Profile saved! Your plan has been personalized.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save your profile.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!effectiveCategory) {
    return (
      <div className="py-10 text-center">
        <p className="mb-4 text-muted-foreground">
          Choose your life stage first so we can tailor your assessment.
        </p>
        <Button className="rounded-full" onClick={() => navigate({ to: "/categories" })}>
          Choose a category
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Your health & lifestyle details"
        subtitle={`Category: ${CATEGORY_LABELS[effectiveCategory]} — your answers power your personal suggestions. Health concerns and symptoms are optional.`}
      />

      <form onSubmit={handleSave} className="space-y-5">
        <Card className="card-soft">
          <CardContent className="grid gap-5 p-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="age">Age (20-35)</Label>
              <Input
                id="age"
                type="number"
                min={20}
                max={35}
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                placeholder={profile?.age ? String(profile.age) : "25"}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Daily sleep: {form.sleepHours} h</Label>
              <Slider
                value={[form.sleepHours]}
                min={0}
                max={12}
                step={0.5}
                onValueChange={([v]) => set("sleepHours", v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="water">Daily water intake (liters)</Label>
              <Input
                id="water"
                type="number"
                step="0.1"
                min={0}
                max={20}
                value={form.waterIntake}
                onChange={(e) => set("waterIntake", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Physical activity level</Label>
              <Select value={form.physicalActivity} onValueChange={(v) => set("physicalActivity", v as ActivityLevel)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Mostly sedentary</SelectItem>
                  <SelectItem value="light">Light (some walking)</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="very_active">Very active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Exercise frequency</Label>
              <Select value={form.exerciseFrequency} onValueChange={(v) => set("exerciseFrequency", v as ExerciseFrequency)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="rarely">Rarely</SelectItem>
                  <SelectItem value="weekly_1_2">1-2 times a week</SelectItem>
                  <SelectItem value="weekly_3_4">3-4 times a week</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="screen">Screen time per day (hours)</Label>
              <Input
                id="screen"
                type="number"
                step="0.5"
                min={0}
                max={24}
                value={form.screenTime}
                onChange={(e) => set("screenTime", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sitting">Sitting time per day (hours)</Label>
              <Input
                id="sitting"
                type="number"
                step="0.5"
                min={0}
                max={24}
                value={form.sittingHours}
                onChange={(e) => set("sittingHours", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Eating habits</Label>
              <Select value={form.eatingHabits} onValueChange={(v) => set("eatingHabits", v as EatingHabits)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced & varied</SelectItem>
                  <SelectItem value="home_cooked">Mostly home-cooked</SelectItem>
                  <SelectItem value="fast_food">Frequent fast food</SelectItem>
                  <SelectItem value="skipping_meals">Often skip meals</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Stress level</Label>
              <Select value={form.stressLevel} onValueChange={(v) => set("stressLevel", v as StressLevel)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="alcohol">Alcohol consumption</Label>
              <Select value={form.alcohol} onValueChange={(v) => set("alcohol", v as AlcoholLevel)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="occasionally">Occasionally</SelectItem>
                  <SelectItem value="regularly">Regularly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-secondary/60 p-3 sm:col-span-2">
              <div>
                <Label htmlFor="smoking">Do you smoke?</Label>
                <p className="text-xs text-muted-foreground">Used only for your own suggestions.</p>
              </div>
              <Switch id="smoking" checked={form.smoking} onCheckedChange={(v) => set("smoking", v)} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardContent className="grid gap-5 p-6">
            <p className="text-sm font-semibold text-foreground">
              Optional details — leave blank anything you'd rather not share
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="concerns">Health concerns</Label>
              <Textarea
                id="concerns"
                placeholder="e.g. frequent headaches, weight management"
                value={form.healthConcerns}
                onChange={(e) => set("healthConcerns", e.target.value)}
                maxLength={500}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="symptoms">Current symptoms</Label>
              <Textarea
                id="symptoms"
                placeholder="e.g. trouble sleeping lately, back pain after long sitting"
                value={form.symptoms}
                onChange={(e) => set("symptoms", e.target.value)}
                maxLength={500}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goals">Personal wellness goals</Label>
              <Textarea
                id="goals"
                placeholder="e.g. sleep 8 hours, run 5 km, drink 3 L water daily"
                value={form.goals}
                onChange={(e) => set("goals", e.target.value)}
                maxLength={500}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3 pb-6">
          <Button type="submit" className="rounded-full" disabled={save.isPending}>
            {save.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Profile
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => {
              if (healthProfile) {
                // Reset to last saved values
                setForm({
                  ...form,
                  age: String(healthProfile.age),
                  sleepHours: Number(healthProfile.sleep_hours),
                  waterIntake: String(Number(healthProfile.water_intake)),
                  screenTime: String(Number(healthProfile.screen_time)),
                  sittingHours: String(Number(healthProfile.sitting_hours)),
                  stressLevel: healthProfile.stress_level,
                  smoking: healthProfile.smoking,
                  alcohol: healthProfile.alcohol,
                  healthConcerns: healthProfile.health_concerns ?? "",
                  symptoms: healthProfile.symptoms ?? "",
                  goals: healthProfile.goals ?? "",
                });
                setDirty(false);
                toast.info("Restored your saved details.");
              } else {
                toast.info("Nothing saved yet — fill the form and press Save Profile.");
              }
            }}
          >
            Edit Details
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="rounded-full"
            onClick={() => navigate({ to: "/dashboard" })}
          >
            Continue
          </Button>
          {dirty && (
            <span className="self-center text-xs text-muted-foreground">
              Unsaved changes
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

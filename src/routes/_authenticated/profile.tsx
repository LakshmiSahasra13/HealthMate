import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, LogOut, Moon, Pencil, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/AppLayout";
import {
  useHealthProfile,
  useProfile,
  useUpdateProfile,
} from "@/hooks/use-healthmate";
import { supabase } from "@/integrations/supabase/client";
import {
  CATEGORY_LABELS,
  stressFromLabel,
  type StressLevel,
} from "@/lib/types";
import { computeWellnessScore, stressLabel } from "@/lib/recommendations";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My Profile – HealthMate" },
      { name: "description", content: "View and edit your health profile." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useProfile();
  const { data: hp } = useHealthProfile();
  const updateProfile = useUpdateProfile();

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    const ageNum = Number(age || profile?.age);
    if (!fullName.trim()) return;
    if (!Number.isInteger(ageNum) || ageNum < 20 || ageNum > 35) {
      toast.error("Age must be a whole number between 20 and 35.");
      return;
    }
    try {
      await updateProfile.mutateAsync({ full_name: fullName.trim(), age: ageNum });
      toast.success("Profile updated.");
      setEditing(false);
    } catch {
      toast.error("Could not update your profile.");
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      current_password: currentPassword,
    });
    setChangingPassword(false);
    if (error) return void toast.error(error.message);
    toast.success("Password changed.");
    setCurrentPassword("");
    setNewPassword("");
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="My Profile" subtitle="Your account and saved health details." />

      <Card className="card-soft">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Account</h2>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full gap-1.5"
              onClick={() => {
                setFullName(profile?.full_name ?? "");
                setAge(profile?.age ? String(profile.age) : "");
                setEditing((v) => !v);
              }}
            >
              <Pencil className="size-3.5" /> {editing ? "Cancel" : "Edit"}
            </Button>
          </div>
          {editing ? (
            <form onSubmit={handleSave} className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="full-name">Full name</Label>
                <Input
                  id="full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={80}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-age">Age (20-35)</Label>
                <Input
                  id="p-age"
                  type="number"
                  min={20}
                  max={35}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Email</Label>
                <Input value={profile?.email ?? ""} disabled />
                <p className="text-xs text-muted-foreground">
                  Your email is your sign-in ID and cannot be changed here.
                </p>
              </div>
              <Button type="submit" className="rounded-full" disabled={updateProfile.isPending}>
                <Save className="size-4" /> Save
              </Button>
            </form>
          ) : (
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-muted-foreground">Full name</dt>
                <dd>{profile?.full_name || "—"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-muted-foreground">Age</dt>
                <dd>{profile?.age ?? "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-semibold text-muted-foreground">Email</dt>
                <dd>{profile?.email}</dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardContent className="p-6">
          <h2 className="font-display text-lg font-bold">Health & lifestyle summary</h2>
          {hp ? (
            <>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div><dt className="font-semibold text-muted-foreground">Category</dt><dd>{CATEGORY_LABELS[hp.category]}</dd></div>
                <div><dt className="font-semibold text-muted-foreground">Wellness score</dt><dd>{computeWellnessScore(hp)} / 100</dd></div>
                <div><dt className="font-semibold text-muted-foreground">Sleep</dt><dd>{Number(hp.sleep_hours)} h / day</dd></div>
                <div><dt className="font-semibold text-muted-foreground">Water</dt><dd>{Number(hp.water_intake)} L / day</dd></div>
                <div><dt className="font-semibold text-muted-foreground">Screen time</dt><dd>{Number(hp.screen_time)} h / day</dd></div>
                <div><dt className="font-semibold text-muted-foreground">Sitting time</dt><dd>{Number(hp.sitting_hours)} h / day</dd></div>
                <div><dt className="font-semibold text-muted-foreground">Stress level</dt><dd>{stressLabel(hp.stress_level)}</dd></div>
                <div><dt className="font-semibold text-muted-foreground">Smoking</dt><dd>{hp.smoking ? "Yes" : "No"}</dd></div>
                <div><dt className="font-semibold text-muted-foreground">Goals</dt><dd>{hp.goals || "—"}</dd></div>
              </dl>
              <Button asChild className="mt-5 rounded-full">
                <a href={`/assessment?category=${hp.category}`}>Update my details</a>
              </Button>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No health details saved yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardContent className="p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <Moon className="size-4 text-primary" /> Change password
          </h2>
          <form onSubmit={handleChangePassword} className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="current-pw">Current password</Label>
              <Input
                id="current-pw"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-pw">New password (min 8 chars)</Label>
              <Input
                id="new-pw"
                type="password"
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="rounded-full" disabled={changingPassword}>
              {changingPassword ? <Loader2 className="size-4 animate-spin" /> : null}
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="pb-6">
        <Button variant="destructive" className="rounded-full gap-2" onClick={handleSignOut}>
          <LogOut className="size-4" /> Sign out
        </Button>
      </div>
    </div>
  );
}

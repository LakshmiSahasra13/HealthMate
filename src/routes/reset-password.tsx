import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [hashError, setHashError] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      setHashError(true);
      return;
    }
    if (password.length < 8)
      { toast.error("Password must be at least 8 characters long."); return; }
    if (password !== confirm) { toast.error("Passwords do not match."); return; }

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated! Please sign in with your new password.");
    await navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md card-soft">
        <CardHeader>
          <CardTitle>Set a new password</CardTitle>
          <CardDescription>
            Choose a strong password you haven't used elsewhere.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hashError ? (
            <p className="text-sm text-destructive">
              This page needs a valid password-reset link from your email.
              Request a new one from the sign-in page.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
                Update password
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

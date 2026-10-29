import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowRight,
  HeartPulse,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { DISCLAIMER } from "@/lib/resources";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect:
      typeof search["redirect"] === "string" &&
      search["redirect"].startsWith("/") &&
      !search["redirect"].startsWith("//")
        ? search["redirect"]
        : undefined,
  }),
  component: AuthPage,
});

function safeTarget(redirect: string | undefined): string {
  return redirect && redirect.startsWith("/") && !redirect.startsWith("//")
    ? redirect
    : "/categories";
}

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { session, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();
    const ageNum = Number(age);
    if (!fullName.trim()) return toast.error("Please enter your full name.");
    if (!email.trim() || !email.includes("@"))
      return toast.error("Please enter a valid email address.");
    if (password.length < 8)
      return toast.error("Password must be at least 8 characters long.");
    if (!Number.isInteger(ageNum) || ageNum < 20 || ageNum > 35)
      return toast.error("Age must be a whole number between 20 and 35.");

    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim(), age: ageNum },
        emailRedirectTo: window.location.origin,
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (data.session) {
      toast.success("Welcome to HealthMate!");
      await navigate({ to: safeTarget(search.redirect) });
    } else {
      setAwaitingConfirmation(true);
    }
  }

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password)
      return toast.error("Please enter your email and password.");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    await navigate({ to: safeTarget(search.redirect) });
  }

  async function handleForgot(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@"))
      return toast.error("Please enter the email you registered with.");
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password reset link sent — check your inbox.");
    setForgotOpen(false);
  }

  async function handleOAuth(provider: "google") {
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error(result.error.message);
    if (result.redirected) return;
    // Tokens returned inline (preview iframe flow): session already set.
    await navigate({ to: safeTarget(search.redirect) });
  }

  if (session && user) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center card-soft">
          <CardHeader>
            <CardTitle>You're signed in</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={() => navigate({ to: "/dashboard" })}>
              Go to dashboard <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
              }}
            >
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (awaitingConfirmation) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center card-soft">
          <CardHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-secondary">
              <Mail className="size-6 text-primary" />
            </div>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a confirmation link to <strong>{email}</strong>. Click it
              to activate your account, then sign in here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => setAwaitingConfirmation(false)}>
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="gradient-primary mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl shadow-md">
            <HeartPulse className="size-6 text-primary-foreground" />
          </span>
          <h1 className="font-display text-2xl font-bold">Welcome to HealthMate</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your personal wellness guide for ages 20-35
          </p>
        </div>

        <Card className="card-soft">
          <CardContent className="pt-6">
            {forgotOpen ? (
              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="forgot-email">Account email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                  Send reset link
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setForgotOpen(false)}
                >
                  Back to sign in
                </Button>
              </form>
            ) : (
              <Tabs defaultValue="signin">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                  <TabsTrigger value="signup">Create account</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setForgotOpen(true)}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                    <Button type="submit" className="w-full" disabled={busy}>
                      {busy ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <LockKeyhole className="size-4" />
                      )}
                      Sign in
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-name">Full name</Label>
                      <Input
                        id="signup-name"
                        placeholder="Your name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        maxLength={80}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="signup-age">Age (20-35)</Label>
                        <Input
                          id="signup-age"
                          type="number"
                          min={20}
                          max={35}
                          placeholder="25"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={busy}>
                      {busy ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="size-4" />
                      )}
                      Create my account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}

            {!forgotOpen && (
              <>
                <div className="my-5 flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  or continue with
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" onClick={() => handleOAuth("google")}>
                    Google
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-xs text-muted-foreground">{DISCLAIMER}</p>
      </div>
    </div>
  );
}

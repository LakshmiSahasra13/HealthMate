import { useState, type ReactNode } from "react";
import { Link, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  BookOpen,
  ChevronDown,
  Dumbbell,
  HeartPulse,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  Shield,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-healthmate";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/reading", label: "Reading Corner", icon: BookOpen },
  { to: "/exercises", label: "Exercise Plans", icon: Dumbbell },
  { to: "/preventive-care", label: "Preventive Care", icon: Shield },
  { to: "/progress", label: "Progress", icon: LineChart },
  { to: "/profile", label: "My Profile", icon: UserRound },
];

function Brand() {
  return (
    <Link to="/dashboard" className="flex items-center gap-2">
      <span className="gradient-primary flex size-9 items-center justify-center rounded-xl shadow-sm">
        <HeartPulse className="size-5 text-primary-foreground" />
      </span>
      <span className="font-display text-lg font-bold text-foreground">
        HealthMate
      </span>
    </Link>
  );
}

export function AppLayout({ children }: { children?: ReactNode }) {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabaseSignOut();
    await navigate({ to: "/auth", replace: true });
    void router.invalidate();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <Brand />
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
                activeProps={{
                  className:
                    "bg-secondary text-secondary-foreground rounded-full px-3 py-2 text-sm font-semibold",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <span className="max-w-40 truncate rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground">
              {profile?.full_name || user?.email || "Member"}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
          <button
            className="inline-flex size-10 items-center justify-center rounded-xl border border-border lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <ChevronDown className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-border bg-background px-4 pb-4 lg:hidden">
            <nav className="flex flex-col py-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                  activeProps={{ className: "bg-secondary rounded-xl" }}
                >
                  <link.icon className="size-4 text-primary" />
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
              <span className="truncate text-sm font-semibold text-muted-foreground">
                {profile?.full_name || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="size-4" /> Sign out
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-10">
        {children ?? <Outlet />}
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <Activity className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              HealthMate provides general health education and preventive-care
              awareness for adults aged 20-35. It does not diagnose, treat, or
              replace advice from a qualified healthcare professional.
            </span>
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 font-semibold">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <Link to="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-foreground">
              About the Project
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

async function supabaseSignOut() {
  const { supabase } = await import("@/integrations/supabase/client");
  await supabase.auth.signOut();
}

export function PageHeader({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6", className)}>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

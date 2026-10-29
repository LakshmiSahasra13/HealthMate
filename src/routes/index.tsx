import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Dumbbell,
  HeartPulse,
  LineChart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero.jpg";
import categoryStudents from "@/assets/category-students.jpg";
import categoryMarried from "@/assets/category-married.jpg";
import categoryJob from "@/assets/category-job.jpg";
import { useAuth } from "@/hooks/use-auth";
import { CATEGORY_BLURBS, CATEGORY_LABELS, type Category } from "@/lib/types";
import { DISCLAIMER } from "@/lib/resources";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HealthMate – Your Personal Wellness Guide" },
      {
        name: "description",
        content:
          "Digital health support and preventive care for adults aged 20-35. Get a personalized wellness plan for student, family or work life.",
      },
      { property: "og:title", content: "HealthMate – Your Personal Wellness Guide" },
      {
        property: "og:description",
        content:
          "Personalized wellness plans, exercise routines, reading resources and weekly progress tracking for adults aged 20-35.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CATEGORY_IMAGES: Record<Category, string> = {
  student: categoryStudents,
  married: categoryMarried,
  job_holder: categoryJob,
};

function Index() {
  const { session } = useAuth();

  // Signed-in visitors land back here after social sign-in.
  useEffect(() => {
    if (session) {
      window.location.href = "/categories";
    }
  }, [session]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="gradient-primary flex size-9 items-center justify-center rounded-xl">
              <HeartPulse className="size-5 text-primary-foreground" />
            </span>
            <span className="font-display text-lg font-bold">HealthMate</span>
          </div>
          <div className="flex items-center gap-2">
            {session ? (
              <Button asChild className="rounded-full">
                <Link to="/categories">
                  Continue <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="rounded-full">
                  <Link to="/about">About</Link>
                </Button>
                <Button asChild className="rounded-full">
                  <Link to="/auth">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-mint">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
            <div>
              <Badge className="mb-4 rounded-full bg-card text-card-foreground shadow-sm">
                <Sparkles className="size-3.5 text-primary" /> For adults aged 20-35
              </Badge>
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                Your personal wellness guide, made just for you
              </h1>
              <p className="mt-4 max-w-lg text-lg text-muted-foreground">
                Digital health support and preventive care that adapts to your
                life — whether you're studying, married, or building your
                career. Answer a short lifestyle form and get a plan that fits.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full shadow-md">
                  <Link to="/auth">
                    Start my wellness plan <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link to="/privacy">How we protect your data</Link>
                </Button>
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" />
                Private by design — your answers are visible only to you.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src={heroImage}
                alt="Young adults enjoying healthy habits"
                width={1600}
                height={912}
                className="w-full max-w-xl rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-center font-display text-3xl font-bold">
            How HealthMate works
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Create your account",
                text: "Register with your name, email and age. Secure sign-in with email or Google.",
              },
              {
                step: "2",
                title: "Pick your life stage & share habits",
                text: "Choose Student, Married, or Job Holder, then fill a short health and lifestyle form.",
              },
              {
                step: "3",
                title: "Get your personal plan",
                text: "A dashboard of suggestions, exercises, reading, checklists and weekly progress tracking — updated to your answers.",
              },
            ].map((s) => (
              <Card key={s.step} className="card-soft border-0">
                <CardContent className="p-6">
                  <span className="gradient-primary mb-3 flex size-10 items-center justify-center rounded-full font-display text-lg font-bold text-primary-foreground">
                    {s.step}
                  </span>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="bg-card py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center font-display text-3xl font-bold">
              Built around your life stage
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
              Every suggestion adapts to how you actually live.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
                <Card key={c} className="overflow-hidden card-soft border-0">
                  <img
                    src={CATEGORY_IMAGES[c]}
                    alt={`${CATEGORY_LABELS[c]} wellness`}
                    width={944}
                    height={704}
                    loading="lazy"
                    className="h-44 w-full object-cover"
                  />
                  <CardContent className="p-5">
                    <h3 className="font-display text-xl font-bold">
                      {CATEGORY_LABELS[c]}s
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {CATEGORY_BLURBS[c]}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-center font-display text-3xl font-bold">
            Everything you need, in one place
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Sparkles, title: "Personal suggestions", text: "Hydration goals, sleep tips and stress care calculated from your answers." },
              { icon: Dumbbell, title: "Beginner exercise plans", text: "Week-by-week routines that start where you are." },
              { icon: BookOpen, title: "Trusted reading corner", text: "Verified resources from WHO, CDC, NHS and NIH — bookmark your favorites." },
              { icon: LineChart, title: "Weekly progress", text: "Weekly check-ins and charts that show your trends over time." },
            ].map((f) => (
              <Card key={f.title} className="card-soft border-0">
                <CardContent className="p-6 text-center">
                  <span className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-secondary">
                    <f.icon className="size-5 text-primary" />
                  </span>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="gradient-primary py-14 text-primary-foreground">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="font-display text-3xl font-bold">
              Small habits today, healthier years ahead
            </h2>
            <p className="mt-3 opacity-90">
              Join HealthMate and build a wellness routine that sticks.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 rounded-full bg-card text-foreground hover:bg-card/90"
            >
              <Link to="/auth">Create my free account</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background py-6 text-center text-sm text-muted-foreground">
        <p className="mx-auto max-w-3xl px-4">{DISCLAIMER}</p>
        <div className="mt-3 flex justify-center gap-4 font-semibold">
          <Link to="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link to="/about" className="hover:text-foreground">
            About the Project
          </Link>
        </div>
      </footer>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  HeartPulse,
  Salad,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DISCLAIMER } from "@/lib/resources";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Project – HealthMate" },
      {
        name: "description",
        content:
          "About HealthMate: a digital health support and preventive care website for adults aged 20-35.",
      },
      { property: "og:title", content: "About the Project – HealthMate" },
      {
        property: "og:description",
        content: "About HealthMate: digital health support and preventive care for adults aged 20-35.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const FEATURES = [
  {
    icon: Target,
    title: "A working recommendation engine",
    text: "Suggestions are computed from your saved lifestyle details — hydration goals, sleep advice, movement plans and stress care all change when your answers change.",
  },
  {
    icon: Brain,
    title: "Life-stage aware guidance",
    text: "Students get study-life balance and exam-stress support; married users get shared routines and meal planning; job holders get ergonomics, movement breaks and workplace stress care.",
  },
  {
    icon: Salad,
    title: "Everyday habits, tracked",
    text: "A personalized daily checklist, a weekly plan, and weekly check-ins with charts so you can see your own trends over time.",
  },
  {
    icon: BookOpen,
    title: "Verified educational resources",
    text: "Reading recommendations link to genuine, maintained resources from WHO, CDC, NHS, NIH and other recognized health organizations.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Button asChild variant="ghost" className="mb-6 rounded-full gap-2">
          <Link to="/">
            <ArrowLeft className="size-4" /> Back home
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <span className="gradient-primary flex size-12 items-center justify-center rounded-2xl">
            <HeartPulse className="size-6 text-primary-foreground" />
          </span>
          <h1 className="font-display text-3xl font-bold">About HealthMate</h1>
        </div>

        <p className="mt-5 text-muted-foreground">
          HealthMate – Your Personal Wellness Guide is a digital health support
          and preventive care website for adults aged 20 to 35. Its purpose is
          education: helping young adults understand their own lifestyle
          patterns and take small, realistic steps toward better sleep,
          hydration, movement, nutrition and stress management.
        </p>
        <p className="mt-3 text-muted-foreground">
          Instead of showing everyone the same generic tips, HealthMate asks a
          short set of questions about your daily life, stores your answers
          privately, and builds a personal dashboard from them. You can update
          your details whenever life changes, and your plan updates with you.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <Card key={f.title} className="card-soft">
              <CardContent className="p-5">
                <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-secondary">
                  <f.icon className="size-5 text-primary" />
                </span>
                <h2 className="font-semibold">{f.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="card-soft mt-8">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-bold">Important limitation</h2>
            <p className="mt-2 text-sm text-muted-foreground">{DISCLAIMER}</p>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link to="/auth">Get started free</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/privacy">Read the privacy policy</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

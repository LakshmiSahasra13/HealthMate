import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Database, Lock, ServerOff, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy – HealthMate" },
      {
        name: "description",
        content:
          "How HealthMate collects, stores and protects your health information, and the choices you have.",
      },
      { property: "og:title", content: "Privacy Policy – HealthMate" },
      {
        property: "og:description",
        content: "How HealthMate collects, stores and protects your health information.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  {
    icon: Database,
    title: "What we collect",
    body: [
      "Account basics: your full name, email address, and the age you provide at registration (we only accept ages 20-35).",
      "Health and lifestyle details you choose to submit in the assessment form: sleep, hydration, activity, screen time, eating habits, stress level, tobacco and alcohol use, and optional health concerns, symptoms and goals.",
      "Wellness activity you record: bookmarks, completed checklist items and weekly check-in values.",
    ],
  },
  {
    icon: Lock,
    title: "How your data is protected",
    body: [
      "Every record is stored with row-level security, meaning the database itself only ever returns your rows to you. No other user can read your health information — not by clicking around, not via the API.",
      "Passwords are handled by our authentication provider and are never visible to HealthMate staff or to the application itself.",
      "Sensitive health fields (concerns, symptoms, goals) are optional; you decide how much to share.",
    ],
  },
  {
    icon: UserCheck,
    title: "Your choices and rights",
    body: [
      "You can view and edit your profile and assessment details at any time from the Profile page.",
      "You can delete bookmarks and uncheck completed items at any time.",
      "You may request deletion of your account and associated data by contacting the project owner through the About page.",
    ],
  },
  {
    icon: ServerOff,
    title: "What we never do",
    body: [
      "We never sell your data. We never share your health information with advertisers or third parties.",
      "We never use your answers for anything other than generating your own personal suggestions.",
      "We never embed private keys or secret credentials in the browser app; all sensitive configuration stays server-side.",
    ],
  },
];

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Button asChild variant="ghost" className="mb-6 rounded-full gap-2">
          <Link to="/">
            <ArrowLeft className="size-4" /> Back home
          </Link>
        </Button>
        <h1 className="font-display text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-muted-foreground">
          HealthMate is a health education website for adults aged 20-35. This
          policy explains what we store, how it's protected, and the control you
          keep. Last updated: October 2026.
        </p>

        <div className="mt-8 space-y-4">
          {SECTIONS.map((s) => (
            <Card key={s.title} className="card-soft">
              <CardContent className="p-6">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-secondary">
                    <s.icon className="size-4 text-primary" />
                  </span>
                  {s.title}
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {s.body.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="card-soft mt-6">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-bold">Medical disclaimer</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              HealthMate provides general health education and preventive-care
              awareness only. It does not provide medical diagnosis or
              treatment, and nothing on this site should be treated as medical
              advice for your specific situation. Always consult a qualified
              healthcare professional about symptoms, concerns, or before
              making significant changes to your diet, exercise or medication.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

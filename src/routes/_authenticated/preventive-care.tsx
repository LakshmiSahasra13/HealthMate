import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/AppLayout";
import { DISCLAIMER, PREVENTIVE_ITEMS } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/preventive-care")({
  head: () => ({
    meta: [
      { title: "Preventive Care – HealthMate" },
      { name: "description", content: "General preventive-care checks and screenings for adults 20-35." },
    ],
  }),
  component: PreventiveCarePage,
});

function PreventiveCarePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Preventive Care"
        subtitle="Routine checks worth putting on your calendar. Talk to your doctor about what fits you."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {PREVENTIVE_ITEMS.map((item) => (
          <Card key={item.id} className="card-soft">
            <CardContent className="flex h-full flex-col p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <Shield className="size-4 shrink-0 text-primary" /> {item.title}
              </h2>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {item.when}
              </p>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{item.description}</p>
              {item.url && (
                <Button asChild size="sm" variant="outline" className="mt-4 self-start rounded-full">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    Learn more <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="pb-4 text-center text-xs text-muted-foreground">{DISCLAIMER}</p>
    </div>
  );
}

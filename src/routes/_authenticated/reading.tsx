import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/AppLayout";
import { useBookmarks, useToggleBookmark } from "@/hooks/use-healthmate";
import { ARTICLES, BOOKS, DISCLAIMER } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/reading")({
  head: () => ({
    meta: [
      { title: "Reading Corner – HealthMate" },
      { name: "description", content: "Trusted articles and books on sleep, nutrition, exercise and stress." },
    ],
  }),
  component: ReadingPage,
});

type Item = {
  id: string;
  type: "article" | "book";
  title: string;
  byline: string;
  url: string;
  topic: string;
  description: string;
};

const ITEMS: Item[] = [
  ...ARTICLES.map((a) => ({
    id: a.id,
    type: "article" as const,
    title: a.title,
    byline: a.source,
    url: a.url,
    topic: a.topic,
    description: a.description,
  })),
  ...BOOKS.map((b) => ({
    id: b.id,
    type: "book" as const,
    title: b.title,
    byline: b.author,
    url: b.url,
    topic: b.topic,
    description: b.description,
  })),
];

const TOPICS = ["all", ...Array.from(new Set(ITEMS.map((i) => i.topic)))];

function ReadingPage() {
  const [topic, setTopic] = useState("all");
  const [savedOnly, setSavedOnly] = useState(false);
  const { data: bookmarks } = useBookmarks();
  const toggle = useToggleBookmark();
  const saved = new Set((bookmarks ?? []).map((b) => b.resource_id));

  const visible = ITEMS.filter(
    (i) => (topic === "all" || i.topic === topic) && (!savedOnly || saved.has(i.id)),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reading Corner"
        subtitle="Trusted articles and books. Bookmark the ones you want to come back to."
      />

      <div className="flex flex-wrap items-center gap-2">
        {TOPICS.map((t) => (
          <Button
            key={t}
            size="sm"
            variant={topic === t ? "default" : "outline"}
            className="rounded-full capitalize"
            onClick={() => setTopic(t)}
          >
            {t}
          </Button>
        ))}
        <Button
          size="sm"
          variant={savedOnly ? "default" : "outline"}
          className="ml-auto rounded-full"
          onClick={() => setSavedOnly((v) => !v)}
        >
          <BookmarkCheck className="size-4" /> Saved ({saved.size})
        </Button>
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">Nothing to show here yet.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {visible.map((item) => {
            const isSaved = saved.has(item.id);
            return (
              <Card key={item.id} className="card-soft">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {item.type} · {item.topic}
                      </p>
                      <h2 className="font-display text-lg font-bold">{item.title}</h2>
                      <p className="text-sm text-muted-foreground">{item.byline}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={isSaved ? "Remove bookmark" : "Save bookmark"}
                      disabled={toggle.isPending}
                      onClick={() =>
                        toggle.mutate(
                          { resourceId: item.id, resourceType: item.type, bookmarked: isSaved },
                          { onError: () => toast.error("Could not update bookmark. Try again.") },
                        )
                      }
                    >
                      {isSaved ? (
                        <BookmarkCheck className="size-5 text-primary" />
                      ) : (
                        <Bookmark className="size-5" />
                      )}
                    </Button>
                  </div>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">{item.description}</p>
                  <Button asChild size="sm" variant="outline" className="mt-4 self-start rounded-full">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      Read <ExternalLink className="size-3.5" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <p className="pb-4 text-center text-xs text-muted-foreground">{DISCLAIMER}</p>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, HeartHandshake, Briefcase, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/AppLayout";
import { useHealthProfile } from "@/hooks/use-healthmate";
import { CATEGORY_BLURBS, CATEGORY_LABELS, type Category } from "@/lib/types";
import categoryStudents from "@/assets/category-students.jpg";
import categoryMarried from "@/assets/category-married.jpg";
import categoryJob from "@/assets/category-job.jpg";

export const Route = createFileRoute("/_authenticated/categories")({
  head: () => ({
    meta: [
      { title: "Choose Your Category – HealthMate" },
      { name: "description", content: "Select your life stage to personalize your wellness plan." },
    ],
  }),
  component: CategoriesPage,
});

const CATEGORY_CARDS: {
  category: Category;
  image: string;
  icon: typeof GraduationCap;
}[] = [
  { category: "student", image: categoryStudents, icon: GraduationCap },
  { category: "married", image: categoryMarried, icon: HeartHandshake },
  { category: "job_holder", image: categoryJob, icon: Briefcase },
];

function CategoriesPage() {
  const navigate = useNavigate();
  const { data: healthProfile, isLoading } = useHealthProfile();

  return (
    <div>
      <PageHeader
        title="Which describes you best?"
        subtitle="Pick the category that fits your daily life — your suggestions will be built around it."
      />

      {healthProfile && !isLoading && (
        <Card className="card-soft mb-6 border-primary/30 bg-secondary/50">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="text-sm font-semibold">
              You already saved a {CATEGORY_LABELS[healthProfile.category]} profile. Continue to your
              dashboard, or pick a category to update your details.
            </p>
            <Button size="sm" className="rounded-full" onClick={() => navigate({ to: "/dashboard" })}>
              Continue <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {CATEGORY_CARDS.map((card) => (
          <Card
            key={card.category}
            className="group card-soft overflow-hidden border-0 transition-transform hover:-translate-y-1"
          >
            <img
              src={card.image}
              alt={`${CATEGORY_LABELS[card.category]} wellness`}
              width={944}
              height={704}
              loading="lazy"
              className="h-44 w-full object-cover"
            />
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-full bg-secondary">
                  <card.icon className="size-4 text-primary" />
                </span>
                <h2 className="font-display text-xl font-bold">
                  {CATEGORY_LABELS[card.category]}
                </h2>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {CATEGORY_BLURBS[card.category]}
              </p>
              <Button
                className="mt-4 w-full rounded-full group-hover:shadow-md"
                onClick={() =>
                  navigate({
                    to: "/assessment",
                    search: { category: card.category },
                  })
                }
              >
                <Sparkles className="size-4" />
                {healthProfile?.category === card.category
                  ? "Update my details"
                  : "Select & continue"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Not sure? You can change your category and answers any time from your
        <Link to="/profile" className="ml-1 font-semibold text-primary hover:underline">
          profile page
        </Link>
        .
      </p>
    </div>
  );
}

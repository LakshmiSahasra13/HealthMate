import type {
  Category,
  HealthProfile,
  StressLevel,
} from "./types";

export interface Suggestion {
  id: string;
  title: string;
  detail: string;
  icon:
    | "sleep"
    | "water"
    | "exercise"
    | "food"
    | "stress"
    | "smoke"
    | "screen"
    | "heart"
    | "calendar"
    | "users"
    | "sun";
  priority: "high" | "medium" | "low";
}

export interface RecommendationSection {
  key: string;
  title: string;
  subtitle: string;
  suggestions: Suggestion[];
}

export interface ChecklistItem {
  id: string;
  title: string;
}

export interface DayPlan {
  day: string;
  focus: string;
  action: string;
}

const ACTIVE_FREQUENCIES = new Set(["weekly_3_4", "daily"]);

/** Personalized daily water goal in liters. */
export function hydrationTarget(p: HealthProfile): number {
  let target = 2.0;
  if (p.exercise_frequency === "daily") target += 0.6;
  else if (p.exercise_frequency === "weekly_3_4") target += 0.4;
  if (p.physical_activity === "very_active") target += 0.3;
  if (p.screen_time >= 8) target += 0.2; // more screen time, less time sipping mindfully
  return Math.min(3.5, Math.round(target * 10) / 10);
}

/**
 * Rule-based wellness score (0-100). Lower starting points for riskier
 * lifestyle answers; never below 10 so the score stays encouraging.
 */
export function computeWellnessScore(p: HealthProfile): number {
  let score = 100;

  if (p.sleep_hours < 6) score -= 25;
  else if (p.sleep_hours < 7) score -= 15;
  else if (p.sleep_hours < 7.5) score -= 5;

  const waterTarget = hydrationTarget(p);
  if (p.water_intake < waterTarget * 0.6) score -= 15;
  else if (p.water_intake < waterTarget) score -= 8;

  if (p.physical_activity === "sedentary") score -= 12;
  else if (p.physical_activity === "light") score -= 6;

  if (p.exercise_frequency === "never") score -= 12;
  else if (p.exercise_frequency === "rarely") score -= 8;
  else if (p.exercise_frequency === "weekly_1_2") score -= 4;

  if (p.screen_time >= 8) score -= 10;
  else if (p.screen_time >= 6) score -= 6;
  else if (p.screen_time >= 4) score -= 3;

  if (p.sitting_hours >= 8) score -= 8;
  else if (p.sitting_hours >= 6) score -= 4;

  if (p.stress_level === "high") score -= 12;
  else if (p.stress_level === "moderate") score -= 6;

  if (p.eating_habits === "fast_food") score -= 10;
  else if (p.eating_habits === "skipping_meals") score -= 8;
  else if (p.eating_habits === "home_cooked") score += 2;

  if (p.smoking) score -= 15;
  if (p.alcohol === "regularly") score -= 8;
  else if (p.alcohol === "occasionally") score -= 3;

  return Math.max(10, Math.min(100, Math.round(score)));
}

function sleepSuggestions(p: HealthProfile): Suggestion[] {
  if (p.sleep_hours >= 7.5) {
    return [
      {
        id: "sleep-good",
        title: "Keep your sleep rhythm steady",
        detail:
          `You average ${p.sleep_hours} hours — that is in the healthy range for adults. Keep a consistent bedtime, even on weekends, to protect it.`,
        icon: "sleep",
        priority: "low",
      },
    ];
  }
  const urgent = p.sleep_hours < 6;
  return [
    {
      id: "sleep-window",
      title: urgent ? "Prioritize a longer sleep window" : "Stretch your sleep slightly",
      detail: urgent
        ? "Under 6 hours regularly is linked to weaker immunity, poor focus and higher stress. Move bedtime 30 minutes earlier each week until you reach 7-9 hours."
        : "You are close to the 7-9 hour adult target. A consistent 15-30 minute earlier bedtime is usually enough to close the gap.",
      icon: "sleep",
      priority: urgent ? "high" : "medium",
    },
    {
      id: "sleep-hygiene",
      title: "Build a wind-down routine",
      detail:
        "Dim screens 30-60 minutes before bed, keep your room dark and cool, and avoid caffeine after mid-afternoon.",
      icon: "sleep",
      priority: "medium",
    },
  ];
}

function hydrationSuggestions(p: HealthProfile): Suggestion[] {
  const target = hydrationTarget(p);
  const gap = target - p.water_intake;
  if (gap <= 0.1) {
    return [
      {
        id: "water-good",
        title: "Hydration on target",
        detail: `You drink about ${p.water_intake} L a day, which meets your ${target} L goal. Keep a bottle nearby to maintain it.`,
        icon: "water",
        priority: "low",
      },
    ];
  }
  return [
    {
      id: "water-goal",
      title: `Aim for ${target} L of water a day`,
      detail: `You currently average ${p.water_intake} L — about ${Math.max(1, Math.round(gap * 4))} glasses short. Drink a glass when you wake up and keep one at your desk or bag.`,
      icon: "water",
      priority: gap > 0.8 ? "high" : "medium",
    },
  ];
}

function movementSuggestions(p: HealthProfile): Suggestion[] {
  const out: Suggestion[] = [];
  if (p.exercise_frequency === "never" || p.exercise_frequency === "rarely") {
    out.push({
      id: "move-start",
      title: "Start a beginner movement plan",
      detail:
        "WHO advises 150 minutes of moderate activity a week. Begin with 10-minute brisk walks after meals and add a short bodyweight routine twice a week.",
      icon: "exercise",
      priority: "high",
    });
  } else if (p.exercise_frequency === "weekly_1_2") {
    out.push({
      id: "move-add",
      title: "Add one more active day",
      detail:
        "You exercise 1-2 times a week. One extra session — even a 20-minute walk or home workout — moves you toward the 150-minute weekly guideline.",
      icon: "exercise",
      priority: "medium",
    });
  } else {
    out.push({
      id: "move-good",
      title: "Great activity level",
      detail:
        "You are meeting the weekly exercise guidance. Vary intensity and add stretching or balance work to stay injury-free.",
      icon: "exercise",
      priority: "low",
    });
  }
  if (p.sitting_hours >= 6) {
    out.push({
      id: "sit-breaks",
      title: "Break up long sitting",
      detail: `You sit about ${p.sitting_hours} hours a day. Stand, stretch or walk for 2-3 minutes every 45-60 minutes — even light movement lowers the risks of prolonged sitting.`,
      icon: "sun",
      priority: p.sitting_hours >= 8 ? "high" : "medium",
    });
  }
  return out;
}

function nutritionSuggestions(p: HealthProfile): Suggestion[] {
  const out: Suggestion[] = [];
  if (p.eating_habits === "fast_food") {
    out.push({
      id: "eat-swap",
      title: "Swap, don't stop",
      detail:
        "Keep convenience but upgrade choices: grilled over fried, water over sugary drinks, add one vegetable to each meal. WHO recommends at least 400 g of fruit and vegetables daily.",
      icon: "food",
      priority: "high",
    });
  } else if (p.eating_habits === "skipping_meals") {
    out.push({
      id: "eat-regular",
      title: "Anchor your meals",
      detail:
        "Skipping meals often backfires as late-night overeating and energy dips. Plan simple, repeatable breakfasts and lunches you actually enjoy.",
      icon: "food",
      priority: "high",
    });
  } else if (p.eating_habits === "vegetarian") {
    out.push({
      id: "eat-protein",
      title: "Mind your protein, iron and B12",
      detail:
        "On a vegetarian diet include pulses, dairy or fortified alternatives, nuts and seeds daily; ask your doctor about checking B12 and iron during your next health visit.",
      icon: "food",
      priority: "medium",
    });
  } else {
    out.push({
      id: "eat-good",
      title: "Keep the balanced plate",
      detail:
        "Half vegetables, a quarter whole grains, a quarter protein is an easy template to hold onto, especially on busy days.",
      icon: "food",
      priority: "low",
    });
  }
  return out;
}

function stressSuggestions(p: HealthProfile): Suggestion[] {
  const out: Suggestion[] = [];
  if (p.stress_level === "high") {
    out.push({
      id: "stress-high",
      title: "Lower the daily stress load",
      detail:
        "Chronic stress affects sleep, digestion and blood pressure. Try 5 minutes of slow breathing twice a day, and one stressor you can remove or delegate this week.",
      icon: "stress",
      priority: "high",
    });
    out.push({
      id: "stress-talk",
      title: "Talk to someone you trust",
      detail:
        "Sharing worries with a friend, family member or counselor helps. If stress feels overwhelming or constant, a healthcare professional can help you find the right support.",
      icon: "heart",
      priority: "medium",
    });
  } else if (p.stress_level === "moderate") {
    out.push({
      id: "stress-balance",
      title: "Keep stress in the healthy range",
      detail:
        "A short daily reset — a walk without your phone, stretching, or slow breathing — prevents moderate stress from creeping up during busy weeks.",
      icon: "stress",
      priority: "medium",
    });
  } else {
    out.push({
      id: "stress-good",
      title: "Protect your calm",
      detail:
        "Your stress level is currently low. Keep whatever routine is working — and have a plan ready for high-pressure weeks.",
      icon: "stress",
      priority: "low",
    });
  }
  if (p.screen_time >= 6) {
    out.push({
      id: "screen-2020",
      title: "Follow the 20-20-20 rule",
      detail: `With about ${p.screen_time} hours of screen time, rest your eyes every 20 minutes by looking 20 feet away for 20 seconds, and reduce screens in the last hour before bed.`,
      icon: "screen",
      priority: p.screen_time >= 8 ? "high" : "medium",
    });
  }
  return out;
}

function substanceSuggestions(p: HealthProfile): Suggestion[] {
  const out: Suggestion[] = [];
  if (p.smoking) {
    out.push({
      id: "smoke-quit",
      title: "Quitting is the single best step",
      detail:
        "Quitting tobacco improves heart and lung health within weeks, at any age. Support and quit plans double your chances of success — see the resources in the Reading Corner.",
      icon: "smoke",
      priority: "high",
    });
  }
  if (p.alcohol === "regularly") {
    out.push({
      id: "alcohol-cut",
      title: "Ease up on alcohol",
      detail:
        "Regular drinking affects sleep quality and long-term heart and liver health. Setting alcohol-free days each week is a simple, proven starting point.",
      icon: "smoke",
      priority: "high",
    });
  } else if (p.alcohol === "occasionally") {
    out.push({
      id: "alcohol-ok",
      title: "Keep alcohol occasional",
      detail:
        "Less is better: alternating with water and keeping alcohol away from weekdays protects sleep and recovery.",
      icon: "smoke",
      priority: "low",
    });
  }
  return out;
}

const CATEGORY_SUGGESTIONS: Record<Category, Suggestion[]> = {
  student: [
    {
      id: "student-balance",
      title: "Balance study blocks with real breaks",
      detail:
        "Study in 25-50 minute focused blocks with 5-10 minute breaks away from your desk. You retain more with spaced, regular revision than with marathon sessions.",
      icon: "calendar",
      priority: "medium",
    },
    {
      id: "student-exams",
      title: "Have an exam-stress plan",
      detail:
        "Before exams: fix sleep first, schedule revision backwards from exam dates, and use past papers under timed conditions. Practice tests reduce anxiety better than re-reading notes.",
      icon: "calendar",
      priority: "medium",
    },
    {
      id: "student-social",
      title: "Protect social time and sunshine",
      detail:
        "Classes, study and screens fill a student day fast. Schedule at least one in-person activity and 15-20 minutes outdoors daily for mood and vitamin D.",
      icon: "users",
      priority: "low",
    },
  ],
  married: [
    {
      id: "married-meals",
      title: "Plan meals together for the week",
      detail:
        "A shared 15-minute meal plan saves money, cuts takeaway, and makes healthy eating the default. Cook double portions for busy nights.",
      icon: "food",
      priority: "medium",
    },
    {
      id: "married-couple",
      title: "Make one habit a couple habit",
      detail:
        "A nightly walk, a shared fitness class or cooking together works better than separate plans — couples who build habits together keep them longer.",
      icon: "users",
      priority: "medium",
    },
    {
      id: "married-balance",
      title: "Guard personal recharge time",
      detail:
        "Time together matters, and so does time alone. Agree on one personal hour each for hobbies, exercise or rest, so support never becomes pressure.",
      icon: "heart",
      priority: "low",
    },
  ],
  job_holder: [
    {
      id: "job-ergonomics",
      title: "Set up an ergonomic desk",
      detail:
        "Screen at eye level, elbows at 90 degrees, feet flat, and a chair supporting your lower back. Check your setup against an ergonomic guide and adjust one thing today.",
      icon: "sun",
      priority: "medium",
    },
    {
      id: "job-breaks",
      title: "Movement breaks every hour",
      detail:
        "Desk jobs make stillness the default. Set an hourly cue to stand, stretch or walk to the water cooler — 5 minutes each hour adds up to real weekly activity.",
      icon: "exercise",
      priority: "medium",
    },
    {
      id: "job-boundaries",
      title: "Draw a line around work",
      detail:
        "Pick a shutdown time, mute non-urgent notifications after it, and take your full lunch break away from the desk. Recovery is part of productivity.",
      icon: "calendar",
      priority: "medium",
    },
  ],
};

function goalSuggestions(p: HealthProfile): Suggestion[] {
  const raw = (p.goals ?? "").trim();
  if (!raw) return [];
  const items = raw
    .split(/[,\n;]+/)
    .map((g) => g.trim())
    .filter((g) => g.length > 2)
    .slice(0, 4);
  if (items.length === 0) return [];
  return [
    {
      id: "goals-echo",
      title: "Turn your goals into weekly actions",
      detail: `You wrote: ${items.join(" · ")}. Pick ONE to start this week, define a tiny daily action for it (under 10 minutes), and track it in your weekly check-in.`,
      icon: "calendar",
      priority: "medium",
    },
  ];
}

function concernSuggestions(p: HealthProfile): Suggestion[] {
  const out: Suggestion[] = [];
  if ((p.health_concerns ?? "").trim() || (p.symptoms ?? "").trim()) {
    out.push({
      id: "concerns-professional",
      title: "Share persistent symptoms with a professional",
      detail:
        "You mentioned health concerns or symptoms. HealthMate offers general education only — anything persistent, painful or worsening deserves a proper check-up with a doctor.",
      icon: "heart",
      priority: "high",
    });
    out.push({
      id: "concerns-log",
      title: "Keep a simple symptom diary",
      detail:
        "For two weeks note when symptoms appear, how long they last, and what changed that day. It makes any medical visit far more useful.",
      icon: "calendar",
      priority: "medium",
    });
  }
  return out;
}

function section(
  key: string,
  title: string,
  subtitle: string,
  suggestions: Suggestion[],
): RecommendationSection | null {
  if (suggestions.length === 0) return null;
  return { key, title, subtitle, suggestions };
}

/** Builds the personalized dashboard content from the user's saved lifestyle answers. */
export function buildRecommendations(
  p: HealthProfile,
): RecommendationSection[] {
  const categoryTitle =
    p.category === "student"
      ? "Student wellness"
      : p.category === "married"
        ? "Family & couple wellness"
        : "Workday wellness";

  const sections = [
    section(
      "category",
      categoryTitle,
      "Tailored to how you live",
      CATEGORY_SUGGESTIONS[p.category],
    ),
    section("sleep", "Sleep", "Rest and recovery", sleepSuggestions(p)),
    section(
      "hydration",
      "Hydration",
      "Water intake",
      hydrationSuggestions(p),
    ),
    section(
      "movement",
      "Movement",
      "Exercise and breaks",
      movementSuggestions(p),
    ),
    section(
      "nutrition",
      "Nutrition",
      "Everyday eating",
      nutritionSuggestions(p),
    ),
    section("stress", "Mind & stress", "Mental wellbeing", stressSuggestions(p)),
    section(
      "substances",
      "Tobacco & alcohol",
      "Long-term health",
      substanceSuggestions(p),
    ),
    section(
      "goals",
      "Your goals",
      "From your own words",
      goalSuggestions(p),
    ),
    section(
      "concerns",
      "Health concerns",
      "General guidance only",
      concernSuggestions(p),
    ),
  ];
  return sections.filter((s): s is RecommendationSection => s !== null);
}

/** Personalized daily wellness checklist — item ids are stable for completion tracking. */
export function dailyChecklist(p: HealthProfile): ChecklistItem[] {
  const items: ChecklistItem[] = [
    { id: "water", title: `Drink your ${hydrationTarget(p)} L water goal` },
    { id: "veggies", title: "Add vegetables or fruit to at least 2 meals" },
  ];
  if (p.sleep_hours < 7.5) {
    items.push({ id: "sleep-early", title: "Screens off 30 min before bedtime" });
  }
  if (p.exercise_frequency === "never" || p.exercise_frequency === "rarely") {
    items.push({ id: "walk", title: "Take a 10-minute brisk walk" });
  } else {
    items.push({ id: "move", title: "Do today's planned activity" });
  }
  if (p.sitting_hours >= 6) {
    items.push({ id: "sit", title: "Stand up and stretch every hour" });
  }
  if (p.screen_time >= 4) {
    items.push({ id: "eyes", title: "Follow the 20-20-20 eye rule" });
  }
  if (p.stress_level !== "low") {
    items.push({ id: "breathe", title: "5 minutes of slow breathing" });
  }
  if (p.eating_habits === "fast_food" || p.eating_habits === "skipping_meals") {
    items.push({ id: "eat", title: "Eat meals at regular times today" });
  }
  items.push({ id: "gratitude", title: "Note one good thing from today" });
  return items;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/** A personalized 7-day focus plan, re-generated from the saved answers. */
export function weeklyPlan(p: HealthProfile): DayPlan[] {
  const plans: DayPlan[] = [];
  const strength = ACTIVE_FREQUENCIES.has(p.exercise_frequency);
  plans.push(
    { day: DAYS[0], focus: "Fresh start", action: "Plan the week's meals and set a bedtime you can keep all week." },
    { day: DAYS[1], focus: strength ? "Strength" : "Start moving", action: strength ? "Strength or bodyweight session (20-30 min)." : "10-minute walk after your biggest meal — add one stretch break every hour." },
    { day: DAYS[2], focus: "Hydration & food", action: `Hit your ${hydrationTarget(p)} L water goal and cook one simple homemade meal.` },
    { day: DAYS[3], focus: "Mind reset", action: p.stress_level === "high" ? "Two 5-minute breathing sessions and one stressor removed or delegated." : "Screen-free half hour before bed; write down worries to park them." },
    { day: DAYS[4], focus: "Active break", action: strength ? "Lighter 20-minute session or long walk." : "Longer 20-30 minute walk, cycle or home workout video." },
    { day: DAYS[5], focus: "Social & outdoors", action: "Spend active time with people you like — a walk, a game, a market trip." },
    { day: DAYS[6], focus: "Rest & review", action: "Prep sleep-friendly Sunday evening, then complete your weekly check-in." },
  );
  if (p.category === "job_holder") {
    plans[0]!.action = "Check your chair, screen height and keyboard position; fix one thing.";
    plans[3]!.action = "Take your full lunch break away from the desk; no email after your shutdown hour.";
  } else if (p.category === "student") {
    plans[3]!.action = "One timed practice test, then a real break outdoors.";
    plans[6]!.action = "Review what study method worked best this week; plan next week's revision blocks.";
  } else if (p.category === "married") {
    plans[2]!.action = `Cook together: pick this week's shared menu and hit your ${hydrationTarget(p)} L water goal.`;
    plans[5]!.action = "Couple activity — a walk, a class or cooking something new together.";
  }
  return plans;
}

export function stressLabel(level: StressLevel): string {
  return level === "high" ? "High" : level === "moderate" ? "Moderate" : "Low";
}

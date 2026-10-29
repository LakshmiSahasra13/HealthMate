export interface Resource {
  id: string;
  title: string;
  source: string;
  url: string;
  topic: "sleep" | "nutrition" | "exercise" | "stress" | "hydration" | "tobacco" | "preventive" | "general";
  description: string;
}

export const ARTICLES: Resource[] = [
  {
    id: "who-healthy-diet",
    title: "Healthy diet — key facts",
    source: "World Health Organization",
    url: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
    topic: "nutrition",
    description: "What a healthy adult diet looks like: fruit, vegetables, whole grains, and limits on sugar, salt and fat.",
  },
  {
    id: "who-physical-activity",
    title: "Physical activity guidelines for adults",
    source: "World Health Organization",
    url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
    topic: "exercise",
    description: "How much weekly activity adults need, plus the risks of too much sitting — the basis of our movement suggestions.",
  },
  {
    id: "who-stress",
    title: "Stress: questions and answers",
    source: "World Health Organization",
    url: "https://www.who.int/news-room/questions-and-answers/item/stress",
    topic: "stress",
    description: "What stress is, how it affects the body, and practical coping strategies you can start today.",
  },
  {
    id: "who-tobacco",
    title: "Tobacco and quitting support",
    source: "World Health Organization",
    url: "https://www.who.int/health-topics/tobacco",
    topic: "tobacco",
    description: "Health effects of tobacco and how quitting improves health at every age — links to national quit services.",
  },
  {
    id: "cdc-sleep",
    title: "About sleep and why it matters",
    source: "US CDC",
    url: "https://www.cdc.gov/sleep/about/index.html",
    topic: "sleep",
    description: "Sleep duration recommendations for adults and how poor sleep affects heart, brain and mood health.",
  },
  {
    id: "cdc-physical-activity",
    title: "Physical activity basics",
    source: "US CDC",
    url: "https://www.cdc.gov/physical-activity-basics/index.html",
    topic: "exercise",
    description: "Beginner-friendly explanations of aerobic and muscle-strengthening activity for adults.",
  },
  {
    id: "who-mental-health",
    title: "Mental health overview",
    source: "World Health Organization",
    url: "https://www.who.int/health-topics/mental-health",
    topic: "stress",
    description: "Understanding mental wellbeing in young adulthood and where to find reliable support.",
  },
  {
    id: "nhs-breathing",
    title: "Breathing exercises for stress",
    source: "UK NHS",
    url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/",
    topic: "stress",
    description: "Simple, guided breathing techniques you can do at a desk, in class or before bed.",
  },
  {
    id: "nhs-mindfulness",
    title: "Mindfulness for everyday life",
    source: "UK NHS",
    url: "https://www.nhs.uk/mental-health/self-help/tips-and-support/mindfulness/",
    topic: "stress",
    description: "How mindfulness works, free exercises, and evidence on when it helps most.",
  },
  {
    id: "myplate",
    title: "MyPlate: build a healthy meal",
    source: "US Department of Agriculture",
    url: "https://www.myplate.gov/",
    topic: "nutrition",
    description: "Visual portion guides, budget tips and recipes based on the healthy-plate model.",
  },
  {
    id: "sleepfoundation-hygiene",
    title: "Healthy sleep tips",
    source: "Sleep Foundation",
    url: "https://www.sleepfoundation.org/sleep-hygiene/healthy-sleep-tips",
    topic: "sleep",
    description: "Practical sleep-hygiene checklist: light, temperature, caffeine timing and wind-down routines.",
  },
  {
    id: "nih-health-info",
    title: "NIH health information A-Z",
    source: "US National Institutes of Health",
    url: "https://www.nih.gov/health-information",
    topic: "general",
    description: "Trusted encyclopedia of conditions, symptoms and prevention, maintained by medical researchers.",
  },
  {
    id: "nhs-live-well",
    title: "NHS Live Well",
    source: "UK NHS",
    url: "https://www.nhs.uk/live-well/",
    topic: "general",
    description: "Free, practical guides on exercise, weight, sleep, alcohol and mental wellbeing for adults.",
  },
  {
    id: "heart-bp",
    title: "Understand your blood pressure",
    source: "American Heart Association",
    url: "https://www.heart.org/en/health-topics/high-blood-pressure",
    topic: "preventive",
    description: "Why young adults should know their blood pressure numbers and what readings mean.",
  },
  {
    id: "nih-vitamind",
    title: "Vitamin D — consumer fact sheet",
    source: "NIH Office of Dietary Supplements",
    url: "https://ods.od.nih.gov/factsheets/VitaminD-Consumer/",
    topic: "nutrition",
    description: "Sunshine vitamin essentials: sources, deficiency signs and when supplements make sense.",
  },
  {
    id: "cancer-gov-cervical",
    title: "Cervical cancer prevention & screening",
    source: "US National Cancer Institute",
    url: "https://www.cancer.gov/types/cervical",
    topic: "preventive",
    description: "Why HPV vaccination and regular screening from your mid-20s matter for long-term health.",
  },
];

export interface BookResource {
  id: string;
  title: string;
  author: string;
  url: string;
  topic: "sleep" | "nutrition" | "exercise" | "stress" | "general";
  description: string;
}

export const BOOKS: BookResource[] = [
  {
    id: "book-why-we-sleep",
    title: "Why We Sleep",
    author: "Matthew Walker",
    url: "https://www.goodreads.com/book/show/34466963-why-we-sleep",
    topic: "sleep",
    description: "Accessible science on how sleep shapes memory, mood, immunity and long-term health.",
  },
  {
    id: "book-atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    url: "https://www.goodreads.com/book/show/40121378-atomic-habits",
    topic: "general",
    description: "The go-to playbook for building small, sticky health habits that survive busy weeks.",
  },
  {
    id: "book-how-not-to-die",
    title: "How Not to Die",
    author: "Michael Greger",
    url: "https://www.goodreads.com/book/show/25664066-how-not-to-die",
    topic: "nutrition",
    description: "Evidence-based nutrition habits tied to preventing the most common chronic diseases.",
  },
  {
    id: "book-blue-zones",
    title: "The Blue Zones Solution",
    author: "Dan Buettner",
    url: "https://www.goodreads.com/book/show/23136322-the-blue-zones-solution",
    topic: "nutrition",
    description: "Lessons from communities where people live longest — food, movement and social life.",
  },
  {
    id: "book-breath",
    title: "Breath",
    author: "James Nestor",
    url: "https://www.goodreads.com/book/show/44932862-breath",
    topic: "stress",
    description: "How the way you breathe affects stress, sleep and energy, with simple practices.",
  },
  {
    id: "book-burnout",
    title: "Burnout",
    author: "Emily & Amelia Nagoski",
    url: "https://www.goodreads.com/book/show/41215875-burnout",
    topic: "stress",
    description: "Completing the stress cycle — practical for students in exam season and busy professionals alike.",
  },
];

export interface PreventiveItem {
  id: string;
  title: string;
  when: string;
  description: string;
  url?: string;
}

/** General preventive-care schedule for adults aged 20-35 (education, not medical advice). */
export const PREVENTIVE_ITEMS: PreventiveItem[] = [
  {
    id: "prev-bp",
    title: "Blood pressure check",
    when: "At least every 1-2 years",
    description: "High blood pressure is silent in young adults. Many pharmacies offer free checks.",
    url: "https://www.heart.org/en/health-topics/high-blood-pressure",
  },
  {
    id: "prev-dental",
    title: "Dental check-up & cleaning",
    when: "Every 6-12 months",
    description: "Early gum problems are painless; regular cleaning prevents bigger issues and costs.",
  },
  {
    id: "prev-eye",
    title: "Eye examination",
    when: "Every 2 years (more with heavy screen use)",
    description: "Correcting small vision errors early reduces headaches and screen fatigue.",
  },
  {
    id: "prev-bmi",
    title: "Weight, BMI & waist check",
    when: "Annually",
    description: "A simple yearly tracking habit catches slow trends early, while change is easy.",
  },
  {
    id: "prev-vaccines",
    title: "Vaccinations & boosters",
    when: "Keep up to date",
    description: "Check tetanus boosters, hepatitis B, HPV (if under 26) and annual flu vaccination.",
    url: "https://www.who.int/health-topics/immunization",
  },
  {
    id: "prev-sti",
    title: "Sexual health screening",
    when: "If sexually active, per guidelines",
    description: "Regular testing is quick, confidential and protects long-term fertility and health.",
  },
  {
    id: "prev-cervical",
    title: "Cervical screening (women)",
    when: "From age 25, per local program",
    description: "HPV-based screening prevents most cervical cancer when done on schedule.",
    url: "https://www.cancer.gov/types/cervical",
  },
  {
    id: "prev-skin",
    title: "Skin & mole self-check",
    when: "Monthly self-check; yearly if high risk",
    description: "Photograph and watch moles for asymmetry, border, color, diameter or change.",
  },
  {
    id: "prev-mental",
    title: "Mental health check-in",
    when: "Ongoing; sooner if low mood persists 2+ weeks",
    description: "Persistent low mood, sleep loss or anxiety deserve a professional conversation.",
    url: "https://www.who.int/health-topics/mental-health",
  },
  {
    id: "prev-lipids",
    title: "Cholesterol & blood glucose (from 25-30)",
    when: "Baseline, then per risk",
    description: "A one-time baseline lipid and glucose panel helps your doctor track long-term risk.",
  },
];

export interface ExercisePlan {
  id: string;
  level: "beginner" | "intermediate" | "active";
  title: string;
  who: string;
  weeks: string;
  days: { day: string; focus: string; exercises: string[] }[];
}

export const EXERCISE_PLANS: ExercisePlan[] = [
  {
    id: "plan-beginner",
    level: "beginner",
    title: "Fresh Start (Weeks 1-4)",
    who: "For anyone currently exercising rarely or never",
    weeks: "20-30 min per day, 4 days a week",
    days: [
      { day: "Day 1", focus: "Walk & legs", exercises: ["Brisk walk 15 minutes", "Sit-to-stand squats: 2 x 10", "Standing calf raises: 2 x 12", "Gentle stretch 5 minutes"] },
      { day: "Day 2", focus: "Rest or easy stroll", exercises: ["Optional 10-minute easy walk", "Neck & shoulder rolls", "5 minutes of slow breathing"] },
      { day: "Day 3", focus: "Full body basics", exercises: ["Brisk walk 10 minutes", "Wall push-ups: 2 x 8", "Glute bridges: 2 x 10", "Plank on knees: 2 x 15 seconds"] },
      { day: "Day 4", focus: "Fun movement", exercises: ["Dancing, cycling, swimming or sport — 20 minutes of anything you enjoy"] },
      { day: "Days 5-7", focus: "Recover & repeat", exercises: ["Two full rest days", "10-minute morning stretch", "Review the week: what felt good?"] },
    ],
  },
  {
    id: "plan-intermediate",
    level: "intermediate",
    title: "Building Momentum (Weeks 5-12)",
    who: "For anyone exercising 1-2 times a week already",
    weeks: "30-45 min per day, 4-5 days a week",
    days: [
      { day: "Day 1", focus: "Cardio intervals", exercises: ["Warm-up walk 5 minutes", "Brisk walk / easy jog intervals: 8 x 1 min", "Cool-down stretch 5 minutes"] },
      { day: "Day 2", focus: "Strength lower body", exercises: ["Bodyweight squats: 3 x 12", "Lunges: 3 x 10 each leg", "Glute bridges: 3 x 15", "Plank: 3 x 30 seconds"] },
      { day: "Day 3", focus: "Active recovery", exercises: ["Yoga or stretching video 20 minutes", "Long walk 20 minutes"] },
      { day: "Day 4", focus: "Strength upper body", exercises: ["Push-ups (knees ok): 3 x 8", "Rows with backpack: 3 x 12", "Shoulder press with bottles: 3 x 10", "Dead bug: 3 x 8 each side"] },
      { day: "Day 5", focus: "Long cardio", exercises: ["Brisk walk, jog, cycle or swim 30-40 minutes"] },
      { day: "Days 6-7", focus: "Rest", exercises: ["At least one full rest day", "Gentle mobility 10 minutes"] },
    ],
  },
  {
    id: "plan-active",
    level: "active",
    title: "Stay Strong (Ongoing)",
    who: "For anyone exercising 3+ times a week",
    weeks: "45-60 min, 5 days a week + 1 active recovery",
    days: [
      { day: "Day 1", focus: "Cardio quality", exercises: ["Run, cycle or swim 40 minutes at conversational pace", "Core: plank + side plank, 3 rounds"] },
      { day: "Day 2", focus: "Full-body strength", exercises: ["Squats: 4 x 10", "Push-ups: 4 x 12", "Rows: 4 x 12", "Hip hinge: 3 x 12", "Farmer carries: 3 x 40 steps"] },
      { day: "Day 3", focus: "Mobility & recovery", exercises: ["Yoga flow or mobility routine 30 minutes", "Foam rolling 10 minutes"] },
      { day: "Day 4", focus: "Intervals", exercises: ["Warm-up 10 minutes", "8-10 x 1 min hard / 1 min easy", "Cool-down 10 minutes"] },
      { day: "Day 5", focus: "Strength variation", exercises: ["Single-leg work: split squats 3 x 10", "Pull-ups or rows: 3 x max", "Core circuit 10 minutes"] },
      { day: "Days 6-7", focus: "Life & rest", exercises: ["Long walk, hike or active social plan", "One full rest day", "Sleep 7-9 hours — this is where progress happens"] },
    ],
  },
];

export const DISCLAIMER =
  "HealthMate provides general health education and preventive-care awareness for adults aged 20-35. It does not provide medical diagnosis or treatment. Always consult a qualified healthcare professional about personal symptoms or before making significant changes to diet, exercise or medication.";

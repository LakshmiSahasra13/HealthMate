export type Category = "student" | "married" | "job_holder";
export type StressLevel = "low" | "moderate" | "high";
export type AlcoholLevel = "never" | "occasionally" | "regularly";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type ExerciseFrequency =
  | "never"
  | "rarely"
  | "weekly_1_2"
  | "weekly_3_4"
  | "daily";

export type EatingHabits =
  | "balanced"
  | "home_cooked"
  | "fast_food"
  | "skipping_meals"
  | "vegetarian";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  age: number | null;
  created_at: string;
  updated_at: string;
}

export interface HealthProfile {
  id: string;
  user_id: string;
  category: Category;
  age: number;
  sleep_hours: number;
  water_intake: number;
  physical_activity: ActivityLevel | "";
  exercise_frequency: ExerciseFrequency | "";
  screen_time: number;
  sitting_hours: number;
  eating_habits: EatingHabits | "";
  stress_level: StressLevel;
  smoking: boolean;
  alcohol: AlcoholLevel;
  health_concerns: string | null;
  symptoms: string | null;
  goals: string | null;
  created_at: string;
  updated_at: string;
}

export interface HealthProfileInput {
  category: Category;
  age: number;
  sleep_hours: number;
  water_intake: number;
  physical_activity: ActivityLevel;
  exercise_frequency: ExerciseFrequency;
  screen_time: number;
  sitting_hours: number;
  eating_habits: EatingHabits;
  stress_level: StressLevel;
  smoking: boolean;
  alcohol: AlcoholLevel;
  health_concerns: string | null;
  symptoms: string | null;
  goals: string | null;
}

export interface Bookmark {
  id: string;
  user_id: string;
  resource_id: string;
  resource_type: string;
  created_at: string;
}

export interface WellnessCompletion {
  id: string;
  user_id: string;
  item_id: string;
  completed_on: string;
  created_at: string;
}

export interface WeeklyCheckin {
  id: string;
  user_id: string;
  week_start: string;
  sleep_hours: number;
  water_intake: number;
  exercise_sessions: number;
  stress_level: StressLevel;
  weight_kg: number | null;
  energy_level: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  student: "Student",
  married: "Married",
  job_holder: "Job Holder",
};

export const CATEGORY_BLURBS: Record<Category, string> = {
  student:
    "Study-life balance, exam-stress support, campus wellness and budget-friendly healthy habits.",
  married:
    "Healthy daily routines, shared meal planning, work-life balance and personal wellness time.",
  job_holder:
    "Desk ergonomics, movement breaks, workplace stress management and healthy work routines.",
};

export function isCategory(value: unknown): value is Category {
  return value === "student" || value === "married" || value === "job_holder";
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import type {
  Bookmark,
  HealthProfile,
  HealthProfileInput,
  Profile,
  WeeklyCheckin,
  WellnessCompletion,
} from "@/lib/types";

/** Signed-in user's basic profile row (profiles table). */
export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (fields: { full_name?: string; age?: number | null }) => {
      const { error } = await supabase
        .from("profiles")
        .update(fields)
        .eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

/** Signed-in user's saved health & lifestyle assessment (health_profiles table). */
export function useHealthProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["health-profile", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<HealthProfile | null> => {
      const { data, error } = await supabase
        .from("health_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as HealthProfile | null;
    },
  });
}

export function useSaveHealthProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: HealthProfileInput) => {
      const payload = {
        user_id: user!.id,
        ...input,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from("health_profiles")
        .upsert(payload, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["health-profile"] });
    },
  });
}

export function useBookmarks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["bookmarks", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Bookmark[]> => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Bookmark[];
    },
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (args: {
      resourceId: string;
      resourceType: string;
      bookmarked: boolean;
    }) => {
      if (args.bookmarked) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user!.id)
          .eq("resource_id", args.resourceId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("bookmarks").insert({
          user_id: user!.id,
          resource_id: args.resourceId,
          resource_type: args.resourceType,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

export function useCompletions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["completions", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<WellnessCompletion[]> => {
      const { data, error } = await supabase
        .from("wellness_completions")
        .select("*")
        .order("completed_on", { ascending: false });
      if (error) throw error;
      return data as WellnessCompletion[];
    },
  });
}

export function useToggleCompletion() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (args: { itemId: string; date: string; done: boolean }) => {
      if (args.done) {
        const { error } = await supabase
          .from("wellness_completions")
          .delete()
          .eq("user_id", user!.id)
          .eq("item_id", args.itemId)
          .eq("completed_on", args.date);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("wellness_completions")
          .upsert(
            {
              user_id: user!.id,
              item_id: args.itemId,
              completed_on: args.date,
            },
            { onConflict: "user_id,item_id,completed_on" },
          );
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["completions"] });
    },
  });
}

export function useCheckins() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["checkins", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<WeeklyCheckin[]> => {
      const { data, error } = await supabase
        .from("weekly_checkins")
        .select("*")
        .order("week_start", { ascending: true });
      if (error) throw error;
      return data as WeeklyCheckin[];
    },
  });
}

export function useSaveCheckin() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (
      input: Omit<WeeklyCheckin, "id" | "user_id" | "created_at" | "updated_at">,
    ) => {
      const { error } = await supabase.from("weekly_checkins").upsert(
        {
          user_id: user!.id,
          ...input,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,week_start" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["checkins"] });
    },
  });
}

/** Monday of the week containing `date` (ISO yyyy-mm-dd). */
export function mondayOf(date = new Date()): string {
  const d = new Date(date);
  const day = d.getUTCDay(); // 0 = Sunday
  const diff = (day + 6) % 7;
  d.setUTCDate(d.getUTCDate() - diff);
  return d.toISOString().slice(0, 10);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

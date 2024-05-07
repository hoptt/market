import { Review } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import snakecaseKeys from "snakecase-keys";

type Params = Omit<Review, "id" | "createdAt" | "createdBy">;

export const createReview = async (
  supabase: SupabaseClient,
  params: Params
) => {
  if (process.env.USE_MOCK_DATA) {
    return;
  }

  const { error } = await supabase
    .from("reviews")
    .insert(snakecaseKeys(params));

  if (error) throw error;

  return;
};

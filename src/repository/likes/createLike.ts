import { SupabaseClient } from "@supabase/supabase-js";

export const createLike = async (
  supabase: SupabaseClient,
  productId: string
) => {
  if (process.env.USE_MOCK_DATA) {
    return;
  }

  const { error } = await supabase
    .from("likes")
    .insert({ product_id: productId });

  if (error) throw error;

  return;
};

import { SupabaseClient } from "@supabase/supabase-js";

export const getShopLikeCount = async (
  supabase: SupabaseClient,
  shopId: string
): Promise<{ data: number }> => {
  if (process.env.USE_MOCK_DATA) {
    return { data: 100 };
  }

  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("created_by", shopId);

  if (error) throw error;

  return { data: count || 0 };
};

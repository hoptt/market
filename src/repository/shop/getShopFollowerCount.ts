import { SupabaseClient } from "@supabase/supabase-js";

export const getShopFollowerCount = async (
  supabase: SupabaseClient,
  shopId: string
): Promise<{
  data: number;
}> => {
  if (process.env.USE_MOCK_DATA) {
    return { data: 100 };
  }

  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_shop_id", shopId);

  if (error) throw error;

  return { data: count || 0 };
};

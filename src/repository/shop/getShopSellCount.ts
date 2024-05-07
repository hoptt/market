import { SupabaseClient } from "@supabase/supabase-js";

export const getShopSellCount = async (
  supabase: SupabaseClient,
  shopId: string
): Promise<{ data: number }> => {
  if (process.env.USE_MOCK_DATA) {
    return { data: 1000 };
  }

  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("created_by", shopId)
    .not("purchase_by", "is", null);

  if (error) throw error;

  return { data: count || 0 };
};

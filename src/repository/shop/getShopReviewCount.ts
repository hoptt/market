import { SupabaseClient } from "@supabase/supabase-js";

export const getShopReviewCount = async (
  supabase: SupabaseClient,
  shopId: string
): Promise<{ data: number }> => {
  if (process.env.USE_MOCK_DATA) {
    return { data: 5 };
  }

  const { count, error } = await supabase
    .from("reviews")
    .select("*,product: product_id!inner(created_by)", {
      count: "exact",
      head: true,
    })
    .eq("product.created_by", shopId);
  if (error) throw error;
  return { data: count || 0 };
};

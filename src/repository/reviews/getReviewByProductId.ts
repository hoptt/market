import { Review } from "@/types";
import { getMockReviewData } from "@/utils/mock";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";

export const getReviewByProductId = async (
  supabase: SupabaseClient,
  productId: string
): Promise<{ data: Review | null }> => {
  if (process.env.USE_MOCK_DATA) {
    const { getMockReviewData } = await import("@/utils/mock");
    const data: Review | null =
      Math.random() > 0.5 ? getMockReviewData({ productId }) : null;
    return { data };
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .maybeSingle();

  if (error) throw error;

  return { data: camelcaseKeys(data, { deep: true }) };
};

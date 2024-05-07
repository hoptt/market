import { Like } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";

type Params = {
  shopId: string;
  fromPage?: number;
  toPage?: number;
};
export const getShopLikes = async (
  supabase: SupabaseClient,
  { shopId, fromPage = 0, toPage = 1 }: Params
): Promise<{ data: Like[] }> => {
  if (process.env.USE_MOCK_DATA) {
    const { getMockLikeData } = await import("@/utils/mock");
    const data: Like[] = Array.from({ length: (toPage - fromPage) * 10 }).map(
      () => getMockLikeData({ createdBy: shopId })
    );

    return { data };
  }

  const { data, error } = await supabase
    .from("likes")
    .select("*,product: product_id(*)")
    .eq("created_by", shopId)
    .range((fromPage ?? 0) * 10, (toPage ?? 1) * 10 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return { data: camelcaseKeys(data, { deep: true }) };
};

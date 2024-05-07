import { Follow } from "@/types";
import { getMockFollowData } from "@/utils/mock";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";

type Params = {
  shopId: string;
  fromPage?: number;
  toPage?: number;
};

export const getShopFollower = async (
  supabase: SupabaseClient,
  { shopId, fromPage = 0, toPage = 1 }: Params
): Promise<{ data: Follow[] }> => {
  if (process.env.USE_MOCK_DATA) {
    const { getMockFollowData } = await import("@/utils/mock");

    const data: Follow[] = Array.from({ length: (toPage - fromPage) * 10 }).map(
      () =>
        getMockFollowData({
          followingShopId: shopId,
        })
    );

    return Promise.resolve({ data });
  }

  const { data, error } = await supabase
    .from("follows")
    .select("*")
    .eq("following_shop_id", shopId)
    .range((fromPage ?? 0) * 10, (toPage ?? 1) * 10 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return { data: camelcaseKeys(data, { deep: true }) };
};

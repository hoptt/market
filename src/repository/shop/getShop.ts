import { Shop } from "@/types";

import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";

export const getShop = async (
  supabase: SupabaseClient,
  shopId: string
): Promise<{ data: Shop }> => {
  if (process.env.USE_MOCK_DATA) {
    const { getMockShopData } = await import("@/utils/mock");
    const data: Shop = getMockShopData({ id: shopId });
    return { data };
  }
  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .eq("id", shopId)
    .limit(1)
    .single();

  if (error) {
    throw error;
  }

  return { data: camelcaseKeys(data) };
};

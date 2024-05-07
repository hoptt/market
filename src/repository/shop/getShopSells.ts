import { Product } from "@/types";
import { getMockProductData } from "@/utils/mock";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
type Params = {
  shopId: string;
  fromPage?: number;
  toPage?: number;
};

export const getShopSells = async (
  supabase: SupabaseClient,
  { shopId, fromPage = 0, toPage = 1 }: Params
): Promise<{ data: Product[] }> => {
  if (process.env.USE_MOCK_DATA) {
    const { getMockProductData } = await import("@/utils/mock");
    const data: Product[] = Array.from({
      length: (toPage - fromPage) * 10,
    }).map(() =>
      getMockProductData({ createdBy: shopId, purchaseBy: "mock-shopId" })
    );

    return { data };
  }
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("created_by", shopId)
    .not("purchase_by", "is", null)
    .range((fromPage ?? 0) * 10, (toPage ?? 1) * 10 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return { data: camelcaseKeys(data, { deep: true }) };
};

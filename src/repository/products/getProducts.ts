import { Product } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
type Params = {
  fromPage?: number;
  toPage?: number;
};
export const getProducts = async (
  supabase: SupabaseClient,
  { fromPage = 0, toPage = 1 }: Params
): Promise<{ data: Product[] }> => {
  if (process.env.USE_MOCK_DATA) {
    const { getMockProductData } = await import("@/utils/mock");
    const data: Product[] = Array.from({
      length: (toPage - fromPage) * 10,
    }).map(() => getMockProductData({ purchaseBy: null }));
    return { data };
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .is("purchase_by", null)
    .range((fromPage ?? 0) * 10, (toPage ?? 1) * 10 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return { data: camelcaseKeys(data, { deep: true }) };
};

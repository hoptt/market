import { Product } from "@/types";
import { getMockProductData } from "@/utils/mock";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";

type Params = {
  query: string;
  fromPage?: number;
  toPage?: number;
};
export const getProductsByKeyword = async (
  supabase: SupabaseClient,
  { query, fromPage = 0, toPage = 1 }: Params
): Promise<{ data: Product[] }> => {
  if (process.env.USE_MOCK_DATA) {
    const { getMockProductData } = await import("@/utils/mock");
    const data: Product[] = Array.from({
      length: (toPage - fromPage) * 10,
    }).map((_, idx) =>
      getMockProductData({
        title: `${query} - ${idx}`,
      })
    );

    return { data };
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .like("title", `%${query}%`)
    .is("purchase_by", null)
    .range((fromPage ?? 0) * 10, (toPage ?? 1) * 10 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return { data: camelcaseKeys(data, { deep: true }) };
};

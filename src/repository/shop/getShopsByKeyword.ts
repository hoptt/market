import { Shop } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";

type Params = {
  query: string;
  fromPage?: number;
  toPage?: number;
};
export const getShopsByKeyword = async (
  supabase: SupabaseClient,
  { query, fromPage = 0, toPage = 1 }: Params
): Promise<{ data: Shop[] }> => {
  if (process.env.USE_MOCK_DATA) {
    const { getMockShopData } = await import("@/utils/mock");
    const data: Shop[] = Array.from({ length: (toPage - fromPage) * 10 }).map(
      (_, idx) =>
        getMockShopData({
          name: `${query} - ${idx}`,
        })
    );

    return { data };
  }

  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .like("name", `%${query}%`);

  if (error) throw error;

  return { data: camelcaseKeys(data, { deep: true }) };
};

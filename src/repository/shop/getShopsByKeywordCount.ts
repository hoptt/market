import { SupabaseClient } from "@supabase/supabase-js";

export const getShopsByKeywordCount = async (
  supabase: SupabaseClient,
  query: string
): Promise<{
  data: number;
}> => {
  if (process.env.USE_MOCK_DATA) {
    return { data: 100 };
  }

  const { count, error } = await supabase
    .from("shops")
    .select("*", { count: "exact", head: true })
    .like("name", `%${query}%`);

  if (error) throw error;

  return { data: count || 0 };
};

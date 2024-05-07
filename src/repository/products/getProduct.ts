import { Product } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";

export async function getProduct(
  supabase: SupabaseClient,
  id: string
): Promise<{ data: Product }> {
  if (process.env.USE_MOCK_DATA) {
    const { getMockProductData } = await import("@/utils/mock");
    const data = getMockProductData({ id });

    return { data };
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

  if (error) throw error;

  return { data: camelcaseKeys(data, { deep: true }) };
}

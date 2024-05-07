import { Product } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

type Params = Omit<Product, "id" | "createdAt" | "createdBy" | "purchaseBy">;
export const createdProduct = async (
  supabase: SupabaseClient,
  params: Params
): Promise<{ data: Product }> => {
  if (process.env.USE_MOCK_DATA) {
    const { getMockProductData } = await import("@/utils/mock");

    return { data: getMockProductData() };
  }

  const { data, error } = await supabase
    .from("products")
    .insert(snakecaseKeys(params))
    .select()
    .single();

  if (error) throw error;

  return { data: camelcaseKeys(data, { deep: true }) };
};

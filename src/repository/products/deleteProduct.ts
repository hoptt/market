import { SupabaseClient } from "@supabase/supabase-js";

export const deleteProduct = async (
  supabase: SupabaseClient,
  productId: string
) => {
  if (process.env.USE_MOCK_DATA) {
    return;
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) throw error;

  return;
};

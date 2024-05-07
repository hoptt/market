import { SupabaseClient } from "@supabase/supabase-js";
import { getMe } from "../me/getMe";
import { AuthError } from "@/utils/error";

export const buyProduct = async (
  supabase: SupabaseClient,
  productId: string
) => {
  if (process.env.USE_MOCK_DATA) {
    return;
  }

  const {
    data: { shopId },
  } = await getMe(supabase);

  if (!shopId) throw new AuthError();

  const { error } = await supabase
    .from("products")
    .update({ purchase_by: shopId })
    .eq("id", productId);

  if (error) throw error;

  return;
};

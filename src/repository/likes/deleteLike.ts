import { SupabaseClient } from "@supabase/supabase-js";
import { getMe } from "../me/getMe";
import { AuthError } from "@/utils/error";

export const deleteLike = async (
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
    .from("likes")
    .delete()
    .eq("product_id", productId)
    .eq("created_by", shopId);

  if (error) throw error;

  return;
};

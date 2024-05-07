import { SupabaseClient } from "@supabase/supabase-js";
import { getMe } from "../me/getMe";
import { AuthError } from "@/utils/error";

export const deleteFollow = async (
  supabase: SupabaseClient,
  followingShopId: string
) => {
  if (process.env.USE_MOCK_DATA) {
    return;
  }

  const {
    data: { shopId },
  } = await getMe(supabase);

  if (!shopId) throw new AuthError();

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("following_shop_id", followingShopId)
    .eq("created_by", shopId);

  if (error) throw error;

  return;
};

import { SupabaseClient } from "@supabase/supabase-js";

type Params = {
  followerId: string;
  followedId: string;
};

export const getIsFollowedByShopId = async (
  supabase: SupabaseClient,
  { followerId, followedId }: Params
): Promise<{ data: boolean }> => {
  if (process.env.USE_MOCK_DATA) {
    return { data: true };
  }

  const { data, error } = await supabase
    .from("follows")
    .select("*")
    .eq("created_by", followerId)
    .eq("following_shop_id", followedId)
    .maybeSingle();

  if (error) throw error;

  return { data: !!data };
};

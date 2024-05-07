import supabase from "@/utils/supabase/browserSupabase";
import { SupabaseClient } from "@supabase/supabase-js";

export const getMe = async (
  supabase: SupabaseClient
): Promise<{ data: { shopId: string | null } }> => {
  if (process.env.USE_MOCK_DATA) {
    return { data: { shopId: "mock-shop-id" } };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { data: { shopId: user?.id || null } };
};

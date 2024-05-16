import { SupabaseClient } from "@supabase/supabase-js";
import { getMe } from "../me/getMe";
import { AuthError } from "@/utils/error";

export const buyProductApi = async (productId: string) => {
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/product/${productId}/buy`,
      {
        cache: "no-store",
      }
    );
    return await res.json();
  } catch (e) {
    return {
      success: false,
      message: "상품 구매에 실패하였습니다",
    };
  }
};

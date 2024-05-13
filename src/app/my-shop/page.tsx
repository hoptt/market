import { getMe } from "@/repository/me/getMe";
import { AuthError } from "@/utils/error";
import getServerComponentSupabase from "@/utils/supabase/getServerComponentSupabase";
import { redirect } from "next/navigation";

export default async function MyShops() {
  const supabase = getServerComponentSupabase();
  try {
    const {
      data: { shopId },
    } = await getMe(supabase);

    if (!shopId) {
      throw new AuthError();
    }
    return redirect(`/shops/${shopId}`);
  } catch (e) {
    if (e instanceof AuthError) {
      return redirect(`/login?next=${encodeURIComponent(`/my-shop`)}`);
    }
    throw e;
  }
}

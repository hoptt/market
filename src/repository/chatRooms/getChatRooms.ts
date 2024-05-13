import { ChatRoom } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";

export const getChatRooms = async (
  supabase: SupabaseClient,
  shopId: string
): Promise<{
  data: ChatRoom[];
}> => {
  if (process.env.USE_MOCK_DATA) {
    const { getMockChatRoomData } = await import("@/utils/mock");
    const data = Array.from({ length: 1000 }).map((_, idx) =>
      getMockChatRoomData({ id: idx.toString(), toShopId: shopId })
    );

    return { data };
  }

  const { data, error } = await supabase
    .from("chat_rooms")
    .select("*")
    .or(`from_shop_id.eq.${shopId}, to_shop_id.eq.${shopId}`);

  if (error) throw error;

  return { data: camelcaseKeys(data, { deep: true }) };
};

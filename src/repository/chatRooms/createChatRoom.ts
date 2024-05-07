import { SupabaseClient } from "@supabase/supabase-js";
import { getMe } from "../me/getMe";
import { AuthError } from "@/utils/error";
import { getChatRooms } from "./getChatRooms";
import camelcaseKeys from "camelcase-keys";

export const createChatRoom = async (
  supabase: SupabaseClient,
  toShopId: string
) => {
  if (process.env.USE_MOCK_DATA) {
    const { getMockChatRoomData } = await import("@/utils/mock");
    return { data: getMockChatRoomData({ toShopId }) };
  }

  const {
    data: { shopId },
  } = await getMe(supabase);

  if (!shopId) throw new AuthError();

  const { data: chatRooms } = await getChatRooms(supabase, shopId);

  const chatRoom = chatRooms.find(
    (chatRoom) =>
      chatRoom.toShopId === toShopId || chatRoom.fromShopId === toShopId
  );

  if (chatRoom) {
    return { data: camelcaseKeys(chatRoom, { deep: true }) };
  }

  const { data, error } = await supabase
    .from("chat_rooms")
    .insert({ from_shop_id: shopId, to_shop_id: toShopId })
    .select("*")
    .single();

  if (error) throw error;

  return { data: camelcaseKeys(data, { deep: true }) };
};

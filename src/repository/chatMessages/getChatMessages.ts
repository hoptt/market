import { ChatMessage } from "@/types";
import { getMockChatMessageData } from "@/utils/mock";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";

type Params = {
  chatRoomId: string;
  fromIndex?: number;
  toIndex?: number;
};
export const getChatMessages = async (
  supabase: SupabaseClient,
  { chatRoomId, fromIndex = 0, toIndex = 1 }: Params
): Promise<{
  data: ChatMessage[];
}> => {
  if (process.env.USE_MOCK_DATA) {
    const { getMockChatMessageData } = await import("@/utils/mock");
    const data: ChatMessage[] = Array.from({
      length: toIndex - fromIndex,
    }).map((_, idx) =>
      getMockChatMessageData({
        chatRoom: chatRoomId,
        message: `fromIdx:${fromIndex}, toIndex:${toIndex}, curIndex:${idx}`,
      })
    );
    return { data };
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("chat_room", chatRoomId)
    .range(fromIndex, toIndex)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return { data: camelcaseKeys(data, { deep: true }) };
};

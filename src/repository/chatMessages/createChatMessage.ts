import { SupabaseClient } from "@supabase/supabase-js";

type Params = {
  chatRoomId: string;
  message: string;
};
export const createChatMessage = async (
  supabase: SupabaseClient,
  { chatRoomId, message }: Params
) => {
  if (process.env.USE_MOCK_DATA) {
    return;
  }

  const { error } = await supabase
    .from("chat_messages")
    .insert({ chat_room: chatRoomId, message });

  if (error) throw error;
  return;
};

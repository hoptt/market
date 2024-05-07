import { SupabaseClient } from "@supabase/supabase-js";

export const getChatMessageCount = async (
  supabase: SupabaseClient,
  chatRoomId: string
): Promise<{
  data: number;
}> => {
  if (process.env.USE_MOCK_DATA) {
    return { data: 100 };
  }

  const { count, error } = await supabase
    .from("chat_messages")
    .select("*", { count: "exact", head: true })
    .eq("chat_room", chatRoomId);

  if (error) throw error;

  return { data: count || 0 };
};

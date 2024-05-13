"use client";

import { getChatRooms } from "@/repository/chatRooms/getChatRooms";
import { ChatRoom as TChatRoom } from "@/types";
import supabase from "@/utils/supabase/browserSupabase";
import { useCallback, useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import ChatPreview from "../ChatPreview";

type Props = {
  chatRooms: TChatRoom[];
  currentChatRoomId?: string;
  shopId: string;
};
export default function ChatRoom({
  chatRooms: initialChatRooms,
  currentChatRoomId,
  shopId,
}: Props) {
  const [chatRooms, setChatRooms] = useState(initialChatRooms);
  const handleUpdateChatRooms = useCallback(async () => {
    const { data } = await getChatRooms(supabase, shopId);
    setChatRooms(data);
  }, [shopId]);
  useEffect(() => {
    const subscribeChatRoomsFromMe = supabase
      .channel(`chat_rooms_from_${shopId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_rooms",
          filter: `from_shop_id=eq.${shopId}`,
        },
        (payload) => {
          handleUpdateChatRooms();
        }
      );
    const subscribeChatRoomsToMe = supabase
      .channel(`chat_rooms_to_${shopId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_rooms",
          filter: `to_shop_id=eq.${shopId}`,
        },
        (payload) => {
          handleUpdateChatRooms();
        }
      );
    subscribeChatRoomsFromMe.subscribe();
    subscribeChatRoomsToMe.subscribe();

    return () => {
      subscribeChatRoomsFromMe.unsubscribe();
      subscribeChatRoomsToMe.unsubscribe();
    };
  }, [handleUpdateChatRooms, shopId]);
  return (
    <Virtuoso
      initialTopMostItemIndex={Math.max(
        0,
        chatRooms.findIndex(({ id }) => id === currentChatRoomId)
      )}
      data={chatRooms}
      itemContent={(_, { id, fromShopId, toShopId }) => (
        <ChatPreview
          key={id}
          chatRoomId={id}
          shopId={fromShopId === shopId ? toShopId : fromShopId}
          isActive={id === currentChatRoomId}
        />
      )}
    />
  );
}

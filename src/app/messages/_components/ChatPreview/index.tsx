"use client";

import { ChatMessage, Shop } from "@/types";
import { useEffect, useState } from "react";
import { getShop } from "./../../../../repository/shop/getShop";
import ShopProfileImage from "@/components/common/ShopProfileImage";
import Text from "@/components/common/Text";
import { getChatMessages } from "@/repository/chatMessages/getChatMessages";
import Link from "next/link";
import Spinner from "@/components/common/Spinner";
import { checkIsImage } from "./../../../../utils/image";
import classNames from "classnames";
import supabase from "@/utils/supabase/browserSupabase";
import camelcaseKeys from "camelcase-keys";

type Props = {
  chatRoomId: string;
  shopId: string;
  isActive: boolean;
};

export default function ChatPreview({ chatRoomId, shopId, isActive }: Props) {
  const [shop, setShop] = useState<Shop>();
  const [lastMessage, setLastMessage] = useState<ChatMessage | null>();

  useEffect(() => {
    (async () => {
      const [
        { data: shop },
        {
          data: [lastMessage],
        },
      ] = await Promise.all([
        getShop(supabase, shopId),
        getChatMessages(supabase, { chatRoomId, fromIndex: 0, toIndex: 1 }),
      ]);
      setShop(shop);
      setLastMessage(lastMessage === undefined ? null : lastMessage);
    })();
  }, [chatRoomId, shopId]);

  useEffect(() => {
    const subscribeChat = supabase.channel(`preview_on_${chatRoomId}`).on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `chat_room=eq.${chatRoomId}`,
      },
      (payload) => {
        setLastMessage(camelcaseKeys(payload.new) as ChatMessage);
      }
    );
    subscribeChat.subscribe();

    return () => {
      subscribeChat.unsubscribe();
    };
  }, [chatRoomId]);

  if (shop === undefined || lastMessage === undefined)
    return (
      <div className="flex justify-center items-center shrink-0 h-20">
        <Spinner />
      </div>
    );
  return (
    <Link
      href={`/messages/${chatRoomId}`}
      prefetch={false}
      shallow
      className={classNames(
        "flex py-3 hover:bg-gray-100 h-20 shrink-0",
        isActive && "bg-gray-200 hover:bg-gray-200"
      )}
    >
      <div className="mx-3">
        <ShopProfileImage imageUrl={shop?.imageUrl || undefined} />
      </div>
      <div className="flex flex-col mx-3 flex-1 w-0">
        <Text size="lg" weight="bold">
          {shop?.name}
        </Text>
        <div className="truncate">
          <Text size="sm" color="grey">
            {lastMessage
              ? checkIsImage(lastMessage.message)
                ? "[이미지]"
                : lastMessage.message
              : "메시지가 없습니다."}
          </Text>
        </div>
      </div>
    </Link>
  );
}

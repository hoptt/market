"use client";
import Button from "@/components/common/Button";
import Text from "@/components/common/Text";
import { createChatRoom } from "@/repository/chatRooms/createChatRoom";
import supabase from "@/utils/supabase/browserSupabase";
import { useRouter } from "next/navigation";
import React from "react";
type Props = {
  isLoggedIn: boolean;
  shopId: string;
};
export default function ChatButton({ isLoggedIn, shopId }: Props) {
  const router = useRouter();
  const handleChat = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다");
      return;
    }
    await createChatRoom(supabase, shopId);
    router.push(`/messages`);
  };

  return (
    <Button
      color="orange"
      className="w-52 flex justify-center items-center"
      onClick={() => handleChat()}
    >
      <span style={{ fontSize: "1rem" }} className="material-symbols-outlined">
        chat_bubble
      </span>
      <Text color="white">문의하기</Text>
    </Button>
  );
}

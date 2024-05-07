import Text from "@/components/common/Text";
import Container from "@/components/layout/Container";
import Wrapper from "@/components/layout/Wrapper";
import { getChatRooms } from "@/repository/chatRooms/getChatRooms";
import { getMe } from "@/repository/me/getMe";
import { ChatRoom } from "@/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import ChatPreview from "../_components/ChatPreview";
import { useCallback, useEffect, useState } from "react";
import Button from "@/components/common/Button";
import ChatMessages from "../_components/ChatMessages";
import { useRouter } from "next/router";
import { Virtuoso } from "react-virtuoso";
import { AuthError } from "@/utils/error";
import getServerSupabase from "@/utils/supabase/getSeverSupabase";
import supabase from "@/utils/supabase/browserSupabase";

export const getServerSideProps: GetServerSideProps<{
  chatRooms: ChatRoom[];
  shopId: string;
}> = async (context) => {
  const supabase = getServerSupabase(context);
  try {
    const {
      data: { shopId },
    } = await getMe(supabase);

    if (!shopId) throw new AuthError();

    const { data: chatRooms } = await getChatRooms(supabase, shopId);

    return {
      props: {
        chatRooms,
        shopId,
      },
    };
  } catch (e) {
    if (e instanceof AuthError) {
      return {
        redirect: {
          destination: `/login?next=${encodeURIComponent(context.resolvedUrl)}`,
          permanent: false,
        },
      };
    }
    throw e;
  }
};
export default function Messages({
  chatRooms: initialChatRooms,
  shopId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState(initialChatRooms);
  const currentChatRoomId = router.query.chatRoomId?.[0] || "";
  const currentChatRoom = chatRooms.find(({ id }) => id === currentChatRoomId);
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
          console.log("새로운 채팅 보냄");
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
          console.log("새로운 채팅 받음");
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
    <Wrapper className="bg-gray-100">
      <Container>
        <div className="flex bg-white border-x border-gray-100">
          <div
            className="w-1/2 h-full flex overflow-auto"
            style={{
              minHeight: "calc(100vh - 28px - 108px - 65px)",
              maxHeight: "calc(100vh - 28px - 108px - 65px)",
            }}
          >
            {chatRooms.length === 0 ? (
              <div className="flex justify-center items-center w-full">
                <Text color="grey" size="2xl">
                  대화방이 없습니다
                </Text>
              </div>
            ) : (
              <div className="flex flex-col flex-1">
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

                {/* {chatRooms.map(({ id, fromShopId, toShopId }) => (
                  <ChatPreview
                    key={id}
                    chatRoomId={id}
                    shopId={fromShopId === shopId ? toShopId : fromShopId}
                    isActive={true}
                  />
                ))} */}
              </div>
            )}
          </div>
          <div
            className="w-1/2 border-l border-grey px-2"
            style={{
              minHeight: "calc(100vh - 28px - 108px - 65px)",
              maxHeight: "calc(100vh - 28px - 108px - 65px)",
            }}
          >
            {!currentChatRoom ? (
              <div className="flex justify-center items-center h-full">
                <Text color="grey">대화를 선택해주세요</Text>
              </div>
            ) : (
              <ChatMessages
                chatRoomId={currentChatRoom.id}
                myShopId={shopId}
                counterShopId={
                  currentChatRoom.fromShopId === shopId
                    ? currentChatRoom.toShopId
                    : currentChatRoom.fromShopId
                }
              />
            )}
          </div>
        </div>
      </Container>
    </Wrapper>
  );
}

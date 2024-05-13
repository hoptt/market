"use client";

import Spinner from "@/components/common/Spinner";
import Text from "@/components/common/Text";
import { getMe } from "@/repository/me/getMe";
import { getShopLikeCount } from "@/repository/shop/getShopLikeCount";
import supabase from "@/utils/supabase/browserSupabase";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Likes() {
  const [shopId, setShopId] = useState<string>();
  const [likeCount, setLikeCount] = useState<number>(0);
  useEffect(() => {
    (async () => {
      const {
        data: { shopId },
      } = await getMe(supabase);
      if (!shopId) {
        setLikeCount(0);
        return;
      }

      const { data: likeCount } = await getShopLikeCount(supabase, shopId);
      setLikeCount(likeCount);
      setShopId(shopId);
    })();
  }, []);
  return (
    <div className="border border-black bg-white p-2 flex flex-col items-center">
      <Text size="xs">찜한 상품</Text>
      {likeCount === undefined ? (
        <div className="mt-1">
          <Spinner />
        </div>
      ) : (
        <Link href={!shopId ? "#" : `/shops/${shopId}/likes`}>
          <Text size="xs" color="grey" className="flex gap-1 items-center mt-1">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "0.725rem" }}
            >
              favorite
            </span>
            {likeCount}
          </Text>
        </Link>
      )}
    </div>
  );
}

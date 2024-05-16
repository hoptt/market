"use client";

import Button from "@/components/common/Button";
import Text from "@/components/common/Text";
import { createFollow } from "@/repository/follows/createFollow";
import { deleteFollow } from "@/repository/follows/deleteFollow";
import supabase from "@/utils/supabase/browserSupabase";
import React, { useState } from "react";

type Props = {
  isLoggedIn: boolean;
  initialIsFollowed: boolean;
  shopId: string;
};

export default function FollowButton({
  isLoggedIn,
  initialIsFollowed,
  shopId,
}: Props) {
  const [isFollowed, setIsFollowed] = useState(initialIsFollowed);
  const handleToggleFollow = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다");
      return;
    }
    try {
      setIsFollowed(!isFollowed);
      if (!isFollowed) {
        await createFollow(supabase, shopId);
      } else {
        await deleteFollow(supabase, shopId);
      }
    } catch (e) {
      setIsFollowed(isFollowed);
    }
  };
  return (
    <Button
      outline={!isFollowed}
      color="grey"
      fullWidth
      onClick={handleToggleFollow}
    >
      <Text color="black" className="flex justify-center items-center gap-1">
        <span className="material-symbols-outlined">
          {isFollowed ? "person_remove" : "person_add"}
        </span>
        {isFollowed ? "언팔로우" : "팔로우"}
      </Text>
    </Button>
  );
}

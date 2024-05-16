"use client";
import Text from "@/components/common/Text";
import { createLike } from "@/repository/likes/createLike";
import { deleteLike } from "@/repository/likes/deleteLike";
import supabase from "@/utils/supabase/browserSupabase";
import { useState } from "react";
import styles from "./like.module.css";
import classNames from "classnames";

type Props = {
  initialIsLiked: boolean;
  isLoggedIn: boolean;
  productId: string;
};
export default function LikeButton({
  initialIsLiked,
  isLoggedIn,
  productId,
}: Props) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다");
      return;
    }
    try {
      setIsLiked(!isLiked);
      if (!isLiked) {
        await createLike(supabase, productId);
      } else {
        await deleteLike(supabase, productId);
      }
    } catch (e) {
      setIsLiked(isLiked);
    }
  };
  return (
    <>
      <span
        className={classNames(
          "material-symbols-outlined cursor-pointer me-2 text-zinc-400 w-fit",
          isLiked && styles.fill
        )}
        style={{ fontSize: "1.5rem" }}
        onClick={() => handleToggleLike()}
      >
        favorite
      </span>
    </>
  );
}

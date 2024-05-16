"use client";

import Text from "@/components/common/Text";
import LoginPannel from "@/components/shared/LoginPannel";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useEffect, useState } from "react";
import Spinner from "@/components/common/Spinner";
import { getMe } from "@/repository/me/getMe";
import supabase from "@/utils/supabase/browserSupabase";
import { getShop } from "@/repository/shop/getShop";
import Link from "next/link";
import { Shop } from "@/types";

export default function Login() {
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>();
  const [shop, setShop] = useState<Shop>();

  useEffect(() => {
    if (showModal) {
      disablePageScroll();
    } else {
      enablePageScroll();
    }
  }, [showModal]);

  useEffect(() => {
    (async () => {
      const {
        data: { shopId },
      } = await getMe(supabase);
      if (!shopId) return setIsLoggedIn(false);
      const { data: shopInfo } = await getShop(supabase, shopId);
      setShop(shopInfo);
      setIsLoggedIn(!!shopId);
    })();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };
  return (
    <>
      {isLoggedIn === undefined ? (
        <Text size="sm" color="grey">
          <Spinner size="xs" />
        </Text>
      ) : isLoggedIn === false ? (
        <Text
          size="sm"
          color="grey"
          onClick={() => setShowModal(true)}
          className="cursor-pointer"
        >
          로그인 / 회원가입
        </Text>
      ) : (
        <div className="flex gap-3 items-center">
          <span className="material-symbols-outlined">person</span>
          <Link href={`/shops/${shop!.id}`}>
            <Text color="black" size="sm">
              {shop!.name}
            </Text>
          </Link>
          <Text
            size="sm"
            color="grey"
            onClick={handleLogout}
            className="cursor-pointer"
          >
            로그아웃
          </Text>
        </div>
      )}

      {showModal && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-gray-400/50 z-50 flex justify-center items-center"
          onClick={() => setShowModal(false)}
        >
          <LoginPannel />
        </div>
      )}
    </>
  );
}

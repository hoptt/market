"use client";

import Button from "@/components/common/Button";
import Text from "@/components/common/Text";
import { buyProduct } from "@/repository/products/buyProduct";
import supabase from "@/utils/supabase/browserSupabase";

type Props = {
  isPurchased: boolean;
  isLoggedIn: boolean;
  productId: string;
};

export default function PurchaseButton({
  isLoggedIn,
  productId,
  isPurchased,
}: Props) {
  const handlePurchase = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다");
      return;
    }
    await buyProduct(supabase, productId);
    location.reload();
  };
  return (
    <Button
      fullWidth
      disabled={isPurchased}
      color="red"
      className="flex justify-center items-center gap-1"
      onClick={() => handlePurchase()}
    >
      <Text color="white">{isPurchased ? "판매완료" : "바로구매"}</Text>
    </Button>
  );
}

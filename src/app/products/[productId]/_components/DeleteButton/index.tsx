"use client";
import Button from "@/components/common/Button";
import Text from "@/components/common/Text";
import { deleteProduct } from "@/repository/products/deleteProduct";
import supabase from "@/utils/supabase/browserSupabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
type Props = {
  productId: string;
  isPurchased: boolean;
};
export default function DeleteButton({ productId, isPurchased }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleDeleteProduct = async () => {
    if (window.confirm("등록하신 상품을 삭제하시겠습니까?")) {
      try {
        setIsLoading(true);
        await deleteProduct(supabase, productId);
        router.push("/products/manage");
      } catch (e) {
        alert("삭제에 실패했습니다");
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <Button
      color="red"
      className="w-52 flex justify-center items-center"
      isLoading={isLoading}
      disabled={isPurchased}
      onClick={handleDeleteProduct}
    >
      <Text color="white">상품 내리기</Text>
    </Button>
  );
}

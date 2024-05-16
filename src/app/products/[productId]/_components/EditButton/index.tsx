import Button from "@/components/common/Button";
import Text from "@/components/common/Text";
import Link from "next/link";
import React from "react";
type Props = {
  productId: string;
  isPurchased: boolean;
};
export default function EditButton({ productId, isPurchased }: Props) {
  return (
    <Link href={`/products/edit/${productId}`}>
      <Button
        color="orange"
        className="w-52 flex justify-center items-center"
        disabled={isPurchased}
      >
        <span className="material-symbols-outlined">edit_square</span>
        <Text color="white">수정하기</Text>
      </Button>
    </Link>
  );
}

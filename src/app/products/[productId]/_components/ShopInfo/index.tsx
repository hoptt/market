"use client";

import Shop from "@/components/common/Shop";
import { Shop as TShop } from "@/types";
import { useRouter } from "next/navigation";
import React from "react";
type Props = {
  shop: TShop;
  productCount: number;
  followerCount: number;
};
export default function ShopInfo({ shop, productCount, followerCount }: Props) {
  const router = useRouter();
  return (
    <Shop
      name={shop.name}
      profileImageUrl={shop.imageUrl || undefined}
      productCount={productCount}
      followerCount={followerCount}
      handleClickTitle={() => router.push(`/shops/${shop.id}`)}
      handleClickProfileImage={() => router.push(`/shops/${shop.id}`)}
      handleClickProductCount={() => router.push(`/shops/${shop.id}/products`)}
      handleClickFollowerCount={() => router.push(`/shops/${shop.id}/follower`)}
      type="row"
    />
  );
}

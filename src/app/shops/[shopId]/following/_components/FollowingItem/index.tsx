"use client";

import Shop from "@/components/common/Shop";
import Spinner from "@/components/common/Spinner";
import { getShop } from "@/repository/shop/getShop";
import { getShopFollowerCount } from "@/repository/shop/getShopFollowerCount";
import { getShopProductCount } from "@/repository/shop/getShopProductCount";
import { getShopProducts } from "@/repository/shop/getShopProducts";
import { Product, Shop as TShop } from "@/types";
import supabase from "@/utils/supabase/browserSupabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  shopId: string;
};

export default function FollowingItem({ shopId }: Props) {
  const router = useRouter();
  const [data, setData] = useState<{
    shop: TShop;
    products: Product[];
    productCount: number;
    followerCount: number;
  }>();

  useEffect(() => {
    (async () => {
      const [
        { data: shop },
        { data: products },
        { data: productCount },
        { data: followerCount },
      ] = await Promise.all([
        getShop(supabase, shopId),
        getShopProducts(supabase, { shopId, fromPage: 0, toPage: 1 }),
        getShopProductCount(supabase, shopId),
        getShopFollowerCount(supabase, shopId),
      ]);
      setData({ shop, products, productCount, followerCount });
    })();
  }, [shopId]);
  if (!data) {
    return (
      <div className="border border-dashed flex justify-center items-center h-40">
        <Spinner />
      </div>
    );
  }
  const { shop, products, productCount, followerCount } = data;
  return (
    <div className="flex gap-5">
      <div className="flex items-center">
        <Shop
          name={shop.name}
          profileImageUrl={shop.imageUrl || undefined}
          productCount={productCount}
          followerCount={followerCount}
          handleClickTitle={() => router.push(`/shops/${shop.id}`)}
          handleClickProfileImage={() => router.push(`/shops/${shop.id}`)}
          handleClickProductCount={() =>
            router.push(`/shops/${shop.id}/products`)
          }
          handleClickFollowerCount={() =>
            router.push(`/shops/${shop.id}/follower`)
          }
          type="column"
        />
      </div>
      {products.slice(0, 3).map(({ imageUrls, id, title }) => (
        <Link key={id} href={`/products/${id}`} className="w-40 h-40 relative">
          <Image src={imageUrls[0]} alt={title} fill />
        </Link>
      ))}
    </div>
  );
}

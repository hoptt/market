import { getMe } from "@/repository/me/getMe";
import { getShop } from "@/repository/shop/getShop";
import { getShopFollowerCount } from "@/repository/shop/getShopFollowerCount";
import { getShopFollowingCount } from "@/repository/shop/getShopFollowingCount";
import { getShopLikeCount } from "@/repository/shop/getShopLikeCount";
import { getShopProductCount } from "@/repository/shop/getShopProductCount";
import { getShopReviewCount } from "@/repository/shop/getShopReviewCount";
import getServerComponentSupabase from "@/utils/supabase/getServerComponentSupabase";
import ShopLayout from "../_components/ShopLayout";

type Props = {
  params: {
    shopId: string;
  };
  children: React.ReactNode;
};

export default async function Layout({ params: { shopId }, children }: Props) {
  const supabase = getServerComponentSupabase();

  const [
    {
      data: { shopId: myShopId },
    },
    { data: shop },
    { data: productCount },
    { data: reviewCount },
    { data: likeCount },
    { data: followingCount },
    { data: followerCount },
  ] = await Promise.all([
    getMe(supabase),
    getShop(supabase, shopId),
    getShopProductCount(supabase, shopId),
    getShopReviewCount(supabase, shopId),
    getShopLikeCount(supabase, shopId),
    getShopFollowingCount(supabase, shopId),
    getShopFollowerCount(supabase, shopId),
  ]);
  return (
    <ShopLayout
      isMyShop={myShopId === shopId}
      shop={shop}
      productCount={productCount}
      reviewCount={reviewCount}
      likeCount={likeCount}
      followingCount={followingCount}
      followerCount={followerCount}
    >
      {children}
    </ShopLayout>
  );
}

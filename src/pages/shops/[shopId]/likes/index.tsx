import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import ShopLayout from "../../_components/ShopLayout";
import { Like, Shop } from "@/types";
import { getShop } from "@/repository/shop/getShop";
import { getShopFollowerCount } from "@/repository/shop/getShopFollowerCount";
import { getShopFollowingCount } from "@/repository/shop/getShopFollowingCount";
import { getShopLikeCount } from "@/repository/shop/getShopLikeCount";
import { getShopProductCount } from "@/repository/shop/getShopProductCount";
import { getShopReviewCount } from "@/repository/shop/getShopReviewCount";
import { getShopLikes } from "@/repository/shop/getShopLikes";
import Text from "@/components/common/Text";
import LikeList from "./_components/LikeList";
import { getMe } from "@/repository/me/getMe";
import getServerSupabase from "@/utils/supabase/getSeverSupabase";

export const getServerSideProps: GetServerSideProps<{
  isMyShop: boolean;
  shop: Shop;
  productCount: number;
  reviewCount: number;
  likeCount: number;
  followingCount: number;
  followerCount: number;
  likes: Like[];
}> = async (context) => {
  const supabase = getServerSupabase(context);
  const shopId = context.query.shopId as string;

  const [
    {
      data: { shopId: isMyShop },
    },
    { data: shop },
    { data: productCount },
    { data: reviewCount },
    { data: likeCount },
    { data: followingCount },
    { data: followerCount },
    { data: likes },
  ] = await Promise.all([
    getMe(supabase),
    getShop(supabase, shopId),
    getShopProductCount(supabase, shopId),
    getShopReviewCount(supabase, shopId),
    getShopLikeCount(supabase, shopId),
    getShopFollowingCount(supabase, shopId),
    getShopFollowerCount(supabase, shopId),
    getShopLikes(supabase, { shopId, fromPage: 0, toPage: 1 }),
  ]);

  return {
    props: {
      isMyShop: isMyShop === shopId,
      shop,
      productCount,
      reviewCount,
      likeCount,
      followingCount,
      followerCount,
      likes,
    },
  };
};

export default function ShopsLikes({
  isMyShop,
  shop,
  productCount,
  reviewCount,
  likeCount,
  followingCount,
  followerCount,
  likes: initialLikes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <ShopLayout
      isMyShop={isMyShop}
      shop={shop}
      productCount={productCount}
      reviewCount={reviewCount}
      likeCount={likeCount}
      followingCount={followingCount}
      followerCount={followerCount}
      currentTab="likes"
    >
      <div className="mt-9 mb-5">
        <Text size="lg">찜 </Text>
        <Text size="lg" color="red">
          {likeCount.toLocaleString()}개
        </Text>
      </div>
      <LikeList
        count={likeCount}
        initialLikes={initialLikes}
        shopId={shop.id}
      />
    </ShopLayout>
  );
}

import Text from "@/components/common/Text";
import { getMe } from "@/repository/me/getMe";
import { getShop } from "@/repository/shop/getShop";
import { getShopFollower } from "@/repository/shop/getShopFollower";
import { getShopFollowerCount } from "@/repository/shop/getShopFollowerCount";
import { getShopFollowingCount } from "@/repository/shop/getShopFollowingCount";
import { getShopLikeCount } from "@/repository/shop/getShopLikeCount";
import { getShopProductCount } from "@/repository/shop/getShopProductCount";
import { getShopReviewCount } from "@/repository/shop/getShopReviewCount";
import { Follow, Shop } from "@/types";
import getServerSupabase from "@/utils/supabase/getSeverSupabase";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import ShopLayout from "../../_components/ShopLayout";
import FollowerList from "./_components/FollowerList";

export const getServerSideProps: GetServerSideProps<{
  isMyShop: boolean;
  shop: Shop;
  productCount: number;
  reviewCount: number;
  likeCount: number;
  followingCount: number;
  followerCount: number;
  follower: Follow[];
}> = async (context) => {
  const supabase = getServerSupabase(context);
  const shopId = context.query.shopId as string;
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
    { data: follower },
  ] = await Promise.all([
    getMe(supabase),
    getShop(supabase, shopId),
    getShopProductCount(supabase, shopId),
    getShopReviewCount(supabase, shopId),
    getShopLikeCount(supabase, shopId),
    getShopFollowingCount(supabase, shopId),
    getShopFollowerCount(supabase, shopId),
    getShopFollower(supabase, { shopId, fromPage: 0, toPage: 1 }),
  ]);

  return {
    props: {
      isMyShop: myShopId === shopId,
      shop,
      productCount,
      reviewCount,
      likeCount,
      followingCount,
      followerCount,
      follower,
    },
  };
};
export default function Follower({
  isMyShop,
  shop,
  productCount,
  reviewCount,
  likeCount,
  followingCount,
  followerCount,
  follower: initialFollower,
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
      currentTab="follower"
    >
      <div className="mt-9 mb-5">
        <Text size="lg">팔로워</Text>
        <Text size="lg" color="red">
          {followerCount.toLocaleString()}개
        </Text>
      </div>
      <FollowerList
        initialFollower={initialFollower}
        count={followerCount}
        shopId={shop.id}
      />
    </ShopLayout>
  );
}

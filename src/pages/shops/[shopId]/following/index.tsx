import Text from "@/components/common/Text";
import { getShop } from "@/repository/shop/getShop";
import { getShopFollowerCount } from "@/repository/shop/getShopFollowerCount";
import { getShopFollowing } from "@/repository/shop/getShopFollowing";
import { getShopFollowingCount } from "@/repository/shop/getShopFollowingCount";
import { getShopLikeCount } from "@/repository/shop/getShopLikeCount";
import { getShopProductCount } from "@/repository/shop/getShopProductCount";
import { getShopReviewCount } from "@/repository/shop/getShopReviewCount";
import { Follow, Shop } from "@/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import ShopLayout from "../../_components/ShopLayout";
import FollowingList from "./_components/FollowingList";
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
  following: Follow[];
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
    { data: following },
  ] = await Promise.all([
    getMe(supabase),
    getShop(supabase, shopId),
    getShopProductCount(supabase, shopId),
    getShopReviewCount(supabase, shopId),
    getShopLikeCount(supabase, shopId),
    getShopFollowingCount(supabase, shopId),
    getShopFollowerCount(supabase, shopId),
    getShopFollowing(supabase, { shopId, fromPage: 0, toPage: 1 }),
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
      following,
    },
  };
};
export default function Following({
  isMyShop,
  shop,
  productCount,
  reviewCount,
  likeCount,
  followingCount,
  followerCount,
  following: initialFollowing,
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
      currentTab="following"
    >
      <div className="mt-9 mb-5">
        <Text size="lg">팔로잉</Text>
        <Text size="lg" color="red">
          {followingCount.toLocaleString()}개
        </Text>
      </div>
      <FollowingList
        initialFollowing={initialFollowing}
        count={followingCount}
        shopId={shop.id}
      />
    </ShopLayout>
  );
}

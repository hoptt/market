import { getShop } from "@/repository/shop/getShop";
import { getShopFollowerCount } from "@/repository/shop/getShopFollowerCount";
import { getShopFollowingCount } from "@/repository/shop/getShopFollowingCount";
import { getShopLikeCount } from "@/repository/shop/getShopLikeCount";
import { getShopProductCount } from "@/repository/shop/getShopProductCount";
import { getShopReviewCount } from "@/repository/shop/getShopReviewCount";
import { getShopReviews } from "@/repository/shop/getShopReviews";
import { Product, Review, Shop } from "@/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import ShopLayout from "../../_components/ShopLayout";
import Text from "@/components/common/Text";
import ReviewList from "./_components/ReviewList";
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
  reviews: Review[];
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
    { data: reviews },
  ] = await Promise.all([
    getMe(supabase),
    getShop(supabase, shopId),
    getShopProductCount(supabase, shopId),
    getShopReviewCount(supabase, shopId),
    getShopLikeCount(supabase, shopId),
    getShopFollowingCount(supabase, shopId),
    getShopFollowerCount(supabase, shopId),
    getShopReviews(supabase, { shopId, fromPage: 0, toPage: 1 }),
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
      reviews,
    },
  };
};

export default function ShopReviews({
  isMyShop,
  shop,
  productCount,
  reviewCount,
  likeCount,
  followingCount,
  followerCount,
  reviews: initialReviews,
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
      currentTab={"reviews"}
    >
      <div className="mt-9 mb-5">
        <Text size="lg">후기</Text>
        <Text size="lg" color="red">
          {reviewCount.toLocaleString()}개
        </Text>
      </div>
      <ReviewList
        initialReviews={initialReviews}
        count={reviewCount}
        shopId={shop.id}
      />
    </ShopLayout>
  );
}

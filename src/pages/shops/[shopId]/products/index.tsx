import Container from "@/components/layout/Container";
import Wrapper from "@/components/layout/Wrapper";
import { getShop } from "@/repository/shop/getShop";
import { getShopFollowerCount } from "@/repository/shop/getShopFollowerCount";
import { getShopFollowingCount } from "@/repository/shop/getShopFollowingCount";
import { getShopLikeCount } from "@/repository/shop/getShopLikeCount";
import { getShopProductCount } from "@/repository/shop/getShopProductCount";
import { getShopReviewCount } from "@/repository/shop/getShopReviewCount";
import { Product, Shop } from "@/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import ShopLayout from "../../_components/ShopLayout";
import Text from "@/components/common/Text";
import ProductList from "./_components/ProductList";
import { getShopProducts } from "@/repository/shop/getShopProducts";
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
  products: Product[];
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
    { data: products },
  ] = await Promise.all([
    getMe(supabase),
    getShop(supabase, shopId),
    getShopProductCount(supabase, shopId),
    getShopReviewCount(supabase, shopId),
    getShopLikeCount(supabase, shopId),
    getShopFollowingCount(supabase, shopId),
    getShopFollowerCount(supabase, shopId),
    getShopProducts(supabase, { shopId, fromPage: 0, toPage: 1 }),
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
      products,
    },
  };
};

export default function ShopProducts({
  isMyShop,
  shop,
  productCount,
  reviewCount,
  likeCount,
  followingCount,
  followerCount,
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <ShopLayout
        isMyShop={isMyShop}
        shop={shop}
        productCount={productCount}
        reviewCount={reviewCount}
        likeCount={likeCount}
        followingCount={followingCount}
        followerCount={followerCount}
        currentTab="products"
      >
        <div className="mt-9 mb-5">
          <Text size="lg">상품</Text>
          <Text size="lg" color="red">
            {productCount.toLocaleString()}개
          </Text>
        </div>
        <ProductList
          initialProducts={products}
          count={productCount}
          shopId={shop.id}
        />
      </ShopLayout>
    </>
  );
}

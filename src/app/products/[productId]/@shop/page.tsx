import Text from "@/components/common/Text";
import { getIsFollowedByShopId } from "@/repository/follows/getIsFollowedByShopId";
import { getMe } from "@/repository/me/getMe";
import { getProduct } from "@/repository/products/getProduct";
import { getShop } from "@/repository/shop/getShop";
import { getShopFollowerCount } from "@/repository/shop/getShopFollowerCount";
import { getShopProductCount } from "@/repository/shop/getShopProductCount";
import { getShopProducts } from "@/repository/shop/getShopProducts";
import { getShopReviewCount } from "@/repository/shop/getShopReviewCount";
import { getShopReviews } from "@/repository/shop/getShopReviews";
import getServerComponentSupabase from "@/utils/supabase/getServerComponentSupabase";
import Image from "next/image";
import Link from "next/link";
import ChatButton from "../_components/ChatButton";
import FollowButton from "../_components/FollowButton";
import PurchaseButton from "../_components/PurchaseButton";
import ReviewItem from "../_components/ReviewItem";
import ShopInfo from "../_components/ShopInfo";
import { getProductApi } from "@/repository/products/getProductApi";
import styles from "./shop.module.css";
type Props = {
  params: { productId: string };
};

export default async function ProductsDetailShop({
  params: { productId },
}: Props) {
  const { data: product } = await getProductApi(productId);
  const supabase = getServerComponentSupabase();

  const {
    data: { shopId: myShopId },
  } = await getMe(supabase);

  const [
    { data: shop },
    { data: productCount },
    { data: followerCount },
    { data: isFollowed },
    { data: shopProducts },
    { data: reviews },
    { data: reviewCount },
  ] = await Promise.all([
    getShop(supabase, product.createdBy),
    getShopProductCount(supabase, product.createdBy),
    getShopFollowerCount(supabase, product.createdBy),
    myShopId !== null
      ? getIsFollowedByShopId(supabase, {
          followerId: myShopId,
          followedId: product.createdBy,
        })
      : { data: false },
    getShopProducts(supabase, {
      shopId: product.createdBy,
      fromPage: 0,
      toPage: 1,
    }),
    getShopReviews(supabase, {
      shopId: product.createdBy,
      fromPage: 0,
      toPage: 1,
    }),
    getShopReviewCount(supabase, product.createdBy),
  ]);
  return (
    <>
      <div className="border-b border-grey pb-3">
        <Text size="xl">상점 정보</Text>
      </div>
      <div className="p-5 border-b border-grey">
        <ShopInfo
          shop={shop}
          followerCount={followerCount}
          productCount={productCount}
        />
      </div>

      {product.createdBy !== myShopId && (
        <FollowButton
          isLoggedIn={!!myShopId}
          initialIsFollowed={isFollowed}
          shopId={shop.id}
        />
      )}

      <div className="grid grid-cols-2 gap-2 mt-5">
        {shopProducts.slice(0, 2).map(({ id, title, price, imageUrls }) => (
          <Link
            key={id}
            href={`/products/${id}`}
            className="relative aspect-square overflow-hidden"
          >
            <Image src={imageUrls[0]} alt="" fill className={styles.image} />
            <div className="absolute bottom-0 w-full bg-black text-center opacity-50">
              <Text color="white" size="sm">
                {price.toLocaleString()}원
              </Text>
            </div>
          </Link>
        ))}
      </div>
      {shopProducts.length > 2 && (
        <div>
          <Link
            href={`/shops/${shop.id}/products`}
            className="block border-b text-center py-3"
          >
            <Text size="sm" color="red">
              {shopProducts.length - 2}개
            </Text>{" "}
            <Text size="sm" color="grey">
              상품 더보기 {">"}
            </Text>
          </Link>
        </div>
      )}
      <div>
        {reviewCount > 0 && (
          <div className="my-4 border-b pb-4">
            <Text>상점후기</Text> <Text color="red">{reviewCount}</Text>
          </div>
        )}
        <div>
          {reviews.slice(0, 3).map(({ id, contents, createdBy, createdAt }) => (
            <ReviewItem
              key={id}
              contents={contents}
              createdBy={createdBy}
              createdAt={createdAt}
            />
          ))}
        </div>
        {reviewCount > 0 && (
          <div>
            <Link
              href={`/shops/${shop.id}/reviews`}
              className="block border-y text-center py-2"
            >
              <Text color="grey" size="sm">
                상점후기 더 보기 {">"}
              </Text>
            </Link>
          </div>
        )}

        {/* {product.createdBy !== myShopId && (
          <>
            <div className="flex gap-1 my-7">
              <ChatButton isLoggedIn={!!myShopId} shopId={shop.id} />
              <PurchaseButton
                isLoggedIn={!!myShopId}
                isPurchased={!!product.purchaseBy}
                productId={product.id}
              />
            </div>
          </>
        )} */}
      </div>
    </>
  );
}

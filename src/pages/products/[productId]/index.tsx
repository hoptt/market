import Text from "@/components/common/Text";
import Container from "@/components/layout/Container";
import Wrapper from "@/components/layout/Wrapper";
import { getProduct } from "@/repository/products/getProduct";
import { Product as TProduct, Shop as TShop, Review as TReview } from "@/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import ProductImage from "./_components/ProductImage";
import Button from "@/components/common/Button";
import { getMe } from "@/repository/me/getMe";
import { getIsLikedWithProductIdAndShopId } from "@/repository/likes/getIsLikedWithProductIdAndShopId";
import { useEffect, useState } from "react";
import { getProductsByTag } from "@/repository/products/getProductsByTag";
import Product from "@/components/common/Product";
import Link from "next/link";
import { getShop } from "@/repository/shop/getShop";
import Shop from "@/components/common/Shop";
import { getShopProductCount } from "@/repository/shop/getShopProductCount";
import { getShopFollowerCount } from "@/repository/shop/getShopFollowerCount";
import { getIsFollowedByShopId } from "@/repository/follows/getIsFollowedByShopId";
import { getShopProducts } from "@/repository/shop/getShopProducts";
import { getShopReviews } from "@/repository/shop/getShopReviews";
import { getShopReviewCount } from "@/repository/shop/getShopReviewCount";
import ReviewItem from "./_components/ReviewItem";
import { addRecentItemId } from "@/utils/localstorage";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import MarkdownViewerSkeleton from "@/components/shared/MarkdownViewer/Skeleton";
import Head from "next/head";
import getServerSupabase from "@/utils/supabase/getSeverSupabase";
import { createLike } from "@/repository/likes/createLike";
import supabase from "@/utils/supabase/browserSupabase";
import { deleteLike } from "@/repository/likes/deleteLike";
import { createFollow } from "@/repository/follows/createFollow";
import { deleteFollow } from "@/repository/follows/deleteFollow";
import { buyProduct } from "@/repository/products/buyProduct";
import { createChatRoom } from "@/repository/chatRooms/createChatRoom";

dayjs.extend(relativeTime).locale("ko");

const MarkdownViewer = dynamic(
  () => import("@/components/shared/MarkdownViewer"),
  {
    ssr: false,
    loading: () => <MarkdownViewerSkeleton />,
  }
);

export const getServerSideProps: GetServerSideProps<{
  product: TProduct;
  shop: TShop;
  productCount: number;
  followerCount: number;
  myShopId: string | null;
  isLiked: boolean;
  isFollowed: boolean;
  suggest: TProduct[];
  shopProducts: TProduct[];
  reviews: TReview[];
  reviewCount: number;
}> = async (context) => {
  const supabase = getServerSupabase(context);
  const productId = context.query.productId as string;
  const { data: product } = await getProduct(supabase, productId);
  const {
    data: { shopId: myShopId },
  } = await getMe(supabase);

  const [
    { data: isLiked },
    productsByTagsResult,
    { data: shop },
    { data: productCount },
    { data: followerCount },
    { data: isFollowed },
    { data: shopProducts },
    { data: reviews },
    { data: reviewCount },
  ] = await Promise.all([
    myShopId !== null
      ? await getIsLikedWithProductIdAndShopId(supabase, {
          productId,
          shopId: myShopId,
        })
      : { data: false },
    Promise.all(
      (product.tags || []).map((tag) => getProductsByTag(supabase, tag))
    ),
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

  const suggest = productsByTagsResult.map(({ data }) => data).flat();

  return {
    props: {
      product,
      shop,
      productCount,
      followerCount,
      myShopId,
      isLiked,
      isFollowed,
      suggest,
      shopProducts,
      reviews,
      reviewCount,
    },
  };
};

export default function ProductDetail({
  product,
  shop,
  productCount,
  followerCount,
  myShopId,
  isLiked: initialIsLiked,
  isFollowed: initialIsFollowed,
  suggest,
  shopProducts,
  reviews,
  reviewCount,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isFollowed, setIsFollowed] = useState(initialIsFollowed);
  const checkAuth = (func: Function) => () => {
    if (!myShopId) {
      alert("로그인이 필요합니다.");
      return;
    }
    func();
  };

  const handleToggleLike = checkAuth(async () => {
    try {
      setIsLiked(!isLiked);
      if (!isLiked) {
        await createLike(supabase, product.id);
      } else {
        await deleteLike(supabase, product.id);
      }
    } catch (e) {
      setIsLiked(isLiked);
    }
  });

  const handleChat = checkAuth(async () => {
    await createChatRoom(supabase, shop.id);
    router.push(`/messages`);
  });
  const handlePurchase = checkAuth(async () => {
    await buyProduct(supabase, product.id);
    location.reload();
  });

  const handleToggleFollow = checkAuth(async () => {
    try {
      setIsFollowed(!isFollowed);
      if (!isFollowed) {
        await createFollow(supabase, product.createdBy);
      } else {
        await deleteFollow(supabase, product.createdBy);
      }
    } catch (e) {
      setIsFollowed(isFollowed);
    }
  });

  useEffect(() => {
    addRecentItemId(product.id);
  }, [product.id]);
  return (
    <>
      <Head>
        <title>중고장터 - {product.title}</title>
        <meta
          property="og:title"
          content={`중고장터 - ${product.title}`}
          key="title"
        />
        <meta property="og:image" content={product.imageUrls[0]} />
      </Head>
      <Wrapper>
        <Container>
          <div className="flex gap-6 my-6">
            <div className="w-96 h-96">
              <ProductImage imageUrls={product.imageUrls} />
            </div>

            <div
              className="flex flex-col justify-between flex-1"
              style={{ minWidth: 0 }}
            >
              <div>
                <div className="truncate">
                  <Text size="4xl" weight="bold">
                    {product.title}
                  </Text>
                </div>
                <div className="my-6">
                  <Text size="3xl">{product.price.toLocaleString()}</Text>
                  <Text size="xl"> 원</Text>
                </div>
                <div className="border-t border-grey-500 py-4 flex gap-1 items-center">
                  <Text color="grey" className="flex">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "1.25rem" }}
                    >
                      schedule
                    </span>
                  </Text>
                  <Text color="grey">{dayjs(product.createdAt).fromNow()}</Text>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  fullWidth
                  color="grey"
                  className="flex justify-center items-center gap-1"
                  onClick={() => handleToggleLike()}
                >
                  <span
                    style={{ fontSize: "1rem" }}
                    className="material-symbols-outlined"
                  >
                    favorite
                  </span>
                  <Text color="white">{isLiked ? "찜 취소" : "찜"}</Text>
                </Button>
                <Button
                  fullWidth
                  color="orange"
                  className="flex justify-center items-center gap-1"
                  onClick={() => handleChat()}
                >
                  <span
                    style={{ fontSize: "1rem" }}
                    className="material-symbols-outlined"
                  >
                    chat_bubble
                  </span>
                  <Text color="white">문의하기</Text>
                </Button>
                <Button
                  fullWidth
                  disabled={!!product.purchaseBy}
                  color="red"
                  className="flex justify-center items-center gap-1"
                  onClick={() => handlePurchase()}
                >
                  <Text color="white">
                    {!!product.purchaseBy ? "판매완료" : "바로구매"}
                  </Text>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex border-t border-black pt-10">
            <div className="w-4/6 pr-2">
              <div className="border-b border-grey pb-3">
                <Text size="xl">상품 정보</Text>
              </div>
              <div className="mt-5 mb-10">
                <MarkdownViewer value={product.description} />
              </div>
              <div className="border-y py-4 flex gap-2">
                <div className=" rounded bg-slate-200 px-3 py-1 text-sm">
                  {product.isChangeable ? "교환가능" : "교환불가"}
                </div>
                <div className=" rounded bg-slate-200 px-3 py-1 text-sm">
                  {product.isUsed ? "중고상품" : "새 상품"}
                </div>
              </div>
              <div className="flex py-4 border-b mb-10">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <Text size="lg" color="grey">
                    거래 지역
                  </Text>
                  <Text color="grey">{product.address}</Text>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <Text size="lg" color="grey">
                    상품 태그
                  </Text>
                  <div className="flex gap-2 flex-wrap">
                    {product.tags === null ? (
                      <Text color="grey">상품 태그가 없습니다.</Text>
                    ) : (
                      product.tags.map((tag) => (
                        <div
                          key={tag}
                          className="bg-purple-200 rounded-xl px-2 text-sm"
                        >
                          {tag}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              {suggest.length === 0 ? null : (
                <div className="border-b py-4">
                  <div>
                    <Text size="xl">비슷한 상품</Text>
                  </div>
                  <div className="my-5 flex gap-3 flex-wrap">
                    {suggest
                      .slice(0, 3)
                      .map(({ id, title, price, createdAt, imageUrls }) => (
                        <Link key={id} href={`/products/${id}`}>
                          <a className="w-44">
                            <Product
                              title={title}
                              price={price}
                              createdAt={createdAt}
                              imageUrl={imageUrls[0]}
                            />
                          </a>
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
            <div className="w-2/6 border-l border-grey pl-2">
              <div className="border-b border-grey pb-3">
                <Text size="xl">상점 정보</Text>
              </div>
              <div className="p-5">
                <Shop
                  name={shop.name}
                  profileImageUrl={shop.imageUrl || undefined}
                  productCount={productCount}
                  followerCount={followerCount}
                  handleClickTitle={() => router.push(`/shops/${shop.id}`)}
                  handleClickProfileImage={() =>
                    router.push(`/shops/${shop.id}`)
                  }
                  handleClickProductCount={() =>
                    router.push(`/shops/${shop.id}/products`)
                  }
                  handleClickFollowerCount={() =>
                    router.push(`/shops/${shop.id}/follower`)
                  }
                  type="row"
                />
              </div>

              <Button color="grey" fullWidth onClick={handleToggleFollow}>
                <Text
                  color="black"
                  className="flex justify-center items-center gap-1"
                >
                  <span className="material-symbols-outlined">
                    {isFollowed ? "person_remove" : "person_add"}
                  </span>
                  {isFollowed ? "언팔로우" : "팔로우"}
                </Text>
              </Button>
              <div className="grid grid-cols-2 gap-2 mt-5">
                {shopProducts
                  .slice(0, 2)
                  .map(({ id, title, price, imageUrls }) => (
                    <Link key={id} href={`/products/${id}`}>
                      <a className="relative aspect-square">
                        <img
                          src={imageUrls[0]}
                          alt=""
                          className="w-full h-full"
                        />
                        <div className="absolute bottom-0 w-full bg-black text-center opacity-50">
                          <Text color="white" size="sm">
                            {price.toLocaleString()}원
                          </Text>
                        </div>
                      </a>
                    </Link>
                  ))}
              </div>
              {shopProducts.length > 2 && (
                <div>
                  <Link href="/">
                    <a className="block border-b text-center py-3">
                      <Text size="sm" color="red">
                        {shopProducts.length - 2}개
                      </Text>{" "}
                      <Text size="sm" color="grey">
                        상품 더보기 {">"}
                      </Text>
                    </a>
                  </Link>
                </div>
              )}
              <div>
                <div className="my-4 border-b pb-4">
                  <Text>상점후기</Text> <Text color="red">{reviewCount}</Text>
                </div>
                <div>
                  {reviews
                    .slice(0, 3)
                    .map(({ id, contents, createdBy, createdAt }) => (
                      <ReviewItem
                        key={id}
                        contents={contents}
                        createdBy={createdBy}
                        createdAt={createdAt}
                      />
                    ))}
                </div>
                <div>
                  <Link href={`/shops/${shop}/reviews`}>
                    <a className="block border-y text-center py-2">
                      <Text color="grey" size="sm">
                        상점후기 더 보기 {">"}
                      </Text>
                    </a>
                  </Link>
                </div>
                <div className="flex gap-1 my-7">
                  <Button
                    fullWidth
                    color="orange"
                    className="flex justify-center items-center gap-1"
                    onClick={() => handleChat()}
                  >
                    <span
                      style={{ fontSize: "1rem" }}
                      className="material-symbols-outlined"
                    >
                      chat_bubble
                    </span>
                    문의하기
                  </Button>
                  <Button
                    fullWidth
                    color="red"
                    className="flex justify-center items-center gap-1"
                    disabled={!!product.purchaseBy}
                    onClick={() => handlePurchase()}
                  >
                    <Text color="white">
                      {!!product.purchaseBy ? "판매완료" : "바로구매"}
                    </Text>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Wrapper>
    </>
  );
}

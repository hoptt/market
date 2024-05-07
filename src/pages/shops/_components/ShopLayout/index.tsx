import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import ShopProfileImage from "@/components/common/ShopProfileImage";
import Text from "@/components/common/Text";
import Container from "@/components/layout/Container";
import Wrapper from "@/components/layout/Wrapper";
import { updateShopImageUrl } from "@/repository/shop/updateShopImageUrl";
import { updateShopIntroduce } from "@/repository/shop/updateShopIntroduce";
import { updateShopName } from "@/repository/shop/updateShopName";
import { Shop } from "@/types";
import { timeout } from "@/utils/mock";
import supabase from "@/utils/supabase/browserSupabase";
import classNames from "classnames";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { FormEventHandler, ReactNode, useState } from "react";

dayjs.extend(relativeTime).locale("ko");

type Props = {
  isMyShop: boolean;
  shop?: Shop;
  productCount: number;
  reviewCount: number;
  likeCount: number;
  followingCount: number;
  followerCount: number;
  currentTab: Tabs;
  children: ReactNode;
};
type EDIT_STATUS = "IDLE" | "EDIT" | "LOADING";
type Tabs = "products" | "reviews" | "likes" | "following" | "follower";
export default function ShopLayout({
  isMyShop,
  shop,
  productCount,
  reviewCount,
  likeCount,
  followingCount,
  followerCount,
  currentTab,
  children,
}: Props) {
  const [shopName, setShopName] = useState(shop?.name || "");
  const [shopIntroduce, setShopIntroduce] = useState(shop?.introduce || "");
  const [shopImageUrl, setShopImageUrl] = useState(shop?.imageUrl || "");
  const [shopNameStatus, setShopNameState] = useState<EDIT_STATUS>("IDLE");
  const [shopIntroduceStatus, setShopIntroduceState] =
    useState<EDIT_STATUS>("IDLE");
  const handleSubmitShopName: FormEventHandler<HTMLFormElement> = async (e) => {
    if (!shop) return;
    try {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;

      setShopNameState("LOADING");

      await updateShopName(supabase, { shopId: shop.id, name });
      setShopName(name);
    } catch (e) {
      alert("상점명 수정에 실패하였습니다.");
    } finally {
      setShopNameState("IDLE");
    }
  };
  const handleSubmitShopIntroduce: FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    if (!shop) return;
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const introduce = formData.get("introduce") as string;
      setShopIntroduceState("LOADING");
      await updateShopIntroduce(supabase, { shopId: shop.id, introduce });
      setShopIntroduce(introduce);
    } catch (e) {
      alert("상점 소개글 수정에 실패하였습니다.");
    } finally {
      setShopIntroduceState("IDLE");
    }
  };

  const handleSubmitShopProfileImage: FormEventHandler<
    HTMLFormElement
  > = async (e) => {
    if (!shop) return;
    try {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const imageFile = formData.get("image") as File;

      const {
        data: { imageUrl },
      } = await updateShopImageUrl(supabase, { shopId: shop.id, imageFile });
      setShopImageUrl(imageUrl);
    } catch (e) {
      alert("이미지 수정에 실패했습니다.");
    }
  };

  if (!shop) return null;
  return (
    <>
      <Wrapper>
        <Container>
          <div className="my-10">
            <div className="border border-gray-300 flex h-64">
              <div className="bg-gray-300 h-full w-60 flex flex-col justify-center items-center gap-2">
                {!isMyShop ? (
                  <ShopProfileImage imageUrl={shopImageUrl || undefined} />
                ) : (
                  <>
                    <form onChange={handleSubmitShopProfileImage}>
                      <label htmlFor="image" className="cursor-pointer">
                        <ShopProfileImage
                          imageUrl={shopImageUrl || undefined}
                        />
                      </label>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept=".jpg, .jpeg, .png"
                        hidden
                      />
                    </form>
                    <Link href="/products">
                      <a className="border border-white text-white px-3 py-2 my-2">
                        내 상점 관리
                      </a>
                    </Link>
                  </>
                )}
              </div>
              <div className="flex flex-col flex-1 gap-2 py-2">
                <div className="pl-4 flex items-center">
                  {isMyShop ? (
                    <>
                      {shopNameStatus === "IDLE" ? (
                        <>
                          <Text size="lg">{shopName}</Text>
                          <Button
                            size="xs"
                            className="ml-2"
                            outline
                            onClick={() => setShopNameState("EDIT")}
                          >
                            상점명 수정
                          </Button>
                        </>
                      ) : (
                        <form onSubmit={handleSubmitShopName}>
                          <Input
                            name="name"
                            className="text-xs w-60"
                            placeholder="새 닉네임을 입력하세요"
                            disabled={shopNameStatus === "LOADING"}
                            required
                            autoComplete="off"
                            minLength={2}
                          />
                          <Button
                            className="text-sm w-20"
                            isLoading={shopNameStatus === "LOADING"}
                          >
                            확인
                          </Button>
                        </form>
                      )}
                    </>
                  ) : (
                    <>
                      <Text size="lg">{shopName}</Text>
                    </>
                  )}
                </div>
                <div className="pl-4 flex gap-2 border border-slate-200 py-2">
                  <div className="flex gap-2">
                    <Text size="sm" color="grey">
                      가입일
                    </Text>
                    <Text size="sm">{dayjs(shop.createdAt).fromNow()}</Text>
                  </div>
                  <div className="flex gap-2">
                    <Text size="sm" color="grey">
                      상품수
                    </Text>
                    <Text size="sm">{productCount.toLocaleString()}개</Text>
                  </div>
                </div>
                <div className="flex flex-col flex-1 px-4 overflow-hidden">
                  {isMyShop ? (
                    shopIntroduceStatus === "IDLE" ? (
                      <>
                        <Text size="sm" className="block overflow-auto h-full">
                          {shopIntroduce}
                        </Text>
                        <Button
                          size="xs"
                          outline
                          className="w-20"
                          onClick={() => setShopIntroduceState("EDIT")}
                        >
                          소개글 수정
                        </Button>
                      </>
                    ) : (
                      <form
                        onSubmit={handleSubmitShopIntroduce}
                        className="flex f-hull flex-1"
                      >
                        <textarea
                          name="introduce"
                          className="flex-1 p-1 text-sm border outline-none disabled:opacity-50"
                          placeholder="소개글을 입력해주세요"
                          disabled={shopIntroduceStatus === "LOADING"}
                        >
                          {shopIntroduce}
                        </textarea>
                        <Button
                          size="xs"
                          outline
                          className="w-20"
                          isLoading={shopIntroduceStatus === "LOADING"}
                        >
                          확인
                        </Button>
                      </form>
                    )
                  ) : (
                    <Text size="sm" className="block overflow-auto h-full">
                      {shopIntroduce}
                    </Text>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full h-12 mt-6">
            <Link href={`/shops/${shop.id}/products`}>
              <a
                className={classNames(
                  "flex-1 border flex justify-center items-center",
                  currentTab === "products"
                    ? "border-black border-b-0"
                    : "bg-gray-100 text-gray-600 border-gray"
                )}
              >
                상품
                <Text className="ml-2">{productCount.toLocaleString()}</Text>
              </a>
            </Link>
            <Link href={`/shops/${shop.id}/reviews`}>
              <a
                className={classNames(
                  "flex-1 border flex justify-center items-center",
                  currentTab === "reviews"
                    ? "border-black border-b-0"
                    : "bg-gray-100 text-gray-600 border-gray"
                )}
              >
                상점후기
                <Text className="ml-2">{reviewCount.toLocaleString()}</Text>
              </a>
            </Link>
            <Link href={`/shops/${shop.id}/likes`}>
              <a
                className={classNames(
                  "flex-1 border flex justify-center items-center",
                  currentTab === "likes"
                    ? "border-black border-b-0"
                    : "bg-gray-100 text-gray-600 border-gray"
                )}
              >
                찜<Text className="ml-2">{likeCount.toLocaleString()}</Text>
              </a>
            </Link>
            <Link href={`/shops/${shop.id}/following`}>
              <a
                className={classNames(
                  "flex-1 border flex justify-center items-center",
                  currentTab === "following"
                    ? "border-black border-b-0"
                    : "bg-gray-100 text-gray-600 border-gray"
                )}
              >
                팔로잉
                <Text className="ml-2">{followingCount.toLocaleString()}</Text>
              </a>
            </Link>
            <Link href={`/shops/${shop.id}/follower`}>
              <a
                className={classNames(
                  "flex-1 border flex justify-center items-center",
                  currentTab === "follower"
                    ? "border-black border-b-0"
                    : "bg-gray-100 text-gray-600 border-gray"
                )}
              >
                팔로워
                <Text className="ml-2">{followerCount.toLocaleString()}</Text>
              </a>
            </Link>
          </div>
          <div>{children}</div>
        </Container>
      </Wrapper>
    </>
  );
}

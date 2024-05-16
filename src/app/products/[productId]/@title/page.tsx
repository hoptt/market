import Text from "@/components/common/Text";
import { getIsLikedWithProductIdAndShopId } from "@/repository/likes/getIsLikedWithProductIdAndShopId";
import { getMe } from "@/repository/me/getMe";
import { getProduct } from "@/repository/products/getProduct";
import { getShop } from "@/repository/shop/getShop";
import getServerComponentSupabase from "@/utils/supabase/getServerComponentSupabase";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import ChatButton from "../_components/ChatButton";
import LikeButton from "../_components/LikeButton";
import ProductImage from "../_components/ProductImage";
import PurchaseButton from "../_components/PurchaseButton";
import { getProductApi } from "@/repository/products/getProductApi";
import Button from "@/components/common/Button";
import EditButton from "../_components/EditButton";
import DeleteButton from "../_components/DeleteButton";
dayjs.extend(relativeTime).locale("ko");
type Props = {
  params: { productId: string };
};
export default async function ProductsDetailTitle({
  params: { productId },
}: Props) {
  const { data: product } = await getProductApi(productId);
  const supabase = getServerComponentSupabase();
  const {
    data: { shopId: myShopId },
  } = await getMe(supabase);
  const [{ data: shop }, { data: isLiked }] = await Promise.all([
    getShop(supabase, product.createdBy),
    myShopId !== null
      ? getIsLikedWithProductIdAndShopId(supabase, {
          productId,
          shopId: myShopId,
        })
      : { data: false },
  ]);

  return (
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
          <div className="border-t border-grey-500 py-4 flex flex-col gap-1">
            <div className="flex gap-1">
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

            <Text color="grey">카테고리: {product.category}</Text>

            {product.createdBy !== myShopId ? (
              <LikeButton
                initialIsLiked={isLiked}
                isLoggedIn={!!myShopId}
                productId={product.id}
              />
            ) : (
              <div className="rounded bg-cyan-700 px-3 py-1 text-sm w-fit text-white mt-3">
                내가 등록한 상품
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          {product.createdBy === myShopId ? (
            <>
              <EditButton
                productId={product.id}
                isPurchased={!!product.purchaseBy}
              />
              <DeleteButton
                productId={product.id}
                isPurchased={!!product.purchaseBy}
              />
            </>
          ) : (
            <>
              <ChatButton isLoggedIn={!!myShopId} shopId={shop.id} />
              <PurchaseButton
                isLoggedIn={!!myShopId}
                isPurchased={!!product.purchaseBy}
                productId={product.id}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

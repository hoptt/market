import Text from "@/components/common/Text";
import { getShop } from "@/repository/shop/getShop";
import { getShopLikeCount } from "@/repository/shop/getShopLikeCount";
import { getShopLikes } from "@/repository/shop/getShopLikes";
import getServerComponentSupabase from "@/utils/supabase/getServerComponentSupabase";
import LikeList from "./_components/LikeList";

type Props = {
  params: {
    shopId: string;
  };
};

export default async function ShopsLikes({ params: { shopId } }: Props) {
  const supabase = getServerComponentSupabase();

  const [{ data: shop }, { data: likeCount }, { data: likes }] =
    await Promise.all([
      getShop(supabase, shopId),
      getShopLikeCount(supabase, shopId),
      getShopLikes(supabase, { shopId, fromPage: 0, toPage: 1 }),
    ]);
  return (
    <>
      <div className="mt-9 mb-5">
        <Text size="lg">찜 </Text>
        <Text size="lg" color="red">
          {likeCount.toLocaleString()}개
        </Text>
      </div>
      <LikeList count={likeCount} initialLikes={likes} shopId={shop.id} />
    </>
  );
}

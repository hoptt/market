import Text from "@/components/common/Text";
import { getShop } from "@/repository/shop/getShop";
import { getShopFollowing } from "@/repository/shop/getShopFollowing";
import { getShopFollowingCount } from "@/repository/shop/getShopFollowingCount";
import getServerComponentSupabase from "@/utils/supabase/getServerComponentSupabase";
import FollowingList from "./_components/FollowingList";

type Props = {
  params: {
    shopId: string;
  };
};

export default async function Following({ params: { shopId } }: Props) {
  const supabase = getServerComponentSupabase();
  const [{ data: shop }, { data: followingCount }, { data: following }] =
    await Promise.all([
      getShop(supabase, shopId),
      getShopFollowingCount(supabase, shopId),
      getShopFollowing(supabase, { shopId, fromPage: 0, toPage: 1 }),
    ]);
  return (
    <>
      <div className="mt-9 mb-5">
        <Text size="lg">팔로잉</Text>
        <Text size="lg" color="red">
          {followingCount.toLocaleString()}개
        </Text>
      </div>
      <FollowingList
        initialFollowing={following}
        count={followingCount}
        shopId={shop.id}
      />
    </>
  );
}

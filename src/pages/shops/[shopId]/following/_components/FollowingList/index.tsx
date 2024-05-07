import Pagination from "@/components/common/Pagination";
import { Follow } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import FollowingItem from "../FollowingItem";
import { getShopFollowing } from "@/repository/shop/getShopFollowing";
import Text from "@/components/common/Text";
import supabase from "@/utils/supabase/browserSupabase";

type Props = {
  initialFollowing?: Follow[];
  count: number;
  shopId: string;
};
export default function FollowingList({
  initialFollowing = [],
  count,
  shopId,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [following, setFollowing] = useState<Follow[]>(initialFollowing);

  useEffect(() => {
    (async () => {
      const { data } = await getShopFollowing(supabase, {
        shopId,
        fromPage: currentPage - 1,
        toPage: currentPage,
      });
      setFollowing(data);
    })();
  }, [currentPage, shopId]);
  return (
    <div>
      {following.length === 0 ? (
        <Text color="grey">팔로잉이 없습니다.</Text>
      ) : (
        <>
          <div>
            {following.map(({ id, followingShopId }) => (
              <FollowingItem key={id} shopId={followingShopId} />
            ))}
          </div>
          <div className="flex justify-end">
            <Pagination
              currentPage={currentPage}
              count={count}
              handlePageChange={(pageNumber) => setCurrentPage(pageNumber)}
            />
          </div>
        </>
      )}
    </div>
  );
}

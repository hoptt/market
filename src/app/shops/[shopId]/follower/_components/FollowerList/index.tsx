"use client";

import Pagination from "@/components/common/Pagination";
import Text from "@/components/common/Text";
import { Follow } from "@/types";
import { useEffect, useState } from "react";
import FollowerItem from "../FollowerItem";
import { getShopFollower } from "@/repository/shop/getShopFollower";
import supabase from "@/utils/supabase/browserSupabase";

type Props = {
  initialFollower?: Follow[];
  count: number;
  shopId: string;
};
export default function FollowerList({
  initialFollower = [],
  count,
  shopId,
}: Props) {
  const [followers, setFollowers] = useState<Follow[]>(initialFollower);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      const { data } = await getShopFollower(supabase, {
        shopId,
        fromPage: currentPage - 1,
        toPage: currentPage,
      });
      setFollowers(data);
    })();
  }, [currentPage, shopId]);
  return (
    <div>
      {followers.length === 0 ? (
        <Text color="grey">팔로워가 없습니다.</Text>
      ) : (
        <>
          <div>
            {followers.map(({ id, createdBy }) => (
              <FollowerItem key={id} shopId={createdBy} />
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

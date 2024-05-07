import Pagination from "@/components/common/Pagination";
import Text from "@/components/common/Text";
import { getShopLikes } from "@/repository/shop/getShopLikes";
import { Like } from "@/types";
import { useEffect, useState } from "react";
import LikeItem from "../LikeItem";
import Link from "next/link";
import supabase from "@/utils/supabase/browserSupabase";
type Props = {
  count: number;
  initialLikes?: Like[];
  shopId: string;
};

export default function LikeList({ count, initialLikes = [], shopId }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [likes, setLikes] = useState(initialLikes);

  useEffect(() => {
    (async () => {
      const { data } = await getShopLikes(supabase, {
        shopId,
        fromPage: currentPage - 1,
        toPage: currentPage,
      });
      setLikes(data);
    })();
  }, [currentPage, shopId]);
  return (
    <div>
      {likes.length === 0 ? (
        <Text>찜한 상품이 없습니다.</Text>
      ) : (
        <>
          <div className="w-full grid grid-cols-5 gap-4">
            {likes.map(({ id, productId }) => (
              <Link key={id} href={`/products/${id}`}>
                <a>
                  <LikeItem productId={productId} />
                </a>
              </Link>
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

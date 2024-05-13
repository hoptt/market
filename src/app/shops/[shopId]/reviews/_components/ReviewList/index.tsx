"use client";

import Pagination from "@/components/common/Pagination";
import Text from "@/components/common/Text";
import { getShopReviews } from "@/repository/shop/getShopReviews";
import { Review } from "@/types";
import { useEffect, useState } from "react";
import ReviewItem from "../ReviewItem";
import supabase from "@/utils/supabase/browserSupabase";

type Props = {
  initialReviews?: Review[];
  count: number;
  shopId: string;
};
export default function ReviewList({
  initialReviews = [],
  count,
  shopId,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState(initialReviews);

  useEffect(() => {
    (async () => {
      const { data } = await getShopReviews(supabase, {
        shopId,
        fromPage: currentPage - 1,
        toPage: currentPage,
      });
      setReviews(data);
    })();
  }, [currentPage, shopId]);
  return (
    <div>
      {reviews.length === 0 ? (
        <Text color="grey">등록된 리뷰가 없습니다.</Text>
      ) : (
        <>
          <div>
            {reviews.map(
              ({ id, createdAt, productId, contents, createdBy }) => (
                <ReviewItem
                  key={id}
                  reviewerId={createdBy}
                  contents={contents}
                  productId={productId}
                  createdAt={createdAt}
                />
              )
            )}
          </div>
          <div className="flex justify-end">
            <Pagination
              currentPage={currentPage}
              handlePageChange={(pageNumber) => setCurrentPage(pageNumber)}
              count={count}
            />
          </div>
        </>
      )}
    </div>
  );
}

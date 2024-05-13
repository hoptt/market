"use client";

import Pagination from "@/components/common/Pagination";
import Text from "@/components/common/Text";
import { getShopBuys } from "@/repository/shop/getShopBuys";
import { Product } from "@/types";
import supabase from "@/utils/supabase/browserSupabase";
import { useEffect, useState } from "react";
import BuyProductItem from "../BuyProductItem";

type Props = {
  initialProducts?: Product[];
  count: number;
  shopId: string;
};

export default function BuyProductList({
  initialProducts = [],
  count,
  shopId,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    (async () => {
      const { data } = await getShopBuys(supabase, {
        shopId,
        fromPage: currentPage - 1,
        toPage: currentPage,
      });
      setProducts(data);
    })();
  }, [currentPage, shopId]);
  return (
    <div>
      {products.length === 0 ? (
        <div className="pt-5 text-center">
          <Text>판매 내역이 없습니다.</Text>
        </div>
      ) : (
        <>
          <div>
            {products.map(({ id, imageUrls, title, price }) => (
              <BuyProductItem
                key={id}
                id={id}
                title={title}
                price={price}
                imageUrl={imageUrls[0]}
              />
            ))}
          </div>
          <div className="flex justify-end">
            <Pagination
              count={count}
              currentPage={currentPage}
              handlePageChange={(pageNumber) => setCurrentPage(pageNumber)}
            />
          </div>
        </>
      )}
    </div>
  );
}

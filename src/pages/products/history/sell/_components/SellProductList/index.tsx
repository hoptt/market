import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import Text from "@/components/common/Text";
import { getShopSells } from "@/repository/shop/getShopSells";
import { Product } from "@/types";
import supabase from "@/utils/supabase/browserSupabase";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  initialProducts?: Product[];
  count: number;
  shopId: string;
};

export default function SellProductList({
  initialProducts = [],
  count,
  shopId,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    (async () => {
      const { data } = await getShopSells(supabase, {
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
              <div key={id} className="flex text-center border-y-2 my-4 py-2">
                <div className="w-28 h-28">
                  <img
                    src={imageUrls[0]}
                    alt={title}
                    className="w-full h-full"
                  />
                </div>

                <div className="flex-1 flex justify-center items-center">
                  <Link href={`/products/${id}`}>
                    <a>
                      <Text>{title}</Text>
                    </a>
                  </Link>
                </div>
                <div className="w-28 flex justify-center items-center">
                  <Text>{price.toLocaleString()}</Text>
                </div>
              </div>
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

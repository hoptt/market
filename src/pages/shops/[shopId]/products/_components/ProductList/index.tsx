import Pagination from "@/components/common/Pagination";
import Product from "@/components/common/Product";
import Text from "@/components/common/Text";
import { getShopProducts } from "@/repository/shop/getShopProducts";
import { Product as TProduct } from "@/types";
import supabase from "@/utils/supabase/browserSupabase";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  initialProducts?: TProduct[];
  count: number;
  shopId: string;
};
export default function ProductList({
  initialProducts = [],
  count,
  shopId,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    (async () => {
      const { data } = await getShopProducts(supabase, {
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
        <Text color="grey">등록된 상품이 없습니다.</Text>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-4">
            {products.map(
              ({ id, title, price, createdAt, imageUrls, purchaseBy }) => (
                <Link key={id} href={`/products/${id}`}>
                  <a>
                    <Product
                      title={title}
                      price={price}
                      createdAt={createdAt}
                      imageUrl={imageUrls[0]}
                      isSoldOut={!!purchaseBy}
                    />
                  </a>
                </Link>
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

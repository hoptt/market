import Product from "@/components/common/Product";
import { Product as TProduct } from "@/types";
import { getProducts } from "@/repository/products/getProducts";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Spinner from "@/components/common/Spinner";
import Link from "next/link";
import supabase from "@/utils/supabase/browserSupabase";
type Props = {
  initialProducts?: TProduct[];
};
export default function ProductList({ initialProducts = [] }: Props) {
  const [products, setProducts] = useState<TProduct[]>(initialProducts);
  const { ref, inView } = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const handleGetProducts = async ({
    fromPage,
    toPage,
  }: {
    fromPage: number;
    toPage: number;
  }) => {
    try {
      setIsLoading(true);
      const { data } = await getProducts(supabase, { fromPage, toPage });
      return data;
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    (async () => {
      if (inView) {
        const data = await handleGetProducts({
          fromPage: page,
          toPage: page + 1,
        });
        if (data.length === 0) {
          setIsLastPage(true);
          return;
        }
        setProducts((prev) => [...prev, ...data]);
        setPage((page) => page + 1);
      }
    })();
  }, [inView]);

  return (
    <div className="my-8">
      <div className="grid grid-cols-5 gap-4">
        {products.map(({ id, title, price, imageUrls, createdAt }) => (
          <Link key={id} href={`/products/${id}`}>
            <a>
              <Product
                title={title}
                price={price}
                imageUrl={imageUrls[0]}
                createdAt={createdAt}
              />
            </a>
          </Link>
        ))}
      </div>
      {isLoading && (
        <div className="text-center">
          <Spinner />
        </div>
      )}
      {!isLastPage && products.length > 0 && products.length < 100 && (
        <div ref={ref} style={{ height: 20, backgroundColor: "red" }} />
      )}
    </div>
  );
}

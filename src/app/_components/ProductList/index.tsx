"use client";

import Product from "@/components/common/Product";
import Spinner from "@/components/common/Spinner";
import Text from "@/components/common/Text";
import { getProductsApi } from "@/repository/products/getProductsApi";
import { Product as TProduct } from "@/types";
import { PRODUCT_CATEGORY } from "@/utils/etc";
import Link from "next/link";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
  initialProducts?: TProduct[];
};
export default function ProductList({ initialProducts = [] }: Props) {
  const [products, setProducts] = useState<TProduct[]>(initialProducts);
  const { ref, inView } = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [isLastPage, setIsLastPage] = useState(false);
  const [category, setCategory] = useState("");

  const handleCategory: ChangeEventHandler<HTMLSelectElement> = async (e) => {
    setCategory(e.target.value);
    setPage(2);
    setIsLastPage(false);
    const data = await handleGetProducts({
      fromPage: 0,
      toPage: 2,
      category: e.target.value,
    });
    setProducts(data);
  };

  const handleGetProducts = async ({
    fromPage,
    toPage,
    category,
  }: {
    fromPage: number;
    toPage: number;
    category: string;
  }) => {
    try {
      setIsLoading(true);
      const { data } = await getProductsApi({ fromPage, toPage, category });
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (inView) {
        if (products.length % 20 !== 0) return;
        const data = await handleGetProducts({
          fromPage: page,
          toPage: page + 2,
          category,
        });

        if (data.length === 0) {
          setIsLastPage(true);
          return;
        }
        if (page !== 0) {
          setProducts((prev) => [...prev, ...data]);
        }
        setPage((page) => page + 2);
      }
    })();
  }, [inView, products, category]);

  return (
    <div className="my-8">
      <div className="flex items-center gap-1 mb-3">
        <Text color="black" size="sm" className="me-1 flex items-center gap-1">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "1rem" }}
          >
            tune
          </span>
          카테고리
        </Text>
        <select
          required
          name="category"
          className="border py-1 px-2 w-32 cursor-pointer"
          onChange={handleCategory}
        >
          <option value="">선택</option>
          {PRODUCT_CATEGORY.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-5 gap-4">
            {products.map(({ id, title, price, imageUrls, createdAt }) => (
              <Link key={id} href={`/products/${id}`}>
                <Product
                  title={title}
                  price={price}
                  imageUrl={imageUrls[0]}
                  createdAt={createdAt}
                />
              </Link>
            ))}
          </div>
          {!isLastPage && products.length > 0 && products.length < 100 && (
            <div ref={ref} />
          )}
          {isLoading && (
            <div className="text-center">
              <Spinner />
            </div>
          )}
        </>
      ) : (
        <div>
          <Text color="grey">해당되는 제품이 없습니다.</Text>
        </div>
      )}
    </div>
  );
}

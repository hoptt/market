import Pagination from "@/components/common/Pagination";
import Text from "@/components/common/Text";
import Container from "@/components/layout/Container";
import Wrapper from "@/components/layout/Wrapper";
import { getShopsByKeyword } from "@/repository/shop/getShopsByKeyword";
import { getShopsByKeywordCount } from "@/repository/shop/getShopsByKeywordCount";
import { Shop } from "@/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import SearchShopItem from "./_components/SearchShopItem";
import getServerSupabase from "@/utils/supabase/getSeverSupabase";
import supabase from "@/utils/supabase/browserSupabase";

export const getServerSideProps: GetServerSideProps<{
  shops: Shop[];
  query: string;
  count: number;
}> = async (context) => {
  const supabase = getServerSupabase(context);
  const originalQuery = context.query.query as string | undefined;

  if (!originalQuery) {
    throw new Error("검색어가 없습니다");
  }
  const query = decodeURIComponent(originalQuery);
  const [{ data: shops }, { data: count }] = await Promise.all([
    getShopsByKeyword(supabase, { query }),
    getShopsByKeywordCount(supabase, query),
  ]);
  return {
    props: {
      shops,
      query,
      count,
    },
  };
};

export default function SearchShop({
  count,
  query,
  shops: initialShops,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [initialShops]);

  useEffect(() => {
    (async () => {
      const { data: shops } = await getShopsByKeyword(supabase, {
        query,
        fromPage: currentPage - 1,
        toPage: currentPage,
      });
      setShops(shops);
    })();
  }, [currentPage, query]);
  return (
    <Wrapper>
      <Container>
        <div className="my-7">
          <Text size="lg">검색 결과</Text>
          <Text size="lg" color="grey" className="ml-2">
            {count.toLocaleString()}개
          </Text>
        </div>
        <div className="flex flex-col gap-3">
          {shops.length === 0 ? (
            <Text>검색 결과가 없습니다.</Text>
          ) : (
            shops.map(({ id, name, imageUrl }) => (
              <SearchShopItem
                key={id}
                id={id}
                name={name}
                profileImageUrl={imageUrl || undefined}
              />
            ))
          )}
        </div>
        <div className="my-6 flex justify-end">
          <Pagination
            currentPage={currentPage}
            count={count}
            handlePageChange={(pageIndex) => setCurrentPage(pageIndex)}
          />
        </div>
      </Container>
    </Wrapper>
  );
}

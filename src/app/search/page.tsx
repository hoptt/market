import { getProductsByKeyword } from "@/repository/products/getProductsByKeyword";
import { getProductsByKeywordCount } from "@/repository/products/getProductsByKeywordCount";
import getServerComponentSupabase from "@/utils/supabase/getServerComponentSupabase";
import SearchResult from "./_components/SearchResult";

type Props = {
  searchParams: {
    query?: string;
  };
};
export default async function Search({ searchParams }: Props) {
  const supabase = getServerComponentSupabase();
  const originalQuery = searchParams.query as string | undefined;
  if (!originalQuery) {
    throw new Error("검색어가 없습니다");
  }
  const query = decodeURIComponent(originalQuery);

  const [{ data: count }, { data: products }] = await Promise.all([
    getProductsByKeywordCount(supabase, query),
    getProductsByKeyword(supabase, { query, fromPage: 0, toPage: 1 }),
  ]);
  return <SearchResult products={products} count={count} />;
}

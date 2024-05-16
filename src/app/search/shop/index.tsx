import { getShopsByKeyword } from "@/repository/shop/getShopsByKeyword";
import { getShopsByKeywordCount } from "@/repository/shop/getShopsByKeywordCount";
import getServerComponentSupabase from "@/utils/supabase/getServerComponentSupabase";
import SearchShopResult from "./_components/SearchShopResult";

type Props = {
  searchParams: {
    query?: string;
  };
};
export default async function SearchShop({ searchParams }: Props) {
  const supabase = getServerComponentSupabase();
  const originalQuery = searchParams.query as string | undefined;

  if (!originalQuery) {
    return;
    // throw new Error("검색어가 없습니다");
  }
  const query = decodeURIComponent(originalQuery);
  const [{ data: shops }, { data: count }] = await Promise.all([
    getShopsByKeyword(supabase, { query }),
    getShopsByKeywordCount(supabase, query),
  ]);

  return <SearchShopResult shops={shops} count={count} />;
}

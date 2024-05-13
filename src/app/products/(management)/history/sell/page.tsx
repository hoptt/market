import Container from "@/components/layout/Container";
import { getMe } from "@/repository/me/getMe";
import { getShopSellCount } from "@/repository/shop/getShopSellCount";
import { getShopSells } from "@/repository/shop/getShopSells";
import { AuthError } from "@/utils/error";
import getServerComponentSupabase from "@/utils/supabase/getServerComponentSupabase";
import { redirect } from "next/navigation";
import Tab from "../_components/Tab";
import SellProductList from "./_components/SellProductList";

export default async function ProductHistorySell() {
  const supabase = getServerComponentSupabase();
  let shopId;
  try {
    const { data } = await getMe(supabase);
    if (!data.shopId) {
      throw new AuthError();
    }
    shopId = data.shopId;
  } catch (e) {
    if (e instanceof AuthError) {
      return redirect(
        `/login?next=${encodeURIComponent("/products/history/sell")}`
      );
    }
    throw e;
  }
  const [{ data: products }, { data: count }] = await Promise.all([
    getShopSells(supabase, { shopId, fromPage: 0, toPage: 1 }),
    getShopSellCount(supabase, shopId),
  ]);
  return (
    <Container>
      <Tab currentTab="sell" />
      <div className="flex text-center border-y border-black py-2">
        <div className="w-28">사진</div>
        <div className="flex-1">상품명</div>
        <div className="w-28">가격</div>
      </div>
      <SellProductList
        initialProducts={products}
        count={count}
        shopId={shopId}
      />
    </Container>
  );
}

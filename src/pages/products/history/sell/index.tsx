import Container from "@/components/layout/Container";
import ProductsLayout from "../../_components/ProductsLayout";
import Tab from "../_components/Tab";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getMe } from "@/repository/me/getMe";
import { Product } from "@/types";
import { getShopSells } from "@/repository/shop/getShopSells";
import { getShopSellCount } from "@/repository/shop/getShopSellCount";
import SellProductList from "./_components/SellProductList";
import { AuthError } from "@/utils/error";
import getServerSupabase from "@/utils/supabase/getSeverSupabase";

export const getServerSideProps: GetServerSideProps<{
  products: Product[];
  count: number;
  shopId: string;
}> = async (context) => {
  const supabase = getServerSupabase(context);
  try {
    const {
      data: { shopId },
    } = await getMe(supabase);
    if (!shopId) {
      throw new AuthError();
    }

    const [{ data: products }, { data: count }] = await Promise.all([
      getShopSells(supabase, { shopId, fromPage: 0, toPage: 1 }),
      getShopSellCount(supabase, shopId),
    ]);

    return {
      props: {
        products,
        count,
        shopId,
      },
    };
  } catch (e) {
    if (e instanceof AuthError) {
      return {
        redirect: {
          destination: `/login?next=${encodeURIComponent(context.resolvedUrl)}`,
          permanent: false,
        },
      };
    }
    throw e;
  }
};
export default function ProductHistorySell({
  products: initialProducts,
  count,
  shopId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <ProductsLayout currentTab="history">
      <Container>
        <Tab currentTab="sell" />
        <div className="flex text-center border-y border-black py-2">
          <div className="w-28">사진</div>
          <div className="flex-1">상품명</div>
          <div className="w-28">가격</div>
        </div>
        <SellProductList
          initialProducts={initialProducts}
          count={count}
          shopId={shopId}
        />
      </Container>
    </ProductsLayout>
  );
}

import Container from "@/components/layout/Container";
import ProductsLayout from "../_components/ProductsLayout";
import Text from "@/components/common/Text";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Product } from "@/types";
import { getMe } from "@/repository/me/getMe";
import { getShopProducts } from "@/repository/shop/getShopProducts";
import { getShopProductCount } from "@/repository/shop/getShopProductCount";
import ProductList from "./_components/ProductList";
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
      getShopProducts(supabase, { shopId, fromPage: 0, toPage: 1 }),
      getShopProductCount(supabase, shopId),
    ]);

    return {
      props: {
        shopId,
        products,
        count,
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

export default function ProductsManage({
  products: initialProducts,
  count,
  shopId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <ProductsLayout currentTab="manage">
      <Container>
        <div className="my-10">
          <div className="flex text-center border-y border-black py-2">
            <Text className="w-28">사진</Text>
            <Text className="w-28">판매상태</Text>
            <Text className="flex-1">상품명</Text>
            <Text className="w-28">가격</Text>
            <Text className="w-28">등록시간</Text>
            <Text className="w-28">기능</Text>
          </div>
          <ProductList
            initialProducts={initialProducts}
            count={count}
            shopId={shopId}
          />
        </div>
      </Container>
    </ProductsLayout>
  );
}

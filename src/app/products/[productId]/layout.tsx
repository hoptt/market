import Wrapper from "@/components/layout/Wrapper";
import { ReactNode } from "react";
import ProductWrapper from "./_components/ProductWrapper";
import Container from "@/components/layout/Container";
import { Metadata } from "next";
import getServerComponentSupabase from "@/utils/supabase/getServerComponentSupabase";
import { getProduct } from "@/repository/products/getProduct";
import { getProductApi } from "@/repository/products/getProductApi";

type Props = {
  params: { productId: string };
  title: ReactNode;
  detail: ReactNode;
  shop: ReactNode;
};
export async function generateMetadata({
  params: { productId },
}: Props): Promise<Metadata> {
  const { data: product } = await getProductApi(productId);

  const title = `중고장터 - ${product.title}`;
  return {
    title,
    openGraph: {
      title,
      images: product.imageUrls,
    },
  };
}
export default function ProductsDetailLayout({
  params: { productId },
  detail,
  shop,
  title,
}: Props) {
  return (
    <ProductWrapper productId={productId}>
      <Wrapper>
        <Container>
          {title}
          <div className="flex border-t border-black pt-10">
            <div className="w-4/6 pr-2">{detail}</div>
            <div className="w-2/6 border-l border-grey pl-2">{shop}</div>
          </div>
        </Container>
      </Wrapper>
    </ProductWrapper>
  );
}

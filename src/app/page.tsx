import Container from "@/components/layout/Container";
import Wrapper from "@/components/layout/Wrapper";
import { getProductsApi } from "@/repository/products/getProductsApi";
import Banner from "./_components/Banner";
import ProductList from "./_components/ProductList";

export default async function Home() {
  const { data: products } = await getProductsApi({ fromPage: 0, toPage: 2 });
  return (
    <Wrapper>
      <Container>
        <Banner />
        <ProductList initialProducts={products} />
      </Container>
    </Wrapper>
  );
}

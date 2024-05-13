import Container from "@/components/layout/Container";
import Wrapper from "@/components/layout/Wrapper";
import { getProducts } from "@/repository/products/getProducts";
import getServerComponentSupabase from "@/utils/supabase/getServerComponentSupabase";
import Banner from "./_components/Banner";
import ProductList from "./_components/ProductList";

export default async function Home() {
  const supabase = getServerComponentSupabase();
  const { data: products } = await getProducts(supabase, {
    fromPage: 0,
    toPage: 2,
  });
  return (
    <Wrapper>
      <Container>
        <Banner />
        <ProductList initialProducts={products} />
      </Container>
    </Wrapper>
  );
}

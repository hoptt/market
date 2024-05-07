import Container from "@/components/layout/Container";
import JggtLayout from "@/components/layout/JggtLayout";
import Wrapper from "@/components/layout/Wrapper";
import ProductList from "./_components/ProductList";
import { getProducts } from "@/repository/products/getProducts";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Banner from "./_components/Banner";
import { useEffect } from "react";
import getServerSupabase from "@/utils/supabase/getSeverSupabase";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = getServerSupabase(context);
  const { data } = await getProducts(supabase, { fromPage: 0, toPage: 2 });
  return {
    props: {
      products: data,
    },
  };
};

export default function Home({
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Wrapper>
      <Container>
        <Banner />
        <ProductList initialProducts={products} />
      </Container>
    </Wrapper>
  );
}

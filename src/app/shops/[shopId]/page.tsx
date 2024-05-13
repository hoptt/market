import { GetServerSideProps } from "next";
import { redirect } from "next/navigation";

type Props = {
  params: {
    shopId: string;
  };
};

export default async function Shops({ params }: Props) {
  return redirect(`/shops/${params.shopId}/products`);
}

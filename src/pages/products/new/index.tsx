import { GetServerSideProps } from "next";
import ProductForm from "../_components/ProductForm";
import { AuthError } from "@/utils/error";
import { getMe } from "@/repository/me/getMe";
import getServerSupabase from "@/utils/supabase/getSeverSupabase";

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const supabase = getServerSupabase(context);
  try {
    const {
      data: { shopId },
    } = await getMe(supabase);
    if (!shopId) {
      throw new AuthError();
    }
    return {
      props: {},
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

export default function ProductNew() {
  return <ProductForm />;
}

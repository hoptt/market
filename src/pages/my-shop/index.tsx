import { getMe } from "@/repository/me/getMe";
import { AuthError } from "@/utils/error";
import getServerSupabase from "@/utils/supabase/getSeverSupabase";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = getServerSupabase(context);
  try {
    const {
      data: { shopId },
    } = await getMe(supabase);

    if (!shopId) {
      throw new AuthError();
    }
    return {
      redirect: {
        destination: `/shops/${shopId}`,
        permanent: false,
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

export default function MyShops() {
  return null;
}

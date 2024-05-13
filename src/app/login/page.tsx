import LoginPannel from "@/components/shared/LoginPannel";
import { getMe } from "@/repository/me/getMe";
import getServerComponentSupabase from "@/utils/supabase/getServerComponentSupabase";
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    next?: string;
  };
};

export default async function Login({ searchParams: { next } }: Props) {
  const supabase = getServerComponentSupabase();
  const {
    data: { shopId },
  } = await getMe(supabase);
  if (shopId) {
    const destination = next ? decodeURIComponent(next as string) : "/";

    return redirect(destination);
  }

  return (
    <div
      className="flex justify-center items-center"
      style={{ minHeight: "inherit" }}
    >
      <LoginPannel />
    </div>
  );
}

import Shop from "@/components/common/Shop";
import Spinner from "@/components/common/Spinner";
import { getShopFollowerCount } from "@/repository/shop/getShopFollowerCount";
import { getShopProductCount } from "@/repository/shop/getShopProductCount";
import supabase from "@/utils/supabase/browserSupabase";
import Link from "next/link";
import React, { useEffect, useState } from "react";
type Props = {
  id: string;
  name: string;
  profileImageUrl?: string;
};
export default function SearchShopItem({ id, name, profileImageUrl }: Props) {
  const [followerCount, setFollowerCount] = useState<number | undefined>();
  const [productCount, setProductCount] = useState<number | undefined>();

  useEffect(() => {
    (async () => {
      const [{ data: followerCount }, { data: productCount }] =
        await Promise.all([
          getShopFollowerCount(supabase, id),
          getShopProductCount(supabase, id),
        ]);
      setFollowerCount(followerCount);
      setProductCount(productCount);
    })();
  }, [id]);

  if (followerCount === undefined || productCount === undefined) {
    return (
      <div className="border border-grey-300 h-28 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }
  return (
    <Link href={`/shops/${id}`}>
      <a className="border border-grey-300 p-5">
        <Shop
          type="row"
          name={name}
          productCount={0}
          followerCount={0}
          profileImageUrl={profileImageUrl}
        />
      </a>
    </Link>
  );
}

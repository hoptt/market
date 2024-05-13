"use client";

import ShopProfileImage from "@/components/common/ShopProfileImage";
import Text from "@/components/common/Text";
import { getProduct } from "@/repository/products/getProduct";
import { getShop } from "@/repository/shop/getShop";
import { Product, Shop } from "@/types";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import Link from "next/link";
import dynamic from "next/dynamic";
import MarkdownViewerSkeleton from "@/components/shared/MarkdownViewer/Skeleton";
import supabase from "@/utils/supabase/browserSupabase";

dayjs.extend(relativeTime).locale("ko");

const MarkdownViewer = dynamic(
  () => import("@/components/shared/MarkdownViewer"),
  {
    ssr: false,
    loading: () => <MarkdownViewerSkeleton />,
  }
);

type Props = {
  reviewerId: string;
  productId: string;
  contents: string;
  createdAt: string;
};
export default function ReviewItem({
  reviewerId,
  productId,
  contents,
  createdAt,
}: Props) {
  const [data, setData] = useState<{ reviewer: Shop; product: Product }>();

  useEffect(() => {
    (async () => {
      const [{ data: reviewer }, { data: product }] = await Promise.all([
        getShop(supabase, reviewerId),
        getProduct(supabase, productId),
      ]);
      setData({ reviewer, product });
    })();
  }, [productId, reviewerId]);

  if (!data) {
    return (
      <div className="my-5 border border-dashed py-2 px-5 flex justify-center items-center h-40"></div>
    );
  }

  const { reviewer, product } = data;

  return (
    <div className="flex my-5 py-2 px-5">
      <ShopProfileImage imageUrl={reviewer.imageUrl || undefined} />
      <div className="ml-3 flex-1">
        <div className="flex justify-between">
          <div>
            <Text weight="bold">{reviewer.name}</Text>
            <Text> 님의 후기 </Text>
          </div>
          <Text color="grey">{dayjs(createdAt).fromNow()}</Text>
        </div>
        <div>
          <Link
            href={`/products/${product.id}`}
            className="border border-grey-300 px-2 py-1 my-3 inline-flex gap-2 items-center"
          >
            <Text size="sm" color="grey">
              {product.title}
            </Text>
            <Text size="sm" color="grey" weight="bold">
              {">"}
            </Text>
          </Link>
          <div>
            <MarkdownViewer value={contents} />
          </div>
        </div>
      </div>
    </div>
  );
}

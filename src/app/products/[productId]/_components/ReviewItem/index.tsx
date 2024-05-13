'use client'

import ShopProfileImage from "@/components/common/ShopProfileImage";
import Spinner from "@/components/common/Spinner";
import Text from "@/components/common/Text";
import MarkdownViewerSkeleton from "@/components/shared/MarkdownViewer/Skeleton";
import { getShop } from "@/repository/shop/getShop";
import { Shop } from "@/types";
import supabase from "@/utils/supabase/browserSupabase";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relative from "dayjs/plugin/relativeTime";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MarkdownViewer = dynamic(
  () => import("@/components/shared/MarkdownViewer"),
  {
    ssr: false,
    loading: () => <MarkdownViewerSkeleton />,
  }
);

dayjs.extend(relative).locale("ko");
type Props = {
  contents: string;
  createdBy: string;
  createdAt: string;
};
export default function ReviewItem({ contents, createdBy, createdAt }: Props) {
  const [reviewer, setReviewer] = useState<Shop>();

  useEffect(() => {
    (async () => {
      const { data } = await getShop(supabase, createdBy);
      setReviewer(data);
    })();
  }, [createdBy]);

  if (!reviewer) {
    return (
      <div className="flex mey-2 py-2">
        <div className="flex justify-center items-center w-full h-32 border border-dashed">
          <Spinner />
        </div>
      </div>
    );
  }
  return (
    <div className="flex my-2 py-2">
      <ShopProfileImage imageUrl={reviewer.imageUrl || undefined} />
      <div className="ml-4 border-b pb-2 flex-1 w-0">
        <div className="flex justify-between">
          <div className="truncate pr-1">
            <Text color="grey" size="sm">
              {reviewer.name}
            </Text>
          </div>
          <div className="shrink-0">
            <Text color="grey" size="sm">
              {dayjs(createdAt).fromNow()}
            </Text>
          </div>
        </div>
        <div className="py-2">
          <MarkdownViewer value={contents} />
        </div>
      </div>
    </div>
  );
}

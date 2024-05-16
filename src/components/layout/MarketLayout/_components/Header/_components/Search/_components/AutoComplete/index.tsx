"use client";

import Text from "@/components/common/Text";
import { getProductsByKeyword } from "@/repository/products/getProductsByKeyword";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { throttle } from "lodash";
import { useRouter } from "next/navigation";
import { addRecentKeyword } from "@/utils/localstorage";
import Link from "next/link";
import supabase from "@/utils/supabase/browserSupabase";
type Props = {
  query: string;

  handleClose: () => void;
};
export default function AutoComplete({ query, handleClose }: Props) {
  const router = useRouter();
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleSearch = useMemo(
    () =>
      throttle(async (query: string) => {
        if (!query) {
          setKeywords([]);
          return;
        }
        const { data } = await getProductsByKeyword(supabase, {
          query,
          fromPage: 0,
          toPage: 1,
        });
        setKeywords(data.map((product) => product.title));
      }, 1000),
    []
  );
  useEffect(() => {
    handleSearch(query);
  }, [handleSearch, query]);

  return (
    <div
      className="flex flex-col h-full"
      style={{ boxShadow: "0px 1px 5px -1px black" }}
    >
      <div className="flex-1 overflow-hidden p-2">
        <Link
          href={`/search/shop?query=${encodeURIComponent(query)}`}
          className="border-b border-slate-500 pb-2 mb-2 flex items-center cursor-pointer"
          onClick={() => handleClose()}
        >
          <span className="material-symbols-outlined">storefront</span>
          <Text size="sm" className="ml-1 shrink-0">
            상점 검색 {">"}
          </Text>
          <Text size="sm" color="red" className="mx-1 truncate">
            {query}
          </Text>
          <Text size="sm" color="grey" className="shrink-0">
            상점명으로 검색
          </Text>
        </Link>

        {keywords.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Text color="grey" size="sm">
              검색 결과가 없습니다
            </Text>
          </div>
        ) : (
          <div className="h-full overflow-auto pb-8">
            {keywords.map((keyword) => (
              <Link
                className="hover:bg-gray-200 block p-1"
                href={`/search?query=${encodeURIComponent(keyword)}`}
                key={keyword}
                prefetch={false}
              >
                <Text
                  size="sm"
                  className="block truncate"
                  onClick={() => {
                    addRecentKeyword(keyword);
                    handleClose();
                  }}
                >
                  {keyword}
                </Text>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-100 flex justify-end px-2 py-1">
        <Text size="sm" onClick={handleClose} className="cursor-pointer">
          닫기
        </Text>
      </div>
    </div>
  );
}

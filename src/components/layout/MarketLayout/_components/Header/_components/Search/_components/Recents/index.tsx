"use client";

import Text from "@/components/common/Text";
import {
  RECENT_KEYWORDS_KEY,
  addRecentKeyword,
  clearRecentKeyword,
  getRecentKeywords,
} from "@/utils/localstorage";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  handleClose: () => void;
};
export default function Recent({ handleClose }: Props) {
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    const recents = getRecentKeywords();
    setRecents(recents);
  }, []);

  useEffect(() => {
    const eventHandler = () => setRecents([]);
    window.addEventListener(RECENT_KEYWORDS_KEY, eventHandler);

    return () => {
      window.removeEventListener(RECENT_KEYWORDS_KEY, eventHandler);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden p-2">
        <div className="border-b border-red-500 pb-1 mb-2">
          <Text size="sm" color="red" weight="bold">
            최근 검색어
          </Text>
        </div>
        {recents.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Text size="sm">최근 검색어가 없습니다</Text>
          </div>
        ) : (
          <div className="h-full overflow-auto pb-8">
            {recents.map((recent) => (
              <Link
                href={`/search?query=${encodeURIComponent(recent)}`}
                key={recent}
                prefetch={false}
              >
                <Text
                  size="sm"
                  className="block my-1 truncate"
                  onClick={() => {
                    addRecentKeyword(recent);
                    handleClose();
                  }}
                >
                  {recent}
                </Text>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="bg-gray-100 flex justify-between px-2 py-1">
        <Text size="sm" onClick={clearRecentKeyword} className="cursor-pointer">
          검색어 전체 삭제
        </Text>
        <Text size="sm" onClick={handleClose} className="cursor-pointer">
          닫기
        </Text>
      </div>
    </div>
  );
}

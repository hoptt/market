"use client";

import { addRecentKeyword } from "@/utils/localstorage";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AutoComplete from "./_components/AutoComplete";
import Recent from "./_components/Recents";

export default function Search() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const shouldSearchColosed = !!ref.current?.contains(e.target as Node);
      setIsFocused(shouldSearchColosed);
    };
    window.addEventListener("click", handler);

    return () => window.removeEventListener("click", handler);
  }, []);
  return (
    <>
      <div className="relative flex-1" ref={ref}>
        <div className="w-full border-b-2 border-slate-500 px-4 py-2">
          <form
            className="flex justify-between"
            onSubmit={(e) => {
              e.preventDefault();
              if (!search) {
                router.push(`/`);
              } else {
                addRecentKeyword(search);
                router.push(`/search?query=${encodeURIComponent(search)}`);
              }
            }}
          >
            <input
              className="w-full font-light outline-0"
              type="text"
              placeholder="상품명, 상점명 입력"
              value={search}
              onFocus={() => setIsFocused(true)}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="flex justify-center items-center">
              <span className="material-symbols-outlined">search</span>
            </button>
          </form>
        </div>
        {isFocused && (
          <div
            className={classNames(
              "w-full border boder-gray-300 h-96 absolute bg-white my-2"
            )}
          >
            {!search ? (
              <Recent handleClose={() => setIsFocused(false)} />
            ) : (
              <AutoComplete
                handleClose={() => setIsFocused(false)}
                query={search}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import Text from "@/components/common/Text";
import { removeRecentItemId } from "@/utils/localstorage";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
type Props = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
};
export default function RecentItem({ id, title, price, imageUrl }: Props) {
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Link href={`/products/${id}`}>
        {!isHover ? (
          <div className="w-16 h-16 border border-grey-300 relative">
            <Image src={imageUrl} alt={title} fill />
          </div>
        ) : (
          <div className="w-16 h-16 relative">
            <div className="absolute top-0 right-0 h-16 w-52 bg-white flex">
              <div
                className="absolute bg-black flex justify-center items-center text-white text-xs"
                style={{ width: 20, height: 20, left: -20 }}
                onClick={(e) => {
                  e.preventDefault();
                  removeRecentItemId(id);
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "1rem" }}
                >
                  close
                </span>
              </div>
              <div className="flex-1 w-0 px-2 flex flex-col justify-center gap-2 border-black border-t border-l border-b">
                <Text size="xs" className="truncate">
                  {title}asdasdsadsdaadsadsadsasdasd
                </Text>
                <Text size="xs">{price.toLocaleString()}원</Text>
              </div>
              <div className="w-16 h-16 shrink-0 border-black border-t border-r border-b relative">
                <Image src={imageUrl} alt={title} fill />
              </div>
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}

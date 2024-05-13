"use client";

import { addRecentItemId } from "@/utils/localstorage";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  productId: string;
};

export default function ProductWrapper({ children, productId }: Props) {
  useEffect(() => {
    addRecentItemId(productId);
  }, [productId]);
  return <>{children}</>;
}

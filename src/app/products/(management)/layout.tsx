"use client";

import Text from "@/components/common/Text";
import Container from "@/components/layout/Container";
import Wrapper from "@/components/layout/Wrapper";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type CurrentTab = "new" | "manage" | "history";
export default function ProductManagementLayout({ children }: Props) {
  const pathname = usePathname();
  const currentTab: CurrentTab | undefined = pathname.includes("new")
    ? "new"
    : pathname.includes("manage")
      ? "manage"
      : pathname.includes("history")
        ? "history"
        : undefined;
  return (
    <Wrapper>
      <div className="border-b py-4">
        <Container>
          <div className="flex gap-7">
            <Link href="/products/new">
              <Text size="sm" color={currentTab === "new" ? "red" : "grey"}>
                상품 등록
              </Text>
            </Link>
            |
            <Link href="/products/manage">
              <Text size="sm" color={currentTab === "manage" ? "red" : "grey"}>
                상품 관리
              </Text>
            </Link>
            |
            <Link href="/products/history">
              <Text size="sm" color={currentTab === "history" ? "red" : "grey"}>
                구매 / 판매 내역
              </Text>
            </Link>
          </div>
        </Container>
      </div>
      {children}
    </Wrapper>
  );
}

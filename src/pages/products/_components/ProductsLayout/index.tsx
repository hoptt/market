import Text from "@/components/common/Text";
import Container from "@/components/layout/Container";
import Wrapper from "@/components/layout/Wrapper";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  currentTab?: "new" | "manage" | "history";
};

export default function ProductsLayout({ children, currentTab }: Props) {
  return (
    <Wrapper>
      <div className="border-b py-4">
        <Container>
          <div className="flex gap-7">
            <Link href="/products/new">
              <a>
                <Text size="sm" color={currentTab === "new" ? "red" : "grey"}>
                  상품 등록
                </Text>
              </a>
            </Link>
            |
            <Link href="/products/manage">
              <a>
                <Text
                  size="sm"
                  color={currentTab === "manage" ? "red" : "grey"}
                >
                  상품 관리
                </Text>
              </a>
            </Link>
            |
            <Link href="/products/history">
              <a>
                <Text
                  size="sm"
                  color={currentTab === "history" ? "red" : "grey"}
                >
                  구매 / 판매 내역
                </Text>
              </a>
            </Link>
          </div>
        </Container>
      </div>
      {children}
    </Wrapper>
  );
}

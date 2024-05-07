import Text from "@/components/common/Text";
import Container from "@/components/layout/Container";
import Wrapper from "@/components/layout/Wrapper";
import Search from "./_components/Search";
import { useRouter } from "next/router";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};
export default function Header({ children }: Props) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-10 bg-white border-b">
      <Wrapper>
        <Container>
          <div className="flex justify-between items-center py-8 gap-2">
            <Link href="/" prefetch={false}>
              <a>
                <Text
                  size="4xl"
                  style={{ fontFamily: `'Black Han Sans','sans-serif'` }}
                >
                  📣 중고장터
                </Text>
              </a>
            </Link>
            <Search />
            <div className="flex gap-2">
              <Link href="/products/new" prefetch={false}>
                <a>
                  <div className="flex items-center">
                    <span className="material-symbols-outlined">sell</span>
                    <Text weight="light" size="sm" className="mx-1">
                      판매하기
                    </Text>
                  </div>
                </a>
              </Link>
              <Link href="/my-shop" prefetch={false}>
                <a>
                  <div className="flex items-center">
                    <span className="material-symbols-outlined">
                      storefront
                    </span>
                    <Text weight="light" size="sm" className="mx-1">
                      내 상점
                    </Text>
                  </div>
                </a>
              </Link>
              <Link href="/messages" prefetch={false}>
                <a>
                  <div className="flex items-center">
                    <span className="material-symbols-outlined">
                      chat_bubble
                    </span>
                    <Text weight="light" size="sm" className="mx-1">
                      채팅
                    </Text>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </Container>
      </Wrapper>
      {children}
    </div>
  );
}

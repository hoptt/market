import Text from "@/components/common/Text";
import Link from "next/link";

type Props = {
  currentTab: "sell" | "buy";
};
export default function Tab({ currentTab }: Props) {
  return (
    <div className="flex gap-2 my-5">
      <Link href={`/products/history/sell`}>
        <Text
          size="lg"
          weight="bold"
          color={currentTab === "sell" ? "red" : "grey"}
        >
          판매 내역
        </Text>
      </Link>
      <Text size="lg">|</Text>
      <Link href={`/products/history/buy`}>
        <Text
          size="lg"
          weight="bold"
          color={currentTab === "buy" ? "red" : "grey"}
        >
          구매 내역
        </Text>
      </Link>
    </div>
  );
}

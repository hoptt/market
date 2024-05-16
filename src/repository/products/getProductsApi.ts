import { Product } from "@/types";
import camelcaseKeys from "camelcase-keys";

export async function getProductsApi({
  fromPage = 0,
  toPage = 2,
  category = "",
}: {
  fromPage?: number;
  toPage?: number;
  category?: string;
}): Promise<{ data: Product[] }> {
  const res = await fetch(
    `${process.env.BASE_URL}/api/products/list?fromPage=${fromPage}&toPage=${toPage}${category ? `&category=${category}` : ""}`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  return camelcaseKeys(data, { deep: true });
}

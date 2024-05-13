import { Product } from "@/types";
import camelcaseKeys from "camelcase-keys";

export async function getProductApi(
  productId: string
): Promise<{ data: Product }> {
  const res = await fetch(`${process.env.BASE_URL}/api/products/${productId}`, {
    next: { tags: ["product"] },
  });

  const data = await res.json();

  return camelcaseKeys(data, { deep: true });
}

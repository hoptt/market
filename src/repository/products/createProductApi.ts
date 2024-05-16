import { Product } from "@/types";
import camelcaseKeys from "camelcase-keys";

type Params = Omit<Product, "id" | "createdAt" | "createdBy" | "purchaseBy">;
export async function createdProductApi(params: Params) {
  const res = await fetch(`${process.env.BASE_URL}/api/product/create`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(params),
    cache: "no-store",
  });

  const data = await res.json();
  console.log(data);

  return camelcaseKeys(data, { deep: true });
}

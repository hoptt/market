import { getProduct } from "@/repository/products/getProduct";
import supabase from "@/utils/supabase/browserSupabase";

export async function GET(
  _: Request,
  { params: { productId } }: { params: { productId: string } }
) {
  const product = await getProduct(supabase, productId);

  return new Response(JSON.stringify(product));
}

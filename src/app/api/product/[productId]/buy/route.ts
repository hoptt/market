import { buyProduct } from "@/repository/products/buyProduct";
import supabase from "@/utils/supabase/browserSupabase";

export async function GET(
  _: Request,
  { params: { productId } }: { params: { productId: string } }
) {
  const product = await buyProduct(supabase, productId);

  return new Response(JSON.stringify(product));
}

import { getProducts } from "@/repository/products/getProducts";
import supabase from "@/utils/supabase/browserSupabase";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fromPage = Number(searchParams.get("fromPage"));
  const toPage = Number(searchParams.get("toPage"));
  const category = searchParams.get("category") as string;
  const product = await getProducts(supabase, {
    fromPage,
    toPage,
    category,
  });

  return new Response(JSON.stringify(product));
}

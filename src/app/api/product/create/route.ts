import { createdProduct } from "@/repository/products/createProduct";
import supabase from "@/utils/supabase/browserSupabase";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const params = await req.json();

  const createProduct = await createdProduct(supabase, params);

  console.log("createProduct", createProduct);

  return new Response(JSON.stringify(createProduct));
}

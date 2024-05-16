"use server";

import { createdProductApi } from "@/repository/products/createProductApi";
import { updateProduct } from "@/repository/products/updateProduct";
import getServerComponentSupabase from "@/utils/supabase/getServerComponentSupabase";
import { revalidateTag } from "next/cache";

export async function createdProductAction(
  previousState: unknown,
  formData: FormData
) {
  const supabase = getServerComponentSupabase();
  try {
    const tags = formData.getAll("tags") as string[];
    const imageUrls = formData.getAll("imageUrls") as string[];

    if (imageUrls.length === 0) {
      throw new Error("상품 이미지를 1개 이상 등록해주세요");
    }

    const title = formData.get("title") as string;
    const price = parseInt(formData.get("price") as string);
    const city = formData.get("city");
    const district = formData.get("district");
    const address = city && district ? `${city} ${district}` : null;
    const description = formData.get("description") as string;
    const isChangeable = formData.get("isChangeable") === "y";
    const isUsed = formData.get("isUsed") === "y";
    const category = formData.get("category") as string;

    const { data } = await createdProductApi({
      title,
      price,
      address,
      description,
      isChangeable,
      isUsed,
      tags: tags.length > 0 ? tags : null,
      imageUrls,
      category,
    });
    return {
      status: "success",
      data,
    };
  } catch (e: unknown) {
    return {
      status: "error",
      errorMessage:
        (e instanceof Error && e.message) || "알 수 없는 에러가 발생했습니다",
    };
  }
}

export async function updateProductAction(
  previousState: unknown,
  formData: FormData
) {
  const supabase = getServerComponentSupabase();
  try {
    const tags = formData.getAll("tags") as string[];
    const imageUrls = formData.getAll("imageUrls") as string[];

    if (imageUrls.length === 0) {
      throw new Error("상품 이미지를 1개 이상 등록해주세요");
    }
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const price = parseInt(formData.get("price") as string);
    const city = formData.get("city");
    const district = formData.get("district");
    const address = city && district ? `${city} ${district}` : null;
    const description = formData.get("description") as string;
    const isChangeable = formData.get("isChangeable") === "y";
    const isUsed = formData.get("isUsed") === "y";
    const category = formData.get("category") as string;

    const { data } = await updateProduct(supabase, {
      id,
      title,
      price,
      address,
      description,
      isChangeable,
      isUsed,
      tags: tags.length > 0 ? tags : null,
      imageUrls,
      category,
    });
    return {
      status: "success",
      data,
    };
  } catch (e: unknown) {
    return {
      status: "error",
      errorMessage:
        (e instanceof Error && e.message) || "알 수 없는 에러가 발생했습니다",
    };
  } finally {
    revalidateTag("product");
  }
}

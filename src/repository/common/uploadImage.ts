import { getImageUrl } from "@/utils/image";
import { SupabaseClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

export const uploadImage = async (
  supabase: SupabaseClient,
  imageFile: File
): Promise<{
  data: { imageUrl: string };
}> => {
  if (process.env.USE_MOCK_DATA) {
    const { getMockImageDataUri } = await import("@/utils/mock");
    return { data: { imageUrl: getMockImageDataUri() } };
  }

  const { data, error } = await supabase.storage
    .from("market")
    .upload(
      `${nanoid()}.${imageFile.type === "image/jpeg" ? "jpeg" : "png"}`,
      imageFile
    );

  if (error) {
    throw error;
  }

  const imageUrl = await getImageUrl(data.path);

  return { data: { imageUrl } };
};

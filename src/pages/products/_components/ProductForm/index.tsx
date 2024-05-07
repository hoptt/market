import React, {
  ChangeEventHandler,
  FormEventHandler,
  useRef,
  useState,
} from "react";
import Text from "@/components/common/Text";
import Container from "@/components/layout/Container";
import Input from "@/components/common/Input";
import { City, cities, getDistricts } from "@/utils/address";
import Button from "@/components/common/Button";
import ProductsLayout from "../ProductsLayout";
import MarkdownEditorSkeleton from "@/components/shared/MarkdownEditor/Skeleton";
import dynamic from "next/dynamic";
import supabase from "@/utils/supabase/browserSupabase";
import { uploadImage } from "@/repository/common/uploadImage";
import { createdProduct } from "@/repository/products/createProduct";
import { useRouter } from "next/router";
import { updateProduct } from "@/repository/products/updateProduct";
const MarkdownEditor = dynamic(
  () => import("@/components/shared/MarkdownEditor"),
  {
    ssr: false,
    loading: () => <MarkdownEditorSkeleton />,
  }
);
type Props = {
  id: string;
  imageUrls: string[];
  title: string;
  isUsed: boolean;
  isChangeable: boolean;
  price: number;
  city: City;
  district: string;
  description: string;
  tags: string[];
};
export default function ProductForm({
  id: defaultId,
  imageUrls: defaultImageUrls,
  title: defaultTitle,
  isUsed: defaultIsUsed,
  isChangeable: defaultisChangeable,
  price: defaultPrice,
  city: defaultCity,
  district: defaultDistrict,
  description: defaultDescription,
  tags: defaultTags,
}: Partial<Props>) {
  const formType = defaultId ? "edit" : "new";
  const router = useRouter();
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>(defaultImageUrls || []);
  const [tags, setTags] = useState<string[]>(defaultTags || []);
  const [city, setCity] = useState<City | undefined>(defaultCity);
  const [description, setDescription] = useState<string>(
    defaultDescription || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const handleUploadImage: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target.files?.[0]) {
      const imageFile = e.target.files[0];
      const {
        data: { imageUrl },
      } = await uploadImage(supabase, imageFile);
      e.target.value = "";
      setImageUrls((prev) => [imageUrl, ...prev]);
    }
  };
  const handleAddTag = () => {
    if (!tagInputRef.current) {
      return;
    }
    if (tags.length >= 5) {
      return;
    }

    const tagValue = tagInputRef.current.value.trim();
    tagInputRef.current.value = "";
    setTags((prev) => {
      if (!prev.find((tag) => tag === tagValue)) {
        return [...prev, tagValue];
      }
      return prev;
    });
  };
  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleRemoveImage = (imageUrl: string) => {
    setImageUrls((prev) =>
      prev.filter((imageUrlItem) => imageUrlItem !== imageUrl)
    );
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();

      setIsLoading(true);
      const formData = new FormData(e.currentTarget);

      const tags = formData.getAll("tags") as string[];
      const imageUrls = formData.getAll("imageUrls") as string[];

      if (imageUrls.length === 0) {
        alert("상품 이미지를 1개 이상 등록해주세요");
        return;
      }
      const id = formData.get("id") as string;
      const title = formData.get("title") as string;
      const price = parseInt(formData.get("price") as string);
      const city = formData.get("city");
      const district = formData.get("district");
      const address = `${city} ${district}`;
      const description = formData.get("description") as string;
      const isChangeable = formData.get("isChangeable") === "y";
      const isUsed = formData.get("isUsed") === "y";

      if (formType === "new") {
        const { data } = await createdProduct(supabase, {
          title,
          price,
          address,
          description,
          isChangeable,
          isUsed,
          tags,
          imageUrls,
        });

        router.push(`/products/${data.id}`);
      } else {
        const { data } = await updateProduct(supabase, {
          id,
          title,
          price,
          address,
          description,
          isChangeable,
          isUsed,
          tags,
          imageUrls,
        });
        router.push(`/products/${data.id}`);
      }
    } catch (e) {
      alert(`상품 ${formType === "edit" ? "수정" : "등록"}에 실패하였습니다`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ProductsLayout currentTab={formType === "edit" ? undefined : "new"}>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="id" defaultValue={defaultId} />
        <Container>
          <div className="my-6 border-b-2 border-black py-7">
            <Text size="2xl" className="mr-3">
              {formType === "edit" ? "수정하기" : "등록하기"}
            </Text>
            <Text size="md" color="red">
              * 필수정보
            </Text>
          </div>
          <div className="flex border-b border-grey-300 pb-7 pt-5">
            <div className="w-40">
              <Text size="lg">상품 이미지</Text>
              <Text size="lg" color="grey" weight="light">
                ({imageUrls.length}/3)
              </Text>
              <Text size="md" color="red">
                *
              </Text>
            </div>
            <div className="flex gap-2 flex-reverse">
              {imageUrls.map((imageUrl) => (
                <div key={imageUrl} className="w-40 h-40 border relative">
                  <button
                    type="button"
                    className="rounded-full bg-black opacity-50 absolute top-1 right-1 w-8 h-8 text-white"
                    onClick={() => handleRemoveImage(imageUrl)}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "1rem" }}
                    >
                      close
                    </span>
                  </button>
                  <img src={imageUrl} className="w-full h-full" />
                  <input
                    type="text"
                    name="imageUrls"
                    defaultValue={imageUrl}
                    hidden
                  />
                </div>
              ))}
              {imageUrls.length < 3 && (
                <>
                  <label htmlFor="image">
                    <div className="w-40 h-40 border flex justify-center items-center cursor-pointer">
                      파일 업로드 하기
                    </div>
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept=".jpg, .jpeg, .png"
                    hidden
                    disabled={imageUrls.length >= 3}
                    onChange={handleUploadImage}
                  />
                </>
              )}
            </div>
          </div>
          <div className="flex border-b border-grey-300 pb-7 pt-5">
            <div className="w-40">
              <Text size="lg">상품명</Text>
              <Text size="md" color="red">
                *
              </Text>
            </div>
            <div className="flex-1">
              <Input
                type="text"
                className="w-full px-3 py-2"
                placeholder="상품명을 입력해주세요"
                name="title"
                defaultValue={defaultTitle}
                required
              />
            </div>
          </div>
          <div className="flex border-b border-grey-300 pb-7 pt-5">
            <div className="w-40">
              <Text size="lg">상품상태</Text>
              <Text size="md" color="red">
                *
              </Text>
            </div>
            <div className="flex-1">
              <select
                required
                name="isUsed"
                className="border py-1 px-2 w-32"
                defaultValue={
                  defaultIsUsed === undefined
                    ? undefined
                    : defaultIsUsed
                      ? "y"
                      : "n"
                }
              >
                <option value="n">신품</option>
                <option value="y">중고</option>
              </select>
            </div>
          </div>
          <div className="flex border-b border-grey-300 pb-7 pt-5">
            <div className="w-40">
              <Text size="lg">교환</Text>
              <Text size="md" color="red">
                *
              </Text>
            </div>
            <div className="flex-1">
              <select
                required
                name="isChangeable"
                className="border py-1 px-2 w-32"
                defaultValue={
                  defaultisChangeable === undefined
                    ? undefined
                    : defaultisChangeable
                      ? "y"
                      : "n"
                }
              >
                <option value="y">가능</option>
                <option value="n">불가</option>
              </select>
            </div>
          </div>
          <div className="flex border-b border-grey-300 pb-7 pt-5">
            <div className="w-40">
              <Text size="lg">가격</Text>
              <Text size="md" color="red">
                *
              </Text>
            </div>
            <div className="flex-1">
              <Input
                type="number"
                className="w-full px-3 py-2"
                placeholder="가격을 입력해주세요"
                name="price"
                defaultValue={defaultPrice}
                required
              />
            </div>
          </div>
          <div className="flex border-b border-grey-300 pb-7 pt-5">
            <div className="w-40">
              <Text size="lg">거래지역</Text>
              <Text size="md" color="red">
                *
              </Text>
            </div>
            <div className="flex-1 flex gap-2">
              <select
                name="city"
                className="border py-1 px-2 w-32"
                defaultValue={defaultCity}
                onChange={(e) => {
                  if (e.currentTarget.value) {
                    setCity(e.currentTarget.value as City);
                  } else {
                    setCity(undefined);
                  }
                }}
              >
                <option value="">선택</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {!!city && (
                <select
                  name="district"
                  className="border py-1 px-2 w-32"
                  defaultValue={defaultDistrict}
                >
                  <option value="">선택</option>
                  {getDistricts(city).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="flex border-b border-grey-300 pb-7 pt-5">
            <div className="w-40">
              <Text size="lg">상품태그</Text>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex gap-2 flex-wrap">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-purple-200 rounded-lg px-2 flex justify-center items-center"
                  >
                    {tag}
                    <span
                      className="material-symbols-outlined cursor-pointer"
                      style={{ fontSize: "1rem" }}
                      onClick={() => handleRemoveTag(tag)}
                    >
                      close
                    </span>
                    <input type="text" name="tags" defaultValue={tag} hidden />
                  </div>
                ))}
              </div>
              <div className="w-96 flex">
                <Input
                  ref={tagInputRef}
                  className="flex-1"
                  type="text"
                  placeholder="태그를 입력하세요. (최대 5개)"
                  disabled={tags.length >= 5}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                      return false;
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => handleAddTag()}
                  disabled={tags.length >= 5}
                >
                  입력
                </Button>
              </div>
            </div>
          </div>
          <div className="flex border-b border-grey-300 pb-7 pt-5">
            <div className="w-40">
              <Text size="lg">상품설명</Text>
              <Text size="md" color="red">
                *
              </Text>
            </div>
            <div className="flex-1">
              <MarkdownEditor
                initialValue={description}
                handleOnChange={(value) => setDescription(value)}
              />
              <input
                type="text"
                name="description"
                value={description}
                required
                className="opacity-0 h-1 w-1"
              />
            </div>
          </div>
        </Container>
        <div className="sticky bottom-0 z-50 bg-gray-100 py-4 border-t border-gray-200">
          <Container>
            <div className="flex justify-end">
              <Button color="red" className="w-28 h-12" disabled={isLoading}>
                {formType === "edit" ? "수정" : "등록하기"}
              </Button>
            </div>
          </Container>
        </div>
      </form>
    </ProductsLayout>
  );
}

import classNames from "classnames";
import React from "react";

interface Props {
  /** 상점 프로필 이미지 주소 */
  imageUrl?: string;
  /** 커스텀 클래스 명 */
  className?: string;
}

/**
 * 상점 프로필 이미지 컴포넌트 (default 기본 상점 이미지)
 */
export default function ShopProfileImage({ className, imageUrl }: Props) {
  if (!imageUrl) {
    return (
      <div
        className={classNames(
          className,
          "rounded-full bg-slate-200 w-14 h-14 flex justify-center items-center"
        )}
      >
        <span className="material-symbols-outlined text-2xl text-slate-500">
          storefront
        </span>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        className,
        "rounded-full w-14 h-14 bg-cover bg-center"
      )}
      style={{ backgroundImage: `url(${imageUrl})` }}
    />
  );
}
